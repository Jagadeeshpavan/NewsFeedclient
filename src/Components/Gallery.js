import { React, useState, useEffect } from 'react'
import './Gallery.css'
import { Link } from "react-router-dom"
import axios from 'axios';
import { format } from 'date-fns';
import { calculateTimeDifference } from './PostingTime';
import { BASE_URL } from '../Helper.js/Helper';

const Gallery = () => {
  
const [posts, setPosts] = useState([]);
  const [token] = useState(localStorage.getItem("token"));

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/gallery`, {
        headers: {
          "x-token": token,
        },
      })
      .then((res) => {
        console.log(res.data);
        setPosts(res.data.posts.reverse());
      })
      .catch((err) => console.log(err));
  }, [token, setPosts]);







  return (
    <div className="App">
      <div style={{ width: '100%', margin: 'auto', }}>


        <header className="App-header" style={{ maxWidth: '75%', margin: 'auto' }}>
          <h1>Gallery</h1>
        </header>
        <div className="feed-container11" >
          {posts.map((post) => (
            <div className="card1" key={post.id}>
              <p className="card1-timestamp">
                  Posted {calculateTimeDifference(post.createdAt)}
                  </p>
              <Link style={{color:'black',textDecoration:'none'}} to={`/post/${post._id}`}>

              <div className="post-div1">
                      {(post.type && post.type.toLowerCase() === 'mp4') || (post.type && post.type.toLowerCase() === 'mp3') ? (
                        <video controls className='post-video'style={{height:'152px',objectFit:"inherit",marginBottom:'0%'}}>
                          <source src={`${BASE_URL}${post.image}`} />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img className="post-picture"
                          src={`${BASE_URL}${post.image}`}
                          alt="img" />
                      )}
                    </div>

                {/* <img src={`${BASE_URL}${post.image}`} 
                alt={''} className="card1-image" /> */}
                <div className="card1-content">
                  <h6 className="card1-title">{post.title.substring(0,50)}</h6>
                  

                </div>
              </Link>
            </div>
          ))}



        </div>
      </div>
    </div>
  );


}

export default Gallery;