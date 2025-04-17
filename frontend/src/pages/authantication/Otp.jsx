import React, { useEffect, useState } from "react";
import { FaCloud, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { registration } from "../../api/apiCalls";
import { Slide, toast } from "react-toastify";

const OTPVerification = () => {
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

      useEffect(() => {
        notifySucess("OTP sent to your mobile number!")
      }, [])
      
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isVerified, setIsVerified] = useState(false);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto focus to next input
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    try {
      const response = await registration({ otp: otpCode });
      setIsVerified(true);
      // console.log(response)
      if (response.message == "User is created sucessfully !") {
        window.location.reload()
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }

  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="back-button">
            <Link to="/login">
              <FaArrowLeft />
            </Link>
          </div>
          <FaCloud className="auth-icon" />
          <h2>OTP Verification</h2>
          <p>We've sent a 4-digit code to your mobile number</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="otp-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                className="otp-input"
                required
              />
            ))}
          </div>

          <div className="resend-otp">
            Didn't receive code? <button type="button">Resend OTP</button>
          </div>

          <button type="submit" className="auth-btn">
            Verify
          </button>

          {isVerified && (
            <div className="verification-success">
              <p>Your account has been successfully verified!</p>
              <Link to="/dashboard" className="proceed-link">
                Proceed to Dashboard
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
