import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Keep this for basic Quill styling
import {
  createBlog,
  getBlogById,
  updateBlog,
  uploadImage,
} from "../api/apiService";
import { toast } from "react-toastify";

const CreateBlogPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();
  const quillRef = useRef(null); // Create a ref to access the editor instance

  // --- Custom Image Handler ---
  const imageHandler = () => {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      
      toast.info('Uploading image...');
      try {
        const { data } = await uploadImage(formData); 
        const imageUrl = data.url;

        const editor = quillRef.current.getEditor();
        const range = editor.getSelection(true);
        const position = range ? range.index : editor.getLength();

        // Insert the image into the editor
        editor.insertEmbed(position, 'image', imageUrl);
        editor.setSelection(position + 1);

        // --- THE FIX ---
        // Manually update the React state with the new content
        //setContent(editor.root.innerHTML);

      } catch (error) {
        toast.error('Image upload failed. Please try again.');
        console.error("Upload Error:", error);
      }
    }
  };
};
  // Define the modules to link to our custom toolbar and enable syntax highlighting
  const modules = useMemo(
    () => ({
      toolbar: {
        container: "#toolbar-container",
        handlers: {
          image: imageHandler,
        },
      },
      syntax: true,
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "code-block",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "formula",
    "color",
    "background",
    "script",
    "align",
    "direction",
  ];

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const { data } = await getBlogById(id);
          setTitle(data.title);
          setContent(data.content);
        } catch (error) {
          toast.error("Could not fetch blog post.");
          navigate("/");
        }
      };
      fetchBlog();
    }
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      return toast.error("Title and content cannot be empty.");
    }

    const blogData = { title, content };
    try {
      if (id) {
        await updateBlog(id, blogData);
        toast.success("Blog updated successfully!");
      } else {
        await createBlog(blogData);
        toast.success("Blog created successfully!");
      }
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save blog post");
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6">
        {id ? "Edit Post" : "Create New Post"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          <div className="editor-container flex-auto">
            <div className="">
              <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            className="bg-white"
            placeholder="Start Writing!"
              />
            </div>
          </div>
        </div>
        <div id="toolbar-container">
          <span className="ql-formats">
            <select className="ql-font"></select>
            <select className="ql-size"></select>
          </span>
          <span className="ql-formats">
            <button className="ql-bold"></button>
            <button className="ql-italic"></button>
            <button className="ql-underline"></button>
            <button className="ql-strike"></button>
          </span>
          <span className="ql-formats">
            <select className="ql-color"></select>
            <select className="ql-background"></select>
          </span>
          <span className="ql-formats">
            <button className="ql-script" value="sub"></button>
            <button className="ql-script" value="super"></button>
          </span>
          <span className="ql-formats">
            <button className="ql-header" value="1"></button>
            <button className="ql-header" value="2"></button>
            <button className="ql-blockquote"></button>
            <button className="ql-code-block"></button>
          </span>
          <span className="ql-formats">
            <button className="ql-list" value="ordered"></button>
            <button className="ql-list" value="bullet"></button>
            <button className="ql-indent" value="-1"></button>
            <button className="ql-indent" value="+1"></button>
          </span>
          <span className="ql-formats">
            <button className="ql-direction" value="rtl"></button>
            <select className="ql-align"></select>
          </span>
          <span className="ql-formats">
            <button className="ql-link"></button>
            <button className="ql-image"></button>
            <button className="ql-video"></button>
            <button className="ql-formula"></button>
          </span>
          <span className="ql-formats">
            <button className="ql-clean"></button>
          </span>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-black"
        >
          {id ? "Update Post" : "Publish Post"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlogPage;
