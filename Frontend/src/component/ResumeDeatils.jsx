import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { api } from "../utils/axios"
import { useEffect } from "react"


export const ResumeDetails=()=>{
    const {resumeId}=useParams()
    const [resume,setResume]=useState(null)
    const[loading,setLoading]=useState(true)
    const navigate=useNavigate()
    const getResumeDetails=async (params) => {
        try {
setLoading(true)
            const respone =await api.get(`/resume/details/${resumeId}`)
setResume(respone.data)
console.log(respone.data)
        } catch (error) {
       console.log(error)     
        }
        finally{
            setLoading(false)
        }
    }

    useEffect(()=>{
getResumeDetails()
    },[])
    if (loading) {

    return (

        <h1>

            Loading...

        </h1>

    );

}
return (
<div className="resume-details">

   <div className="resume-header">

<button onClick={()=>navigate("/analytics")}>

← Back

</button>

<h1>

{resume.resumeName}

</h1>

<div className="header-info">

<span className={`status-badge ${resume.status.toLowerCase()}`}>
    {resume.status}
</span>

<span>
    {new Date(resume.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })}
</span>

</div>

</div>

    <div className="score-container">

<div className="score-card">

<h2>

Match Score

</h2>

<p>

{resume.score}%

</p>

</div>

<div className="score-card">

<h2>

ATS Score

</h2>

<p>

{resume.atsScore}%

</p>

</div>

</div>
<div className="compare-section">

<button
className="compare-btn"

onClick={()=>navigate(`/resume/compare/${resume._id}`)}

>

Compare With Previous Resume

</button>

</div>

   <div className="summary-card">

<h2>

Professional Summary

</h2>

<p>

{resume.summary}

</p>

</div>

    <div className="analysis-grid">

    <div className="analysis-card">

        <h2>💪 Strengths</h2>

        <ul>

            {

                resume.strengths.map((item,index)=>(

                    <li key={index}>

                        ✅ {item}

                    </li>

                ))

            }

        </ul>

    </div>

    <div className="analysis-card">

        <h2>⚠️ Weaknesses</h2>

        <ul>

            {

                resume.weaknesses.map((item,index)=>(

                    <li key={index}>

                        ❌ {item}

                    </li>

                ))

            }

        </ul>

    </div>

</div>

<div className="keyword-grid">

    <div className="keyword-card">

        <h2>✅ Matched Keywords</h2>

        <div className="chip-container">

            {

                resume.matchedKeywords.map((item,index)=>(

                    <span
                    className="matched-chip"
                    key={index}
                    >

                        {item}

                    </span>

                ))

            }

        </div>

    </div>

    <div className="keyword-card">

        <h2>❌ Missing Keywords</h2>

        <div className="chip-container">

            {

                resume.missingKeywords.map((item,index)=>(

                    <span
                    className="missing-chip"
                    key={index}
                    >

                        {item}

                    </span>

                ))

            }

        </div>

    </div>

</div>

<div className="suggestion-card">

    <h2>💡  Suggestions</h2>

    <ul>

        {

            resume.suggestions.map((item,index)=>(

                <li key={index}>

                    {item}

                </li>

            ))

        }

    </ul>

</div>

</div>
)
    
}