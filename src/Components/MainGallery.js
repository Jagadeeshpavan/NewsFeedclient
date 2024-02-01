import { React, useState, useEffect } from 'react'
import Gallery from './Gallery';
import { Link } from "react-router-dom"
import axios from 'axios';
import { format } from 'date-fns';
import { BASE_URL } from '../Helper.js/Helper';


const MainGallery = () => {
  

  const calculateTimeDifference = (createdAt) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const timeDifference = now - createdDate;
    const minutesDifference = Math.floor(timeDifference / (1000 * 60));

    if (minutesDifference < 60) {
        return `${minutesDifference} ${minutesDifference === 1 ? 'minute' : 'minutes'} ago`;
    } else {
        const hoursDifference = Math.floor(minutesDifference / 60);

        if (hoursDifference < 24) {
            return `${hoursDifference} ${hoursDifference === 1 ? 'hour' : 'hours'} ago`;
        } else {
            const daysDifference = Math.floor(hoursDifference / 24);

            if (daysDifference >= 7) {
                const formattedDate = createdDate.toLocaleDateString(undefined, {
                    month: 'short',  // 3-letter month abbreviation
                    day: 'numeric',
                    year: '2-digit',  // 2-digit year
                });

                return ` ${formattedDate}`;
            } else {
                // Exclude the days information for posts less than 7 days old
                const weeksDifference = Math.floor(daysDifference / 7);
                return `${weeksDifference} ${weeksDifference === 1 ? 'week' : 'weeks'} ago`;
            }
        }
    }
};


const [posts, setPosts] = useState([]);
  const [token] = useState(localStorage.getItem("token"));

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/profile`, {
        headers: {
          "x-token": token,
        },
      })
      .then((res) => {
        console.log(res.data);
        setPosts(res.data.user.post);
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
              <Link to={`/post/${post._id}`}>
                <img src={`${BASE_URL}${post.image}`} alt={''} className="card1-image" />
                <div className="card1-content">
                  <h6 className="card1-title">{post.title}</h6>
                  

                </div>
              </Link>
            </div>
          ))}



        
  </div>

  </div>
  </div>
  )
}

export default MainGallery;