import { useState } from "react";
import "../App.css";
import { useContext } from "react";
import { Authcontext } from "./context/authcontext";
import { api } from "../utils/axios";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const[resumeFile,setResumeFile]=useState(null)
  const[resumeName,setResumeName]=useState("Upload Your Resume")
  const[jobDescription,setJobDescription]=useState("")
  const[result,setResult]=useState(null)
  const{user,setUser}=useContext(Authcontext)
  const navigate=useNavigate()
  console.log(user)
  const handleFile = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  if (file.type !== "application/pdf") {
    alert("Only PDF files are allowed");
    return;
  }

  setResumeFile(file);
  setResumeName(file.name);
};

const Analyzeresume=async () => {
  try {
    if (!resumeFile || !jobDescription) {
     return  alert("please upload resume and paste job description properly")
    }
    const formData=new FormData()
    formData.append("jobDescription",jobDescription)
    // formData.append("user",user._id)
    formData.append("resume",resumeFile)
    const response=await api.post("/resume/addresume",formData)
    setResult(response.data.resume)
    console.log(response.data.resume)
    navigate(`/resume/${response.data.resume._id}`);
  } catch (error) {
    console.log(error.response?.data)
  }
}
const handleLogout = async () => {
  try {

    await signOut(auth);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);

    navigate("/");

  } catch (error) {

    console.log(error);

  }
};
  return (
    <div className="dashboard-page">

      {/* LEFT */}

      <div className="dashboard-left">

        <div className="dashboard-header">

          <p>Smart Resume Screening</p>

          <h1>
            Resume Match Score
            
            
          </h1>

        </div>

        <div className="instruction-card">

          <h3>🔔 Important Instructions :</h3>

          <ul>

            <li>
              Please paste the complete job description in the
              <strong> "Job Description"</strong> field before submitting.
            </li>

            <li>
              Only PDF format (.pdf) resumes are accepted.
            </li>

          </ul>

        </div>

        <div className="upload-card">

    <div className="upload-top">

        <input
            type="text"
            placeholder={resumeName}
            readOnly
        />
<input type="file" accept=".pdf" id="inputField" hidden onChange={handleFile} />

        <label htmlFor="inputField" className="upload-btn">Upload Resume</label>
    </div>

    <div className="upload-bottom">

        <textarea value={jobDescription}
        onChange={(e)=>setJobDescription(e.target.value)}
            placeholder="Paste Your Job Description"
        ></textarea>

        <button className="analyze-btn" onClick={Analyzeresume}>

            Analyze

        </button>

    </div>

</div>
{result && (
  <div className="analysis-container">

    <div className="analysis-title">
      <h2>Resume Analysis Report</h2>
    </div>

    {/* Score Cards */}

    <div className="score-grid">

      <div className="score-card">
        <h3>Resume Match Score</h3>
        <div className="score-value">
          {result.score}%
        </div>
      </div>

      <div className="score-card">
        <h3>ATS Score</h3>
        <div className="score-value">
          {result.atsScore}%
        </div>
      </div>

    </div>

    {/* Summary */}

    <div className="analysis-card">
      <h3>Professional Summary</h3>
      <p>{result.summary}</p>
    </div>

    {/* Strengths & Weaknesses */}

    <div className="double-grid">

      <div className="analysis-card">
        <h3>Strengths</h3>

        <ul>
          {result.strengths?.map((item, index) => (
            <li key={index}>✅ {item}</li>
          ))}
        </ul>

      </div>

      <div className="analysis-card">
        <h3>Weaknesses</h3>

        <ul>
          {result.weaknesses?.map((item, index) => (
            <li key={index}>❌ {item}</li>
          ))}
        </ul>

      </div>

    </div>

    {/* Matched Keywords */}

    <div className="analysis-card">

      <h3>Matched Keywords</h3>

      <div className="keyword-wrapper">

        {result.matchedKeywords?.map((keyword, index) => (
          <span key={index} className="keyword success">
            {keyword}
          </span>
        ))}

      </div>

    </div>

    {/* Missing Keywords */}

    <div className="analysis-card">

      <h3>Missing Keywords</h3>

      <div className="keyword-wrapper">

        {result.missingKeywords?.map((keyword, index) => (
          <span key={index} className="keyword danger">
            {keyword}
          </span>
        ))}

      </div>

    </div>

    {/* Suggestions */}

    <div className="analysis-card">

      <h3>AI Suggestions</h3>

      <ul>
        {result.suggestions?.map((item, index) => (
          <li key={index}>💡 {item}</li>
        ))}
      </ul>

    </div>

  </div>
)}
      </div>

      {/* RIGHT */}

      <div className="dashboard-right">

        <div className="profile-card">

    <h2>Analyze With AI</h2>

    <div className="profile-image">

        <div>
          {user?.name?.charAt(0).toUpperCase()}
        </div>

    </div>

    <h3>{user?.name}</h3>
    <button className="log-out" onClick={handleLogout}>Logout</button>
</div>
{result && (
        <div className="result-card">

    <div className="result-header">

        <h2>Result</h2>

        <div className="score-circle">

            <span>{result?.score}</span>

        </div>

    </div>

    <div className="feedback">

        <h4>Summary</h4>

        <p>

            {result?.summary}
        </p>

    </div>

</div>
)}

      </div>

    </div>
  );
};