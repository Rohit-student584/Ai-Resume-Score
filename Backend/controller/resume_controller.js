import fs from "fs";
import dotenv from "dotenv";
import { PDFParse } from "pdf-parse";
import { CohereClient, CohereClientV2 } from "cohere-ai";
import { Resume } from "../models/resume_model.js";
import crypto from "crypto";
import mongoose from "mongoose";

dotenv.config();

const cohere = new CohereClientV2({
  token: process.env.API_KEY,
});

export const Addresume = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    const userId = req.user._id;
    if (!jobDescription) {
    return res.status(400).json({
        message: "Job Description is required."
    });
}
console.log(req.file)
    if (!req.file) {
      return res.status(400).json({
        message: "Resume is required",
      });
    }
if (req.file.mimetype !== "application/pdf") {
    return res.status(400).json({
        message: "Only PDF files are allowed."
    });
}
    const pdfPath = req.file.path;

    const dataBuffer = fs.readFileSync(pdfPath);

    const parser = new PDFParse(new Uint8Array(dataBuffer));

    const pdfResult = await parser.getText();
    // Normalize Resume Text

const normalizedResume = pdfResult.text
  .trim()
  .replace(/\s+/g, " ")
  .toLowerCase();

// Generate Resume Hash

const resumeHash = crypto
  .createHash("sha256")
  .update(normalizedResume)
  .digest("hex");

// Normalize Job Description

const normalizedJD = jobDescription
  .trim()
  .replace(/\s+/g, " ")
  .toLowerCase();

// Generate Job Description Hash

const jobHash = crypto
  .createHash("sha256")
  .update(normalizedJD)
  .digest("hex");
  console.log("Resume Hash :", resumeHash);

console.log("Job Hash :", jobHash);
// Check if the same resume + job description has already been analyzed

const existingResume = await Resume.findOne({

    resumeHash,

    jobHash

});

if (existingResume) {

    // Delete newly uploaded PDF because we don't need it

    fs.unlinkSync(req.file.path);

    return res.status(200).json({

        message: "Existing analysis found.",

        resume: existingResume,

        cached: true

    });

}
const prompt = `
You are an expert AI Resume Screening Assistant.

Your task is to compare the given Resume with the provided Job Description.

Evaluate the resume carefully and return ONLY a valid JSON object.

Do NOT include markdown.
Do NOT include explanations outside JSON.
Do NOT wrap the response inside triple backticks.

Evaluation Criteria:

1. Resume Match Score (0-100)
   - Compare resume with the Job Description.
   - Consider skills, technologies, experience, projects, education and responsibilities.

2. ATS Score (0-100)
   - Evaluate ATS friendliness.
   - Consider formatting, headings, readability, keyword usage and overall ATS compatibility.

3. Strengths
   - Mention the strong points of the resume.

4. Weaknesses
   - Mention missing skills or weak areas.

5. Matched Keywords
   - Keywords found in both the Resume and Job Description.

6. Missing Keywords
   - Important keywords present in the Job Description but missing from the Resume.

7. Suggestions
   - Provide actionable improvements.

8. Summary
   - Write a short professional summary (2-4 sentences).

Return ONLY this JSON format:

{
  "score": 0,
  "atsScore": 0,
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "matchedKeywords": [],
  "missingKeywords": [],
  "suggestions": []
}

Resume:

${pdfResult.text}

Job Description:

${jobDescription}
Return ONLY valid JSON.

Do NOT explain your reasoning.

Do NOT think aloud.

Do NOT include any thinking.

Return only the final answer.
`;

    const response = await cohere.chat({
      model: "command-a-plus-05-2026",
     messages: [
        {
            role: "user",
            content: prompt,
        },
    ],
    temperature:0
    });
    console.log(JSON.stringify(response, null, 2));

   const textContent = response.message.content.find(
    item => item.type === "text"
);

if (!textContent) {
    return res.status(500).json({
        message: "AI did not return any text response."
    });
}

let analysis;

try {
    analysis = JSON.parse(textContent.text);
} catch (err) {
    return res.status(500).json({
        message: "Invalid JSON returned by AI."
    });
}

// console.log(analysis);

// console.log(analysis.score);

// console.log(analysis.atsScore);

// console.log(analysis.summary);

// console.log(analysis.strengths);

// console.log(analysis.weaknesses);

// console.log(analysis.matchedKeywords);

// console.log(analysis.missingKeywords);

// console.log(analysis.suggestions);
    
