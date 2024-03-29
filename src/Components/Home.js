import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"
import Navbar from "./Navbar";
import axios from "axios";
import { AiFillLike } from "react-icons/ai";
import { AiFillDislike } from "react-icons/ai";
import { FaCommentAlt } from "react-icons/fa";
import { BiLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { BiCommentDetail } from "react-icons/bi";
import { IoMdShare } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "./Home.css";
import { MdReply } from "react-icons/md";
import { calculateTimeDifference } from "./PostingTime";
import { HiOutlineDotsVertical } from "react-icons/hi";
import{FacebookShareButton, WhatsappShareButton,EmailShareButton,TwitterShareButton,
  FacebookIcon,LinkedinShareButton,WhatsappIcon,LinkedinIcon,EmailIcon,TwitterIcon,} from "react-share";
import { BASE_URL } from '../Helper.js/Helper';
import { Helmet } from 'react-helmet-async';
import { MdOutlineViewSidebar } from "react-icons/md";
import ReactPlayer from 'react-player'
import { FaEdit } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [commentVisible, setCommentVisible] = useState({});
  const [replyVisible, setReplyVisible] = useState({});
  const [moreVisible, setMoreVisible] = useState({});

  const [comment, setComment] = useState("");
  const [reply, setReply] = useState("");
  const [editing, setEditing] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [displayButtons, setDisplayButtons] = useState(false);
  const [commentLikes, /*setCommentLikes*/] = useState(0);
  const [commentDislikes, /*setCommentDislikes*/] = useState(0);
  const [loginUser, setLoginUser] = useState("");
  const [shareButtons, setShareButtons] = useState(false);
  const commentSectionRef = useRef(null);
  // const [allComments, setAllComments] = useState([]);

  const [token] = useState(localStorage.getItem("token"));
  const [playingStates, setPlayingStates] = useState(false);
  const [videoPlayedStates, setVideoPlayedStates] = useState({});
  // const currentPageUrl = window.location.href;
  const [playedFromStart, setPlayedFromStart] = useState({});
  const [shareCount, setShareCount] = useState({});
  const navigate = useNavigate();
  
  const handlePostEdit = (post) => {
    console.log(post);
    navigate("/postForm", { state: post });
  };




  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/profile`, {
        headers: {
          "x-token": token,
        },
      })
      .then((res) => {
        
        setLoginUser(res.data._id);
      })
      .catch((err) => console.log(err));
  }, [token, setLoginUser]);

  const handleCommentClick = (postId) => {
    setCommentVisible((prevVisible) => ({
      ...prevVisible,
      [postId]: !prevVisible[postId],
    }));
  };

  const handleReplyClick = (commentId) => {
    setReplyVisible((prevVisible) => ({
      ...prevVisible,
      [commentId]: !prevVisible[commentId],
    }));
  }

  

  const handleShareClick = (postId) => {
    setShareButtons((prevShareButtons) => ({
   ...prevShareButtons,
   [postId]:!prevShareButtons[postId]
    }));
  };

  const handleReplyChange = (e) => {
    setReply(e.target.value);
  };

  const handleLessClick = (e,postId) => {
    setMoreVisible((prevVisibility) => ({
      ...prevVisibility,
      [postId]: !prevVisibility[postId]
  }));
  };

  
  
  const handleMoreClick = async (e, postId) => {
    // Toggle the playing state
    setMoreVisible((prevVisibility) => ({
      ...prevVisibility,
      [postId]: !prevVisibility[postId]
  }));
  
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        toast.error("Please login to submit a reply.");
        window.location.href = "/login";
        return; // Stop further execution if token is missing
      }
  
      // Check if the video is currently playing
       {
        // If the video is playing, increment the view count
        const response = await axios.post(
          `${BASE_URL}/api/viewCount/${postId}`,
          {}, // Empty request body
          {
            headers: {
              "x-token": token,
            },
          }
        );
  
        console.log("view submitted:", response.data);
  
        setAllPosts((prevPosts) => {
          return prevPosts.map((post) =>
            post._id === postId ? response.data : post
          );
        });
  
        toast.success("view submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting view:", error);
      toast.error("Error submitting view. Please try again.");
    }
  };
  


  
  const handleVideoPlay = (e,postId) => {
    if (!playedFromStart[postId]) {
      // Increase view count only if the video is played from the start
      handleMoreClick(e, postId);
      setPlayedFromStart((prevPlayedFromStart) => ({
          ...prevPlayedFromStart,
          [postId]: true
      }));
  }
  };

  const handleShareCount = async (postId) => {
    try {
      const token = localStorage.getItem("token");
  
      if (!token) {
        toast.error("Please login to submit a reply.");
        window.location.href = "/login";
        return; // Stop further execution if token is missing
      }
      // Make an HTTP POST request to your backend endpoint to update share count
      {
        // If the video is playing, increment the view count
        const response = await axios.post(
          `${BASE_URL}/api/shareCount/${postId}`,
          {}, // Empty request body
          {
            headers: {
              "x-token": token,
            },
          }
        );
  
        console.log("share submitted:", response.data);
  
        setAllPosts((prevPosts) => {
          return prevPosts.map((post) =>
            post._id === postId ? response.data : post
          );
        });
  
        toast.success("share submitted successfully!");
      }
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };
  

  const handlePostDotsClick = (postId, postedBy) => {
    setDisplayButtons((prevButtons) => ({
      ...prevButtons,
      [postId]: {
        visible: !prevButtons[postId]?.visible,
        currentPostUser: postedBy,
      },
    }));
  };



  

  const handleCommentDotsClick = (commentId, commentedBy) => {
    setDisplayButtons((prevButtons) => ({
      ...prevButtons,
      [commentId]: {
        visible: !prevButtons[commentId]?.visible,
        currentCommentUser: commentedBy,
      },
    }));
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    console.log(postId);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to add items to the wishlist.");
        window.location.href = "/login";
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/api/comment/${postId}`,
        {
          text: comment,
        },
        {
          headers: {
            "x-token": token,
          },
        }
      );

      console.log("Comment submitted:", response.data);
      setAllPosts((prevPosts) => {
        return prevPosts.map((post) =>
          post._id === postId ? response.data : post
        );
      });

      setComment(""); // Clear the comment input

      toast.success("Comment submitted successfully!");
    } catch (error) {
      console.error("Error submitting comment:", error);
      toast.error("Error submitting comment. Please try again.");
    }
  };


  const handleReplySubmit = async (e, postId, commentId) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login to submit a replay.");
        window.location.href = "/login";
        return; // Stop further execution if token is missing
      }

      const response = await axios.post(
        `${BASE_URL}/api/replay/${postId}/${commentId}`,
        {
          text: reply,
        },
        {
          headers: {
            "x-token": token,
          },
        }
      );

      console.log("Replay submitted:", response.data);
      setReply("");
      
      setAllPosts((prevPosts) => {
        return prevPosts.map((post) =>
          post._id === postId ? response.data : post
        );
      });

      
      toast.success("Replay submitted successfully!");
    } catch (error) {
      console.error("Error submitting replay:", error);
      toast.error("Error submitting replay. Please try again.");
    }
  };








  const handleLike = (e, postId, userId) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to add items to the wishlist.");
      window.location.href = "/login";
      return;
    }

    axios
      .post(
        `${BASE_URL}/api/like/${postId}`,
        null, // No request data needed
        {
          headers: {
            "x-token": token,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setAllPosts((prevPosts) => {
          return prevPosts.map((post) =>
            post._id === postId ? response.data : post
          );
        });
      })
      .catch((error) => console.error("Error liking media:", error));
  };

  const handleCommentLike = async (e, postId, commentId) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      toast.error("Please login to add items to the wishlist.");
      window.location.href = "/login";
      return;
    }
  
    try {
      const response = await axios.post(
        `${BASE_URL}/api/commentlike/${postId}/${commentId}`,
        null,
        {
          headers: {
            "x-token": token,
          },
        }
      );
  
      console.log("Server response:", response.data);
  
      setAllPosts((prevPosts) => {
        return prevPosts.map((post) =>
          post._id === postId ? response.data : post
        );
      });
    } catch (error) {
      console.error("Error liking comment:", error);
      console.log("Server response:", error.response);
    }
  };
  
  

  const handleCommentDislike = async (e, postId, commentId) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      toast.error("Please login to add items to the wishlist.");
      window.location.href = "/login";
      return;
    }
  
    try {
      const response = await axios.post(
        `${BASE_URL}/api/commentdislike/${postId}/${commentId}`,
        null,
        {
          headers: {
            "x-token": token,
          },
        }
      );
  
      console.log("Server response:", response.data);
  
      setAllPosts((prevPosts) => {
        return prevPosts.map((post) =>
          post._id === postId ? response.data : post
        );
      });
    } catch (error) {
      console.error("Error liking comment:", error);
      console.log("Server response:", error.response);
    }
  };
  
  

  const handleDislike = (e, postId, userId) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to add items to the wishlist.");
      window.location.href = "/login";
      return;
    }
    axios
      .post(
        `${BASE_URL}/api/dislike/${postId}`,
        null, // No request data 
        {
          headers: {
            "x-token": token,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setAllPosts((prevPosts) => {
          return prevPosts.map((post) =>
            post._id === postId ? response.data : post
          );
        });
      })
      .catch((error) => console.error("Error disliking media:", error));
  };

  const handleDeleteComment = async (commentId, postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );

    if (confirmDelete) {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.delete(
          `${BASE_URL}/api/comment/${postId}/${commentId}`,
          { headers: { "x-token": token } }
        );

        if (response.status === 200) {
          // Update the state to remove the deleted comment
          setAllPosts((prevPosts) => {
            return prevPosts.map((post) => {
              if (post._id === postId) {
                return {
                  ...post,
                  comments: post.comments.filter(
                    (comment) => comment._id !== commentId
                  ),
                };
              }
              return post;
            });
          });

          toast.success("Comment deleted successfully");
        } else {
          console.error("Error deleting comment:", response.data.error);
          toast.error("Error deleting comment. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting comment:", error.message);
        toast.error("Error deleting comment. Please try again.");
      }
    }
  };

  const handlePostDelete = async (postId) => {
    console.log("postId:", postId);

    try {
      
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this post?"
      );
      if (confirmDelete) {
        const token = localStorage.getItem("token");
        const response = await axios.delete(`${BASE_URL}/api/deletePost/${postId}`, {
          headers: { "x-token": token },
        });
        if (response.status === 200) {
          setAllPosts((prevPosts) => prevPosts.filter(post => post._id !== postId));
          toast.success("Post deleted successfully");
        } else {
          console.error("Error deleting post:", response.data.error);
          toast.error("Error deleting post. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error deleting post:", error.message);
      toast.error("Error deleting post. Please try again.");
    }
  };





  const handleEditComment = async (commentId, currentText, postId) => {
    // const newText = prompt("Edit your comment:", currentText);

    setIsEditing(true);
    setEditing({
      commentId,
      postId,
      currentText,
    });

    setComment((prevComments) => {
      // Use the postId as the key in the state object
      return {
        ...prevComments,
        [postId]: currentText,
      };
    });

    if (commentSectionRef.current) {
      commentSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleUpdateComment = async (postId) => {
    // const newText = prompt("Edit your comment:", currentText);
    const { commentId } = editing;
    const newText = comment[postId];

    if (isEditing) {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.put(
          `${BASE_URL}/api/comment/${postId}/${commentId}`,
          { text: newText },
          { headers: { "x-token": token } }
        );

        if (response.status === 200) {
          // Update the state to reflect the edited comment
          setAllPosts((prevPosts) => {
            return prevPosts.map((post) => {
              if (post._id === postId) {
                return {
                  ...post,
                  comments: post.comments.map((comment) => {
                    // Update the edited comment
                    if (comment._id === commentId) {
                      return {
                        ...comment,
                        text: newText,
                      };
                    }
                    return comment;
                  }),
                };
              }
              return post;
            });
          });
          //poiuy
          setComment("");
          setIsEditing(false);
          toast.success("Comment edited successfully");
        } else {
          console.error("Error editing comment:", response.data.error);
          toast.error("Error editing comment. Please try again.");
        }
      } catch (error) {
        console.error("Error editing comment:", error.message);
        toast.error("Error editing comment. Please try again.");
      }
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/allPosts`);
        const responseData = response.data.reverse();
        console.log(responseData);
        setAllPosts(responseData);
      } catch (error) {
        console.error(error);
      }
    };

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

    fetchPosts();
    fetchUsers();
  }, []);

  const generateBackgroundColor = (userInfo) => {
    // Combine user information to create a unique identifier (you can customize this logic)
    const userIdentifier = userInfo
      ? userInfo._id || userInfo.email || userInfo.username
      : null;

    // Generate a hash based on the user identifier
    const hash = userIdentifier
      ? userIdentifier
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0)
      : 0;

    // Use the hash to select a color from a predefined array
    const colors = ["#808000", "#008080", "#800080", "#800000", "#008000"];
    const colorIndex = Math.abs(hash) % colors.length;

    return colors[colorIndex];
  };

  // window.alert((window.location.href));

  return (
    <>

   <Navbar />
      <div className="App">
        <div style={{ width: "75%", margin: "auto" }}>
          <header className="App-header">
            <h2>Movies Feed</h2>
          </header>
          <div className="feed-container">
            {allPosts &&
              allPosts.map((post) => {
                const user = allUsers.find(
                  (user) => user._id === post.Author?.UserId
                );

                // Check if user is found
                if (user) {
                  return (
                    <div className="post" key={post.id}>
                      <div className="post-div">
                       <div className="flex432">
                        <img
                          className="post-profile-pic"
                          src={`${BASE_URL}${user.profilePicture}`}
                          alt="img"
                        />
                        <div>
                          <h3 style={{ margin: "0%", marginLeft: "15px" }}>
                            {`${user.firstName} ${user.lastName}`}
                          </h3>
                          <p className="card1-timestamp">
                            Posted {calculateTimeDifference(post.createdAt)}
                          </p>
                        </div>
                        </div>
                        <div
                                            onClick={() =>
                                              handlePostDotsClick(
                                                post._id,
                                                post.Author?.UserId
                                              )
                                            }
                                            className="comment-buttons"
                                          >
                                            <HiOutlineDotsVertical size={20} />

                                            {displayButtons[post._id]
                                            ?.visible && (
                                            <div className="comment-buttons">
                                              {displayButtons[post._id]
                                                ?.currentPostUser ===
                                              loginUser ? (
                                                <>
                                                <div className="edit-delete-text">
                                                 <MdEdit size={25} style={{ color: 'orange' }} onClick={()=>handlePostEdit(post)} 
                                                  />
                                                  <span style={{ marginLeft: '5px' }}>Edit</span>
                                                  </div>
                                                  <div className="edit-delete-text">
                                                 <MdDeleteForever size={25} style={{ color: 'red' }} onClick={(e)=>handlePostDelete(post._id)}  />
                                                 <span style={{ marginLeft: '5px' }}>Delete</span>
                                                 </div>
                                                </>
                                              ) : (
                                                <button className="creply-button">Report</button>
                                              )}
                                            </div>
                                          )}





                                          </div>
                        {/* <div className="post-editdelete">
                      <FaEdit size={25} style={{ color: 'blue' }} onClick={()=>handlePostEdit(post)}  />
      <MdDeleteForever size={25} style={{ color: 'red' }} onClick={(e)=>handlePostDelete(post._id)}  />
                          </div> */}
                      </div>
                      {/* {displayButtons[post._id]
                                            ?.visible && (
                                            <div className="comment-buttons">
                                              {displayButtons[post._id]
                                                ?.currentPostUser ===
                                              loginUser ? (
                                                <>
                                                 <FaEdit size={25} style={{ color: 'blue' }} onClick={()=>handlePostEdit(post)}  />
                                                 <MdDeleteForever size={25} style={{ color: 'red' }} onClick={(e)=>handlePostDelete(post._id)}  />
                                                  
                                                </>
                                              ) : (
                                                <button className="creply-button">Report</button>
                                              )}
                                            </div>
                                          )}

 */}



                      

                     <div className="post-div1">
                        {post.type &&
                        (post.type.toLowerCase() === "mp4" ||
                          post.type.toLowerCase() === "mp3") ? (
                          <video controls className="post-video" onPlay={(e) => handleVideoPlay(e, post._id)}> 
                            <source 
                              src={`${BASE_URL}${post.image}`}
                            />
                            Your browser does not support video tag.
                          </video>
                        ) : (
                          <img
                            className="post-picture"
                            src={`${BASE_URL}${post.image}`}
                            alt="img"
                          />
                        )}
                      </div> 
                       
                      <div>
                        <h3 style={{ padding: "10px", margin: "0%" }}>
                          {post.title}
                        </h3>
                        {moreVisible[post._id] && (
                          <div className="post-div5">
                            <p className="post-p">{post.content}</p>
                            <button
                              className="post-button"
                              onClick={(e)=>handleLessClick(e, post._id)}
                            >
                              Show Less
                            </button>
                          </div>
                        )}
                        {!moreVisible[post._id] && (
                          <div className="post-div5">
                       <p>
  {post.content.length > 80 ? (
    <>
      <span dangerouslySetInnerHTML={{__html: `${post.content.substring(0, 80)}...`}} />
      <strong>
        <span className="readmore" onClick={(e) => handleMoreClick(e, post._id)}>Read more</span>
      </strong>
    </>
  ) : (
    post.content
  )}
</p>



                            {/* <button
                              className="post-button"
                              onClick={(e)=>handleMoreClick(e,post._id)}
                            >
                              Show More
                            </button> */}
                          </div>
                        )}
                      </div>
                      <div className="post-div4">
                        <div
                          className="post-div3"
                          onClick={(e) =>
                            handleLike(e, post._id, post.Author.UserId)
                          }
                        >
                          <AiFillLike className="post-like" />
                          <p style={{ margin: "0%", marginLeft: "5px" }}>
                            {post.likes} Likes
                          </p>
                        </div>

                        <div
                          className="post-div3"
                          onClick={(e) =>
                            handleDislike(e, post._id, post.Author.UserId)
                          }
                        >
                          <AiFillDislike className="post-like" />
                          <p style={{ margin: "0%", marginLeft: "5px" }}>
                            {post.dislikes} Dislikes
                          </p>
                        </div>

                        <div
                          className="post-div3"
                          onClick={(e) => handleCommentClick(post._id)}
                        >
                          <FaCommentAlt className="post-like" />
                          <p style={{ margin: "0%", marginLeft: "5px" }}>
                            Comments:{" "}
                            {Array.isArray(post.comments)
                              ? post.comments.length
                              : 0}
                          </p>
                        </div>
                    
                        <div className="post-div3"
                        onClick={(e) => handleShareClick(post._id)}
                        >
                          <IoMdShare className="post-like" />
                          <p style={{ margin: "0%", marginLeft: "5px" }}>
                          {post.shareCount} Share
                          </p>
                          

                        </div>
                       
                        <div
                          className="post-div3"
                          onClick={(e) =>
                            handleDislike(e, post._id, post.Author.UserId)
                          }
                        >
                          <MdOutlineViewSidebar className="post-like" />
                          <p style={{ margin: "0%", marginLeft: "5px" }}>
                            {post.views} Views
                          </p>
                        </div>



                      </div>

                      {shareButtons[post._id]&&
                   <div className="share-buttons">
                  <FacebookShareButton 
                   url={`https://news-feedclient.vercel.app/post/${post._id}`}  // Dynamic post URL

                   
                  quote="please share this post"
                  hashtag = "#code"
                  onClick={() => handleShareCount(post._id)} 
                  >
                   <FacebookIcon size={40} round={true}/>  
                  </FacebookShareButton>
                  
                  
<WhatsappShareButton
  url={`https://news-feedclient.vercel.app/post/${post._id}`}
  onClick={() => handleShareCount(post._id)}
>
  <WhatsappIcon size={40} round={true} />
</WhatsappShareButton>

            
                  <TwitterShareButton
                  url={`https://news-feedclient.vercel.app/post/${post._id}`}  // Dynamic post URL
                  onClick={() => handleShareCount(post._id)} 
                  >
                    <TwitterIcon size={40} round={true}/>
                  </TwitterShareButton>
                  <LinkedinShareButton
                  url={`https://news-feedclient.vercel.app/post/${post._id}`}  // Dynamic post URL
                  onClick={() => handleShareCount(post._id)} 
                  >
                  <LinkedinIcon size={40} round={true}/>
                  </LinkedinShareButton>
                  <EmailShareButton
                  url={`https://news-feedclient.vercel.app/post/${post._id}`}  // Dynamic post URL
                  onClick={() => handleShareCount(post._id)} 
                 >
                    <EmailIcon size={40} round={true}/>
                  </EmailShareButton>
                   </div>
                   }





                      {commentVisible?.[post._id] && (
                        <div className="comment-popup">
                          <div className="comment-section1">
                            <h4>
                              {" "}
                              Post Comments:{" "}
                              {Array.isArray(post.comments)
                                ? post.comments.length
                                : 0}{" "}
                            </h4>
                            <div
                              className="comment-section2"
                              ref={commentSectionRef}
                            >
                              <input
                                type="text"
                                placeholder="Add a comment..."
                                value={isEditing ? comment[post._id] : comment}
                                onChange={(e) =>
                                  isEditing
                                    ? setComment((prevComments) => ({
                                        ...prevComments,
                                        [post._id]: e.target.value,
                                      }))
                                    : setComment(e.target.value)
                                }
                                className="comment-input"
                              />

                              {isEditing ? (
                                // Render the "Update" button when editing
                                <button
                                  type="button"
                                  onClick={() => handleUpdateComment(post._id)}
                                >
                                  Update
                                </button>
                              ) : (
                                // Render the "Post" button when not editing
                                <button
                                  type="button"
                                  onClick={(e) =>
                                    handleCommentSubmit(e, post._id)
                                  }
                                >
                                  Post
                                </button>
                              )}
                            </div>
                            <div>
                              {Array.isArray(post.comments) &&
                                post.comments.slice().reverse().map((comment) => {
                                  const commentedUser = allUsers.find(
                                    (user) => user._id === comment.postedBy
                                  );
                                  // Check if commentedUser is defined before rendering
                                  if (commentedUser) {
                                    return (
                                      <div
                                        key={comment._id}
                                        className="comment"
                                      >
                                        <div className="post-div1">
                                          <div className="pnt-div">
                                            {commentedUser.profilePicture ===
                                              "null" ||
                                            commentedUser.profilePicture ===
                                              null ? (
                                              <div
                                                className="post-profile-pic"
                                                style={{
                                                  width: "40px",
                                                  height: "40px",
                                                  borderRadius: "50%",
                                                  backgroundColor:
                                                    generateBackgroundColor(
                                                      commentedUser
                                                    ),
                                                  display: "flex",
                                                  justifyContent: "center",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    fontSize: "20px",
                                                    color: "#",
                                                  }}
                                                >
                                                  {commentedUser.firstName
                                                    .charAt(0)
                                                    .toUpperCase()}
                                                </span>
                                              </div>
                                            ) : (
                                              <img
                                                className="post-profile-pic"
                                                src={`${BASE_URL}${commentedUser.profilePicture}`}
                                                alt="User Profile"
                                                style={{
                                                  width: "40px",
                                                  height: "40px",
                                                }}
                                              />
                                            )}
                                            <h4
                                              style={{
                                                margin: "0%",
                                                marginLeft: "15px",
                                              }}
                                            >
                                              {`${commentedUser.firstName} ${commentedUser.lastName}`}
                                            </h4>
                                            <p className="laxmi123">{`${calculateTimeDifference(
                                              comment.createdAt
                                            )}`}</p>
                                          </div>
                                          <div
                                            onClick={() =>
                                              handleCommentDotsClick(
                                                comment._id,
                                                commentedUser._id
                                              )
                                            }
                                          >
                                            <HiOutlineDotsVertical />
                                          </div>
                                        </div>

                                        <div className="post-div1">
                                          <div>
                                            <p className="comment-text">
                                              {comment.text}
                                            </p>
                                            <div className="cldr">
                                              <span>
                                                <BiLike 
                                                onClick={(e) => handleCommentLike(e, post._id, comment._id)}
                                                
                                                /> &nbsp;{comment.likes}
                                              </span>
                                              <span>
                                                <BiDislike 
                                                 onClick={(e) => handleCommentDislike(e, post._id, comment._id)}/> &nbsp;
                                                {comment.dislikes}
                                              </span>
                                              <span>
                                                <BiCommentDetail 
                                                onClick={() => handleReplyClick(comment._id)}/>
                                                &nbsp;{comment && comment.replays ? comment.replays.length : 0}
                                              </span>
                                              
                                              {replyVisible[comment._id] && (
                                        <div className="replay-popup">
                                          <div className="replay-section1">
                                            <h4> Replies: {comment.replays ? comment.replays.length : 0} </h4>                                            <div className="replay-section2">
                                              <input
                                                type="text"
                                                placeholder="Write a replay..."
                                                value={reply}
                                                onChange={handleReplyChange}
                                                className="Replay-input"
                                              />
                                              <button
                                                type="button"
                                                onClick={(e) => handleReplySubmit(e, post._id, comment._id)}
                                              >
                                                Post
                                              </button>


                                            </div>
                                            <div>
                                            {
                                              comment.replays && comment.replays.slice().reverse().map((replay) => {
                                                const replayedUser = allUsers.find((user) => user._id === replay.replyedBy);
                                          
                                                // Check if replayedUser is defined and has a profile picture before rendering
                                                if (replayedUser) {
                                                  return (
                                                    <div key={replay._id} className="replay" style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
                                                      <div style={{ width: '300px' }}>
                                                        <div className="post-div" style={{ marginBottom: '0%' }}>
                                                        {replayedUser.profilePicture ===
                                              "null" ||
                                            replayedUser.profilePicture ===
                                              null ? (
                                              <div
                                                className="post-profile-pic"
                                                style={{
                                                  width: "40px",
                                                  height: "40px",
                                                  borderRadius: "50%",
                                                  backgroundColor:
                                                    generateBackgroundColor(
                                                      replayedUser
                                                    ),
                                                  display: "flex",
                                                  justifyContent: "center",
                                                  alignItems: "center",
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    fontSize: "20px",
                                                    color: "#",
                                                  }}
                                                >
                                                  {replayedUser.firstName
                                                    .charAt(0)
                                                    .toUpperCase()}
                                                </span>
                                              </div>
                                            ) : (
                                                          <img
                                                            className="post-profile-pic"
                                                            src={`${BASE_URL}${replayedUser.profilePicture}`}
                                                            alt="User Profile"
                                                            style={{ width: "40px", height: "40px" }}
                                                          />
                                            )}
                                                          <h4 style={{ margin: "0%", marginLeft: "15px" }}>
                                                            {`${replayedUser.firstName} ${replayedUser.lastName}`}
                                                          </h4>
                                                        </div>
                                                        {/* <p className="card1-timestamp" style={{ fontSize: 'smaller', margin: '0%', marginLeft: '67px' }}>
                                                          Posted {calculateTimeDifference(comment.createdAt)}
                                                        </p> */}
                                                        <p className="replay-text">{replay.text}</p>
                                                      </div>
                                                    </div>
                                                  );
                                                } else {
                                                  return (
                                                    <div key={replay._id} className="replay">
                                                      <p className="replay-text">{replay.text}</p>
                                                      <div className="post-div3" >
                                                      
                                                    
                                                
                                                
                                                      
                                                    </div>
                                                    </div>
                                                    
                                                  );
                                                }
                                              })
                                            }
                                          </div>
                                          
                                          </div>
                                        </div>
                                      )}
                                            </div>
                                          </div>

                                          {displayButtons[comment._id]
                                            ?.visible && (
                                            <div className="comment-buttons">
                                              {displayButtons[comment._id]
                                                ?.currentCommentUser ===
                                              loginUser ? (
                                                <>
                                                  <button
                                                    className="cedit-button"
                                                    onClick={() =>
                                                      handleEditComment(
                                                        comment._id,
                                                        comment.text,
                                                        post._id
                                                      )
                                                    }
                                                  >
                                                    Edit
                                                  </button>
                                                  <button
                                                    className="cdelete-button"
                                                    onClick={() =>
                                                      handleDeleteComment(
                                                        comment._id,
                                                        post._id
                                                      )
                                                    }
                                                  >
                                                    Delete
                                                  </button>
                                                  {/* <button className="creply-button">Reply</button> */}
                                                </>
                                              ) : (
                                                <button className="creply-button">Report</button>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  } else {
                                    // Handle the case where commentedUser is undefined
                                    return (
                                      <div
                                        key={comment._id}
                                        className="comment-text"
                                      >
                                        <p>User not found</p>
                                        <p>{comment.text}</p>
                                      </div>
                                    );
                                  }
                                })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                } else {
                  // Handle the case when user is not found
                  return (
                    <div className="post" key={post.id}>
                      <p>User not found</p>
                    </div>
                  );
                }
              })}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Home;
