import React, { useState, useEffect } from "react";
import { getAllBlogs } from "../api/apiService";
import BlogItem from "../components/BlogItem";
import { getProfile } from "../api/apiService";
import bgimage from "../assets/landingBg.webp";
import { Link } from "react-router-dom";
import BlurText from "../components/BlurText";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This can be combined into a single useEffect hook
    const fetchData = async () => {
      try {
        const profileRes = await getProfile();
        setUser(profileRes.data);
      } catch (error) {
        setUser(null);
      }

      try {
        const blogsRes = await getAllBlogs();
        setBlogs(blogsRes.data);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div>
      {user ? (
        <div className="max-w-4xl mx-auto px-5">
          <h1 className="text-xl md:text-3xl text-gray-800 border-b border-gray-200 py-5 font-serif">
            For You
          </h1>
          <div className="mt-8 ">
            {blogs.length > 0 ? (
              <div className="space-y-8">
                {blogs.map((blog) => (
                  <BlogItem key={blog._id} blog={blog} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No blog posts found.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 text-center lg:text-left">
            <div className="max-w-lg">
              <BlurText
                text="Your Voice, Your Story."
                delay={150}
                animateBy="words"
                direction="top"
                className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif mb-4"
              />
              <p className="text-lg md:text-xl text-gray-600 mb-8 font-mono">
                A platform to share, discover, and connect with a world of
                ideas.
              </p>
              <Link
                to="/register"
                className="inline-block bg-gray-900 text-white font-bold text-lg px-8 py-3 rounded-full shadow-lg hover:bg-gray-800 transition-transform transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-1/2 h-64 lg:h-screen">
            <img
              className="h-full w-full object-cover"
              src={bgimage}
              alt="Scenic background for blog platform"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;