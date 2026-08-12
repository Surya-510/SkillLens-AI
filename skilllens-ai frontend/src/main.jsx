import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-toastify";

import "./styles/app-pages.css";
import "./styles/Sidebar.css";
import "./styles/Dashboard.css";
import "./styles/ats-analysis.css";
import "./styles/interview.css";
import "./styles/skill-gap.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <>
        <App />

        <ToastContainer
            position="top-right"
            autoClose={3000}
            theme="colored"
        />
    </>
);