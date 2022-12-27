import React from "react";
import { Link, useParams } from "react-router-dom";

import _ from "lodash";
import { API } from "../utils/api";
import { useState } from "react";
import LoadingFullPage from "../components/LoadingFullPage";
import { hostImage } from "../utils/image";
import { useSelector } from "react-redux";

import { TfiFaceSad } from "react-icons/tfi";
import { toast } from "react-hot-toast";
import useAuth from "../utils/useAuth";
import Navbar from "../components/Navbar";
import { useMutation, useQuery } from "react-query";
import PulseLoader from "react-spinners/PulseLoader";

const ProfilePage = () => {
  useAuth();

  const { user, loading } = useSelector((state) => state.auth);
  const { userId } = useParams();
  const [follow, setFollow] = useState(false);

  const userProfile = useQuery(
    "/user/get-user/:userId",
    async () => {
      const res = await API.get(`/user/get-user/${userId}`);
      return res.data;
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setFollow(data.followers.includes(user?._id));
      },
    }
  );

  const followMutate = useMutation(() => API.patch(`/user/follow/${userProfile?.data?._id}`), {
    retry: false,
    onError: () => toast.error("Cannot follow this person."),
    onSuccess: () => {
      setFollow(!follow);
      toast.success(follow ? "You unfollowed this person." : "You followed this person.");
    },
  });

  if (userProfile.isLoading || loading) return <LoadingFullPage />;
  if (userProfile.data) {
    const own = user?._id === userProfile.data?._id;

    return (
      <div className="flex lg:flex-row flex-col">
        <Navbar />
        <div className="max-w-3xl w-full py-8 mx-auto">
          <header className="flex gap-3 sm:items-center border-b border-gray-400 border-opacity-50 mb-4 pb-4 px-3">
            <img src={hostImage(userProfile.data.profilePicture)} className="sm:w-40 w-32 sm:h-40 h-32 object-cover rounded-full" alt="" />
            <div className="flex flex-col h-full sm:w-auto w-full">
              <h1 className="font-medium text-3xl">{userProfile.data.name}</h1>
              <div className="flex sm:flex-row flex-col sm:gap-3 justify-around">
                <div>
                  Followers <span className="text-lg text-blue-500">{userProfile.data.followers.length}</span>
                </div>
                <div>
                  Followings <span className="text-lg text-blue-500">{userProfile.data.followings.length}</span>
                </div>
                <div>
                  Blogs <span className="text-lg text-blue-500">{userProfile.data.blogs.length}</span>
                </div>
              </div>
              <button
                onClick={user ? followMutate.mutate : () => toast.error("Cannot follow this person, please login.")}
                disabled={own || followMutate.isLoading}
                className={`bg-[#003566] w-full text-white rounded-lg px-4 py-1.5 mt-5 ${own || (followMutate.isLoading && "opacity-80")}`}
              >
                {followMutate.isLoading ? <PulseLoader color="#fff" /> : follow ? "Following" : "Follow"}
              </button>
            </div>
          </header>
          <section className="p-3 md:p-0">
            {userProfile.data.blogs.length > 0 ? (
              userProfile.data.blogs.map((blog) => (
                <Link to={`/blog/${blog.slug}`} key={blog._id} className="md:flex block hover:bg-gray-300 hover:bg-opacity-70 p-3">
                  <img src={hostImage(blog.image)} alt="" className="w-full md:w-[330px]" />
                  <div className="p-3 pb-5 flex flex-col w-full">
                    <h2 className="text-2xl">{blog.title}</h2>
                    <p className="">{_.truncate(blog.content, { length: 75 })}</p>
                    <div className="mt-auto flex justify-between">
                      <div className="font-medium text-lg">{blog.likes.length} Likes</div>
                      <div className="font-light text-lg">{new Date(blog.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex py-5">
                <p className="m-auto">
                  There are no post <TfiFaceSad className="inline" />
                </p>
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }
};

export default ProfilePage;
