import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

import {
    FaChartLine,
    FaCheckCircle,
    FaExclamationTriangle,
    FaLightbulb,
    FaArrowLeft,
    FaRobot
} from "react-icons/fa";

import "../styles/ats-analysis.css";

export default function ATSAnalysis() {

    const { id } = useParams();
    const nav = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadAnalysis = async () => {

            try {

                setLoading(true);

                const targetRole =
                    localStorage.getItem("targetRole") ||
                    "";

                const jobDescription =
                    localStorage.getItem("jobDescription") || "";

                /*
                 * Backend handles AI analysis.
                 * If cached, response will be fast.
                 * If not cached, AI processing may take some time.
                 */

               const response = await api.post(
    `/resume/analyze/${id}`,
    {
        targetRole,
        jobDescription
    }
);

console.log(
    "========== ATS FRONTEND RESPONSE =========="
);

console.log(
    JSON.stringify(
        response.data,
        null,
        2
    )
);

console.log(
    "Target Role:",
    targetRole
);

console.log(
    "Job Description Length:",
    jobDescription.length
);

console.log(
    "============================================"
);

setData(response.data);

            } catch (error) {

                console.error("ATS Analysis error:", error);

                toast.error(
                    error.response?.data?.message ||
                    "Unable to load ATS analysis"
                );

            } finally {

                setLoading(false);

            }

        };

        loadAnalysis();

    }, [id]);


    /* =====================================================
       AI LOADING SCREEN
       ===================================================== */

    if (loading) {

        return (

            <div className="ats-loading-page">

                <div className="ats-loading-card">

                    {/* AI ICON */}

                    <div className="ats-ai-icon">

                        <FaRobot />

                    </div>


                    {/* SPINNER */}

                    <div className="ats-spinner"></div>


                    <h2>
                        Analyzing Your Resume
                    </h2>

                    <p>
                        AI is comparing your resume with the
                        target job requirements.
                    </p>


                    {/* LOADING STEPS */}

                    <div className="ats-loading-steps">

                        <div className="ats-loading-step active">

                            <span></span>

                            <p>
                                Reading resume
                            </p>

                        </div>


                        <div className="ats-loading-step">

                            <span></span>

                            <p>
                                Checking skills
                            </p>

                        </div>


                        <div className="ats-loading-step">

                            <span></span>

                            <p>
                                Calculating ATS score
                            </p>

                        </div>


                        <div className="ats-loading-step">

                            <span></span>

                            <p>
                                Preparing recommendations
                            </p>

                        </div>

                    </div>


                    <small>
                        Please wait while AI completes the analysis...
                    </small>

                </div>

            </div>

        );

    }


    /* =====================================================
       EMPTY
       ===================================================== */

    if (!data) {

        return (

            <div className="ats-empty">

                <FaExclamationTriangle />

                <h3>
                    Analysis unavailable
                </h3>

                <p>
                    Please analyze your resume first.
                </p>

                <button
                    onClick={() =>
                        nav(`/resume/${id}`)
                    }
                    className="ats-primary-btn"
                >
                    <FaArrowLeft />
                    Back to Resume
                </button>

            </div>

        );

    }


    /* =====================================================
       DATA
       ===================================================== */

    const score = data.atsScore || 0;

    const matchedSkills =
        data.skills || [];

    const missingSkills =
        data.missingSkills || [];

    const suggestions =
        data.suggestions || [];


    /* =====================================================
       SCORE LABEL
       ===================================================== */

    const getScoreLabel = () => {

        if (score >= 80)
            return "Excellent";

        if (score >= 60)
            return "Good";

        if (score >= 40)
            return "Needs Improvement";

        return "Low";

    };


    /* =====================================================
       MAIN PAGE
       ===================================================== */

    return (

        <div className="ats-page">


            {/* =========================
                HEADER
            ========================= */}

            <div className="ats-header">

                <div>

                    <span className="ats-eyebrow">
                        RESUME INTELLIGENCE
                    </span>

                    <h1>
                        ATS Analysis
                    </h1>

                    <p>
                        Understand how your resume performs
                        against Applicant Tracking Systems.
                    </p>

                </div>


                <button
                    className="ats-back-btn"
                    onClick={() =>
                        nav(`/resume/${id}`)
                    }
                >

                    <FaArrowLeft />

                    Resume Details

                </button>

            </div>


            {/* =========================
                SCORE
            ========================= */}

            <div className="ats-score-card">

                <div className="score-info">

                    <div className="score-icon">

                        <FaChartLine />

                    </div>


                    <div>

                        <span>
                            ATS SCORE
                        </span>

                        <h2>

                            {score}

                            <small>
                                /100
                            </small>

                        </h2>

                        <strong>
                            {getScoreLabel()}
                        </strong>

                    </div>

                </div>


                <div className="score-progress">

                    <div
                        className="score-progress-bar"
                        style={{
                            width:
                                `${Math.min(score, 100)}%`
                        }}
                    ></div>

                </div>


                <p className="score-description">

                    Your resume currently has a{" "}

                    <strong>
                        {score}%
                    </strong>

                    {" "}ATS readiness score.

                </p>

            </div>


            {/* =========================
                SUMMARY
            ========================= */}

            <div className="ats-card summary-card">

                <div className="card-title">

                    <FaLightbulb />

                    <div>

                        <h3>
                            Professional Summary
                        </h3>

                        <span>
                            AI-generated resume assessment
                        </span>

                    </div>

                </div>


                <p>

                    {data.summary ||
                        "No professional summary available."
                    }

                </p>

            </div>


            {/* =========================
                SKILLS
            ========================= */}

            <div className="ats-grid">


                {/* MATCHED */}

                <div className="ats-card">

                    <div className="card-title success-title">

                        <FaCheckCircle />

                        <div>

                            <h3>
                                Matched Skills
                            </h3>

                            <span>
                                Skills detected in your resume
                            </span>

                        </div>

                    </div>


                    <div className="skill-list">

                        {matchedSkills.length > 0 ? (

                            matchedSkills.map(
                                (skill, index) => (

                                    <span
                                        className="skill-chip matched"
                                        key={index}
                                    >

                                        <FaCheckCircle />

                                        {skill}

                                    </span>

                                )
                            )

                        ) : (

                            <p className="empty-text">
                                No matched skills found.
                            </p>

                        )}

                    </div>

                </div>


                {/* MISSING */}

                <div className="ats-card">

                    <div className="card-title warning-title">

                        <FaExclamationTriangle />

                        <div>

                            <h3>
                                Missing Skills
                            </h3>

                            <span>
                                Skills you can improve
                            </span>

                        </div>

                    </div>


                    <div className="skill-list">

                        {missingSkills.length > 0 ? (

                            missingSkills.map(
                                (skill, index) => (

                                    <span
                                        className="skill-chip missing"
                                        key={index}
                                    >

                                        <FaExclamationTriangle />

                                        {skill}

                                    </span>

                                )
                            )

                        ) : (

                            <p className="empty-text">
                                No major missing skills detected.
                            </p>

                        )}

                    </div>

                </div>

            </div>


            {/* =========================
                RECOMMENDATIONS
            ========================= */}

            <div className="ats-card recommendations">

                <div className="card-title">

                    <FaLightbulb />

                    <div>

                        <h3>
                            AI Recommendations
                        </h3>

                        <span>
                            Improve your resume before applying
                        </span>

                    </div>

                </div>


                <div className="recommendation-list">

                    {suggestions.length > 0 ? (

                        suggestions.map(
                            (suggestion, index) => (

                                <div
                                    className="recommendation-item"
                                    key={index}
                                >

                                    <div className="recommendation-number">

                                        {index + 1}

                                    </div>

                                    <p>
                                        {suggestion}
                                    </p>

                                </div>

                            )
                        )

                    ) : (

                        <p className="empty-text">

                            Your resume looks good.
                            No additional recommendations
                            available.

                        </p>

                    )}

                </div>

            </div>


            {/* =========================
                ACTIONS
            ========================= */}

            <div className="ats-actions">

                <button
                    className="ats-secondary-btn"
                    onClick={() =>
                        nav(`/resume/${id}`)
                    }
                >

                    Resume Details

                </button>


                <button
                    className="ats-primary-btn"
                    onClick={() =>
                        nav(`/skill-gap/${id}`)
                    }
                >

                    Continue to Skill Gap

                </button>

            </div>

        </div>

    );

}