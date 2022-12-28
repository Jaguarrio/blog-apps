import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useMutation, useQuery } from "react-query";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import Layout from "../components/Layout";
import { API } from "../utils/api";
import { validateCreateBlog } from "../utils/validate";

const EditBlogPage = () => {
  const navigate = useNavigate();
  const { blogId } = useParams();
  const { user, loading } = useSelector((state) => state.auth);
  const [image, setImage] = useState({ file: null, preview: "", old: "" });
  const [formValues, setFormValues] = useState({
    title: "",
    content: "",
  });

  const blog = useQuery(
    "/blog/get-blog/:blogId",
    async () => {
      const res = await API.get(`/blog/get-blog/${blogId.slice(-24)}`);
      return res.data;
    },
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setFormValues({ title: data.title, content: data.content });
        setImage({ ...image, old: data.image });
      },
    }
  );

  const onInput = ({ target: { name, value } }) => setFormValues({ ...formValues, [name]: value });

  const submit = useMutation(
    async () => {
      const { title, content } = formValues;
      let imageUrl;

      if (image.file) {
        const formImage = new FormData();
        formImage.append("file", image.file);
        formImage.append("upload_preset", process.env.REACT_APP_PRESET_NAME);
        imageUrl = await axios.post(process.env.REACT_APP_HOST_IMAGE_URL, formImage);
      }


      return API.patch(`/blog/edit/${blogId.slice(-24)}`, {
        title,
        content,
        image: imageUrl && imageUrl.data.url ,
      });
    },
    {
      retry: false,
      onError: () => toast.error("Cannot edit the blog."),
      onSuccess: () => {
        toast.success("Edited the blog.");
        navigate("/");
      },
    }
  );

  const onSubmit = (e) => {
    e.preventDefault();
    const { title, content } = formValues;
    if (validateCreateBlog(title, content, image.file || image.old)) return;

    submit.mutate();
  };

  if (!user && loading === false) {
    return <Navigate to="/login" />;
  }

  if (user?._id != blog?.data?.userId) return <Navigate to="/" />;

  return (
    <Layout>
      <div className="mx-auto p-3 w-full max-w-3xl">
        <form onSubmit={onSubmit} className="p-3 self-start mt-8 bg-white border-2 border-gray-400 border-opacity-40 shadow-lg rounded-lg w-full">
          <h1 className="text-2xl text-center">Edit Your Blog</h1>

          <div className="flex flex-col my-4">
            <label className="block mb-2 font-medium text-gray-900" htmlFor="">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formValues.title}
              onInput={onInput}
              name="title"
              className="px-2 py-1 outline-none border rounded-lg"
              placeholder="Enter your title"
            />
          </div>

          <div className="flex flex-col my-4">
            <label className="block mb-2 font-medium text-gray-900" htmlFor="">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              onInput={onInput}
              className="w-full px-2 py-1 outline-none border rounded-lg"
              placeholder="Enter your content"
              value={formValues.content}
            ></textarea>
          </div>

          <div className="flex flex-col my-4">
            <label className="block mb-2 font-medium text-gray-900" htmlFor="">
              Upload file <span className="text-red-500">*</span>
            </label>
            <input
              className=" block w-full border border-gray-400 border-opacity-70 rounded-md cursor-pointer opacity-70 hover:opacity-100"
              type="file"
              onInput={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                setImage({ file, preview: URL.createObjectURL(file) });
              }}
            />
            <p className="mt-1 text-sm text-gray-500">SVG, PNG, JPG</p>
          </div>

          {image.preview ? <img src={image.preview} className="w-full h-full" alt="" /> : image.old && <img src={image.old} />}

          <button disabled={submit.isLoading} className={`bg-[#003566] text-white w-full rounded-lg p-1.5 mt-3 ${submit.isLoading && "opacity-80"}`}>
            {submit.isLoading ? <PulseLoader color="#fff" /> : "Edit Blog"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default EditBlogPage;
