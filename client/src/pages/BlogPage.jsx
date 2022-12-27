import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { MdThumbUpAlt, MdOutlineThumbUpOffAlt } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API } from "../utils/api";
import { hostImage } from "../utils/image";
import useAuth from "../utils/useAuth";
import Navbar from "../components/Navbar";
import LoadingFullPage from "../components/LoadingFullPage";
import { useMutation, useQuery } from "react-query";

const BlogPage = () => {
  useAuth();
  const { slug } = useParams();
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth);
  const [like, setLike] = useState({
    amount: 0,
    click: false,
  });

  const onLike = useMutation(() => API.patch(`/blog/like/${slug.slice(-24)}`), {
    retry: false,
    onError: () => toast.error("Cannot like this post"),
    onSuccess: () => {
      toast.success(like.click ? "You unliked this post" : "You liked this post");
      setLike({ ...like, amount: like.click ? like.amount - 1 : like.amount + 1, click: !like.click });
    },
  });

  const onDelete = useMutation(() => API.delete(`/blog/delete/${slug.slice(-24)}`), {
    retry: false,
    onError: () => toast.error("Cannot delte this post"),
    onSuccess: () => {
      toast.success("Deleted this post");
      navigate("/")
    },
  });

  const blog = useQuery(
    "/blog/get-blog/:blogId",
    async () => {
      const res = await API.get(`/blog/get-blog/${slug.slice(-24)}`);
      return res.data;
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setLike({ ...like, amount: data.likes.length, click: data.likes.includes(user?._id) });
      },
    }
  );

  if (blog.isLoading) return <LoadingFullPage />;

  return (
    <div className="flex lg:flex-row flex-col">
      <Navbar />
      <article className="mx-auto mt-14 w-full max-w-3xl p-3">
        <header className="border-b border-gray-400 border-opacity-50 mb-4">
          <h1 className="text-4xl font-semibold">{blog.data.title}</h1>

          <div className="flex items-center justify-between">
            <span className="text-gray-500">{new Date(blog.data.createdAt).toLocaleDateString()}</span>
            <span className="flex items-center gap-3">
              <button
                disabled={onLike.isLoading}
                onClick={
                  user
                    ? onLike.mutate
                    : () => {
                        toast.error("Cannot like this post, please login.");
                      }
                }
              >
                {like.click ? (
                  <MdThumbUpAlt className="text-orange-500 hover:text-orange-500 text-2xl" />
                ) : (
                  <MdOutlineThumbUpOffAlt className="text-orange-500 hover:text-orange-500 text-2xl" />
                )}
              </button>
              <span>{like.amount} Likes</span>
            </span>
          </div>
          <div className="flex justify-between items-center">
            <Link to={`/profile/${blog.data.user._id}`} className="flex items-center hover:underline cursor-pointer my-5 gap-3">
              <img src={hostImage(blog.data.user.profilePicture)} className="w-9 h-9 object-cover rounded-full" alt="" />
              <h2>{blog.data.user.name}</h2>
            </Link>
            {user?._id == blog.data.userId && (
              <>
                <Link to={`/edit-blog/${blog.data.slug}`} className="space-x-1 ml-auto mr-5 hover:underline">
                  <i className="fa-solid fa-pen-to-square"></i>
                  <span>Edit</span>
                </Link>
                <button onClick={onDelete.mutate} disabled={onDelete.isLoading} className="space-x-1 hover:text-red-500 hover:underline">
                  <i className="fa-solid fa-trash"></i>
                  <span>{onDelete.isLoading ? "Deleting..." : "Delete"}</span>
                </button>
              </>
            )}
          </div>
        </header>
        <section>
          <img src={hostImage(blog.data.image)} className="my-5 h-full max-h-[600px] mx-auto object-cover" alt={blog.data.title} />
          {blog.data.content}
        </section>
      </article>
    </div>
  );
};

export default BlogPage;
