import React,{useState,useEffect} from 'react'
import img from '../Assets/backgroung.webp'
import './MyPost.css'
import { AiFillLike } from 'react-icons/ai';
import { AiFillDislike } from "react-icons/ai";
import { FaCommentAlt } from 'react-icons/fa';
import { IoMdShare } from 'react-icons/io';
import{useParams} from "react-router-dom";
import axios from 'axios';
import { BASE_URL } from '../Helper.js/Helper';

const MyPost = () => {
  const { postId } = useParams();
  
 
  const [commentVisible, setCommentVisible] = useState(false);
  const [moreVisible, setMoreVisible] = useState(false)
  const [comment, setComment] = useState('');
  const [post, setPost] = useState({});
  
  const [token] = useState(localStorage.getItem('token'));



  const handleLike = () => {
    
    axios.post(
      `${BASE_URL}/api/like/${postId}`,
      {},
      {
        headers: {
          'x-token': token,
          'Content-Type': 'application/json',
        },
      }
    )

      .then(response => {
        console.log(response.data);
        setPost(response.data);
         // Update media list after successful like
      })
      .catch(error => console.error('Error liking media:', error));
  };

  const handleDislike = (postId) => {

    axios.post(
      `${BASE_URL}/api/dislike/${postId}`,
      {},
      {
        headers: {
          'x-token': token,
          'Content-Type': 'application/json',
        },
      }
    )

      .then(response => {
        console.log(response.data);
        setPost(response.data);
         // Update media list after successful dislike
      })
      .catch(error => console.error('Error disliking media:', error));
  };






  const handleCommentClick = () => {
    setCommentVisible(!commentVisible);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleMoreclick = () => {
    setMoreVisible(!moreVisible);
  };

  

  
  

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/gallery`, {
        headers: {
          "x-token": token,
        },
      })
      .then((res) => {
        console.log(res.data);
        // Assuming res.data.user.post is an array of posts
        const allPosts = res.data.posts;
  
        // Filter the posts based on the postId
        const selectedPost = allPosts.filter((post) => post._id === postId);
  
        // If a post with the given postId is found, set it as the selected post
        if (selectedPost.length > 0) {
          setPost(selectedPost[0]);
        } else {
          console.log("Post not found");
          // Handle the case where the post with the given ID is not found
        }
      })
      .catch((err) => {
        console.log(err);
        // Handle errors here
      });
  }, [token, postId, setPost]);
  






  return (
    <div className='MainPost'>
        <div className='MyPost'>
            <div className='MyPost-img'>
                {/* <img className='Postimage'
                 src={`${BASE_URL}${post.image}`}
                  alt='img' /> */}


{post.image && post.image.includes('video') ? (
            <video controls style={{width:'100%'}}>
              <source src={`${BASE_URL}${post.image}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              className='Postimage'
              src={`${BASE_URL}${post.image}`}
              alt='img'
            />
          )}
            </div>
            <div className='postdiv'>
            <div className="post-div11">
                <div style={{display:'inline-flex',alignItems:'center'}}>
                    <img className="post-profile-pic" src={img} alt="img" />
                    <h2 style={{ margin: '0%', marginLeft: '15px' }}>UserName</h2>
                    </div>
                    <h3 style={{padding:'10px',margin:'0%',marginTop:'10px'}}>{post.title}</h3>
                    {moreVisible && (
                <div className='post-div5' >
                <p className='post-p'>{post.content}</p>
                <button className='post-button'  onClick={handleMoreclick}>Show Less</button>
                </div>
            )}
            {!moreVisible && (
                <div className='post-div5' >
                <p>{post.content && post.content.substring(0, 200)}</p>
                <button className='post-button' onClick={handleMoreclick}>Show More</button>
                </div>
            )}     
            </div>
<div className="post-div4">
        <div className="post-div3"  onClick={() => handleLike(post._id)}>
          <AiFillLike className="post-like" />
          <p  style={{ margin: '0%', marginLeft: '5px' }}>{post.likes} Likes</p>
        </div>

        <div className="post-div3" onClick={()=>handleDislike(post._id)}>
          <AiFillDislike className="post-like" />
          <p style={{ margin: '0%', marginLeft: '5px' }}>{post.dislikes} Dislikes</p>
        </div>

        <div className="post-div3">
          <IoMdShare className="post-like" />
          <p style={{ margin: '0%', marginLeft: '5px' }}>Share</p>
        </div>
      </div>
      <div className="post-div3" style={{margin:'15px 35px',paddingBottom:'10px',borderBottom:'1px solid #ddd'}} onClick={handleCommentClick}>
          <FaCommentAlt className="post-like" />
          <p style={{ margin: '0%', marginLeft: '5px' }}>Comment</p>
        </div>
      {commentVisible && (
        <div className="comment-section11">
          <input
            type="text"
            placeholder="Write a comment..."
            value={comment}
            onChange={handleCommentChange}
          />
          {/* Additional comment-related components can be added as needed */}
          {/* <p>{comment}</p> */}
        </div>
      )}
            

            </div>
        </div>

    </div>
  )
}

export default MyPost