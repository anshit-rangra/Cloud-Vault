import React, { useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { upload } from '../api/apiCalls';
import { Slide, toast } from 'react-toastify';

const UploadPage = () => {
  
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
    
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const handleUpload = async () => {

    const formData = new FormData()
    formData.append('file', files[0])
    
    const response = await upload(formData)
    notifySucess(response.message)
    setFiles([]);
  };

  return (
    <div className="upload-page">
      <div className="upload-header">
        <FaCloudUploadAlt className="upload-icon" />
        <h2>Upload Files</h2>
        <p>Drag and drop files to upload</p>
      </div>

      <div 
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <FiUpload className="upload-icon-large" />
        <p>Drag & drop files here or</p>
        <label className="browse-btn">
          Select Files
          <input 
            type="file" 
            multiple 
            onChange={handleFileInput}
            style={{ display: 'none' }} 
          />
        </label>
      </div>

      {files.length > 0 && (
        <>
          <div className="file-list">
            {files.map((file, index) => (
              <div key={index} className="file-item">
                <span className="file-name">{file.name}</span>
                <span className="file-size">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
                <button 
                  className="remove-btn"
                  onClick={() => removeFile(index)}
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>

          <button 
            className="upload-btn"
            onClick={handleUpload}
          >
            Upload {files.length} File{files.length !== 1 ? 's' : ''}
          </button>
        </>
      )}
    </div>
  );
};

export default UploadPage;