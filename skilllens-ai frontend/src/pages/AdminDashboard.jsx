import { useEffect, useState } from "react";

import api from "../api/axios";

import { toast } from "react-toastify";

import {
    FaUsers,
    FaTrash,
    FaUserShield
} from "react-icons/fa";

export default function AdminDashboard() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);


    // ===============================
    // LOAD USERS
    // ===============================

    const loadUsers = async () => {

        try {

            setLoading(true);

            const response = await api.get("/admin/users");

            setUsers(response.data || []);

        } catch (e) {

            console.error("Admin users error:", e);

            toast.error(
                e.response?.data?.message ||
                "Unable to load users"
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadUsers();

    }, []);


    // ===============================
    // DELETE USER
    // ===============================

    const remove = async (id) => {

        if (!window.confirm(
            "Delete this user and their resumes?"
        )) {
            return;
        }

        try {

            await api.delete(`/admin/users/${id}`);

            toast.success(
                "User deleted successfully"
            );

            loadUsers();

        } catch (e) {

            console.error(
                "Delete user error:",
                e
            );

            toast.error(
                e.response?.data?.message ||
                "Delete failed"
            );
        }
    };


    // ===============================
    // COUNTS
    // ===============================

    const userCount = users.filter(
        (user) => user.role === "USER"
    ).length;


    const adminCount = users.filter(
        (user) => user.role === "ADMIN"
    ).length;


    const totalResumes = users.reduce(
        (total, user) =>
            total + (user.resumeCount || 0),
        0
    );


    return (

        <div className="admin-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="admin-header">

                <span className="admin-badge">
                    ADMIN CONTROL CENTER
                </span>

                <h1>
                    System <span>Overview</span>
                </h1>

                <p>
                    Manage registered users and
                    monitor account information.
                </p>

            </div>


            {/* =========================
                STAT CARDS
            ========================= */}

            <div className="admin-stats">

                <AdminStat
                    icon={<FaUsers />}
                    label="Users"
                    value={userCount}
                />

                <AdminStat
                    icon={<FaFileIcon />}
                    label="Resumes"
                    value={totalResumes}
                />

                <AdminStat
                    icon={<FaUserShield />}
                    label="Admins"
                    value={adminCount}
                />

            </div>


            {/* =========================
                USERS
            ========================= */}

            <div className="admin-panel">

                <div className="admin-panel-header">

                    <div>

                        <h2>
                            Users
                        </h2>

                        <p>
                            Registered users and
                            account information
                        </p>

                    </div>

                    <FaUsers />

                </div>


                {loading ? (

                    <div className="admin-loading">
                        Loading users...
                    </div>

                ) : users.length === 0 ? (

                    <div className="admin-empty">
                        No users found.
                    </div>

                ) : (

                    <div className="admin-table-wrapper">

                        <table className="admin-table">

                            <thead>

                                <tr>

                                    <th>ID</th>

                                    <th>
                                        Username
                                    </th>

                                    <th>
                                        Role
                                    </th>

                                    <th>
                                        Resumes
                                    </th>

                                    <th>
                                        Created
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {users.map((user) => (

                                    <tr key={user.id}>

                                        <td>
                                            {user.id}
                                        </td>


                                        <td className="admin-username">
                                            {user.username}
                                        </td>


                                        <td>

                                            <span
                                                className={
                                                    user.role === "ADMIN"
                                                        ? "role-badge admin-role"
                                                        : "role-badge user-role"
                                                }
                                            >
                                                {user.role}
                                            </span>

                                        </td>


                                        <td>
                                            {user.resumeCount || 0}
                                        </td>


                                        <td>

                                            {user.createdAt
                                                ? new Date(
                                                    user.createdAt
                                                ).toLocaleString()
                                                : "-"
                                            }

                                        </td>


                                        <td>

                                            {user.role === "USER" && (

                                                <button
                                                    type="button"
                                                    className="admin-delete-btn"
                                                    onClick={() =>
                                                        remove(user.id)
                                                    }
                                                    title="Delete user"
                                                >
                                                    <FaTrash />
                                                </button>

                                            )}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}


/* =========================================================
   ADMIN STAT
========================================================= */

function AdminStat({ icon, label, value }) {

    return (

        <div className="admin-stat-card">

            <div className="admin-stat-icon">
                {icon}
            </div>

            <div>

                <p>
                    {label}
                </p>

                <h2>
                    {value}
                </h2>

            </div>

        </div>

    );
}


/* =========================================================
   RESUME ICON
========================================================= */

function FaFileIcon() {

    return (
        <span style={{ fontSize: "20px" }}>
            📄
        </span>
    );

}