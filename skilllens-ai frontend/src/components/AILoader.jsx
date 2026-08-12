import { FaRobot, FaBrain } from "react-icons/fa";
import "../styles/ai-loader.css";

export default function AILoader({ title, description }) {
    return (
        <div className="ai-loader-page">

            <div className="ai-loader-card">

                <div className="ai-loader-icon">
                    <FaRobot />
                </div>

                <div className="ai-loader-ring"></div>

                <h2>{title || "AI is analyzing..."}</h2>

                <p>
                    {description ||
                        "Please wait while SkillLens processes your resume."}
                </p>

                <div className="ai-loader-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <div className="ai-loader-status">
                    <FaBrain />
                    <span>AI Processing</span>
                </div>

            </div>

        </div>
    );
}