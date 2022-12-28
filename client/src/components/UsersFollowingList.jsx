import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { API } from "../utils/api";

const UserList = () => {
  const { user } = useSelector((state) => state.auth);

  const { data, isLoading } = useQuery(
    "/user/get-users-following",
    async () => {
      const res = await API.get("/user/get-users-following");
      return res.data;
    },
    { enabled: Boolean(user), retry: false, refetchOnWindowFocus: false }
  );

  if (user) {
    return (
      <section className="self-start">
        <h3 className="bg-[#ffc300] py-1 px-2 rounded-t-lg">Users Following</h3>
        <div className="overflow-auto h-[300px] bg-white">
          {isLoading ? null : data.length > 0 ? (
            data.map((userFollow) => (
              <Link
                to={`/profile/${userFollow._id}`}
                key={userFollow._id}
                className="flex gap-x-4 items-center py-2 px-3 hover:bg-gray-300 hover:bg-opacity-50 text-gray-500 hover:text-black w-full"
              >
                <img className="h-[30px] w-[32px] object-cover rounded-full" src={userFollow.profilePicture} alt="" />
                <span>{userFollow.name}</span>
              </Link>
            ))
          ) : (
            <div className="flex">
              <div className="m-auto mt-32 font-light">There are no users following.</div>
            </div>
          )}
        </div>
      </section>
    );
  } else return null;
};

export default UserList;
