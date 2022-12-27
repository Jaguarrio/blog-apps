import React, { useState } from "react";

import { HiUsers } from "react-icons/hi";
import { AiOutlineSearch } from "react-icons/ai";
import { BsChevronRight, BsSearch } from "react-icons/bs";

import UserList from "../components/UsersFollowingList";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useSelector } from "react-redux";
import { API } from "../utils/api";
import { useQuery } from "react-query";
import LoadingFullPage from "../components/LoadingFullPage";
import { hostImage } from "../utils/image";

const UsersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValues, setSearchValues] = useState("");
  const { user } = useSelector((state) => state.auth);

  const { data: users, isLoading } = useQuery(
    "/user/get-users",
    () => {
      const search = searchParams.get("search");
      return search ? API.get(`/user/get-users?search=${search}`) : API.get("/user/get-users");
    },
    { retry: false, refetchOnWindowFocus: false }
  );

  const onSearch = (e) => {
    e.preventDefault()
    window.location.assign(`/users?search=${searchValues}`)
  };

  if (isLoading) return <LoadingFullPage />;

  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto my-12 p-3">
        <header className="flex lg:flex-row flex-col gap-y-3 justify-between items-center border-b border-gray-400 border-opacity-50 pb-4 mb-4">
          <div>
            <h1 className="text-3xl flex items-center gap-3">
              <HiUsers /> <span>Users & Authors</span>
            </h1>
            <p>Find someone who you are interested in</p>
          </div>
          <form onSubmit={onSearch} className="max-w-[350px] w-full border rounded-lg bg-white flex items-center  border-gray-300 px-2 gap-1">
            <AiOutlineSearch className="text-lg text-gray-300" />
            <input
              type="search"
              onChange={({ target }) => setSearchValues(target.value)}
              className="w-full outline-none py-1.5"
              placeholder="Search someone..."
            />
          </form>
        </header>
        <section className={user && "lg:grid grid-cols-[auto_325px]"}>
          <div className="px-3 space-y-3 flex flex-col">
            {users?.data?.length > 0 ? (
              users.data.map((userItem) => {
                if (user?._id === userItem._id) return;

                return (
                  <Link to={`/profile/${userItem._id}`} key={userItem._id} className="w-full bg-white flex items-center gap-3 rounded-lg">
                    <img src={hostImage(userItem.profilePicture)} className="w-20 h-20 p-3 object-cover rounded-full bg-white" alt="" />
                    <div className="py-3">
                      <h2 className="font-medium mb-1">{userItem.name}</h2>
                      <p className="text-sm text-gray-500">
                        Followers <span className="text-amber-500">{userItem.followers}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Blogs <span className="text-amber-500">{userItem.blogs}</span>
                      </p>
                    </div>
                    <BsChevronRight className="ml-auto mr-3 text-2xl text-gray-500" />
                  </Link>
                );
              })
            ) : (
              <div className="m-auto flex items-center gap-4">
                <BsSearch className="text-5xl font-light" />
                <div className=" font-light">
                  <span className="text-3xl">Search Someone...</span>
                  <p className="text-sm">if you searched and no one here , please try again</p>
                </div>
              </div>
            )}
          </div>
          <div className="hidden lg:block">
            <UserList />
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default UsersPage;
