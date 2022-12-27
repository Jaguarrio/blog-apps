import { useQuery } from "react-query";
import { MdOutlineThumbUpOffAlt } from "react-icons/md";
import _ from "lodash";
import { Link } from "react-router-dom";
import { API } from "../utils/api";
import { hostImage } from "../utils/image";
import PulseLoader from "react-spinners/PulseLoader";

const BlogList = () => {
  const { isLoading, error, data } = useQuery(
    "/blog/get-blogs",
    async () => {
      const res = await API.get("/blog/get-blogs");
      return res.data;
    },
    { retry: false, refetchOnWindowFocus: false }
  );

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <PulseLoader className="m-auto" size={30} color="#001d3d" />
      </div>
    );
  }

  if (error) return console.log(error);

  return (
    <section className="flex justify-center flex-wrap gap-5">
      {data.map((blog) => (
        <Link to={`/blog/${blog.slug}`} key={blog._id} className="rounded-lg w-full max-w-[330px] overflow-hidden grid grid-rows-2 bg-white">
          <img src={hostImage(blog.image)} className="h-full max-h-[200px] w-full object-cover" alt="" />
          <div className="p-3 pb-5 flex flex-col relative">
            <h2 className="text-2xl">{blog.title}</h2>
            <p className="text-sm ">{_.truncate(blog.content, { length: 75 })}</p>
            <div className="text-orange-500 flex items-center gap-1 mt-2">
              <MdOutlineThumbUpOffAlt /> {blog.likes.length} Likes
            </div>
            <div className="mt-auto flex items-center justify-between">
              <div>{blog.user.name}</div>
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </Link>
      ))}
    </section>
  );
};

export default BlogList;
