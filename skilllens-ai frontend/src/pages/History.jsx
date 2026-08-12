import { useEffect, useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import {
    FaHistory,
    FaFileAlt,
    FaChartBar,
    FaClock,
    FaCheckCircle
} from "react-icons/fa";

export default function History() {
    const [items, setItems] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            setLoading(true);

            const [resumeResponse, activityResponse] =
                await Promise.all([
                    api.get("/resume/history"),
                    api.get("/resume/activity")
                ]);

            setItems(
                Array.isArray(resumeResponse.data)
                    ? resumeResponse.data
                    : []
            );

            setActivities(
                Array.isArray(activityResponse.data)
                    ? activityResponse.data
                    : []
            );
        } catch (error) {
            console.error("History loading error:", error);

            toast.error(
                error.response?.data?.message ||
                "Unable to load history"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="history-page">

            {/* HEADER */}
            <div className="history-header">

                <div className="history-badge">
                    <FaHistory />
                    <span>AUDIT TRAIL</span>
                </div>

                <h1>
                    Your <span>History</span>
                </h1>

                <p>
                    Track your uploaded resumes, ATS analysis
                    and activity inside your SkillLens workspace.
                </p>

            </div>


            {/* SUMMARY */}
            <div className="history-stats">

                <div className="history-stat-card">

                    <div className="history-stat-icon">
                        <FaFileAlt />
                    </div>

                    <div>
                        <span>Total Resumes</span>
                        <strong>{items.length}</strong>
                    </div>

                </div>


                <div className="history-stat-card">

                    <div className="history-stat-icon">
                        <FaHistory />
                    </div>

                    <div>
                        <span>Total Activities</span>
                        <strong>{activities.length}</strong>
                    </div>

                </div>


                <div className="history-stat-card">

                    <div className="history-stat-icon">
                        <FaChartBar />
                    </div>

                    <div>
                        <span>Analysed Resumes</span>
                        <strong>
                            {
                                items.filter(
                                    (item) =>
                                        item.atsScore !== null &&
                                        item.atsScore !== undefined
                                ).length
                            }
                        </strong>
                    </div>

                </div>

            </div>


            {/* RESUME HISTORY */}
            <section className="history-panel">

                <div className="history-panel-header">

                    <div>
                        <h2>
                            Resume Timeline
                        </h2>

                        <p>
                            Your uploaded resume history
                        </p>
                    </div>

                    <FaFileAlt />

                </div>


                {loading ? (

                    <div className="history-empty">

                        <div className="history-spinner"></div>

                        <h3>Loading history...</h3>

                        <p>
                            Please wait while we fetch your resume history.
                        </p>

                    </div>

                ) : items.length === 0 ? (

                    <div className="history-empty">

                        <div className="history-empty-icon">
                            <FaFileAlt />
                        </div>

                        <h3>
                            No Resume History
                        </h3>

                        <p>
                            Upload a resume to see it appear
                            in your history.
                        </p>

                    </div>

                ) : (

                    <div className="history-table-wrapper">

                        <table className="history-table">

                            <thead>
                                <tr>
                                    <th>Resume</th>
                                    <th>Uploaded</th>
                                    <th>ATS Score</th>
                                    <th>Status</th>
                                </tr>
                            </thead>

                            <tbody>

                                {items.map((item) => {

                                    const score =
                                        item.atsScore !== null &&
                                        item.atsScore !== undefined
                                            ? item.atsScore
                                            : null;

                                    return (
                                        <tr key={item.id}>

                                            <td>

                                                <div className="history-resume">

                                                    <div className="history-file-icon">
                                                        <FaFileAlt />
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {item.fileName ||
                                                                "Resume"}
                                                        </strong>

                                                        <small>
                                                            Resume #{item.id}
                                                        </small>
                                                    </div>

                                                </div>

                                            </td>


                                            <td>

                                                <div className="history-date">

                                                    <FaClock />

                                                    <span>
                                                        {item.uploadedAt
                                                            ? new Date(
                                                                item.uploadedAt
                                                            ).toLocaleString()
                                                            : "N/A"}
                                                    </span>

                                                </div>

                                            </td>


                                            <td>

                                                <span className="history-score">

                                                    {score !== null
                                                        ? `${score}%`
                                                        : "Not analysed"}

                                                </span>

                                            </td>


                                            <td>

                                                {score !== null ? (

                                                    <span className="history-status success">
                                                        <FaCheckCircle />
                                                        Analysed
                                                    </span>

                                                ) : (

                                                    <span className="history-status pending">
                                                        Pending
                                                    </span>

                                                )}

                                            </td>

                                        </tr>
                                    );
                                })}

                            </tbody>

                        </table>

                    </div>

                )}

            </section>


            {/* ACTIVITY */}
            <section className="history-panel">

                <div className="history-panel-header">

                    <div>
                        <h2>
                            Activity
                        </h2>

                        <p>
                            Recent actions performed in your workspace
                        </p>
                    </div>

                    <FaHistory />

                </div>


                {loading ? (

                    <div className="history-empty">
                        <div className="history-spinner"></div>
                        <h3>Loading activities...</h3>
                    </div>

                ) : activities.length === 0 ? (

                    <div className="history-empty">

                        <div className="history-empty-icon">
                            <FaHistory />
                        </div>

                        <h3>
                            No Activity Yet
                        </h3>

                        <p>
                            Your SkillLens activity will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="history-activity-list">

                        {activities.map((item) => (

                            <div
                                className="history-activity"
                                key={item.id}
                            >

                                <div className="activity-icon">
                                    <FaCheckCircle />
                                </div>

                                <div className="activity-content">

                                    <div className="activity-top">

                                        <span className="activity-action">
                                            {item.action ||
                                                "Activity"}
                                        </span>

                                        <span className="activity-time">
                                            {item.createdAt
                                                ? new Date(
                                                    item.createdAt
                                                ).toLocaleString()
                                                : "N/A"}
                                        </span>

                                    </div>

                                    <p>
                                        {item.description ||
                                            "No description available"}
                                    </p>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </div>
    );
}