import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Navbar.css'
import { BASE_URL } from '../Helper.js/Helper';
function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    if (token) {
      axios
        .get(`${BASE_URL}/api/profile`, {
          headers: {
            "x-token": token,
          },
        })
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.error('Error fetching user profile:', err);
          toast.error("Error fetching user profile. Please try again later.");
        });
    }
  }, [token]);


  const generateBackgroundColor = (userInfo) => {
    // Combine user information to create a unique identifier (you can customize this logic)
    const userIdentifier = userInfo ? userInfo._id || userInfo.email || userInfo.username : null;
  
    // Generate a hash based on the user identifier
    const hash = userIdentifier ? userIdentifier.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
  
    // Use the hash to select a color from a predefined array
    const colors = ["#808000", "#008080", "#800080", "#800000", "#008000"];
    const colorIndex = Math.abs(hash) % colors.length;
  
    return colors[colorIndex];
  };

  return (
    <div className='main'>
      <div className='navbar'>
        <div className='main-Logo'>
          <img className='nf-logo' src='https://is3-ssl.mzstatic.com/image/thumb/Purple71/v4/f3/c3/78/f3c37877-c178-b36b-cc96-40597046ff5d/source/256x256bb.jpg' alt='nf-logo-alt-tag' />
          <div className='newsfeed-name'>
            <span className='newsfeed'>Movies Feed</span>
          </div>
        </div>
        {!token ? (
          <div className='signin-button1'>
            <Link to="/register">
              <button className='signin-button'>SIGN UP</button>
            </Link>
            <Link to="/login">
              <button className='signup-button'>SIGN IN</button>
            </Link>
          </div>
        ) : (
          <div className='signin-button1'>
            <Link to="/postForm" style={{color:'black',textDecoration:'none'}}>
              <div className='Postform-div-navbar'>
              {user && (user.profilePicture == 'null' || user.profilePicture == null ? (
    <div className="post-profile-pic" style={{ width: "50px", height: "50px", borderRadius: "50%", backgroundColor: generateBackgroundColor(user), display: "flex", justifyContent: "center", alignItems: "center" }}>
<span style={{ fontSize: "20px", color: "white" }}>{user.firstName?.charAt(0).toUpperCase()}</span>
  </div>

  ):(
                user && user.profilePicture && (
                  <img
                  
                    src={`${BASE_URL}${user.profilePicture}`}
                    alt='img'
                  />
                )
  ))}
              </div>
            </Link>
          </div>
        )}
      
      </div>
      <ToastContainer />
    </div>
  );
}

export default Navbar;