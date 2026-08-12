import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";
import "../styles/app-pages.css";

export default function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);


    const handleLogin = async (e) => {

        e.preventDefault();

        if (loading) {
            return;
        }

        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:8080/auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },

                    body: JSON.stringify({
                        username: username.trim(),
                        password: password
                    })
                }
            );


            // ==========================================
            // SUCCESS
            // ==========================================

            if (response.ok) {

                const token =
                    await response.text();

                if (!token || token.trim() === "") {

                    alert(
                        "Login failed. Server returned an empty token."
                    );

                    return;
                }


                // Start clean session
                localStorage.clear();


                localStorage.setItem(
                    "token",
                    token
                );

                localStorage.setItem(
                    "username",
                    username.trim()
                );


                // ==========================================
                // READ JWT ROLE
                // ==========================================

                try {

                    const payload =
                        JSON.parse(
                            atob(
                                token
                                    .split(".")[1]
                                    .replace(/-/g, "+")
                                    .replace(/_/g, "/")
                            )
                        );

                    localStorage.setItem(
                        "role",
                        payload.role || "USER"
                    );

                } catch (error) {

                    console.error(
                        "JWT ROLE ERROR:",
                        error
                    );

                    localStorage.setItem(
                        "role",
                        "USER"
                    );
                }


                const role =
                    localStorage.getItem("role");


                // ==========================================
                // NAVIGATION
                // ==========================================

                navigate(
                    role === "ADMIN"
                        ? "/admin/dashboard"
                        : "/dashboard"
                );

                return;
            }


            // ==========================================
            // LOGIN FAILED
            // ==========================================

            let errorMessage =
                "Incorrect username or password";

            try {

                const errorData =
                    await response.json();

                if (errorData?.message) {

                    errorMessage =
                        errorData.message;
                }

            } catch {

                // Keep default error message
            }


            alert(errorMessage);

        } catch (error) {

            console.error(
                "LOGIN ERROR:",
                error
            );

            alert(
                "Cannot connect to backend server"
            );

        } finally {

            setLoading(false);
        }
    };


    return (
        <div className="auth-page">

            <div className="auth-card login-card">

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


                <div className="auth-heading">

                    <h1>
                        Welcome Back 👋
                    </h1>

                    <p>
                        Login to continue your career journey.
                    </p>

                </div>


                <form
                    onSubmit={handleLogin}
                    autoComplete="on"
                >

                    {/* =========================
                        USERNAME
                    ========================= */}

                    <div className="form-group">

                        <label>
                            Username
                        </label>

                        <div className="input-wrapper">

                            <FaUser />

                            <input
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) =>
                                    setUsername(e.target.value)
                                }
                                autoComplete="username"
                                required
                            />

                        </div>

                    </div>


                    {/* =========================
                        PASSWORD
                    ========================= */}

                    <div className="form-group">

                        <label>
                            Password
                        </label>

                        <div className="input-wrapper">

                            <FaLock />

                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                autoComplete="current-password"
                                required
                            />

                        </div>

                    </div>


                    {/* =========================
                        LOGIN BUTTON
                    ========================= */}

                    <button
                        type="submit"
                        className="auth-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"
                        }
                    </button>

                </form>


                <div className="auth-footer">

                    <span>
                        Don't have an account?
                    </span>

                    <Link to="/register">
                        Create Account
                    </Link>

                </div>

            </div>

        </div>
    );
}