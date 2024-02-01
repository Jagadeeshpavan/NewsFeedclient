import * as React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { FaCloudUploadAlt } from 'react-icons/fa';
import MainGallery from './Gallery';
import Profile from './Profile';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Profile1 from './Profile1';
import { BASE_URL } from '../Helper.js/Helper';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [error, setError] = useState('');
  const [token] = useState(localStorage.getItem('token'));
  const [submitting, setSubmitting] = useState('');

  const [formData, setFormData] = useState({
    image: '',
    title: '',
    content: '',
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    setFormData({
      ...formData,
      image: selectedFile,
    });
    setFile(selectedFile);
    // Generate a preview URL
    setPreviewURL(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    try {
      const formDataWithPicture = new FormData();
      formDataWithPicture.append('title', formData.title);
      formDataWithPicture.append('content', formData.content);
      formDataWithPicture.append('image', formData.image);
      formDataWithPicture.append('timestamp', new Date().toISOString());

      
      

      const response = await axios.post(
        `${BASE_URL}/api/post`,
        formDataWithPicture,
        {
          headers: {
            'x-token': token,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log(response);
      setError('');
      alert('Post added successfully.');
      setFormData({
        image: '',
        title: '',
        content: '',
      });
      setFile('');
      // Generate a preview URL
      setPreviewURL(null);
    } catch (error) {
      console.error(error);
      setError('Internal Server Error');
    } finally {
      setSubmitting(false);
    }
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Post" {...a11yProps(0)} />
          <Tab label="Gallery" {...a11yProps(1)} />
          <Tab label="About" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <div className="upload-form-container11">
          <h1>Upload New Post</h1>
          <form className='Postform'>
            <label htmlFor="title">Title: </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder='Title'
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="description">Description:</label>
            <textarea
              id="content"
              name="content"
              placeholder='About Post'
              rows="4"
              value={formData.content}
              onChange={handleInputChange}
              required
            ></textarea>

            {!file ? (
              <label htmlFor="file" className="upload-icon-label">
                <input
                  type="file"
                  id="file"
                  name="image"
                  accept="image/, video/"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  required
                />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <FaCloudUploadAlt className="upload-icon" />
                  <h5 style={{ margin: '0%', padding: '10px' }}>Upload video or photo</h5>
                </div>
              </label>
            ) : (
              <div className="preview-container">
                {file.type.startsWith('image') ? (
                  <img src={previewURL} className='Postform-image' alt="Preview" />
                ) : (
                  <video controls className='Postform-image'>
                    <source src={previewURL} className='Postform-image' type={file.type} />
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            )}

            <button type="button" className='Postform-button' onClick={handleUpload}>
              Post
            </button>
          </form>
        </div>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <MainGallery />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
      <Profile1 />
      </CustomTabPanel>
    </Box>
  );
}
