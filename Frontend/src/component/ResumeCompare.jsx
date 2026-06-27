import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { api } from "../utils/axios";

export const Resumecompare=()=>{
    const { resumeId } = useParams();

const navigate = useNavigate();

const [comparison, setComparison] = useState(null);

const [loading, setLoading] = useState(true);

const getComparison = async () => {

    try{

        setLoading(true);

        const response = await api.get(
            `/resume/compare/${resumeId}`
        );

        console.log(response.data);

        setComparison(response.data);

    }

    catch(error){
        if (error.response?.status === 404) {

        setComparison(null);

        return;

    }


         console.log("Full Error:", error);

    console.log("Response:", error.response);

    console.log("Data:", error.response?.data);

    console.log("Message:", error.response?.data?.message);

    }

    finally{

        setLoading(false);

    }

}

useEffect(()=>{

    getComparison();

},[]);

if(loading){

    return(

        <h1>

            Loading...

        </h1>

    );

}

if (!comparison) {
    return (
        <div className="compare-page">

            <button
                className="back-btn"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>

            <h2>No previous resume found.</h2>

            <p>
                Upload another resume to compare with this one.
            </p>

        </div>
    );
}
   return (

<div className="compare-page">

    <div className="compare-header">

        <button
        className="back-btn"
        onClick={()=>navigate(-1)}
        >

            ← Back

        </button>

        <h1>

            Resume Comparison

        </h1>

        <p>

            Compare your latest resume with the previous version.

        </p>

    </div>

    <div className="resume-grid">

        <div className="resume-card">

            <span className="card-label">

                Previous Resume

            </span>

            <h2>

                {comparison.previousResume.resumeName}

            </h2>

            <div className="score-box">

                <div>

                    <h3>

                        {comparison.previousResume.score}%

                    </h3>

                    <p>

                        Match Score

                    </p>

                </div>

                <div>

                    <h3>

                        {comparison.previousResume.atsScore}%

                    </h3>

                    <p>

                        ATS Score

                    </p>

                </div>

            </div>

        </div>

        <div className="resume-card current">

            <span className="card-label">

                Current Resume

            </span>

            <h2>

                {comparison.currentResume.resumeName}

            </h2>

            <div className="score-box">

                <div>

                    <h3>

                        {comparison.currentResume.score}%

                    </h3>

                    <p>

                        Match Score

                    </p>

                </div>

                <div>

                    <h3>

                        {comparison.currentResume.atsScore}%

                    </h3>

                    <p>

                        ATS Score

                    </p>

                </div>

            </div>

        </div>

    </div>
<div className="improvement-card">

    <h2>

        Improvement Overview

    </h2>

    <div className="improvement-grid">

        <div className="improvement-item">

            <h3>

                {comparison.comparison.scoreDifference > 0 ? "+" : ""}

                {comparison.comparison.scoreDifference}%

            </h3>

            <p>

                Match Score

            </p>

        </div>

        <div className="improvement-item">

            <h3>

                {comparison.comparison.atsDifference > 0 ? "+" : ""}

                {comparison.comparison.atsDifference}%

            </h3>

            <p>

                ATS Score

            </p>

        </div>

        <div className="improvement-item">

            <span
            className={`status-badge ${
                comparison.comparison.improvementStatus === "Improved"
                    ? "success"
                    : comparison.comparison.improvementStatus === "Declined"
                    ? "danger"
                    : "warning"
            }`}
            >

                {comparison.comparison.improvementStatus}

            </span>

            <p>

                Overall Status

            </p>

        </div>

    </div>

</div>
<p className="improvement-text">

    {

        comparison.comparison.improvementStatus === "Improved"

        ? "Your resume performance has improved compared to the previous version. Keep refining your skills to achieve an even higher match score."

        : comparison.comparison.improvementStatus === "Declined"

        ? "Your latest resume performed lower than the previous version. Review the missing skills and recent changes before applying."

        : "Your resume performance remained the same. Consider adding more relevant skills and measurable achievements to improve your score."

    }

</p>
<div className="skills-comparison">

    <h2>Skills Comparison</h2>

    <div className="skills-grid">

        {/* New Skills */}

        <div className="skill-card">

            <h3>🟢 New Skills Added</h3>

            {

                comparison.comparison.newSkills.length > 0 ?

                <ul>

                    {

                        comparison.comparison.newSkills.map((skill,index)=>(

                            <li key={index}>

                                ✅ {skill}

                            </li>

                        ))

                    }

                </ul>

                :

                <p>No new skills added.</p>

            }

        </div>

        {/* Fixed Skills */}

        <div className="skill-card">

            <h3>🎯 Fixed Missing Skills</h3>

            {

                comparison.comparison.fixedMissingSkills.length > 0 ?

                <ul>

                    {

                        comparison.comparison.fixedMissingSkills.map((skill,index)=>(

                            <li key={index}>

                                ✅ {skill}

                            </li>

                        ))

                    }

                </ul>

                :

                <p>No missing skills fixed.</p>

            }

        </div>

        {/* Still Missing */}

        <div className="skill-card">

            <h3>⚠️ Still Missing</h3>

            {

                comparison.comparison.stillMissing.length > 0 ?

                <ul>

                    {

                        comparison.comparison.stillMissing.map((skill,index)=>(

                            <li key={index}>

                                ❌ {skill}

                            </li>

                        ))

                    }

                </ul>

                :

                <p>No missing skills remaining.</p>

            }

        </div>

    </div>

</div>
<div className="overall-summary">

    <h2>Overall Comparison Summary</h2>

    <div className="summary-box">

        <h3>

            {

                comparison.comparison.improvementStatus === "Improved"

                ? "🎉 Great Progress!"

                : comparison.comparison.improvementStatus === "Declined"

                ? "⚠️ Resume Needs Improvement"

                : "📄 No Significant Change"

            }

        </h3>

        <p>

            {

                comparison.comparison.improvementStatus === "Improved"

                ?

                `Your resume match score improved by ${comparison.comparison.scoreDifference}% compared to the previous version.`

                :

                comparison.comparison.improvementStatus === "Declined"

                ?

                `Your resume score decreased by ${Math.abs(comparison.comparison.scoreDifference)}%. Review the recent changes before applying.`

                :

                "Your resume score remained unchanged compared to the previous version."

            }

        </p>

        <p>

            You added

            <strong>

                {" "}

                {comparison.comparison.newSkills.length}

                {" "}

                new skills

            </strong>

            {" "}and fixed{" "}

            <strong>

                {comparison.comparison.fixedMissingSkills.length}

                {" "}missing skills

            </strong>.

        </p>

        <p>

            {

                comparison.comparison.stillMissing.length > 0

                ?

                `You still have ${comparison.comparison.stillMissing.length} important skill(s) to improve before applying.`

                :

                "Excellent! No important skills are missing."

            }

        </p>

    </div>

</div>
</div>

)
}