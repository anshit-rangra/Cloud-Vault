import React, { useState, useRef } from 'react';
import { FiDownload, FiTrash2, FiGrid, FiFilm, FiLoader, FiPlay } from 'react-icons/fi';
import { FaCloud } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { getVideos, deleteItem } from '../api/apiCalls';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { Slide, toast } from 'react-toastify';

const VideosPage = () => {
  const [video, setVideo] = useState(false)
  const [downloadingId, setDownloadingId] = useState(null);
  const videoRefs = useRef({});

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
 
  const { data, isLoading, error } = useQuery({
    queryKey: ['videos', video],
    queryFn: getVideos,
  });

  const handleDownload = async (url, filename, videoId) => {
    try {
      setDownloadingId(videoId);
      const response = await axios.get(url, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`${percentCompleted}% downloaded`);
        }
      });
      
      // Ensure filename has .mp4 extension if not present
      const finalFilename = filename.endsWith('.mp4') ? filename : `${filename}.mp4`;
      
      saveAs(new Blob([response.data]), finalFilename);
      
      notifySucess("Downloading started")
    } catch (error) {
      console.error('Download failed:', error);
      window.open(url, '_blank');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async (videoId, type) => {
      try {
        const response = await deleteItem(videoId, type);
        setVideo(!video);
        notifySucess(response.message)
      } catch (error) {
        console.log(error);
      }
    };

  const togglePlay = (videoId) => {
    const video = videoRefs.current[videoId];
    if (!video) return;
    
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  if (isLoading) return (
    <div className="loading-state">
      <FiLoader className="spinner" />
      <p>Loading your videos...</p>
    </div>
  );

  if (error) return (
    <div className="error-state">
      <p>Error loading videos: {error.message}</p>
      <button onClick={() => window.location.reload()}>Try Again</button>
    </div>
  );

  return (
    <div className="videos-page">
      <header className="videos-header">
        <div className="header-left">
          <FaCloud className="cloud-icon" aria-hidden="true" />
          <h1>My Videos</h1>
        </div>
        <div className="view-options">
          <button className="view-btn active" aria-label="Grid view">
            <FiGrid />
          </button>
          <button className="view-btn" aria-label="List view">
            <FiFilm />
          </button>
        </div>
      </header>

      <main className="videos-grid">
        {data?.videos?.length > 0 ? (
          data.videos.map((video) => {
            const fileName = `${video.owner || 'user'}_${video._id || Date.now()}`;
            
            return (
              <article key={video._id} className="video-card">
                <div 
                  className="video-preview"
                  onClick={() => togglePlay(video._id)}
                >
                  <video
                    ref={(el) => (videoRefs.current[video._id] = el)}
                    src={video.file}
                    className="video-thumbnail"
                    
                    playsInline
                    disablePictureInPicture
                    preload="metadata"
                    controls={false}
                  />
                  <div className="video-overlay">
                    <div className="play-icon">
                      <FiPlay />
                    </div>
                    <div className="video-duration">
                    </div>
                  </div>
                </div>
                
                <div className="video-details">
                  <h2 className="video-name">
                    {video.owner ? `${video.owner}'s video` : 'Video'}
                  </h2>
                  <div className="video-meta">
                    <span>{video.format}</span>
                    <span aria-hidden="true">•</span>
                    <span>{video.date}</span>
                  </div>
                </div>
                
                <div className="video-actions">
                  <button 
                    className="action-btn download-btn"
                    onClick={() => handleDownload(video.file, fileName, video._id)}
                    disabled={downloadingId === video._id}
                    aria-label={`Download ${fileName}`}
                  >
                    {downloadingId === video._id ? (
                      <>
                        <FiLoader className="spinner" />
                        <span>Downloading</span>
                      </>
                    ) : (
                      <FiDownload />
                    )}
                  </button>
                  <button 
                    className="action-btn delete-btn"
                    onClick={() => handleDelete(video.public_id, video.type)}
                    aria-label={`Delete ${fileName}`}
                  >
                   
                      <FiTrash2 />
                    
                  </button>
                </div>
              </article>
            );
          })
        ) : (
          <div className="empty-state">
            <h2>No videos found!</h2>
          </div>
        )}
      </main>
    </div>
  );
};

export default VideosPage;