import React, { useEffect, useRef, useState } from "react";

import axios from "axios";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { BiCommentDetail, BiDislike, BiLike } from "react-icons/bi";
import { FaCommentAlt } from "react-icons/fa";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoMdShare } from "react-icons/io";
import {
  FacebookIcon,
  FacebookShareButton, WhatsappShareButton
} from "react-share";
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from '../Helper.js/Helper';
import "./Home.css";
import Navbar from "./Navbar";
import { calculateTimeDifference } from "./PostingTime";

const Home = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [commentVisible, setCommentVisible] = useState({});
  const [moreVisible, setMoreVisible] = useState(false);
  const [comment, setComment] = useState("");
  const [editing, setEditing] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [displayButtons, setDisplayButtons] = useState(false);
  const [commentLikes, ] = useState(0);
  const [commentDislikes, ] = useState(0);
  const [loginUser, setLoginUser] = useState("");
  const [shareButtons, setShareButtons] = useState(false);
  const commentSectionRef = useRef(null);

  const [token] = useState(localStorage.getItem("token"));
 

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

  const handleShareClick = () => {
    setShareButtons(!shareButtons);
  };

  // const postQuote = 'Please share this post';
  // const postHashtag = '#code';


  const handleMoreclick = () => {
    setMoreVisible(!moreVisible);
  };
  const handleDotsClick = (commentId, commentedBy) => {
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
            <h1>Facebook Feed</h1>
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
                        <img
                          className="post-profile-pic"
                          src={`${BASE_URL}${user.profilePicture}`}
                          alt="img"
                        />
                        <div>
                          <h2 style={{ margin: "0%", marginLeft: "15px" }}>
                            {`${user.firstName} ${user.lastName}`}
                          </h2>
                          <p className="card1-timestamp">
                            Posted {calculateTimeDifference(post.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="post-div1">
                        {post.type &&
                        (post.type.toLowerCase() === "mp4" ||
                          post.type.toLowerCase() === "mp3") ? (
                          <video controls className="post-video">
                            <source
                              src={`${BASE_URL}${post.image}`}
                            />
                            Your browser does not support the video tag.
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
                        {moreVisible && (
                          <div className="post-div5">
                            <p className="post-p">{post.content}</p>
                            <button
                              className="post-button"
                              onClick={handleMoreclick}
                            >
                              Show Less
                            </button>
                          </div>
                        )}
                        {!moreVisible && (
                          <div className="post-div5">
                            <p>{post.content.substring(0, 200)}</p>
                            <button
                              className="post-button"
                              onClick={handleMoreclick}
                            >
                              Show More
                            </button>
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
                            Share
                          </p>
                          

                        </div>
                   {shareButtons&&
                   <div className="share-buttons">
                  <FacebookShareButton 
                   url="https://amazon.com"

                   
                  quote="please share this post"
                  hashtag = "#code"
                  >
                   <FacebookIcon/>  
                  </FacebookShareButton>
                  <WhatsappShareButton>
    
                  </WhatsappShareButton>
                   </div>
                   }
                 </div>
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
                                placeholder="Write a comment..."
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
                                post.comments.map((comment) => {
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
                                              handleDotsClick(
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
                                                <BiLike /> &nbsp;{commentLikes}
                                              </span>
                                              <span>
                                                <BiDislike /> &nbsp;
                                                {commentDislikes}
                                              </span>
                                              <span>
                                                <BiCommentDetail />
                                              </span>
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
                                                  <button className="creply-button">Reply</button>
                                                </>
                                              ) : (
                                                <button className="creply-button">Reply</button>
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
