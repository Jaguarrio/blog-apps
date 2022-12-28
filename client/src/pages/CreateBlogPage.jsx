import axios from "axios";
import React from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import Layout from "../components/Layout";
import { API } from "../utils/api";
import { validateCreateBlog } from "../utils/validate";

const CreateBlogPage = () => {
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);
  const [image, setImage] = useState({ file: null, preview: "" });
  const [formValues, setFormValues] = useState({
    title: "",
    content: "",
  });

  const onInput = ({ target: { name, value } }) => setFormValues({ ...formValues, [name]: value });

  const submit = useMutation(
    async () => {
      const { title, content } = formValues;
      const formImage = new FormData();
      formImage.append("file", image.file);
      formImage.append("upload_preset", process.env.REACT_APP_PRESET_NAME);

      const imageUrl = await axios.post(process.env.REACT_APP_HOST_IMAGE_URL, formImage);
      return API.post("/blog/create", {
        title,
        content,
        image: imageUrl.data.url,
      });
    },
    {
      retry: false,
      onError: () => toast.error("Cannot create a blog."),
      onSuccess: () => {
        toast.success("Created a blog.");
        navigate("/");
      },
    }
  );

  const onSubmit = async (e) => {
    e.preventDefault();
    const { title, content } = formValues;
    if (validateCreateBlog(title, content, image.file)) return

    submit.mutate();
  };

  if (!user && loading === false) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <div className="mx-auto p-3 w-full max-w-3xl">
        <form onSubmit={onSubmit} className="p-3 self-start mt-8 bg-white border-2 border-gray-400 border-opacity-40 shadow-lg rounded-lg w-full">
          <h1 className="text-2xl text-center">Create Your Blog</h1>

          <div className="flex flex-col my-4">
            <label className="block mb-2 font-medium text-gray-900" htmlFor="">
              Title <span className="text-red-500">*</span>
            </label>
            <input type="text" onInput={onInput} name="title" className="px-2 py-1 outline-none border rounded-lg" placeholder="Enter your title" />
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
                if (!file) return setImage({ file: null, preview: "" });
                setImage({ file, preview: URL.createObjectURL(file) });
              }}
            />
            <p className="mt-1 text-sm text-gray-500">SVG, PNG, JPG</p>
          </div>

          {image.file && <img src={image.preview} alt="" />}

          <button disabled={submit.isLoading} className={`bg-[#003566] text-white w-full rounded-lg p-1.5 mt-3 ${submit.isLoading && "opacity-80"}`}>
            {submit.isLoading ? <PulseLoader color="#fff" /> : "Create"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CreateBlogPage;
