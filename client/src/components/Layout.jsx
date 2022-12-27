import React from "react";
import { useSelector } from "react-redux";
import PulseLoader from "react-spinners/PulseLoader";
import useAuth from "../utils/useAuth";
import LoadingFullPage from "./LoadingFullPage";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  useAuth();
  const { loading } = useSelector((state) => state.auth);
  
  if (loading) return <LoadingFullPage />;
  
  return (
    <div className="flex lg:flex-row flex-col">
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
