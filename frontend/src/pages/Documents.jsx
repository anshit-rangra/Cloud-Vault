import React, { useState } from "react";
import {
  FiDownload,
  FiTrash2,
  FiFileText,
  FiFile,
  FiGrid,
} from "react-icons/fi";
import { FaCloud } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { saveAs } from "file-saver";
import { deleteItem, getFiles } from "../api/apiCalls";
import axios from "axios";
import { Slide, toast } from "react-toastify";

const Documents = () => {
  const [doc, setDoc] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const notifySucess = (message) => toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
    transition: Slide,
    });

  // Sample document data

  const { data, isLoading, error } = useQuery({
    queryKey: ["document"],
    queryFn: getFiles,
  });

  const getFileIcon = (filename) => {
    const extension = filename.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return <FiFileText className="doc-icon pdf" />;
      case "docx":
      case "doc":
        return <FiFileText className="doc-icon word" />;
      case "xlsx":
      case "xls":
        return <FiFileText className="doc-icon excel" />;
      case "pptx":
      case "ppt":
        return <FiFileText className="doc-icon powerpoint" />;
      case "txt":
        return <FiFileText className="doc-icon text" />;
      default:
        return <FiFile className="doc-icon" />;
    }
  };

  const handleDelete = async (docId, type) => {
    try {
      const response = await deleteItem(docId, type);
      setDoc(!doc);
      notifySucess(response.message)
    } catch (error) {
      console.log(error);
      console.log("error is from here")
    }
  };

  const handleDownload = async (fileUrl, fileName, fileId) => {
    try {
      setDownloadingId(fileId);
      setDownloadProgress(0);
  
      // Ensure the fileName has the correct extension
      let finalFileName = fileName;
      
      // If the fileName doesn't have an extension, try to get it from the fileUrl
      if (!fileName.includes('.')) {
        const url = new URL(fileUrl.includes('://') ? fileUrl : `https://${fileUrl}`);
        const pathParts = url.pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        
        if (lastPart.includes('.')) {
          const ext = lastPart.split('.').pop();
          finalFileName = `${fileName}.${ext}`;
        }
      }
  
      const downloadUrl = fileUrl.includes("res.cloudinary.com")
        ? fileUrl.replace("/upload/", "/upload/fl_attachment/")
        : fileUrl;
  
      const response = await axios.get(downloadUrl, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setDownloadProgress(percentCompleted);
          }
        },
      });
  
      // Get the content type from the response if available
      let blobOptions = {};
      if (response.headers['content-type']) {
        blobOptions.type = response.headers['content-type'];
      }
  
      saveAs(new Blob([response.data], blobOptions), finalFileName);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(fileUrl, "_blank");
      notifySucess("Downloading started !")
    } finally {
      setDownloadingId(null);
      setDownloadProgress(0);
    }
  };

  if (isLoading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">Error: {error.message}</div>;

  return (
    <div className="documents-page">
      <div className="documents-header">
        <div className="header-left">
          <FaCloud className="cloud-icon" />
          <h2>My Documents</h2>
        </div>
        <div className="view-options">
          <button className="view-btn active">
            <FiGrid />
          </button>
        </div>  
      </div>

      <div className="documents-grid">
        {data ? (
          data.files.length > 0 ? (
            data.files?.map((doc) => {
              const fileExtension = doc.format?.split("/").pop() || "jpg";
              const fileName = `${
                doc.owner || "document"
              }_${Date.now()}.${fileExtension}`;
              const isDownloading = downloadingId === doc._id;

              return (
                <div key={doc.public_id} className="document-card">
                  <div className="document-preview">
                    {getFileIcon(doc.public_id)}
                  </div>
                  <div className="document-details">
                    <div className="document-name">{doc.owner}'s file</div>
                    <div className="document-meta">
                      <span>{doc.format}</span>
                      <span>•</span>
                      <span>{doc.date}</span>
                    </div>
                  </div>
                  <div className="document-actions">
                    <button
                      className={`action-btn download-btn ${
                        isDownloading ? "downloading" : ""
                      }`}
                      onClick={() =>
                        handleDownload(doc.file, fileName, doc._id)
                      }
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <div className="download-loader">
                          <div
                            className="loader-circle"
                            style={{
                              background: `conic-gradient(#3498db ${downloadProgress}%, #e0f2fe ${downloadProgress}%)`,
                            }}
                          >
                            <span className="progress-text">
                              {downloadProgress}%
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <FiDownload />
                          <span>Download</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(doc.public_id, doc.type)}
                      className="action-btn delete-btn"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <h2>No documents</h2>
          )
        ) : (
          <h2>No documents</h2>
        )}
      </div>
    </div>
  );
};

export default Documents;
