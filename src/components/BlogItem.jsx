import React from "react";
import { Link } from "react-router-dom";

const BlogItem = ({ blog }) => {
  const snippet =
    blog.content.replace(/<[^>]*>?/gm, "").substring(0, 150) + "...";

  return (
    <div className="border-b-1 border-gray-200 py-8">
      <Link to={`/blog/${blog._id}`} className="text-gray-900">
        <p className="text-sm text-gray-500 mb-2">
          {blog.author?.name ?? "Unknown Author"}
        </p>
        <h2 className="text-xl md:text-4xl font-bold mb-2">{blog.title}</h2>
        <p className="text-gray-700 text-sm md:text-lg">{snippet}</p>
        <p className="text-sm text-gray-500 mt-2" >{new Date(blog.createdAt).toLocaleDateString()}</p>
      </Link>
    </div>
  );
};

export default BlogItem;
