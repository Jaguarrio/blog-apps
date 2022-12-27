import React from "react";
import PulseLoader from "react-spinners/PulseLoader";

const LoadingFullPage = () => {
  return (
    <div className="flex lg:flex-row flex-col">
      <div className="bg-[#001d3d] lg:block hidden sticky z-10 duration-300 top-0 left-0 lg:flex-shrink-0 h-screen w-full sm:w-[300px]"></div>
      <div className="flex w-full h-screen">
        <PulseLoader color="#001d3d" size={50} className="m-auto" />
      </div>
    </div>
  );
};

export default LoadingFullPage;
