import React,{useState,useEffect} from 'react'
import img from '../Assets/backgroung.webp'
import './MyPost.css'
import { AiFillLike } from 'react-icons/ai';
import { AiFillDislike } from "react-icons/ai";
import { FaCommentAlt } from 'react-icons/fa';
import { IoMdShare } from 'react-icons/io';
import{useParams,Link} from "react-router-dom";
import axios from 'axios';
import { BASE_URL } from '../Helper.js/Helper';
import{FacebookShareButton, WhatsappShareButton,EmailShareButton,TwitterShareButton,
  FacebookIcon,LinkedinShareButton,WhatsappIcon,LinkedinIcon,EmailIcon,TwitterIcon,} from "react-share";



const MyPost = () => {
  const { postId } = useParams();
  
 
  const [commentVisible, setCommentVisible] = useState(false);
  const [moreVisible, setMoreVisible] = useState(false)
  const [comment, setComment] = useState('');
  const [post, setPost] = useState({});
  const [userId, setUserId] = useState('');
  const [token] = useState(localStorage.getItem('token'));
  const [shareButtons, setShareButtons] = useState(false);
  const [allUsers, setAllUsers] = useState([]);




  const handleShareClick = (postId) => {
    setShareButtons((prevShareButtons) => ({
   ...prevShareButtons,
   [postId]:!prevShareButtons[postId]
    }));
  };

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
      .get(`${BASE_URL}/api/allPosts`
        
      )
      .then((res) => {
        console.log(res.data);
        // Assuming res.data.user.post is an array of posts
        const allPosts = res.data;
  
        // Filter the posts based on the postId
        const selectedPost = allPosts.filter((post) => post._id === postId);
  
        // If a post with the given postId is found, set it as the selected post
        if (selectedPost.length > 0) {
          setPost(selectedPost[0]);
          setUserId(selectedPost[0].Author.UserId)
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
  
  useEffect(() => {
   

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/allUsers`);
        const responseData = response.data;
        console.log(responseData);
        setAllUsers(responseData);
      } catch (error) {
        console.error(error);
      }
    };

    
    fetchUsers();
  }, []);


  const user = allUsers.find((user) => user._id === userId);


  return (
    <div className='MainPost'>
        <div className='MyPost'>
            <div className='MyPost-img'>
                {/* <img className='Postimage'
                 src={`${BASE_URL}${post.image}`}
                  alt='img' /> */}


{post.type &&
                        (post.type.toLowerCase() === "mp4" ||
                          post.type.toLowerCase() === "mp3") ? (
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
            {user && (
                <div style={{display:'inline-flex',alignItems:'center'}}>
                    <img className="post-profile-pic" src={`${BASE_URL}${user.profilePicture}`} alt="img" />
                    <h2 style={{ margin: '0%', marginLeft: '15px' }}>{`${user.firstName} ${user.lastName}`}</h2>
                    </div>
            )}
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
          <p style={{ margin: '0%', marginLeft: '5px' }}>{post.dislikes} Dislikes </p>
        </div>

        <div className="post-div3"
        onClick={(e) => handleShareClick(post._id)}>
          <IoMdShare className="post-like" />
          <p style={{ margin: '0%', marginLeft: '5px' }}>Share</p>
        </div>
      </div>
      {shareButtons[post._id]&&
                   <div className="share-buttons">
                  <FacebookShareButton 
                   url={`https://news-feedclient.vercel.app/post/${post._id}`}  // Dynamic post URL

                   
                  quote="please share this post"
                  hashtag = "#code"
                  
                  >
                   <FacebookIcon size={40} round={true}/>  
                  </FacebookShareButton>
                  
                  <WhatsappShareButton
                   url={`https://news-feedclient.vercel.app/post/${post._id}`}
                  >
                   
                    <WhatsappIcon size={40} round={true}/>
                    
                  </WhatsappShareButton>
            
                  <TwitterShareButton
                  url={`https://news-feedclient.vercel.app/post/${post._id}`}  // Dynamic post URL
                  >
                    <TwitterIcon size={40} round={true}/>
                  </TwitterShareButton>
                  <LinkedinShareButton
                  url={`https://news-feedclient.vercel.app/post/${post._id}`}  // Dynamic post URL
                  >
                  <LinkedinIcon size={40} round={true}/>
                  </LinkedinShareButton>
                  <EmailShareButton
                  url={`https://news-feedclient.vercel.app/post/${post._id}`}  // Dynamic post URL
                  >
                    <EmailIcon size={40} round={true}/>
                  </EmailShareButton>
                   </div>
                   }



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