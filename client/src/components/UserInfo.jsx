import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";

import { FaEllipsisH } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { API } from "../utils/api";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { useMutation } from "react-query";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const initialProfilePictureSetting = {
  file: null,
  preview: "",
  changed: false,
};

const UserInfo = ({ user: { name, profilePicture, followings, followers } }) => {
  const { user } = useSelector((state) => state.auth);
  const [profilePictureSetting, setProfilePictureSetting] = useState(initialProfilePictureSetting);

  const update = useMutation(
    async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.REACT_APP_PRESET_NAME);

      const profilePicture = await axios.post(process.env.REACT_APP_HOST_IMAGE_URL, formData);

      return API.patch("/user/update-profile", { profilePicture: profilePicture.data.url });
    },
    {
      retry: false,
      onError: () => toast.error("Cannot update profile."),
      onSuccess: ({ data }) => {
        toast.success("Updated profile.");
        setProfilePictureSetting({ ...initialProfilePictureSetting, preview: data.url });
      },
    }
  );

  const onUpdateProfile = async () => {
    const { file } = profilePictureSetting;
    if (!file) return;

    update.mutate(file);
  };

  return (
    <header className="text-white flex flex-col mb-3">
      <Menu as="div" className="relative lg:ml-auto inline-block text-left">
        <div>
          <Menu.Button>
            <FaEllipsisH className="text-lg cursor-pointer" />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <>
                    <label
                      htmlFor="profilePicture"
                      className={classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-sm")}
                    >
                      Change profile picture
                    </label>
                    <input
                      type="file"
                      id="profilePicture"
                      className="hidden"
                      onInput={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        setProfilePictureSetting({ file, preview: URL.createObjectURL(file), changed: true });
                      }}
                    />
                  </>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      <img src={profilePictureSetting.preview || profilePicture} className="w-32 h-32 mx-auto object-cover rounded-full" alt="" />
      <Link to={`/profile/${user?._id}`} className="text-center mt-4 text-lg cursor-pointer hover:underline">
        {name}
      </Link>
      <div className="flex justify-around my-3">
        <div className="text-center">
          <h6 className="font-medium">Followings</h6>
          <span className="text-lg font-medium text-[#ffc300]">{followings.length}</span>
        </div>
        <div className="text-center">
          <h6 className="font-medium">Followers</h6>
          <span className="text-lg font-medium text-[#ffc300]">{followers.length}</span>
        </div>
      </div>
      {profilePictureSetting.changed && (
        <div className="flex gap-2">
          <button
            className={`bg-white text-black rounded-sm w-full py-1 ${update.isLoading && "opacity-80"}`}
            disabled={update.isLoading}
            onClick={onUpdateProfile}
          >
            {update.isLoading ? "Updating..." : "Update Profile"}
          </button>
          <button className="bg-red-500 text-white rounded-sm px-3 py-1" onClick={() => setProfilePictureSetting(initialProfilePictureSetting)}>
            Cancel
          </button>
        </div>
      )}
    </header>
  );
};

export default UserInfo;
