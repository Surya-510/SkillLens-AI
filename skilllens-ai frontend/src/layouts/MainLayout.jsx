import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

import Sidebar from "../components/Sidebar";

import "../styles/Sidebar.css";
import "../styles/app-pages.css";

export default function MainLayout() {

    const location = useLocation();

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const publicPages = [
        "/",
        "/login",
        "/register"
    ];

    const isPublicPage =
        publicPages.includes(location.pathname);


    /* =====================================================
       CLOSE MOBILE SIDEBAR AFTER NAVIGATION
    ===================================================== */

    useEffect(() => {

        setSidebarOpen(false);

    }, [location.pathname]);


    /* =====================================================
       CLOSE SIDEBAR WHEN SCREEN BECOMES DESKTOP
    ===================================================== */

    useEffect(() => {

        const handleResize = () => {

            if (window.innerWidth > 768) {

                setSidebarOpen(false);

            }

        };

        window.addEventListener(
            "resize",
            handleResize
        );

        return () => {

            window.removeEventListener(
                "resize",
                handleResize
            );

        };

    }, []);


    /* =====================================================
       PUBLIC PAGES
    ===================================================== */

    if (isPublicPage) {

        return (

            <div className="public-layout">

                <main className="public-main">

                    <Outlet />

                </main>

            </div>

        );

    }


    /* =====================================================
       PROTECTED APPLICATION
    ===================================================== */

    return (

        <div className="app-shell">


            {/* MOBILE MENU BUTTON */}

            <button
                type="button"
                className="mobile-menu-btn"
                aria-label={
                    sidebarOpen
                        ? "Close menu"
                        : "Open menu"
                }
                aria-expanded={sidebarOpen}
                onClick={() =>
                    setSidebarOpen(
                        previous => !previous
                    )
                }
            >

                {sidebarOpen
                    ? <FaTimes />
                    : <FaBars />
                }

            </button>


            {/* MOBILE OVERLAY */}

            {sidebarOpen && (

                <button
                    type="button"
                    className="sidebar-overlay"
                    aria-label="Close menu"
                    onClick={() =>
                        setSidebarOpen(false)
                    }
                />

            )}


            {/* SIDEBAR */}

            <Sidebar
                open={sidebarOpen}
                onNavigate={() =>
                    setSidebarOpen(false)
                }
            />


            {/* MAIN CONTENT */}

            <main className="app-content">

                <Outlet />

            </main>

        </div>

    );

}