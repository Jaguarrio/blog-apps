import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { fetchingUser, loginUser } from "../redux/slice/authSlice";
import { API } from "./api";

const useAuth = () => {
  const dispatch = useDispatch();

  useQuery(
    "/auth/get-token",
    async () => {
      dispatch(fetchingUser());
      const res = await API.post("/auth/get-token");
      return res.data;
    },
    {
      retry: false,
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      onError: () => dispatch(loginUser(null)),
      onSuccess: (data) => {
        dispatch(loginUser(data));
        console.log("Refresh Token");
      },
    }
  );
};

export default useAuth;
