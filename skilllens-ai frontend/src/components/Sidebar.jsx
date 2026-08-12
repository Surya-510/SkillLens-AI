import { NavLink, useNavigate } from "react-router-dom";

import {
    FaTachometerAlt,
    FaUpload,
    FaHistory,
    FaBriefcase,
    FaChartBar,
    FaTools,
    FaQuestionCircle,
    FaSignOutAlt,
    FaUserShield,
    FaFileAlt
} from "react-icons/fa";


export default function Sidebar({
    open = false,
    onNavigate = () => {}
}) {

    const nav = useNavigate();

    const token =
        localStorage.getItem("token");

    const role =
        localStorage.getItem("role");

    const id =
        localStorage.getItem("resumeId");


    /* =====================================================
       NOT LOGGED IN
    ===================================================== */

    if (!token) {

        return null;

    }


    /* =====================================================
       LOGOUT
    ===================================================== */

    const logout = () => {

        localStorage.clear();

        onNavigate();

        nav("/");

    };


    /* =====================================================
       NAVIGATION LINK
    ===================================================== */

    const link = (
        to,
        icon,
        label
    ) => (

        <NavLink
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
                `side-link ${
                    isActive
                        ? "active"
                        : ""
                }`
            }
        >

            {icon}

            <span>
                {label}
            </span>

        </NavLink>

    );


    return (

        <aside
            className={`sidebar ${
                open
                    ? "open"
                    : ""
            }`}
        >


            {/* =================================================
                BRAND
            ================================================= */}

            <div className="brand">

                <div className="brand-mark">
                    S
                </div>

                <div>

                    <strong>
                        SkillLens
                    </strong>

                    <small>
                        AI Career Studio
                    </small>

                </div>

            </div>


            {/* =================================================
                ADMIN SIDEBAR
            ================================================= */}

            {role === "ADMIN" ? (

                <>

                    <div className="side-label">
                        ADMIN
                    </div>

                    {link(
                        "/admin/dashboard",
                        <FaUserShield />,
                        "Admin Dashboard"
                    )}

                </>

            ) : (

                <>


                    {/* =================================================
                        WORKSPACE
                    ================================================= */}

                    <div className="side-label">
                        WORKSPACE
                    </div>


                    {link(
                        "/dashboard",
                        <FaTachometerAlt />,
                        "Dashboard"
                    )}


                    {link(
                        "/upload",
                        <FaUpload />,
                        "Upload Resume"
                    )}


                    {link(
                        "/job-description",
                        <FaBriefcase />,
                        "Job Description"
                    )}


                    {link(
                        "/history",
                        <FaHistory />,
                        "History"
                    )}


                    {/* =================================================
                        AI TOOLS
                    ================================================= */}

                    {id && (

                        <>

                            <div className="side-label">
                                AI TOOLS
                            </div>


                            {link(
                                `/ats-analysis/${id}`,
                                <FaChartBar />,
                                "ATS Analysis"
                            )}


                            {link(
                                `/skill-gap/${id}`,
                                <FaTools />,
                                "Skill Gap"
                            )}


                            {link(
                                `/interview/${id}`,
                                <FaQuestionCircle />,
                                "Interview Prep"
                            )}


                            {link(
                                `/resume/${id}`,
                                <FaFileAlt />,
                                "Resume Details"
                            )}

                        </>

                    )}

                </>

            )}


            {/* =================================================
                LOGOUT
            ================================================= */}

            <button
                type="button"
                className="logout-link"
                onClick={logout}
            >

                <FaSignOutAlt />

                <span>
                    Logout
                </span>

            </button>


        </aside>

    );

}
