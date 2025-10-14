import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogById, getCommentsForBlog, createComment, getProfile } from '../api/apiService';
import { toast } from 'react-toastify';

const BlogPage = () => {
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null); // To check if user is logged in
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user profile to see if they can comment
        const userRes = await getProfile();
        setUser(userRes.data);
      } catch (error) {
        setUser(null);
      }

      try {
        const blogRes = await getBlogById(id);
        setBlog(blogRes.data);

        const commentsRes = await getCommentsForBlog(id);
        setComments(commentsRes.data);

      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);


    const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return toast.error("Comment cannot be empty.");

    setIsSubmitting(true);
    try {
      const { data: createdComment } = await createComment(id, { text: newComment });
      
      const commentWithAuthor = { ...createdComment, author: { name: user.name } };

      // Add the new comment to the top of the list for immediate feedback
      setComments([commentWithAuthor, ...comments]);
      setNewComment(''); // Clear the textarea
      toast.success("Comment posted!");
    } catch (error) {
      toast.error("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!blog) return <div className="text-center mt-10">Blog not found.</div>;

  return (
    <div className="mx-auto bg-white p-8 rounded-lg">
      <Link to="/" className="text-gray-600 hover:underline mb-6 block">
        &larr; Back to all posts
      </Link>
      <h1 className="text-6xl font-extrabold text-gray-900 mb-4">
        {blog.title}
      </h1>
      <div className="text-gray-500 mb-8">
        <div className="flex h-5 items-center space-x-4">
          <div>
            <span className="">{blog.author.name}</span>{" "}
          </div>{" "}
          <div>{new Date(blog.createdAt).toLocaleDateString()}</div>
        </div>
      </div>

      <div
        className="prose lg:prose-xl max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
      {console.log(blog.content)}
      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-2xl font-bold mb-6">Responses ({comments.length})</h2>
        
        {/* New Comment Form */}
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-8">
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-1 focus:ring-black focus:border-indigo-500"
              rows="3"
              placeholder="Write a response..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-3 px-6 py-2 bg-gray-800 text-white font-semibold rounded-md hover:bg-gray-900 disabled:bg-indigo-400"
            >
              {isSubmitting ? 'Posting...' : 'Post Response'}
            </button>
          </form>
        ) : (
          <p className="mb-8 text-gray-600">
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Log in</Link> or <Link to="/register" className="text-indigo-600 font-semibold hover:underline">sign up</Link> to leave a comment.
          </p>
        )}

        {/* Display Comments */}
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map(comment => (
              <div key={comment._id} className="flex space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                    {comment.author?.name.charAt(0).toUpperCase() ?? '?'}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{comment.author?.name ?? 'Anonymous'}</p>
                  <p className="text-gray-600">{comment.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No responses yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
