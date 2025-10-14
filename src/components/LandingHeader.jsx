import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProfile, logout } from "../api/apiService";
import { toast } from "react-toastify";
import BloggitLogo from "../assets/logo.svg";
import WriteLogo from "../assets/write.svg";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getProfile();
        setUser(data);
      } catch (error) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      toast.success("Logged out successfully!");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed.");
    }
  };

  return (
    <header className="bg-white border-b-1 border-gray-100">
      <nav className="mx-auto flex justify-between items-center">
        <Link to="/" className="">
          <img className = "h-14 px-10"src={BloggitLogo} alt="" srcset="" />
        </Link>
        <div className="flex items-center space-x-4 px-14">
          {user ? (
            <>
              <span className="text-gray-500 font-light mx-2">
                Hello, {user.name}
              </span>
              <Link
                to="/create"
                className="text-gray-500 font-light flex gap-1 px-2 mx-0"
              >
                {" "}
                <img className="" src={WriteLogo} alt="" />
                Write
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-500 font-light px-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-500 font-light">
                Login
              </Link>
              <Link to="/register" className="text-gray-500 font-light px-3">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
