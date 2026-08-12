import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";
import { FaCloudUploadAlt } from "react-icons/fa";

export default function Upload() {

  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  const nav = useNavigate();

  const submit = async () => {

    if (!file) {
      toast.error("Select a PDF");
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("PDF files only");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);

    try {

      setBusy(true);

      const { data } = await api.post(
        "/resume/upload",
        fd
      );

      console.log("Upload response:", data);

      // Save resume ID
      localStorage.setItem(
        "resumeId",
        data.id
      );

      toast.success("Resume uploaded successfully!");

      // Go to resume details
      nav(`/resume/${data.id}`);

    } catch (e) {

      console.error("Upload error:", e);

      toast.error(
        e.response?.data?.message ||
        "Upload failed"
      );

    } finally {

      setBusy(false);

    }
  };


  return (
    <div className="page">

      <div className="page-header">

        <span className="step-badge">
          STEP 01
        </span>

        <h1>Upload Resume</h1>

        <p>
          Upload a PDF. SkillLens will keep it
          isolated to your account.
        </p>

      </div>


      <div className="upload-card">

        <FaCloudUploadAlt className="upload-icon" />

        <h3>
          Upload your resume
        </h3>

        <p>
          PDF files only
        </p>


        <input
          className="form-control input-dark mt-3"
          type="file"
          accept="application/pdf,.pdf"
          onChange={(e) =>
            setFile(
              e.target.files?.[0] || null
            )
          }
        />


        {file && (
          <div className="selected-file">
            📄 {file.name}
          </div>
        )}


        <button
          className="btn btn-primary upload-btn"
          onClick={submit}
          disabled={busy}
        >

          {busy
            ? "Uploading..."
            : "Upload & Continue"
          }

        </button>

      </div>

    </div>
  );
}