import React, { useState, useEffect } from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import { FcLock } from 'react-icons/fc';
import './ForgotPassword.css';
import { ToastContainer, toast } from 'react-toastify';
import { BASE_URL } from '../Helper.js/Helper';


const ForgotPassword = () => {

  const navigate=useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/forgot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('Response:', response);

      if (response.ok) {
        setShowOtpField(true);
      } else {
        console.error('Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email,otp }),
      });

      console.log('Response:', response);

      if (response.status===201) {
       
        toast.success('OTP verified successfully .Redirect to password reset page',{ position: 'top-center', className:'toast_success1',autoClose: 3000 });

        setTimeout(() => {
          navigate('/resetPassword',{ state: { email } });
        }, 3000);


      } else {
        toast.error('Failed to verify OTP');
      }
    } catch (error) {
      toast.error('Error sending request:', error);
    }
  };

  useEffect(() => {
    // This effect will run after the component re-renders
    // Update the conditional rendering logic here
  }, [showOtpField]); // Re-run the effect when showOtpField changes

  return (
    <div className='forgot-password'>
      <div className="forgotmainpage">
        <div className="lock-icon">
          <FcLock className="icon-widthlock" />
        </div>
        <div className="forgot-text">Forgot Password ?</div>
        <div className="downtext">
          Remember your password ? <Link to="/login">Login here</Link>.
        </div>

        {!showOtpField ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="outletof-forgot">
              <div className="input-forgot">
                <input
                  type="email"
                  placeholder="Email address"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="forgotpassword-input12"
                />
              </div>
            </div>
            <div className="forgotbutton1">
              <button type="submit" className="forgot-buttn">
                Forgot Password
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <div className="outletof-forgot">
              <div className="input-forgot">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="forgotpassword-input12"
                />
              </div>
            </div>
            <div className="forgotbutton1">
              <button type="submit" className="forgot-buttn">
                Verify OTP
              </button>
            </div>
          </form>
        )}

<ToastContainer  />
      </div>
    </div>
  );
};

export default ForgotPassword;
