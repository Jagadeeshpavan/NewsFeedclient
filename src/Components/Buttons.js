<div className="comment-buttons">
  <button
    onClick={() => handleEditComment(comment._id, comment.text, post._id)}
  >
    Edit
  </button>
  <button onClick={() => handleDeleteComment(comment._id, post._id)}>
    Delete
  </button>
</div>;
