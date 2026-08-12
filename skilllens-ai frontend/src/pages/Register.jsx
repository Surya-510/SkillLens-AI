import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import "../styles/app-pages.css";

export default function Register() {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        const cleanUsername = username.trim();

        // =========================
        // BASIC VALIDATION
        // =========================

        if (!cleanUsername) {
            toast.error("Enter username");
            return;
        }

        if (!password.trim()) {
            toast.error("Enter password");
            return;
        }

        if (!confirmPassword.trim()) {
            toast.error("Confirm your password");
            return;
        }

        // =========================
        // PASSWORD MATCH
        // =========================

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            // =========================
            // REGISTER API
            // =========================

            const response = await fetch(
                "http://localhost:8080/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },

                    // UserDTO expects only
                    // username + password
                    body: JSON.stringify({
                        username: cleanUsername,
                        password: password,
                    }),
                }
            );

            // =========================
            // READ RESPONSE
            // =========================

            const contentType =
                response.headers.get("content-type");

            let data;

            if (
                contentType &&
                contentType.includes("application/json")
            ) {
                data = await response.json();
            } else {
                const text = await response.text();

                data = {
                    message: text,
                };
            }

            // =========================
            // ERROR
            // =========================

            if (!response.ok) {
                toast.error(
                    data?.message ||
                    "Registration failed"
                );

                return;
            }

            // =========================
            // SUCCESS
            // =========================

            toast.success(
                data?.message ||
                "Registration successful"
            );

            // Clear form
            setUsername("");
            setPassword("");
            setConfirmPassword("");

            // Go to login page
            setTimeout(() => {
                navigate("/login");
            }, 800);

        } catch (error) {
            console.error(
                "REGISTER ERROR:",
                error
            );

            toast.error(
                "Cannot connect to backend server"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card register-card">

                {/* =========================
                    LOGO
                ========================= */}

                <div className="auth-logo">

                    <div className="auth-logo-icon">
                        S
                    </div>

                    <div>
                        <h3>
                            SkillLens
                        </h3>

                        <small>
                            AI Resume Intelligence
                        </small>
                    </div>

                </div>


                {/* =========================
                    HEADING
                ========================= */}

                <div className="auth-heading">

                    <h1>
                        Create Account 🚀
                    </h1>

                    <p>
                        Start building your career
                        with SkillLens.
                    </p>

                </div>


                {/* =========================
                    REGISTER FORM
                ========================= */}

                <form onSubmit={handleRegister}>

                    {/* USERNAME */}

                    <div className="form-group">

                        <label htmlFor="username">
                            Username
                        </label>

                        <div className="input-wrapper">

                            <FaUser />

                            <input
                                id="username"
                                type="text"
                                placeholder="Choose a username"
                                value={username}
                                onChange={(e) =>
                                    setUsername(
                                        e.target.value
                                    )
                                }
                                autoComplete="username"
                                required
                            />

                        </div>

                    </div>


                    {/* PASSWORD */}

                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="input-wrapper">

                            <FaLock />

                            <input
                                id="password"
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                autoComplete="new-password"
                                required
                            />

                        </div>

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div className="form-group">

                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>

                        <div className="input-wrapper">

                            <FaLock />

                            <input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                autoComplete="new-password"
                                required
                            />

                        </div>

                    </div>


                    {/* SUBMIT BUTTON */}

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>


                {/* =========================
                    FOOTER
                ========================= */}

                <div className="auth-footer">

                    <span>
                        Already have an account?
                    </span>

                    <Link to="/login">
                        Login
                    </Link>

                </div>

            </div>

        </div>
    );
}