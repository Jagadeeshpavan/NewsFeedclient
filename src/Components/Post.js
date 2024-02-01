
<div >
          {post.image.endsWith('.jpg') || post.image.endsWith('.jpeg') ? (
  <img src={`${BASE_URL}${post.image}`} alt="img" />
) : (
  <video controls>
    <source src={`${BASE_URL}${post.image}`}  />
    Your browser does not support the video tag.
  </video>
) 
  
}

</div>