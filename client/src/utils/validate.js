import { toast } from "react-hot-toast";
import { isEmail, isEmpty, isLength } from "validator";

export const validateRegister = (name, email, password) => {
  if (isEmpty(name)) {
    toast.error("The name is required");
    return true;
  } else if (!isLength(name, { min: 3, max: 20 })) {
    toast.error("The name must be between 3 chars and 20 chars");
    return true;
  }

  if (!isEmail(email)) {
    toast.error("The email is invalid");
    return true;
  }

  if (isEmpty(password)) {
    toast.error("The password is required");
    return true;
  } else if (!isLength(password, { min: 3 })) {
    toast.error("The password must be at least 3 chars");
    return true;
  }

};

export const validateLogin = (email, password) => {
  if (!isEmail(email)) {
    toast.error("The email is invalid");
    return true;
  }

  if (isEmpty(password)) {
    toast.error("The password is required");
    return true;
  } else if (!isLength(password, { min: 3 })) {
    toast.error("The password must be at least 3 chars");
    return true;
  }
};

export const validateCreateBlog = (title,content,image) => {
  if (isEmpty(title)) {
    toast.error("The title is required");
    return true;
  }

  if (isEmpty(content)) {
    toast.error("The content is required");
    return true;
  }

  if (!image) {
    toast.error("The image is required");
    return true;
  }
}