import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    // Owner of Resume
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Resume Details
    resumeName: {
      type: String,
      required: true,
      trim: true,
    },

    resumeUrl: {
      type: String,
      required: true,
    },

    // Job Details
    jobTitle: {
      type: String,
      default: "",
      trim: true,
    },

    companyName: {
      type: String,
      default: "",
      trim: true,
    },

    jobDescription: {
      type: String,
      required: true,
      trim: true,
    },

    resumeHash:{

    type:String,

    required:true

},

jobHash:{

    type:String,

    required:true

},

    // Resume vs Job Description Match Score
    score: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // ATS Score
    atsScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // AI Summary
    summary: {
      type: String,
      default: "",
    },

    // Strengths
    strengths: [
      {
        type: String,
      },
    ],

    // Weaknesses
    weaknesses: [
      {
        type: String,
      },
    ],

    // AI Suggestions
    suggestions: [
      {
        type: String,
      },
    ],

    // Missing Keywords
    missingKeywords: [
      {
        type: String,
      },
    ],

    // Matched Keywords
    matchedKeywords: [
      {
        type: String,
      },
    ],

    // General Feedback
    feedback: [
      {
        type: String,
      },
    ],

    // Analysis Status
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Resume = mongoose.model("Resume", resumeSchema);