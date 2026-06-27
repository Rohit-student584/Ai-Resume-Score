import { useContext } from "react";
import "../App.css";
import { Authcontext } from "./context/authcontext";

const historyData = [
  {
    score: "80%",
    role: "Frontend Developer",
    resume: "Resume.pdf",
    feedback:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium ullam temporibus reiciendis rem officiis consequuntur sunt dolorum esse culpa voluptates saepe explicabo, numquam minus porro voluptatem voluptas similique in. Culpa.",
    date: "2025-11-18",
  },
  {
    score: "80%",
    role: "Frontend Developer",
    resume: "Resume.pdf",
    feedback:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium ullam temporibus reiciendis rem officiis consequuntur sunt dolorum esse culpa voluptates saepe explicabo, numquam minus porro voluptatem voluptas similique in. Culpa.",
    date: "2025-11-18",
  },
  {
    score: "80%",
    role: "Frontend Developer",
    resume: "Resume.pdf",
    feedback:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium ullam temporibus reiciendis rem officiis consequuntur sunt dolorum esse culpa voluptates saepe explicabo, numquam minus porro voluptatem voluptas similique in. Culpa.",
    date: "2025-11-18",
  },
  {
    score: "80%",
    role: "Frontend Developer",
    resume: "Resume.pdf",
    feedback:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium ullam temporibus reiciendis rem officiis consequuntur sunt dolorum esse culpa voluptates saepe explicabo, numquam minus porro voluptatem voluptas similique in. Culpa.",
    date: "2025-11-18",
  },
  {
    score: "80%",
    role: "Frontend Developer",
    resume: "Resume.pdf",
    feedback:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium ullam temporibus reiciendis rem officiis consequuntur sunt dolorum esse culpa voluptates saepe explicabo, numquam minus porro voluptatem voluptas similique in. Culpa.",
    date: "2025-11-18",
  },
];

export const History = () => {
  const{history}=useContext(Authcontext)
  return (
    <div className="history-page">

      {history.map((item, index) => (

        <div className="history-card" key={index}>

          <h1>{item.score}</h1>

          <h2>{item.role}</h2>

          <p className="resume-name">
            Resume Name : {item.resumeName}
          </p>

          <p className="feedback">
            {item.summary}
          </p>

          <p className="history-date">
            Dated : {item.date}
          </p>

        </div>

      ))}

    </div>
  );
};