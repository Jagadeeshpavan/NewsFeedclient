import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
// import { IoMdEye } from "react-icons/io";
// import { IoMdEyeOff } from "react-icons/io";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
// import Navbar from './Navbar';
import './Register.css'
import { BASE_URL } from '../Helper.js/Helper';


const Register = () => {

  const navigate=useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone:'',
    email: '',
    password: '',
    confirmpassword: '',
  });
//   const [showPassword, setShowPassword] = useState(false);


  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

//   const handleTogglePassword = () => {
//     setShowPassword(!showPassword);
//   };
const validatePassword = (password) => {
  // Password should contain at least 8 characters, 1 uppercase, 1 special character, and 1 number
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.password!==formData.confirmpassword){
        alert('wrong credentials')
    }
    else if (!validatePassword(formData.password)) {
      alert('Password should contain at least 8 characters, 1 uppercase, 1 special character, and 1 number.');
    }
    else{
    try {
      const response = await axios.post(`${BASE_URL}/api/register`, formData);

      if (response.status === 201) {
        // Display success message using toast.success
      //  alert('Registration successful');

        toast.success('Registration successful', { position: 'top-center', autoClose: 3000 });

        setTimeout(() => {
          navigate('/login');
        }, 3000);

        // Redirect to login page
      
        setFormData({
          firstName: '',
          lastName: '',
          phone:'',
          email: '',
          password: '',
          confirmpassword: '',
         
        })
      } else {
        // Display unknown error message using toast.error
        toast.error('Unknown error occurred', { position: 'top-center', autoClose: 3000 });
      }
    } catch (error) {
      // Display user already exists message using toast.error
      toast.error('User already exists', { position: 'top-center', autoClose: 3000 });
    }
    
  };
 
}
;

  return (
    <div className='regform'>
    
    <div className='Reg'>
    
    <div className='flex231'>
      <div className='Reg1'> 
      <h2 style={{textAlign:'center'}}>Register Here</h2>
      <form className='RegForm' onSubmit={handleSubmit}>
        {/* <label htmlFor="fname">First Name:</label><br></br> */}
        <input
        className='Reg-input'
          type="text"
          id="firstName"
          name="firstName"
          placeholder='First Name'
          required
          value={formData.firstName}
          onChange={handleInputChange}
        /><br></br>

{/* <label htmlFor="lname">Last Name:</label><br></br> */}
        <input
        placeholder='Last Name'
        className='Reg-input'
          type="text"
          id="lastName"
          name="lastName"
          required
          value={formData.lastName}
          onChange={handleInputChange}
        /><br></br>

<input
        placeholder='Phone'
        className='Reg-input'
          type="number"
          id="phone"
          name="phone"
          required
          value={formData.phone}
          onChange={handleInputChange}
        /><br></br>

        {/* <label htmlFor="email">Email:</label><br></br> */}
        <input
        placeholder='Email'
        className='Reg-input'
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleInputChange}
        /><br></br>

        {/* <label htmlFor="password">Password:</label><br></br> */}
        {/* <div className='password-input-container'> */}
        <input
        placeholder='Password'
        className='Reg-input'
          type="password"
        // type={showPassword ? 'text' : 'password'}
          id="password"
          name="password"
          required
          value={formData.password}
          onChange={handleInputChange}
        />
         {/* <button
            type="button"
            className="password-toggle"
            onClick={handleTogglePassword}
          >
            {showPassword ?  <IoMdEyeOff /> :<IoMdEye />}
          </button> */}
        <br></br>
           {/* </div> */}

{/* <label htmlFor="cpassword">Confirm Password:</label><br></br> */}
        <input
        placeholder='Confirm Password'
        className='Reg-input'
          type="password"
          id="confirmpassword"
          name="confirmpassword"
          required
          value={formData.confirmpassword}
          onChange={handleInputChange}
        /><br></br>
        {/* <button type="submit" className='Reg-but'  >
          Register
        </button> */}
        <button type="submit" disabled={submitting} className='Reg-but'>
          {submitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      <div className='login-link'>
   Have already an account? <Link to="/login" style={{textDecorationLine:'none'}}>Login here</Link>
   </div>
    </div>
   

    <ToastContainer position="top-center" autoClose={3000} />

    </div>
    </div> 
    </div>
    
  );
};

export default Register;