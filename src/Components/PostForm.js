import React, { useState,useEffect } from 'react';
import './PostForm.css'; // Import the CSS file
// import { FaCloudUploadAlt } from 'react-icons/fa';
import Tabs from './Tabs'
import { Link } from 'react-router-dom';

// import { Toast } from 'react-toastify/dist/types';
import postimage from '../Assets/backgroung.webp'
// import { toast } from 'react-toastify';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { BASE_URL } from '../Helper.js/Helper';

const PostForm = () => {
    
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const token = localStorage.getItem("token");

    const getCurrentTimestamp = () => {
        const currentDate = new Date();
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return currentDate.toLocaleDateString('en-US', options);
      };



      useEffect(() => {
        axios
          .get(`${BASE_URL}/api/profile`, {
            headers: {
              "x-token": token,
            },
          })
          .then((res) => {
            console.log(res.data);
            setUser(res.data);
          })
          .catch((err) => console.log(err));
      }, [token, setUser]);
    






     
  
      if (!token) {
        toast.error("Please login to add the post.");
        window.location.href = "/login";
        return;
      }






      const handleLogout = () => {
        // Clear the token
        
        localStorage.removeItem('token')
         
        // Redirect to the login page
        navigate('/');
      }







      



return (
    <div className='PostForm-Post'>
        <button className='Postform-button '
         style={{position:'absolute',right:'50px',top:'10px'}}
         onClick={handleLogout}>Log out</button>
        <div className='Postform-div'>
        {user && user.profilePicture && (
            <img style={{
                width:"100px",
                height:'100px',
                borderRadius:'50%'
            }}  src={`${BASE_URL}${user.profilePicture}`} 
            alt='img' />
        )}

            {user ? (
        <>
          <h3 style={{ marginBottom: '0%' }}>{`${user.firstName} ${user.lastName}`}</h3>
          {/* <p style={{ marginTop: '0%' }}>@UserName</p> */}
          <p style={{ marginTop: '10px', fontSize: '12px', color: '#777' }}>
            Posted on: {getCurrentTimestamp()}
          </p>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
                <Tabs />
        </div>

       
    <ToastContainer/>
    </div>
  );
};

export default PostForm;