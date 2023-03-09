// import React from 'react'

// function EditUserPage() {
//   return (
//     <div>
//         <p>Helllo from Editpage</p>
//     </div>
//   )
// }

// export default EditUserPage

import React, { useEffect, useState } from 'react';

function EditUserPage() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ user_id: '', post_title: '', post_text: ''});

  useEffect(() => {
    // Fetch the list of posts when the component mounts
    fetch('https://dorm-api.vercel.app/api/post')
      .then((response) => response.json())
      .then((data) => setPosts(data));
  }, [posts]);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Create a new post object with the provided title and content
    const post = {
      user_id: newPost.user_id,
      post_title: newPost.post_title,
      post_text: newPost.post_text,
    };
    // Send a POST request to the create post endpoint
    fetch('https://dorm-api.vercel.app/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    })
      .then((response) => response.json())
      .then((data) => {
        // Add the new post to the posts state
        setPosts([...posts, data]);
        // Clear the form fields
        setNewPost({ user_id: '', post_title: '', post_text: ''});
      });
  };

  return (
    <div>
      <h1>Blog Page</h1>
     
      <h2>Posts:</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.post_title}</h3>
            <p>{post.post_text}</p>
          </li>
        ))}
      </ul>
       <form onSubmit={handleSubmit}>
        <label htmlFor="title-input">
          User_id:
          <input
            id="title-input"
            type="text"
            value={newPost.user_id}
            onChange={(event) =>
              setNewPost({ ...newPost, user_id: event.target.value })
            }
          />
        </label>
        <br />
        <label htmlFor="content-input">
          post_title:
          <textarea
            id="content-input"
            value={newPost.post_title}
            onChange={(event) =>
              setNewPost({ ...newPost, post_title: event.target.value })
            }
          />
        </label>
        <br />
        <label htmlFor="content-input">
          post_text:
          <textarea
            id="content-input"
            value={newPost.post_text}
            onChange={(event) =>
              setNewPost({ ...newPost, post_text: event.target.value })
            }
          />
        </label>
        <br />
        <button type="submit">Add Post</button>
      </form>
    </div>
    
  );
}

export default EditUserPage;
