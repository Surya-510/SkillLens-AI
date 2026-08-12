import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

import {
    FaArrowLeft,
    FaBrain,
    FaCheckCircle,
    FaCode,
    FaLightbulb
} from "react-icons/fa";

import "../styles/interview.css";

export default function Interview() {

    const { id } = useParams();
    const nav = useNavigate();

    const [q, setQ] = useState(null);
    const [busy, setBusy] = useState(true);

    // Prevent duplicate API calls
    // especially when React StrictMode is enabled
   const requestStarted = useRef(false);

const targetRole =
    localStorage.getItem("targetRole") ||
    "";

const jobDescription =
    localStorage.getItem("jobDescription") ||
    "";


/* =====================================================
   GENERATE INTERVIEW QUESTIONS
===================================================== */
useEffect(() => {

    let cancelled = false;

    const generateQuestions = async () => {

        try {

            console.log("===== INTERVIEW REQUEST START =====");

            setBusy(true);

            const response = await api.post(
                `/resume/interview/${id}`,
                {
                    targetRole,
                    jobDescription
                }
            );

            console.log(
                "========== INTERVIEW AI RESPONSE =========="
            );

            console.log(
                response.data
            );

            console.log(
                "==========================================="
            );


            // IMPORTANT
            if (!cancelled) {

                setQ(response.data);

                console.log(
                    "Interview questions state updated"
                );

                setBusy(false);

                console.log(
                    "Interview loading stopped"
                );

            }

        } catch (error) {

            console.error(
                "========== INTERVIEW ERROR =========="
            );

            console.error(
                "Status:",
                error.response?.status
            );

            console.error(
                "Response:",
                error.response?.data
            );

            console.error(
                "Message:",
                error.message
            );

            console.error(
                "======================================"
            );

            if (!cancelled) {

                setBusy(false);

                toast.error(
                    error.response?.data?.message ||
                    "Unable to generate interview questions"
                );

            }

        }

    };

    generateQuestions();

    return () => {

        cancelled = true;

    };

}, [id]);
    /* =====================================================
       AI LOADING SCREEN
    ===================================================== */

    if (busy) {

        return (

            <div className="interview-loading">

                <div className="interview-loading-card">

                    <div className="interview-ai-icon">

                        <FaBrain />

                    </div>


                    <div className="interview-spinner"></div>


                    <h2>
                        Preparing Your Interview
                    </h2>


                    <p>
                        AI is analyzing your resume and
                        generating personalized interview questions.
                    </p>


                    <div className="interview-loading-steps">

                        <span className="loading-step active">
                            Resume Analysis
                        </span>

                        <span className="loading-dot">
                            •
                        </span>

                        <span className="loading-step">
                            Skill Matching
                        </span>

                        <span className="loading-dot">
                            •
                        </span>

                        <span className="loading-step">
                            Question Generation
                        </span>

                    </div>

                    <small>
                        This may take a few seconds...
                    </small>

                </div>

            </div>

        );

    }


    /* =====================================================
       EMPTY / ERROR STATE
    ===================================================== */

    if (!q) {

        return (

            <div className="interview-empty">

                <FaBrain />

                <h3>
                    Interview preparation unavailable
                </h3>

                <p>
                    We couldn't generate interview questions
                    for your resume.
                </p>


                <button
                    className="btn btn-primary"
                    onClick={() =>
                        nav(`/resume/${id}`)
                    }
                >
                    <FaArrowLeft />
                    Back to Resume
                </button>

            </div>

        );

    }


    /* =====================================================
       QUESTION DATA
    ===================================================== */

    const technicalQuestions =
        q.technicalQuestions || [];

    const hrQuestions =
        q.hrQuestions || [];

    const resumeQuestions =
        q.resumeQuestions || [];


    /* =====================================================
       MAIN PAGE
    ===================================================== */

    return (

        <div className="interview-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="interview-header">

                <div>

                    <span className="interview-eyebrow">
                        AI INTERVIEW PREPARATION
                    </span>

                    <h1>
                        Interview Prep
                    </h1>

                    <p>
                        Practice questions generated from your
                        resume and target role.
                    </p>

                </div>


                <button
                    className="interview-back-btn"
                    onClick={() =>
                        nav(`/skill-gap/${id}`)
                    }
                >

                    <FaArrowLeft />

                    Skill Gap

                </button>

            </div>


            {/* =================================================
                TARGET ROLE
            ================================================= */}

            <div className="interview-role-card">

                <div className="interview-role-icon">

                    <FaBrain />

                </div>


                <div>

                    <span>
                        TARGET ROLE
                    </span>

                    <h3>
                        {targetRole}
                    </h3>

                </div>

            </div>


            {/* =================================================
                TECHNICAL QUESTIONS
            ================================================= */}

            <QuestionSection
                title="Technical Questions"
                icon={<FaCode />}
                list={technicalQuestions}
            />


            {/* =================================================
                HR QUESTIONS
            ================================================= */}

            <QuestionSection
                title="HR Questions"
                icon={<FaLightbulb />}
                list={hrQuestions}
            />


            {/* =================================================
                RESUME QUESTIONS
            ================================================= */}

            <QuestionSection
                title="Resume Based Questions"
                icon={<FaCheckCircle />}
                list={resumeQuestions}
            />


            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="interview-actions">

                <button
                    className="btn btn-outline-light"
                    onClick={() =>
                        nav(`/resume/${id}`)
                    }
                >
                    Resume Details
                </button>


                <button
                    className="btn btn-primary"
                    onClick={() =>
                        nav("/dashboard")
                    }
                >
                    Back to Dashboard
                </button>

            </div>


        </div>

    );

}


/* =========================================================
   QUESTION SECTION
========================================================= */

function QuestionSection({
    title,
    icon,
    list = []
}) {

    return (

        <div className="interview-card">


            {/* CARD HEADER */}

            <div className="interview-card-title">

                {icon}

                <div>

                    <h3>
                        {title}
                    </h3>

                    <span>
                        Practice these questions before
                        your interview.
                    </span>

                </div>

            </div>


            {/* QUESTIONS */}

            <div className="question-list">

                {list.length > 0 ? (

                    list.map((item, index) => {

                        const question =
                            typeof item === "string"
                                ? item
                                : item.question;


                        const answer =
                            typeof item === "string"
                                ? null
                                : item.answerKey;


                        return (

                            <details
                                className="question-item"
                                key={index}
                            >

                                <summary>

                                    <span className="question-number">

                                        {index + 1}

                                    </span>


                                    <span>

                                        {question}

                                    </span>

                                </summary>


                                {answer && (

                                    <div className="answer-box">

                                        <strong>
                                            Suggested Answer
                                        </strong>

                                        <p>
                                            {answer}
                                        </p>

                                    </div>

                                )}

                            </details>

                        );

                    })

                ) : (

                    <p className="empty-question">

                        No questions available.

                    </p>

                )}

            </div>


        </div>

    );

}