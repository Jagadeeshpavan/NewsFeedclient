import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile1.css';
import postimage from '../Assets/backgroung.webp'
// import { IoMdCloudDownload } from "react-icons/io";
import { BASE_URL } from '../Helper.js/Helper';
import { FaEdit } from "react-icons/fa";

const Profile1 = () => {
  const [editing, setEditing] = useState(false);
  const [token] = useState(localStorage.getItem("token"));

  const [formData, setFormData] = useState({
   
  });

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
  
    setEditing(false);
  
    try {
      const formDataWithPicture = new FormData();
      formDataWithPicture.append('firstName', formData.firstName);
      formDataWithPicture.append('lastName', formData.lastName);
      formDataWithPicture.append('email', formData.email);
      formDataWithPicture.append('phone', formData.phone);
  
      // Check if a new profile picture is selected
      if (formData.profilePicture) {
        formDataWithPicture.append('profilePicture', formData.profilePicture);
      }
  
      const response = await axios.put(`${BASE_URL}/api/profile`, formDataWithPicture, {
        headers: {
          "x-token": token,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Profile updated successfully', response.data);
  
      setFormData(response.data);
      // Handle success or update the state accordingly
    } catch (error) {
      console.error('Error updating profile', error);
      // Handle error or update the state accordingly
    }
  };
  
  const handleCancelClick = () => {
    setEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      profilePicture: file,
    });
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
        setFormData(res.data);
      })
      .catch((err) => console.log(err));
  }, [token, setFormData]);


  return (
    <form onSubmit={handleEditSave}>
      <div className="profile-container">
      {editing ? (
        <h2 className='personal-information'>Edit Profile</h2>
        ) : (
          <h2 className='personal-information'>Profile</h2>
          )}
        <div className="profile-form">
          <div className="profile-info">
          <div className='profile-picture'>
          <img style={{
                width:"150px",
                height:'150px',
                borderRadius:'50%'
            }} src={`${BASE_URL}${formData.profilePicture}`}  alt='img' />
              {editing && (
                <div>
                <label>
                
                <FaEdit />
                  
                  <input type="file" accept="image/*"style={{display:'none'}} name="profilePicture" onChange={handleFileChange} />
                </label>
                </div>
              )}
              
            </div>

            <div className="profile-details">
              <div className="details">
              <div className={editing ? 'flex12' : 'flex'}>
                  
                
                  <div className='flex23'>
                <p class="label-width" >
                First Name:
                </p>
                  {editing ? (
                    
                    <input  className='input-edit' type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                  ) : (
                    <span className='input-edit12'>{formData.firstName}</span>)}
                  
                  </div>
                
               
       <div className='flex23'>
       <p class="label-width" >
         Last Name:
       </p>
       {editing ? (
       
       <input  className='input-edit'  type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} />
       
       ) : (
        <span className='input-edit12'>{formData.lastName}</span>)}
       </div>
    
    </div>
    <div className={editing ? 'flex12' : 'flex'}>

    <div className='flex23'>
                <p class="label-width">
                  Email:
                  </p>
                  {editing ? (
                    <input   className='input-edit' type="text" name="email" value={formData.email} onChange={handleInputChange} />
                  ) : (
                    <span className='input-edit12'>{formData.email}</span>
                  )}
                
                </div>
                <div className='flex23'>
                <p class="label-width">
                  Phone:
                  </p>
                  {editing ? (
                    <input  name="phone" type='text' className='input-edit' value={formData.phone} onChange={handleInputChange} />
                  ) : (
                    <span className='input-edit12'>{formData.phone}</span>
                  )}
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {editing ? (
          <div className='profile-btns'>
            <button className='save-btn' type="submit" >Update</button>
            <button className="cancel-btn" type="button" onClick={handleCancelClick}>
              Cancel
            </button>
        </div>
        ) : (
          
          <button className='edit-btn' type="button" onClick={handleEditClick}>
            Edit
          </button>
          
        )}
      </div>
    </form>
  );
};

export default Profile1;