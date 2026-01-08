import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../editor/GrammarBlot"; // Ensures the blot is registered
import {
  createBlog,
  getBlogById,
  updateBlog,
  uploadImage,
  grammarCheck,
} from "../api/apiService";
import { toast } from "react-toastify";

const CreateBlogPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [grammarMatches, setGrammarMatches] = useState([]);

  // Removed checkingGrammar state if not used for UI loading indicators to simplify
  const navigate = useNavigate();
  const { id } = useParams();
  const quillRef = useRef(null);

  // --- Custom Image Handler ---
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        toast.info("Uploading image...");
        try {
          const { data } = await uploadImage(formData);
          const imageUrl = data.url;

          const editor = quillRef.current.getEditor();
          const range = editor.getSelection(true);
          const position = range ? range.index : editor.getLength();

          editor.insertEmbed(position, "image", imageUrl);
          editor.setSelection(position + 1);
        } catch (error) {
          toast.error("Image upload failed.");
          console.error("Upload Error:", error);
        }
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: "#toolbar-container",
        handlers: {
          image: imageHandler,
        },
      },
      // clipboard: { matchVisual: false } // Optional: prevents issues when pasting
    }),
    []
  );

  // formats MUST include the exact blotName defined in GrammarBlot.js
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
    "grammarError", // <--- Matches GrammarBlot.blotName
  ];

  // Fetch Blog Data
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

  // Run Grammar Check (Debounced)
  useEffect(() => {
    if (!content || content.length < 10) {
      setGrammarMatches([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const editor = quillRef.current?.getEditor();
        if (!editor) return;

        // Check only text content to save API tokens / performance
        const plainText = editor.getText();

        const result = await grammarCheck(plainText);
        setGrammarMatches(result.matches || []);
      } catch (err) {
        console.error("Grammar check failed", err);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [content]);

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
  const applySuggestion = (match) => {
    const editor = quillRef.current.getEditor();
    editor.deleteText(match.offset, match.length);
    editor.insertText(match.offset, match.replacements[0].value);
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
            {grammarMatches.length > 0 && (
              <div className="mt-4 p-4 border rounded bg-gray-50">
                <h3 className="font-semibold mb-3">
                  ⚠ Grammar Issues ({grammarMatches.length})
                </h3>

                <ul className="space-y-3 text-sm">
                  {grammarMatches.map((match, idx) => (
                    <li key={idx} className="flex justify-between items-start">
                      <div>
                        <p className="text-gray-800">{match.message}</p>

                        {match.replacements?.length > 0 && (
                          <p className="text-green-700">
                            Suggestion: <b>{match.replacements[0].value}</b>
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => applySuggestion(match)}
                        className="ml-3 px-2 py-1 text-xs bg-green-600 text-white rounded"
                      >
                        Fix
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Toolbar Definition */}
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
            <button className="ql-header" value="1"></button>
            <button className="ql-header" value="2"></button>
            <button className="ql-blockquote"></button>
            <button className="ql-code-block"></button>
          </span>
          <span className="ql-formats">
            <button className="ql-list" value="ordered"></button>
            <button className="ql-list" value="bullet"></button>
          </span>
          <span className="ql-formats">
            <button className="ql-link"></button>
            <button className="ql-image"></button>
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
