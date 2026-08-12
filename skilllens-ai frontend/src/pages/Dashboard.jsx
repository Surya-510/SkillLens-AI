import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

import {
  FaFileAlt,
  FaBrain,
  FaChartLine,
  FaFilePdf,
  FaTrash,
  FaDownload,
  FaUpload,
  FaTools,
  FaQuestionCircle,
  FaEye
} from "react-icons/fa";

export default function Dashboard() {

  const [dashboard, setDashboard] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const navigate = useNavigate();


  // =========================================================
  // LOAD DASHBOARD
  // =========================================================

  const loadDashboard = async () => {

    try {

      setLoading(true);

      const dashboardResponse =
        await api.get("/resume/dashboard");

      setDashboard(dashboardResponse.data);


      let currentResume = null;

      try {

        const resumeResponse =
          await api.get("/resume/my");

        currentResume = resumeResponse.data;

      } catch (resumeError) {

        /*
         * /resume/my returns 404 when the user has no resume.
         * That should NOT break the dashboard.
         */

        if (resumeError.response?.status !== 404) {

          console.error(
            "Current Resume Error:",
            resumeError
          );

        }

        currentResume = null;
      }


      setResume(currentResume);


      // =====================================================
      // KEEP CURRENT RESUME ID IN SYNC
      // =====================================================

      if (currentResume?.id) {

        localStorage.setItem(
          "resumeId",
          String(currentResume.id)
        );

      } else {

        localStorage.removeItem("resumeId");

      }


    } catch (error) {

      console.error(
        "Dashboard Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Dashboard failed"
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    loadDashboard();

  }, []);


  // =========================================================
  // VIEW RESUME DETAILS
  // =========================================================

  const viewResumeDetails = () => {

    if (!resume?.id) {

      toast.error(
        "Resume not available"
      );

      return;
    }


    const resumeId =
      String(resume.id);


    console.log(
      "VIEW RESUME DETAILS:",
      resumeId
    );


    navigate(
      `/resume/${resumeId}`
    );

  };


  // =========================================================
  // DOWNLOAD RESUME
  // =========================================================

  const downloadResume = async () => {

    if (!resume?.id) {

      toast.error(
        "Resume not available"
      );

      return;

    }


    if (downloading) {
      return;
    }


    try {

      setDownloading(true);


      const resumeId =
        String(resume.id);


      console.log(
        "DOWNLOAD RESUME:",
        resumeId
      );


      const response =
        await api.get(
          `/resume/download/${resumeId}`,
          {
            responseType: "blob"
          }
        );


      /*
       * Create temporary browser URL
       */

      const blob =
        new Blob(
          [response.data],
          {
            type:
              response.headers?.["content-type"] ||
              "application/pdf"
          }
        );


      const url =
        window.URL.createObjectURL(blob);


      /*
       * Create temporary download link
       */

      const link =
        document.createElement("a");

      link.href = url;


      /*
       * Use original file name
       */

      link.download =
        resume.fileName ||
        "resume.pdf";


      document.body.appendChild(link);

      link.click();

      link.remove();


      /*
       * Give browser time to start download
       * before releasing object URL.
       */

      setTimeout(() => {

        window.URL.revokeObjectURL(url);

      }, 1000);


      toast.success(
        "Resume downloaded successfully"
      );


    } catch (error) {

      console.error(
        "Resume Download Error:",
        error
      );


      /*
       * Axios returns Blob when responseType=blob,
       * even for backend errors.
       */

      toast.error(
        "Unable to download resume"
      );


    } finally {

      setDownloading(false);

    }

  };


  // =========================================================
  // DELETE RESUME
  // =========================================================

  const deleteResume = async () => {

    if (!resume?.id) {

      toast.error(
        "Resume not available"
      );

      return;

    }


    if (deleting) {
      return;
    }


    const confirmed =
      window.confirm(
        "Are you sure you want to delete your current resume?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setDeleting(true);


      const resumeId =
        String(resume.id);


      console.log(
        "DELETE RESUME:",
        resumeId
      );


      await api.delete(
        `/resume/${resumeId}`
      );


      /*
       * Remove stale resume ID immediately.
       */

      localStorage.removeItem(
        "resumeId"
      );


      /*
       * Clear current resume from UI.
       */

      setResume(null);


      toast.success(
        "Resume deleted successfully"
      );


      /*
       * Reload dashboard so:
       *
       * Total Resumes
       * Average ATS
       * Current Resume
       *
       * are all updated.
       */

      await loadDashboard();


    } catch (error) {

      console.error(
        "Resume Delete Error:",
        error
      );


      toast.error(
        error.response?.data?.message ||
        "Delete failed"
      );


    } finally {

      setDeleting(false);

    }

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div className="dashboard-page">

        <div className="container py-5 text-center">

          <h3>
            Loading your workspace...
          </h3>

        </div>

      </div>

    );

  }


  // =========================================================
  // NO DASHBOARD DATA
  // =========================================================

  if (!dashboard) {

    return (

      <div className="dashboard-page">

        <div className="container py-5 text-center">

          <h3>
            Unable to load dashboard
          </h3>


          <button
            type="button"
            className="btn btn-primary mt-3"
            onClick={loadDashboard}
          >

            Try Again

          </button>

        </div>

      </div>

    );

  }


  // =========================================================
  // MAIN DASHBOARD
  // =========================================================

  return (

    <div className="dashboard-page">

      <div className="container-fluid px-4 py-4">


        {/* =================================================
            HEADER
        ================================================= */}

        <div className="dashboard-header mb-4">

          <div>

            <span className="text-primary fw-bold">
              PERSONAL WORKSPACE
            </span>


            <h1 className="mt-2">

              Good to see you,{" "}
              {dashboard.username} 👋

            </h1>


            <p className="text-muted">

              Your resume intelligence workspace
              is ready.

            </p>

          </div>


          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              navigate("/upload")
            }
          >

            <FaUpload className="me-2" />

            Upload Resume

          </button>

        </div>


        {/* =================================================
            STATS
        ================================================= */}

        <div className="row g-4 mb-4">


          <div className="col-md-3">

            <div className="dashboard-card">

              <FaFileAlt
                className="dashboard-icon"
              />

              <h6>
                Total Resumes
              </h6>

              <h2>
                {dashboard.totalResumes ?? 0}
              </h2>

            </div>

          </div>


          <div className="col-md-3">

            <div className="dashboard-card">

              <FaChartLine
                className="dashboard-icon"
              />

              <h6>
                Average ATS
              </h6>

              <h2>
                {dashboard.averageATSScore ?? 0}%
              </h2>

            </div>

          </div>


          <div className="col-md-3">

            <div className="dashboard-card">

              <FaBrain
                className="dashboard-icon"
              />

              <h6>
                AI Analyses
              </h6>

              <h2>
                {dashboard.aiAnalysed ?? 0}
              </h2>

            </div>

          </div>


          <div className="col-md-3">

            <div className="dashboard-card">

              <FaFilePdf
                className="dashboard-icon"
              />

              <h6>
                Reports
              </h6>

              <h2>
                {dashboard.totalReports ?? 0}
              </h2>

            </div>

          </div>

        </div>


        {/* =================================================
            CURRENT RESUME
        ================================================= */}

        <div className="dashboard-card mb-4">

          <div className="current-resume-wrapper">


            {/* ---------------------------------------------
                RESUME INFO
            --------------------------------------------- */}

            <div className="current-resume-info">

              <h4>
                Current Resume
              </h4>


              <p className="text-muted mb-0 resume-file-name">

                {resume
                  ? resume.fileName
                  : "No resume uploaded yet"}

              </p>

            </div>


            {/* ---------------------------------------------
                ACTION BUTTONS
            --------------------------------------------- */}

            {resume && (

              <div className="current-resume-actions">


                {/* VIEW */}

                <button
                  type="button"
                  className="btn btn-outline-primary resume-action-btn"
                  onClick={viewResumeDetails}
                  disabled={deleting || downloading}
                  title="View Resume Details"
                >

                  <FaEye />

                  <span>
                    View Details
                  </span>

                </button>


                {/* DOWNLOAD */}

                <button
                  type="button"
                  className="btn btn-outline-success resume-action-btn"
                  onClick={downloadResume}
                  disabled={downloading || deleting}
                  title="Download Resume"
                >

                  <FaDownload />

                  <span>
                    {downloading
                      ? "Downloading..."
                      : "Download"}
                  </span>

                </button>


                {/* DELETE */}

                <button
                  type="button"
                  className="btn btn-outline-danger resume-action-btn"
                  onClick={deleteResume}
                  disabled={deleting || downloading}
                  title="Delete Resume"
                >

                  <FaTrash />

                  <span>
                    {deleting
                      ? "Deleting..."
                      : "Delete"}
                  </span>

                </button>

              </div>

            )}

          </div>


          {/* ---------------------------------------------
              NO RESUME
          --------------------------------------------- */}

          {!resume && (

            <div className="text-center py-5">

              <FaFileAlt
                size={50}
                className="text-muted mb-3"
              />


              <h5>
                No resume uploaded
              </h5>


              <p className="text-muted">

                Upload your resume to start
                using SkillLens AI.

              </p>


              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  navigate("/upload")
                }
              >

                <FaUpload className="me-2" />

                Upload Resume

              </button>

            </div>

          )}

        </div>


        {/* =================================================
            AI TOOLS
        ================================================= */}

        {resume && (

          <div className="dashboard-card">

            <h4 className="mb-4">
              AI Resume Tools
            </h4>


            <div className="row g-3">


              {/* ATS */}

              <div className="col-md-4">

                <div
                  className="tool-card"
                  onClick={() =>
                    navigate(
                      `/ats-analysis/${resume.id}`
                    )
                  }
                >

                  <FaChartLine />

                  <h5>
                    ATS Analysis
                  </h5>

                  <p>
                    Check your resume ATS score
                    and optimization.
                  </p>

                </div>

              </div>


              {/* SKILL GAP */}

              <div className="col-md-4">

                <div
                  className="tool-card"
                  onClick={() =>
                    navigate(
                      `/skill-gap/${resume.id}`
                    )
                  }
                >

                  <FaTools />

                  <h5>
                    Skill Gap
                  </h5>

                  <p>
                    Discover missing skills for
                    your target role.
                  </p>

                </div>

              </div>


              {/* INTERVIEW */}

              <div className="col-md-4">

                <div
                  className="tool-card"
                  onClick={() =>
                    navigate(
                      `/interview/${resume.id}`
                    )
                  }
                >

                  <FaQuestionCircle />

                  <h5>
                    Interview Questions
                  </h5>

                  <p>
                    Generate technical and HR
                    interview questions.
                  </p>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  );

}