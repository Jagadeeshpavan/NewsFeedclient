import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import React,{useState,createContext} from 'react'
import Register from './Components/Register';
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import ForgotPassword from './Components/ForgotPassword';
import Profile from './Components/Profile';
import ResetPassword from './Components/ResetPassword';
import Home from './Components/Home';
import PostForm from './Components/PostForm';
import MyPost from './Components/MyPost';


function App() {
  
  return (
    <div >
          
   <Router>
    <Routes>
    <Route path="/" element={<Home/>}/>   
       
    <Route path='/register' element={<Register/>}/> 
    
    <Route path='/login' element={<Login/>}/> 
    <Route path='/forgotPassword' element={<ForgotPassword/>}/> 
    <Route path='/resetPassword' element={<ResetPassword/>}/> 
    <Route path='/profile' element={<Profile/>}/> 
    <Route path='/postForm' element={<PostForm/>}/> 
    <Route path='/myPost' element={<MyPost/>}/> 
    <Route
                path="/reset_password/:id/:token"
                element={<ForgotPassword />}
              />
       
    <Route path="/post/:postId" element={<MyPost />} /> 
    </Routes>
    </Router>   

           
    </div>
  );
}

export default App;
