import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useMutation } from "react-query";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import PulseLoader from "react-spinners/PulseLoader";
import { API } from "../utils/api";
import useAuth from "../utils/useAuth";
import { validateLogin } from "../utils/validate";

const LoginPage = () => {
  useAuth();

  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const onInput = ({ target: { name, value } }) => setFormValues({ ...formValues, [name]: value });

  const submit = useMutation((data) => API.post("/auth/login", data), {
    retry: false,
    onError: (error) => toast.error(error?.response?.data?.message || error.message),
    onSuccess: () => navigate("/"),
  });

  const onSubmit = (e) => {
    e.preventDefault();

    const { email, password } = formValues;
    if (validateLogin(email, password)) return;

    submit.mutate(formValues);
  };

  if (loading)
    return (
      <div className="flex h-screen">
        <PulseLoader className="m-auto" color={"#003566"} size={60} />;
      </div>
    );

  return (
    <div className="mx-auto p-3 w-full max-w-3xl">
      <form action="/create-blog" onSubmit={onSubmit} className="p-3 self-start mt-8 w-full">
        <h1 className="text-3xl text-center">Log In</h1>
        <div className="flex flex-col my-4">
          <label className="block mb-2 font-medium text-gray-900" htmlFor="">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="email"
            className="px-2 py-2 outline-none border border-gray-500 border-opacity-30 rounded-lg"
            placeholder="Enter your Email"
            onInput={onInput}
          />
        </div>

        <div className="flex flex-col my-4">
          <label className="block mb-2 font-medium text-gray-900" htmlFor="">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            name="password"
            className="px-2 py-2 outline-none border border-gray-500 border-opacity-30 rounded-lg"
            placeholder="Enter your password"
            onInput={onInput}
          />
        </div>

        <button
          disabled={submit.isLoading}
          className={`${submit.isLoading && "opacity-80 cursor-default"} bg-[#003566] text-white w-[70px] rounded-md p-2 mt-3 mr-3`}
        >
          {submit.isLoading ? <PulseLoader color="#fff" size={10} /> : "Login"}
        </button>
        <Link to="/register" className="underline">
          Register
        </Link>
      </form>
    </div>
  );
};

export default LoginPage;
