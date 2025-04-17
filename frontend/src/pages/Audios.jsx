import React, { useState, useRef } from "react";
import {
  FiDownload,
  FiTrash2,
  FiMusic,
  FiGrid,
  FiList,
  FiPlay,
  FiPause,
  FiLoader,
} from "react-icons/fi";
import { FaCloud } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { deleteItem, getAudios } from "../api/apiCalls";
import axios from "axios";
import { saveAs } from "file-saver";
import { Slide, toast } from "react-toastify";

const AudioPage = () => {
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
  const [audio, setAudio] = useState(true)
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const audioRef = useRef(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["audio", audio],
    queryFn: getAudios,
  });

  // Extract audio files from data or default to empty array
  const audioFiles = data?.audios || [];

  const handlePlayPause = (audioId, audioUrl) => {
    if (currentlyPlaying === audioId) {
      audioRef.current.pause();
      setCurrentlyPlaying(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setCurrentlyPlaying(audioId);

      audioRef.current.onended = () => {
        setCurrentlyPlaying(null);
      };
    }
  };

  const handleDownload = async (url, filename, videoId) => {
    try {
      setDownloadingId(videoId);
      const response = await axios.get(url, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`${percentCompleted}% downloaded`);
        },
      });

      // Ensure filename has .mp4 extension if not present
      const finalFilename = filename.endsWith(".mp3")
        ? filename
        : `${filename}.mp3`;

      saveAs(new Blob([response.data]), finalFilename);
      notifySucess("Downloading started !")
    } catch (error) {
      console.error("Download failed:", error);
      window.open(url, "_blank");
    } finally {
      setDownloadingId(null);
    }
  };

    const handleDelete = async (audioId, type) => {
        try {
          const response = await deleteItem(audioId, type);
          setAudio(!audio);
          notifySucess(response.message)
        } catch (error) {
          console.log(error);
        }
      };

  if (isLoading) {
    return <div className="audio-page loading">Loading audio files...</div>;
  }

  if (error) {
    return (
      <div className="audio-page error">
        Error loading audio files: {error.message}
      </div>
    );
  }

  return (
    <div className="audio-page">
      <div className="audio-header">
        <div className="header-left">
          <FaCloud className="cloud-icon" />
          <h2>My Audio Files</h2>
        </div>
        <div className="view-options">
          <button className="view-btn active">
            <FiGrid />
          </button>
          <button className="view-btn">
            <FiList />
          </button>
        </div>
      </div>

      {audioFiles.length === 0 ? (
        <div className="no-audios">
          <FiMusic size={48} />
          <p>No audio files available</p>
        </div>
      ) : (
        <div className="audio-grid">
          {audioFiles.map((audio) => {
            const fileName = `${audio.owner || "user"}_${
              audio._id || Date.now()
            }`;
            return (
              <div key={audio._id} className="audio-card">
                <div
                  className="audio-preview"
                  onClick={() => handlePlayPause(audio._id, audio.file)}
                >
                  <div className="placeholder-icon">
                    {currentlyPlaying === audio._id ? <FiPause /> : <FiPlay />}
                  </div>
                </div>
                <div className="audio-details">
                  <div className="audio-name">{audio.owner}'s audio</div>
                  <div className="audio-meta">
                    <span>{audio.format}</span>
                    <span>•</span>
                    <span>{audio.date}</span>
                  </div>
                </div>
                <div className="audio-actions">
                  <button
                    className="action-btn download-btn"
                    onClick={() =>
                      handleDownload(audio.file, fileName, audio._id)
                    }
                  >
                    {downloadingId === audio._id ? (
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
                    onClick={() => handleDelete(audio.public_id, audio.type)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AudioPage;
