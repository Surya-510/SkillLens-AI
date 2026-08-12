import { Link } from "react-router-dom";
import "../styles/app-pages.css";

export default function Landing() {
    return (
        <div className="landing-page">

            <section className="hero-section">

                <div className="hero-content">

                    <span className="hero-badge">
                        AI-POWERED RESUME INTELLIGENCE
                    </span>

                    <h1>
                        Turn your resume into a
                        <span> career strategy.</span>
                    </h1>

                    <p>
                        Improve your ATS score, discover skill gaps
                        and prepare for interviews with one focused workspace.
                    </p>

                    <div className="hero-buttons">

                        <Link
                            to="/login"
                            className="primary-btn"
                        >
                            Get Started
                        </Link>

                        <Link
                            to="/register"
                            className="secondary-btn"
                        >
                            Create Account
                        </Link>

                    </div>

                </div>

            </section>

        </div>
    );
}