import React, { useState, useEffect } from 'react';

export default function PostReview() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    //بيانات من firebase
    setPosts([
      { id: 1, content: 'أحتاج طعام لطفلين', status: 'pending' },
      { id: 2, content: 'مساعدة في الإيجار', status: 'pending' },
    ]);
  }, []);

  const handleApprove = (id) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, status: 'approved' } : post))
    );
  };

  const handleReject = (id) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, status: 'rejected' } : post))
    );
  };

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <p>{post.content}</p>
          <p>الحالة: {post.status}</p>
          <button onClick={() => handleApprove(post.id)}>قبول</button>
          <button onClick={() => handleReject(post.id)}>رفض</button>
        </div>
      ))}
    </div>
  );
}
