import React, { useState } from 'react';
import { FiDownload, FiTrash2, FiImage, FiGrid } from 'react-icons/fi';
import { FaCloud } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { deleteItem, getImages } from '../api/apiCalls';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { Slide, toast } from 'react-toastify';

const ImagesPage = () => {
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
  const [image, setImage] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['images', image],
    queryFn: getImages
  });

  const handleDelete = async (imageId, type) => {
    try {
      const response = await deleteItem(imageId, type);
      setImage(!image);
      notifySucess(response.message)
    } catch (error) {
      console.log(error);
    }
  };

  const handleDownload = async (fileUrl, fileName, imageId) => {
    try {
      setDownloadingId(imageId);
      setDownloadProgress(0);

      const downloadUrl = fileUrl.includes('res.cloudinary.com') 
        ? fileUrl.replace('/upload/', '/upload/fl_attachment/')
        : fileUrl;

      const response = await axios.get(downloadUrl, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setDownloadProgress(percentCompleted);
        }
      });

      saveAs(new Blob([response.data]), fileName);
      notifySucess("Downloading started")
    } catch (error) {
      console.error('Download failed:', error);
      window.open(fileUrl, '_blank');
    } finally {
      setDownloadingId(null);
      setDownloadProgress(0);
      
    }
  };

  const formatDate = (milliseconds) => {
    if (!milliseconds) return 'No date';
    const date = new Date(milliseconds);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">Error: {error.message}</div>;

  return (
    <div className="images-page">
      <div className="images-header">
        <div className="header-left">
          <FaCloud className="cloud-icon" />
          <h2>My Images</h2>
        </div>
        <div className="view-options">
          <button className="view-btn active"><FiGrid /></button>
          <button className="view-btn"><FiImage /></button>
        </div>
      </div>

      <div className="images-grid">
        {data?.images?.length > 0 ? (
          data.images.map((image) => {
            const fileExtension = image.format?.split('/').pop() || 'jpg';
            const fileName = `${image.owner || 'image'}_${Date.now()}.${fileExtension}`;
            const isDownloading = downloadingId === image._id;
            
            return (
              <div key={image._id} className="image-card">
                <div className="image-preview">
                  <img 
                    src={image.file} 
                    alt={image.owner ? `${image.owner}'s image` : 'User image'} 
                    className="preview-image"
                  />
                </div>
                <div className="image-details">
                  <div className="image-name">
                    {image.owner ? `${image.owner}'s image` : 'Image'}
                  </div>
                  <div className="image-meta">
                    <span>{image.format || 'Unknown format'}</span>
                    <span>•</span>
                    <span>{formatDate(Number(image.date))}</span>
                  </div>
                </div>
                <div className="image-actions">
                  <button 
                    className={`action-btn download-btn ${isDownloading ? 'downloading' : ''}`}
                    onClick={() => handleDownload(image.file, fileName, image._id)}
                    disabled={isDownloading}
                  >
                    {isDownloading ? (
                      <div className="download-loader">
                        <div 
                          className="loader-circle" 
                          style={{
                            background: `conic-gradient(#3498db ${downloadProgress}%, #e0f2fe ${downloadProgress}%)`
                          }}
                        >
                          <span className="progress-text">{downloadProgress}%</span>
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
                    onClick={() => handleDelete(image.public_id, image.type)} 
                    className="action-btn delete-btn"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-images-message">
            No images found!
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagesPage;