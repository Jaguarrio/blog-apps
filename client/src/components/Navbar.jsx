import React from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { logoutUser } from "../redux/slice/authSlice";
import { API } from "../utils/api";
import UserInfo from "./UserInfo";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);
  const [toggle, setToggle] = useState(false);

  const logout = useMutation(() => API.delete("/auth/logout"), {
    retry: false,
    onError: () => toast.error("Cannot Logout!"),
    onSuccess: () => {
      navigate("/login");
      dispatch(logoutUser());
    },
  });

  return (
    <>
      <nav
        className={`${
          toggle ? "left-0" : "-left-full sm:-left-[300px]"
        } bg-[#001d3d] lg:sticky z-10 duration-300 fixed top-0 left-0 lg:flex-shrink-0 h-screen w-full sm:w-[300px] flex flex-col p-5`}
      >
        <i onClick={() => setToggle(false)} className="fa-solid fa-times cursor-pointer absolute right-3 top-1 text-white text-xl lg:hidden"></i>

        {loading ? (
          <div className="flex my-20">
            <PulseLoader color="#fff" className="m-auto" />
          </div>
        ) : user ? (
          <UserInfo user={user} />
        ) : (
          <div className="text-white text-center my-16">
            <h3 className="text-xl">You're not log in.</h3>
            <p className="font-light">login to continue the website.</p>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <Link to="/register" className="rounded-sm px-2 py-1 bg-white text-[#001d3d] hover:bg-gray-100">
                <button>Register</button>
              </Link>
              <Link to="/login" className="rounded-sm px-2 py-1 bg-white text-[#001d3d] hover:bg-gray-100">
                <button>Login</button>
              </Link>
            </div>
          </div>
        )}

        <hr className="border-[#b2b2b2] border-opacity-50" />

        <section className="flex flex-col my-2">
          <Link to="/" className="text-white text-start p-3 hover:bg-[#003566] rounded-md grid grid-cols-[40px_auto] items-center">
            <i className="fa-solid fa-house-chimney"></i> Home
          </Link>
          {user && (
            <Link to="/create-blog" className="text-white text-start p-3 hover:bg-[#003566] rounded-md grid grid-cols-[40px_auto_auto] items-center">
              <i className="fa-solid fa-pen-to-square"></i>{" "}
              <div>
                Create a blog <span className="text-[#ffc300]"></span>
              </div>
            </Link>
          )}
          <Link to="/users" className="text-white text-start p-3 hover:bg-[#003566] rounded-md grid grid-cols-[40px_auto] items-center">
            <i className="fa-solid fa-user"></i> Users
          </Link>
          {user && (
            <button
              onClick={logout.mutate}
              className="text-start p-3 hover:bg-[#003566] text-red-500 rounded-md grid grid-cols-[40px_auto] items-center"
            >
              <i className="fa-solid fa-right-from-bracket"></i> Log out
            </button>
          )}
        </section>
        <footer className="mt-auto text-gray-400 opacity-70 text-[12px] text-center">Copyright © 2022-2023 By Phanupong Ruksanit</footer>
      </nav>

      <div
        onClick={() => setToggle(false)}
        className={`${
          toggle ? "opacity-50 pointer-events-auto" : "opacity-0 pointer-events-none"
        } duration-300 bg-black fixed inset-0 cursor-pointer`}
      ></div>
      <nav className="bg-[#001d3d] sticky top-0 inset-x-0 lg:hidden w-full p-3 text-white flex items-center justify-between">
        <Link to={"/"}>
          <h1 className="text-lg">
            Blog <span className="text-[#ffd60a]">Apps</span>
          </h1>
        </Link>
        <i onClick={() => setToggle(true)} className="fa-solid fa-bars cursor-pointer"></i>
      </nav>
    </>
  );
};

export default Navbar;
