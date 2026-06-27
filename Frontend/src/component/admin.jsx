import { useEffect } from "react";
import { useState } from "react";
import { api } from "../utils/axios";
import {

ResponsiveContainer,

LineChart,

Line,

BarChart,

Bar,

CartesianGrid,

XAxis,

YAxis,

Tooltip,

Legend

} from "recharts";
import { useContext } from "react";
import { Authcontext } from "./context/authcontext";
import { useNavigate } from "react-router-dom";


export const Analytics=()=>{
  const [analytics, setAnalytics] = useState(null);
  const [chartData, setChartData] = useState([]);
  const{user,totalResume,setTotalResume}=useContext(Authcontext)
  const [skillData, setSkillData] = useState({
    matchedSkills: [],
    missingSkills: []
});
const navigate=useNavigate()
const [recentResume, setRecentResume] = useState([]);
const [showDeleteModal, setShowDeleteModal] = useState(false);

const [selectedResumeId, setSelectedResumeId] = useState(null);
  const getAnalytics = async () => {

   try{

      const response = await api.get(`/resume/analytics/${user._id}`);
      console.log(response)
setTotalResume(response.data.totalResume)
      setAnalytics(response.data);

   }

   catch(error){

      console.log(error.response?.data);

   }

}
const getChartData = async () => {

    try {

        const response = await api.get("/resume/chart");

        setChartData(response.data);

    }

    catch (error) {

         console.log(error.response?.data);

    }

}

const getSkillAnalytics = async () => {

    try {

        const response = await api.get(
            `/resume/skills`
        );

        setSkillData(response.data);

    }

    catch(error){

        console.log(error);

    }

}
const getRecentResume = async () => {

    try {

        const response = await api.get(
            `/resume/recent`
        );

        setRecentResume(response.data);

    } catch (error) {

        console.log(error);

    }

}

const handleDelete=async (resumeId) => {
  try {
    const respone=await api.delete(`/resume/delete/${resumeId}`)
      setShowDeleteModal(false);

        setSelectedResumeId(null);

    getRecentResume();

        getAnalytics();

        getChartData();

        getSkillAnalytics();
        

    console.log(respone.data)
  } catch (error) {
    console.log(error)
  }
}
useEffect(()=>{

    if(user){

        getAnalytics();

        getChartData();

        getSkillAnalytics();
        getRecentResume()

    }

},[user]);
console.log(recentResume)
const CustomTooltip = ({ active, payload }) => {

  if (active && payload && payload.length) {

    const data = payload[0].payload;

    return (

      <div className="custom-tooltip">

        <h4>{data.resumeName}</h4>

        <p>
          🎯 Match Score : <strong>{data.score}%</strong>
        </p>

        <p>
          🤖 ATS Score : <strong>{data.atsScore}%</strong>
        </p>

      </div>

    );

  }

  return null;

};
return(
  <div className="analytics-page">

    <div className="analytics-header">

        <h1>Analytics Dashboard</h1>

        <p>
            Track resume analysis performance and insights.
        </p>

    </div>

    <div className="analytics-cards">

        <div className="analytics-card">

            <h4>Total Resumes</h4>

            <h2>{analytics?.totalResume || 0}</h2>

        </div>

        <div className="analytics-card">

            <h4>Average Match Score</h4>

            <h2>{analytics?.averageScore || 0}%</h2>

        </div>

        <div className="analytics-card">

            <h4>Average ATS Score</h4>

            <h2>{analytics?.averageATS || 0}%</h2>

        </div>

        <div className="analytics-card">

            <h4>Success Rate</h4>

            <h2>{analytics?.successRate || 0}%</h2>

        </div>

    </div>

    <div className="chart-grid">

    <div className="chart-card">

        <h2>Resume Match Score</h2>

        <ResponsiveContainer
            width="100%"
            height={320}
        >

            <LineChart data={chartData}>

                <CartesianGrid strokeDasharray="3 3"/>

                <XAxis
    dataKey="label"
    interval={0}
/>

                <YAxis/>

                <Tooltip
  content={<CustomTooltip />}
/>

                <Legend
    formatter={() => "Match Score"}
/>

                <Line

                    type="monotone"

                    dataKey="score"

                    stroke="#1B1C70"

                    strokeWidth={3}

                />

            </LineChart>

        </ResponsiveContainer>

    </div>

    <div className="chart-card">

        <h2>ATS Score Distribution</h2>

        <ResponsiveContainer
            width="100%"
            height={320}
        >

            <BarChart data={chartData}>

                <CartesianGrid strokeDasharray="3 3"/>

                <XAxis dataKey="label" />

                <YAxis/>

                <Tooltip
  content={<CustomTooltip />}
/>

                <Legend
    formatter={() => "ATS Score"}
/>

                <Bar

                    dataKey="atsScore"

                    fill="#22C55E"

                />

            </BarChart>

        </ResponsiveContainer>

    </div>

</div>

<div className="skills-grid">

    <div className="skill-card">

        <h2>🏆 Top Matched Skills</h2>

        {

            skillData.matchedSkills.map((skill,index)=>(

                <div
                    className="skill-row"
                    key={index}
                >

                    <span>{skill._id}</span>

                    <span>{skill.count}</span>

                </div>

            ))

        }

    </div>

    <div className="skill-card">

        <h2>⚠️ Most Missing Skills</h2>

        {

            skillData.missingSkills.map((skill,index)=>(

                <div
                    className="skill-row"
                    key={index}
                >

                    <span>{skill._id}</span>

                    <span>{skill.count}</span>

                </div>

            ))

        }

    </div>

</div>

<div className="recent-card">

    <div className="recent-header">

    <div>

        <h2>Recent Resume Analysis</h2>
<br />
        <p className="recent-subtitle">

            Showing your latest 10 resume analyses

        </p>

    </div>
    <br />

    <span className="analysis-count">

        {recentResume.length} / 10

    </span>

</div>

    <table>

        <thead>

            <tr>

                <th>Resume</th>

                <th>Score</th>

                <th>ATS</th>

                <th>Status</th>

                <th>Date</th>

                <th>Action</th>

            </tr>

        </thead>

        <tbody>

            {

                recentResume.map((resume)=>(

                    <tr key={resume._id}>

                        <td>{resume.resumeName}</td>

                        <td>{resume.score}%</td>

                        <td>{resume.atsScore}%</td>

                        <td>

                            <span className="status">

                                {resume.status}

                            </span>

                        </td>

                        <td>

                            {

                                new Date(
                                    resume.createdAt
                                ).toLocaleDateString()

                            }

                        </td>

                       <td>

    <div className="action-btn">

        <button
            className="view-btn"
            onClick={() => navigate(`/resume/${resume._id}`)}
        >
            View
        </button>

       <button
    className="delete-btn"
    onClick={() => {

        setSelectedResumeId(resume._id);

        setShowDeleteModal(true);

    }}
>
    Delete
</button>

    </div>

</td>

                    </tr>

                ))

            }

        </tbody>

    </table>

</div>

{
showDeleteModal && (

<div className="delete-modal-overlay">

    <div className="delete-modal">

        <h2>

            Delete Resume

        </h2>

        <p>

            Are you sure you want to delete this resume?

        </p>

        <p className="warning">

            This action cannot be undone.

        </p>

        <div className="delete-modal-btn">

            <button

                className="cancel-btn"

                onClick={() => {

                    setShowDeleteModal(false);

                    setSelectedResumeId(null);

                }}

            >

                Cancel

            </button>

            <button

                className="confirm-delete-btn"

                onClick={() => handleDelete(selectedResumeId)}

            >

                Delete

            </button>

        </div>

    </div>

</div>

)
}

</div>
)
}