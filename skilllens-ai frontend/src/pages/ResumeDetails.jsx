import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

import {
    FaDownload,
    FaTrash,
    FaFilePdf,
    FaCheckCircle,
    FaExclamationTriangle,
    FaLightbulb,
    FaArrowLeft,
    FaChartBar,
    FaTools,
    FaQuestionCircle,
    FaFileAlt
} from "react-icons/fa";

import "../styles/app-pages.css";

export default function ResumeDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);

    // ==========================
    // LOAD RESUME
    // ==========================

    useEffect(() => {

        const loadResume = async () => {

            try {

                console.log("Loading resume ID:", id);

                const response = await api.get(`/resume/${id}`);

                console.log(
                    "Resume Details Response:",
                    response.data
                );

                setResume(response.data);

            } catch (error) {

                console.error(
                    "Resume details error:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Unable to load resume"
                );

            } finally {

                setLoading(false);

            }

        };

        loadResume();

    }, [id]);


    // ==========================
    // DOWNLOAD
    // ==========================

    const downloadFile = async (url, fileName) => {

        try {

            const response = await api.get(url, {
                responseType: "blob",
            });

            const blob = new Blob([response.data]);

            const downloadUrl =
                window.URL.createObjectURL(blob);

            const link =
                document.createElement("a");

            link.href = downloadUrl;
            link.download = fileName;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(downloadUrl);

            toast.success(
                "File downloaded successfully"
            );

        } catch (error) {

            console.error(
                "DOWNLOAD ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Download failed"
            );

        }

    };


    // ==========================
    // DELETE
    // ==========================

    const deleteResume = async () => {

        if (
            !window.confirm(
                "Delete this resume?"
            )
        ) {
            return;
        }

        try {

            await api.delete(
                `/resume/${id}`
            );

            localStorage.removeItem(
                "resumeId"
            );

            toast.success(
                "Resume deleted successfully"
            );

            navigate("/dashboard");

        } catch (error) {

            console.error(error);

            toast.error(
                error.response?.data?.message ||
                "Delete failed"
            );

        }

    };


    // ==========================
    // LOADING
    // ==========================

    if (loading) {

        return (

            <div className="resume-details-page">

                <div className="resume-loading">

                    <div className="resume-spinner"></div>

                    <h3>
                        Loading Resume Details...
                    </h3>

                    <p>
                        Please wait while SkillLens
                        loads your resume intelligence.
                    </p>

                </div>

            </div>

        );

    }


    // ==========================
    // NO DATA
    // ==========================

    if (!resume) {

        return (

            <div className="resume-details-page">

                <div className="resume-empty">

                    <div className="resume-empty-icon">
                        <FaFileAlt />
                    </div>

                    <h2>
                        Resume not found
                    </h2>

                    <p>
                        We couldn't find the requested
                        resume details.
                    </p>

                    <button
                        className="resume-primary-btn"
                        onClick={() =>
                            navigate("/dashboard")
                        }
                    >
                        <FaArrowLeft />
                        Back to Dashboard
                    </button>

                </div>

            </div>

        );

    }


    return (

        <div className="resume-details-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="resume-details-header">

                <button
                    className="resume-back-btn"
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    <FaArrowLeft />
                    Back to Dashboard
                </button>


                <div className="resume-header-content">

                    <div className="resume-file-icon">
                        <FaFilePdf />
                    </div>

                    <div className="resume-header-text">

                        <span className="resume-badge">
                            RESUME DETAILS
                        </span>

                        <h1>
                            Resume Intelligence
                        </h1>

                        <p>
                            Review your uploaded resume,
                            ATS readiness and AI insights.
                        </p>

                    </div>

                </div>

            </div>


            {/* =================================================
                FILE INFORMATION
            ================================================= */}

            <div className="resume-panel resume-file-panel">

                <div className="resume-file-info">

                    <div className="resume-small-icon">
                        <FaFilePdf />
                    </div>

                    <div>

                        <span className="resume-label">
                            RESUME FILE
                        </span>

                        <h3>
                            {resume.fileName}
                        </h3>

                        <p>
                            Uploaded:{" "}
                            {new Date(
                                resume.uploadedAt
                            ).toLocaleString()}
                        </p>

                    </div>

                </div>


                <div className="resume-actions">

                    <button
                        className="resume-primary-btn"
                        onClick={() =>
                            downloadFile(
                                `/resume/download/${id}`,
                                resume.fileName
                            )
                        }
                    >
                        <FaDownload />
                        Download Resume
                    </button>


                    <button
                        className="resume-success-btn"
                        onClick={() =>
                            downloadFile(
                                `/resume/report/${id}`,
                                `SkillLens_Report_${id}.pdf`
                            )
                        }
                    >
                        <FaFilePdf />
                        Download Report
                    </button>


                    <button
                        className="resume-danger-btn"
                        onClick={deleteResume}
                    >
                        <FaTrash />
                        Delete
                    </button>

                </div>

            </div>


            {/* =================================================
                ATS SCORE
            ================================================= */}

            <div className="resume-panel">

                <div className="resume-section-heading">

                    <div className="resume-section-icon blue">
                        <FaChartBar />
                    </div>

                    <div>

                        <h2>
                            ATS Score
                        </h2>

                        <p>
                            Your resume's ATS readiness score
                        </p>

                    </div>

                </div>


                <div className="ats-score-container">

                    <div className="ats-score-circle">

                        <span>
                            {resume.atsScore ?? 0}%
                        </span>

                    </div>

                    <div className="ats-score-text">

                        <strong>
                            ATS Readiness
                        </strong>

                        <p>
                            This score represents how well
                            your resume is prepared for
                            Applicant Tracking Systems.
                        </p>

                    </div>

                </div>

            </div>


            {/* =================================================
                PROFESSIONAL SUMMARY
            ================================================= */}

            <div className="resume-panel">

                <div className="resume-section-heading">

                    <div className="resume-section-icon purple">
                        <FaFileAlt />
                    </div>

                    <div>

                        <h2>
                            Professional Summary
                        </h2>

                        <p>
                            AI-generated overview of your resume.
                        </p>

                    </div>

                </div>


                <div className="resume-summary">

                    {resume.summary ||
                        "No summary available."}

                </div>

            </div>


            {/* =================================================
                DETECTED SKILLS
            ================================================= */}

            <div className="resume-panel">

                <div className="resume-section-heading">

                    <div className="resume-section-icon green">
                        <FaCheckCircle />
                    </div>

                    <div>

                        <h2>
                            Detected Skills
                        </h2>

                        <p>
                            Skills identified from your resume.
                        </p>

                    </div>

                </div>


                <div className="resume-tags">

                    {resume.skills?.length > 0 ? (

                        resume.skills.map(
                            (skill, index) => (

                                <span
                                    key={index}
                                    className="resume-tag success"
                                >
                                    <FaCheckCircle />
                                    {skill}
                                </span>

                            )
                        )

                    ) : (

                        <div className="resume-no-data">
                            No skills detected.
                        </div>

                    )}

                </div>

            </div>


            {/* =================================================
                MISSING SKILLS
            ================================================= */}

            <div className="resume-panel">

                <div className="resume-section-heading">

                    <div className="resume-section-icon orange">
                        <FaExclamationTriangle />
                    </div>

                    <div>

                        <h2>
                            Missing Skills
                        </h2>

                        <p>
                            Skills that could strengthen
                            your resume.
                        </p>

                    </div>

                </div>


                <div className="resume-tags">

                    {resume.missingSkills?.length > 0 ? (

                        resume.missingSkills.map(
                            (skill, index) => (

                                <span
                                    key={index}
                                    className="resume-tag warning"
                                >
                                    <FaExclamationTriangle />
                                    {skill}
                                </span>

                            )
                        )

                    ) : (

                        <div className="resume-no-data success-text">
                            No missing skills identified.
                        </div>

                    )}

                </div>

            </div>


            {/* =================================================
                AI SUGGESTIONS
            ================================================= */}

            <div className="resume-panel">

                <div className="resume-section-heading">

                    <div className="resume-section-icon yellow">
                        <FaLightbulb />
                    </div>

                    <div>

                        <h2>
                            AI Suggestions
                        </h2>

                        <p>
                            Recommendations to improve
                            your resume.
                        </p>

                    </div>

                </div>


                <div className="resume-suggestions">

                    {resume.suggestions?.length > 0 ? (

                        resume.suggestions.map(
                            (suggestion, index) => (

                                <div
                                    key={index}
                                    className="resume-suggestion"
                                >

                                    <div className="suggestion-number">
                                        {index + 1}
                                    </div>

                                    <p>
                                        {suggestion}
                                    </p>

                                </div>

                            )
                        )

                    ) : (

                        <div className="resume-no-data">
                            No suggestions available.
                        </div>

                    )}

                </div>

            </div>


            {/* =================================================
                AI TOOLS
            ================================================= */}

            <div className="resume-panel resume-tools-panel">

                <div className="resume-section-heading">

                    <div className="resume-section-icon blue">
                        <FaTools />
                    </div>

                    <div>

                        <h2>
                            AI Resume Tools
                        </h2>

                        <p>
                            Continue analyzing your resume
                            with SkillLens AI tools.
                        </p>

                    </div>

                </div>


                <div className="resume-tools">

                    <button
                        className="resume-tool-btn blue-btn"
                        onClick={() =>
                            navigate(
                                `/ats-analysis/${id}`
                            )
                        }
                    >
                        <FaChartBar />
                        <span>
                            ATS Analysis
                        </span>
                    </button>


                    <button
                        className="resume-tool-btn purple-btn"
                        onClick={() =>
                            navigate(
                                `/skill-gap/${id}`
                            )
                        }
                    >
                        <FaTools />
                        <span>
                            Skill Gap
                        </span>
                    </button>


                    <button
                        className="resume-tool-btn green-btn"
                        onClick={() =>
                            navigate(
                                `/interview/${id}`
                            )
                        }
                    >
                        <FaQuestionCircle />
                        <span>
                            Interview Questions
                        </span>
                    </button>

                </div>

            </div>

        </div>

    );

}