const resume= await Resume.create({
  user:userId,
    jobDescription,
    resumeName:req.file.originalname,
    resumeUrl:req.file.path,
    score:analysis.score,
    atsScore:analysis.atsScore,
    summary:analysis.summary,
    suggestions:analysis.suggestions,
    missingKeywords:analysis.missingKeywords,
    matchedKeywords:analysis.matchedKeywords,
    weaknesses:analysis.weaknesses,
strengths:analysis.strengths,
status: "Completed",
resumeHash,
jobHash,
})
await resume.save()
fs.unlinkSync(req.file.path);
return res.status(201).json({

    message: "Resume analyzed successfully.",

    resume

});
  } catch (error) {
    console.log(error);
status:"Failed"
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllResumeForUser = async (req, res) => {
  try {

    const { userId } = req.params;

    const resumes = await Resume.find({ user: userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: resumes.length,
      resumes
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const getResumeForAdmin=async (req,res) => {
 try {

    const resumes = await Resume.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: resumes.length,
      resumes
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
        message: error.message
    });

}
}


export const getAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
const total = await Resume.countDocuments();

console.log("Total Documents:", total);
    const analytics = await Resume.aggregate([
      {
    $match: {
        user:userId
    }
},
      {
        $group: {
          _id: null,

          totalResume: {
            $sum: 1
          },

          averageScore: {
            $avg: "$score"
          },

          averageATS: {
            $avg: "$atsScore"
          },

          completed: {
            $sum: {
              $cond: [
                {
                  $eq: ["$status", "Completed"]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    if (analytics.length === 0) {
      return res.status(200).json({
        totalResume: 0,
        averageScore: 0,
        averageATS: 0,
        successRate: 0
      });
    }

    const data = analytics[0];

    const successRate =
      data.totalResume === 0
        ? 0
        : Math.round(
            (data.completed / data.totalResume) * 100
          );

    return res.status(200).json({

      totalResume: data.totalResume,

      averageScore: Math.round(data.averageScore),

      averageATS: Math.round(data.averageATS),

      successRate

    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }
};

export const getChartData = async (req, res) => {
  try {
const userId = req.user._id;
    const resumes = await Resume.find({ user: userId })
  .select("resumeName score atsScore createdAt")
  .sort({ createdAt: -1 })
  .limit(10);

    const chartData = resumes.reverse().map((resume, index) => ({

      id: resume._id,

      label: `R${index + 1}`,

      resumeName: resume.resumeName,

      score: resume.score,

      atsScore: resume.atsScore,

      uploadDate: resume.createdAt

    }));

    return res.status(200).json(chartData);

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }
};

export const getSkillAnalytics = async (req, res) => {
  try {

    const userId = req.user._id;

    const matchedSkills = await Resume.aggregate([

      {
        $match: {
          user: new mongoose.Types.ObjectId(userId)
        }
      },

      {
        $unwind: "$matchedKeywords"
      },

      {
        $group: {

          _id: "$matchedKeywords",

          count: {
            $sum: 1
          }

        }
      },

      {
        $sort: {
          count: -1
        }
      },

      {
        $limit: 5
      }

    ]);

    const missingSkills = await Resume.aggregate([

      {
        $match: {
          user: new mongoose.Types.ObjectId(userId)
        }
      },

      {
        $unwind: "$missingKeywords"
      },

      {
        $group: {

          _id: "$missingKeywords",

          count: {
            $sum: 1
          }

        }
      },

      {
        $sort: {
          count: -1
        }
      },

      {
        $limit: 5
      }

    ]);

    return res.status(200).json({

      matchedSkills,

      missingSkills

    });

  }

  catch (error) {

    return res.status(500).json({

      message: error.message

    });

  }

}

export const getRecentResume = async (req, res) => {
  try {

    const userId = req.user._id;
const resumes = await Resume.find({
    user: userId
})
.select(
    "resumeName score atsScore status createdAt"
)
.sort({ createdAt: -1 })
.limit(10);

    return res.status(200).json(resumes);

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }
};

export const getResumeById = async (req, res) => {
  try {

    const { resumeId } = req.params;

const resume = await Resume.findOne({

    _id: resumeId,

    user: req.user._id

});

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found"
      });
    }

    return res.status(200).json(resume);

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }
};

export const compareResume = async (req, res) => {
  try {

    const { resumeId } = req.params;

    // Current Resume
    const currentResume = await Resume.findOne({
    _id: resumeId,
    user: req.user._id
});

    if (!currentResume) {
      return res.status(404).json({
        message: "Resume not found"
      });
    }

    // Previous Resume of same user
const previousResume = await Resume.findOne({
    user: req.user._id,
    createdAt: { $lt: currentResume.createdAt }
})
.sort({ createdAt: -1 });

    if (!previousResume) {

      return res.status(404).json({

        message: "No previous resume found for comparison."

      });

    }
    console.log("Resume ID:", req.params.resumeId);

    console.log("Current Resume:", currentResume);

    console.log("Previous Resume:", previousResume);

    const scoreDifference = currentResume.score - previousResume.score;

    const atsDifference = currentResume.atsScore - previousResume.atsScore;

    const newSkills = currentResume.matchedKeywords.filter(
        skill => !previousResume.matchedKeywords.includes(skill)
    );

    const fixedMissingSkills = previousResume.missingKeywords.filter(
        skill => !currentResume.missingKeywords.includes(skill)
    );

    const stillMissing = currentResume.missingKeywords.filter(
        skill => previousResume.missingKeywords.includes(skill)
    );

    const improvementStatus =
        scoreDifference > 0
            ? "Improved"
            : scoreDifference < 0
            ? "Declined"
            : "No Change";

    return res.status(200).json({
      currentResume,
      previousResume,
      comparison: {
        scoreDifference,
        atsDifference,
        newSkills,
        fixedMissingSkills,
        stillMissing,
        improvementStatus
      }
    });
  } catch (error) {
     console.log(error);

        return res.status(500).json({
            message: error.message
        });

  }
};

export const deleteResume=async (req,res) => {
  try {
    const { resumeId } = req.params;

const resume = await Resume.findOne({

    _id: resumeId,

    user: req.user._id

});
  if (!resume) {
    return res.status(400).json({message:"Resume Not Found"})
  }

        if (fs.existsSync(resume.resumeUrl)) {

            fs.unlinkSync(resume.resumeUrl);

        }
await Resume.findByIdAndDelete(resumeId)
return res.status(200).json({message:"resume deleted succesfully"})
  } catch (error) {
    return res.status(500).json({message:`resume delete error ${error}`})
  }
}