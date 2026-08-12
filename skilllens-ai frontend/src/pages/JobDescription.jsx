import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBriefcase, FaSave } from "react-icons/fa";

export default function JobDescription() {
    const [role, setRole] = useState(
        localStorage.getItem("targetRole") || ""
    );

    const [jd, setJd] = useState(
        localStorage.getItem("jobDescription") || ""
    );

    const nav = useNavigate();

    const save = (e) => {
        e.preventDefault();

        if (!role.trim() || !jd.trim()) {
            toast.error("Enter target role and job description");
            return;
        }

        localStorage.setItem("targetRole", role.trim());
        localStorage.setItem("jobDescription", jd.trim());

        toast.success("Job profile saved");

        nav("/dashboard");
    };

    return (
        <div className="page">

            {/* HEADER */}
            <div className="page-header">

                <span className="step-badge">
                    JOB PROFILE
                </span>

                <h1>
                    Define the role you want.
                </h1>

                <p>
                    ATS, Skill Gap and Interview Prep use this profile
                    as their comparison context.
                </p>

            </div>


            {/* JOB DESCRIPTION CARD */}
            <div className="job-description-card">

                <div className="job-description-icon">
                    <FaBriefcase />
                </div>

                <div className="job-description-heading">

                    <h2>
                        Job Description
                    </h2>

                    <p>
                        Tell SkillLens which role you are targeting.
                    </p>

                </div>


                <form onSubmit={save}>

                    {/* TARGET ROLE */}
                    <div className="form-group">

                        <label htmlFor="targetRole">
                            Target Role
                        </label>

                        <input
                            id="targetRole"
                            type="text"
                            className="form-control input-dark"
                            value={role}
                            onChange={(e) =>
                                setRole(e.target.value)
                            }
                            placeholder="Example: Java Backend Developer"
                        />

                    </div>


                    {/* JOB DESCRIPTION */}
                    <div className="form-group">

                        <label htmlFor="jobDescription">
                            Job Description
                        </label>

                        <textarea
                            id="jobDescription"
                            className="form-control input-dark job-description-textarea"
                            rows="10"
                            value={jd}
                            onChange={(e) =>
                                setJd(e.target.value)
                            }
                            placeholder="Paste the job description here..."
                        />

                    </div>


                    {/* ACTION */}
                    <div className="job-description-actions">

                        <button
                            type="button"
                            className="secondary-action"
                            onClick={() => nav("/dashboard")}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-action"
                        >
                            <FaSave />

                            <span>
                                Save Job Profile
                            </span>
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}