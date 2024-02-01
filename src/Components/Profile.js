import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css'
import { IoHomeOutline } from "react-icons/io5";
import { BsFillPersonFill, BsCheckCircle, BsGraphUpArrow } from "react-icons/bs";
import { RiBookOpenLine } from "react-icons/ri";
import { GiSettingsKnobs } from "react-icons/gi";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { BASE_URL } from '../Helper.js/Helper';

function Profile() {
  const [videos, setVideos] = useState([]);

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState('');
  const [formData, setFormData] = useState({
    image:'',
    title: '',
    subtitle: '',
    content: '',

  });

  const [token] = useState(localStorage.getItem('token'));
  
  // console.log(token);

  // useEffect(() => {
  //   // Fetch videos when the component mounts
  //   axios.get('${BASE_URL}/videos')
  //     .then(response => setVideos(response.data))
  //     .catch(error => console.error('Error fetching videos:', error));
  // }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };
  
  

  
  const handleUpload = async (e) => {
    e.preventDefault();
  
    try {
      const formDataWithPicture = new FormData();
      formDataWithPicture.append('title', formData.title);
      formDataWithPicture.append('subtitle', formData.subtitle);
      formDataWithPicture.append('content', formData.content);
      formDataWithPicture.append('image', formData.image);
  
      const response = await axios.post(
        `${BASE_URL}/api/addPost`,
        formDataWithPicture,
        {
          headers: {
            'x-token': token,
            'Content-Type': 'multipart/form-data', // Add this header
          },
        }
      );
  
      console.log(response);
      setError('');
      alert('Post added successfully.');
    } catch (error) {
      console.error(error);
      setError('Internal Server Error');
    } finally {
      setSubmitting(false);
    }
  };
  
  
  
  return (
    <div>
      <div className='main-formsback'>
        <div className='main-row'>
          <div className='main-forms1'>
            <div className='info-flow'>
              Info Flow
            </div>
            <div className='main-profile'>
              <div className='profibox'>
                <div className='named'>
                  <img src='https://img.freepik.com/free-photo/fashionable-young-woman-standing-front-blue-backdrop_23-2148204718.jpg?size=626&ext=jpg&ga=GA1.2.107918774.1697509086&semt=ais' height={'55px'} style={{ borderRadius: "50px" }} />
                </div>
              </div>
              <div className='names'>
                Linda Stewart
              </div>
              <div className='name'>
                k@qyf
              </div>
            </div>
            <div className='dash-row'>
              <div className='dashboard-icon1'>
                <IoHomeOutline />
              </div>
              <div className='dashboard text'>
                Dash Board
              </div>
            </div>
            <div className='dash-row'>
              <div className='dashboard-icon1'>
                <BsFillPersonFill />
              </div>
              <div className='dashboard text'>
                My Profile
              </div>
            </div>
            <div className='dash-row'>
              <div className='dashboard-icon1'>
                <RiBookOpenLine />
              </div>
              <div className='dashboard text'>
                Article Feed
              </div>
            </div>
            <div className='dash-row'>
              <div className='dashboard-icon1'>
                <GiSettingsKnobs />
              </div>
              <div className='dashboard text'>
                Settings
              </div>
            </div>
            <hr className='hr-line'></hr>
            <div className='notifications-row'>
              <div className='notifications'>
                Notifications
              </div>
              <div className='view-all'>
                View All
              </div>
              <div className='view-icon'>
                <MdOutlineKeyboardArrowRight className='icon-color' />
              </div>
            </div>
            <div className='out-let'>
              <div className='posted-details'>
                <div className='profile'>
                  <img src='https://img.freepik.com/free-photo/fashionable-young-woman-standing-front-blue-backdrop_23-2148204718.jpg?size=626&ext=jpg&ga=GA1.2.107918774.1697509086&semt=ais' height={'20px'} style={{ borderRadius: "10px" }} />
                </div>
                <div className='profile-details1'>
                  Last edited was 1 minute ago<br></br>
                  25minute ago
                </div>
              </div>
            </div>
            <div className='margins'>
              <div className='out-let2'>
                <div className='posted-details'>
                  <div className='profile'>
                    <img src='https://img.freepik.com/free-photo/fashionable-young-woman-standing-front-blue-backdrop_23-2148204718.jpg?size=626&ext=jpg&ga=GA1.2.107918774.1697509086&semt=ais' height={'20px'} style={{ borderRadius: "10px" }} />
                  </div>
                  <div className='profile-details1'>
                    Last edited was 1 minute ago<br></br>
                    25minute ago
                  </div>
                </div>
              </div>
            </div>
            <div className='margins'>
              <div className='out-let3'>
                <div className='posted-details'>
                  <div className='profile'>
                    <img src='https://img.freepik.com/free-photo/fashionable-young-woman-standing-front-blue-backdrop_23-2148204718.jpg?size=626&ext=jpg&ga=GA1.2.107918774.1697509086&semt=ais' height={'20px'} style={{ borderRadius: "10px" }} />
                  </div>
                  <div className='profile-details1'>
                    Last edited was 1 minute ago<br></br>
                    25minute ago
                  </div>
                </div>
              </div>
            </div>
            <div className='logout-row'>
              <div className='icon-logout'>
                <BiLogOut />
              </div>
              <div className='logout-text'>
                Log out
              </div>
            </div>

          </div>
          <div className='main-middlepart'>
            <div className='main-nametext'>
              Hello,Linda!
            </div>
            <div className='main-boxtoupload'>
              <div className='main-uploadrow'>
                <div className='main-textlarge'>
                  Participate in the largest online<br />market by integrating your news.
                </div>
                <div className='uploadbutton'>
                  <button className='upload-button'>Upload Post</button>
                </div>
              </div>

            </div>
            <div className='add-new-text'>
              Add a new Post
            </div>
            <div className='viedochange'>
              <div className='displayrowchange'>
                <div className='viedoss'>
                  <input
                    type="file"
                    accept="image/*"
                    name="image" 
                    onChange={handleFileChange}
                    className='choose'
                  />

                </div>
                <div className='display'>
                  <div className='displaycolumn1'>
                    <div className='displayrowchange'>
                      <div className='displaycolumn'>
                        <div className='pixels'>
                          450*120
                        </div>
                        <hr className='hr1'></hr>
                      </div>
                      <div className='px'>
                        PX
                      </div>
                      <div className='px-icon'>
                        <BsCheckCircle className='sizeoficon' />
                      </div>
                    </div>

                  </div>
                  <div className='trendingrow'>
                    <div className='iconheih'>
                      <BsGraphUpArrow className='dupli' />
                    </div>
                    <div className='trendingtext'>
                      Trending
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='heading'>
              <label className='head'>Headlines</label>
              <br />
              <input type="text"
                placeholder="Enter title"
                value={formData.title}
                name="title"
                onChange={handleInputChange}
                className='input12' />

            </div>
            <div className='heading'>
              <label className='Subhead'> Sub Headings</label>
              <br />
              <input type="text"
                placeholder="Enter subtitle"
                value={formData.subtitle}
                name="subtitle"
                onChange={handleInputChange}
                className='input12' />

            </div>
            <div className='heading'>
              <label className='head'> Contents</label>
              <br />
              <input type="text"
                placeholder="Enter content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className='inputcontents' />

            </div>
            <div className='save'>
              <button onClick={handleUpload} className='savebutton'>Save</button>
              <button className='cancelbutton'>Cancel</button>

            </div>
          </div>
        </div>
      </div>
      <div>
        <h2>Video List</h2>
        {/* {videos.map((video) => (
          <div key={video._id}>
            <p>{video.title}</p>
            <p>{video.subtitle}</p>
            <p>{video.content}</p>
            <video
              width="400"
              height="300"
              controls
              autoPlay
              muted
              loop
              src={`http://localhost:5003/uploads/${video.filename}`}
              type="video/mp4"
            />

          </div>
        ))} */}
      </div>

    </div>

  );
}

export default Profile;