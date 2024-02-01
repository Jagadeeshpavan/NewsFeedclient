import {React,useState} from 'react'
import './ForgotPassword.css';
import{useNavigate,useLocation} from "react-router-dom"
import axios from "axios";
import { BASE_URL } from '../Helper.js/Helper';



const ResetPassword = () => {
  const location = useLocation();
  const  email  = location.state.email;
  console.log(email) ;
  const [password,setPassword]=useState();
  const [confirmPassword,setConfirmPassword]=useState();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post(`${BASE_URL}/api/reset-password/${email}`, { password });
  
      if (res.data.Status === "Success") {
        navigate('/login');
      }
    } catch (err) {
      console.log(err);
    }
  };
  





  return (
    <div className='reset-maindiv'>
      <div className='resetmain'>
        <div className='reset-text'>
          Reset Password
        </div>
        <form onSubmit={handleSubmit}>
        <div className='Passwordreset'>
          <label className='passwordname'>New Password<span className='r-span'>*</span></label>
          <br/>
          <input type='password' 
          name='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          
           className='name-reset'/>
        </div>
        <div className='Passwordreset'>
          <label className='passwordname'>Confirm Password<span className='r-span'>*</span></label>
          <br/>
          <input type='password' 
          name='confirmpassword'
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
           className='name-reset'/>
        </div>
        <div className='resetbutton1'>
          <button type="submit" className='reset-butn'>Reset Password</button>
        </div>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword