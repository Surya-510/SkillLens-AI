import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

import {
    FaCheckCircle,
    FaExclamationTriangle,
    FaLightbulb,
    FaArrowLeft,
    FaGraduationCap,
    FaBullseye,
    FaRobot
} from "react-icons/fa";

import "../styles/skill-gap.css";

export default function SkillGap() {

    const { id } = useParams();
    const nav = useNavigate();

    const [r, setR] = useState(null);
    const [busy, setBusy] = useState(true);

    /*
     * IMPORTANT:
     * Read localStorage inside the API function.
     *
     * This prevents stale targetRole / jobDescription
     * values when the user changes the job description
     * or target role before opening Skill Gap.
     */

    const [targetRole, setTargetRole] = useState(
        localStorage.getItem("targetRole") || ""
    );

    const [jobDescription, setJobDescription] = useState(
        localStorage.getItem("jobDescription") || ""
    );


    /* =====================================================
       LOAD SKILL GAP
    ===================================================== */

useEffect(() => {

    const loadSkillGap = async () => {

        try {

            setBusy(true);
            setR(null);

            const currentTargetRole =
                localStorage.getItem("targetRole") || "";

            const currentJobDescription =
                localStorage.getItem("jobDescription") || "";

            console.log(
                "========== SKILL GAP REQUEST =========="
            );

            console.log("Resume ID:", id);
            console.log("Target Role:", currentTargetRole);
            console.log(
                "Job Description:",
                currentJobDescription
            );

            const { data } = await api.post(
                `/resume/skill-gap/${id}`,
                {
                    targetRole: currentTargetRole,
                    jobDescription: currentJobDescription
                }
            );

            console.log(
                "========== SKILL GAP RESPONSE =========="
            );

            console.log(
                JSON.stringify(data, null, 2)
            );

            setR(data);

        } catch (e) {

            console.error(
                "========== SKILL GAP ERROR =========="
            );

            console.error(e);

            toast.error(
                e.response?.data?.message ||
                "Unable to analyze skill gap"
            );

        } finally {

            setBusy(false);

        }

    };

    if (id) {
        loadSkillGap();
    }

}, [id]);


    /* =====================================================
       AI LOADING SCREEN
    ===================================================== */

    if (busy) {

        return (

            <div className="skill-loading-page">

                <div className="skill-loading-card">

                    <div className="skill-ai-icon">
                        <FaRobot />
                    </div>

                    <div className="skill-spinner"></div>

                    <h2>
                        Analyzing Your Skill Gap
                    </h2>

                    <p>
                        AI is comparing your resume skills
                        with the requirements of your target role.
                    </p>

                    <div className="skill-loading-steps">

                        <div className="skill-loading-step active">

                            <span></span>

                            <p>
                                Reading your resume
                            </p>

                        </div>

                        <div className="skill-loading-step">

                            <span></span>

                            <p>
                                Identifying your skills
                            </p>

                        </div>

                        <div className="skill-loading-step">

                            <span></span>

                            <p>
                                Comparing target role
                            </p>

                        </div>

                        <div className="skill-loading-step">

                            <span></span>

                            <p>
                                Finding missing skills
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

    if (!r) {

        return (

            <div className="skill-empty">

                <FaExclamationTriangle />

                <h3>
                    Skill Gap unavailable
                </h3>

                <p>
                    We couldn't analyze your current skill set.
                </p>

                <button
                    className="skill-primary-btn"
                    onClick={() =>
                        nav(`/ats-analysis/${id}`)
                    }
                >

                    <FaArrowLeft />

                    Back to ATS Analysis

                </button>

            </div>

        );

    }


    /* =====================================================
       NORMALIZE RESPONSE
    ===================================================== */

   const resumeSkills =
    Array.isArray(r.skills)
        ? r.skills
        : [];

const matchedSkills =
    Array.isArray(r.matchedSkills)
        ? r.matchedSkills
        : resumeSkills;


    const missingSkills =
        Array.isArray(r.missingSkills)
            ? r.missingSkills
            : [];


    const suggestions = (() => {

        if (Array.isArray(r.suggestions)) {
            return r.suggestions;
        }

        if (typeof r.suggestions === "string") {

            try {

                const parsed =
                    JSON.parse(r.suggestions);

                if (Array.isArray(parsed)) {
                    return parsed;
                }

                return [r.suggestions];

            } catch {

                return [r.suggestions];

            }

        }

        return [];

    })();


    /* =====================================================
       MATCH CALCULATION
    ===================================================== */

    const total =
        matchedSkills.length +
        missingSkills.length;


    const matchPercentage =
        total > 0
            ? Math.round(
                (matchedSkills.length / total) * 100
            )
            : 0;


    /* =====================================================
       RECOMMENDATION
    ===================================================== */

    const recommendationText =
        r.recommendation ||
        suggestions.join(" ");


    /* =====================================================
       MAIN PAGE
    ===================================================== */

    return (

        <div className="skill-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="skill-header">

                <div>

                    <span className="skill-eyebrow">
                        CAREER INTELLIGENCE
                    </span>

                    <h1>
                        Skill Gap Analysis
                    </h1>

                    <p>
                        Discover the skills you already have and
                        identify what you need to learn next.
                    </p>

                </div>


                <button
                    className="skill-back-btn"
                    onClick={() =>
                        nav(`/ats-analysis/${id}`)
                    }
                >

                    <FaArrowLeft />

                    ATS Analysis

                </button>

            </div>


            {/* =================================================
                TARGET ROLE
            ================================================= */}

            <div className="skill-role-card">

                <div className="role-icon">

                    <FaBullseye />

                </div>


                <div>

                    <span>
                        TARGET ROLE
                    </span>

                    <h2>
                        {targetRole || "Target Role Not Set"}
                    </h2>

                </div>


                <div className="match-score">

                    <strong>
                        {matchPercentage}%
                    </strong>

                    <span>
                        Skill Match
                    </span>

                </div>

            </div>


            {/* =================================================
                PROGRESS
            ================================================= */}

            <div className="skill-progress-card">

                <div className="progress-heading">

                    <div>

                        <h3>
                            Your Skill Readiness
                        </h3>

                        <p>
                            {matchedSkills.length}
                            {" "}skills matched out of{" "}
                            {total}
                            {" "}identified skills
                        </p>

                    </div>

                    <strong>
                        {matchPercentage}%
                    </strong>

                </div>


                <div className="skill-progress">

                    <div
                        style={{
                            width: `${matchPercentage}%`
                        }}
                    ></div>

                </div>

            </div>


            {/* =================================================
                SKILLS GRID
            ================================================= */}

            <div className="skill-grid">


                {/* =================================================
                    MATCHED SKILLS
                ================================================= */}

                <div className="skill-card">

                    <div className="skill-card-title matched-title">

                        <FaCheckCircle />

                        <div>

                            <h3>
                                Matched Skills
                            </h3>

                            <span>
                                Skills you already have
                            </span>

                        </div>

                    </div>


                    <div className="skill-list">

                        {matchedSkills.length > 0 ? (

                            matchedSkills.map(
                                (skill, index) => (

                                    <span
                                        className="skill-chip matched-chip"
                                        key={`${skill}-${index}`}
                                    >

                                        <FaCheckCircle />

                                        {skill}

                                    </span>

                                )
                            )

                        ) : (

                            <p className="skill-empty-text">
                                No matching skills detected.
                            </p>

                        )}

                    </div>

                </div>


                {/* =================================================
                    MISSING SKILLS
                ================================================= */}

                <div className="skill-card">

                    <div className="skill-card-title missing-title">

                        <FaExclamationTriangle />

                        <div>

                            <h3>
                                Missing Skills
                            </h3>

                            <span>
                                Skills you should develop
                            </span>

                        </div>

                    </div>


                    <div className="skill-list">

                        {missingSkills.length > 0 ? (

                            missingSkills.map(
                                (skill, index) => (

                                    <span
                                        className="skill-chip missing-chip"
                                        key={`${skill}-${index}`}
                                    >

                                        <FaExclamationTriangle />

                                        {skill}

                                    </span>

                                )
                            )

                        ) : (

                            <p className="skill-empty-text">
                                Great! No major skill gaps detected.
                            </p>

                        )}

                    </div>

                </div>

            </div>


            {/* =================================================
                RECOMMENDATION
            ================================================= */}

            <div className="skill-card recommendation-card">

                <div className="skill-card-title">

                    <FaLightbulb />

                    <div>

                        <h3>
                            Learning Recommendation
                        </h3>

                        <span>
                            AI-powered career guidance
                        </span>

                    </div>

                </div>


                <div className="recommendation-content">

                    <FaGraduationCap />

                    <div className="recommendation-text">

                        {suggestions.length > 0 ? (

                            <ul className="recommendation-list">

                                {suggestions.map(
                                    (suggestion, index) => (

                                        <li key={index}>
                                            {suggestion}
                                        </li>

                                    )
                                )}

                            </ul>

                        ) : (

                            <p>

                                {recommendationText ||
                                    "Focus on developing the missing skills to improve your readiness for the target role."
                                }

                            </p>

                        )}

                    </div>

                </div>

            </div>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="skill-actions">

                <button
                    className="skill-secondary-btn"
                    onClick={() =>
                        nav(`/ats-analysis/${id}`)
                    }
                >

                    <FaArrowLeft />

                    ATS Analysis

                </button>


                <button
                    className="skill-primary-btn"
                    onClick={() =>
                        nav(`/interview/${id}`)
                    }
                >

                    Prepare for Interview

                    <FaGraduationCap />

                </button>

            </div>

        </div>

    );

}