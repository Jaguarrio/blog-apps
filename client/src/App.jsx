import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "react-hot-toast";

import Main from "./pages/MainPage";
import BlogPage from "./pages/BlogPage";
import CreateBlogPage from "./pages/CreateBlogPage";
import UsersPage from "./pages/UsersPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";

import { useSelector } from "react-redux";
import EditBlogPage from "./pages/EditBlogPage";

const App = () => {
  const { user } = useSelector((state) => state.auth);

  const authResult = Boolean(user?._id && user?.email);

  return (
    <BrowserRouter>
      <Toaster position="bottom-center" />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/blog/:slug" element={<BlogPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />
        <Route path="/login" element={authResult ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/register" element={authResult ? <Navigate to="/" /> : <RegisterPage />} />

        <Route path="/edit-blog/:blogId" element={<EditBlogPage/>}/>
        <Route path="/create-blog" element={<CreateBlogPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
