import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: true,
  },
  reducers: {
    loginUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    fetchingUser: (state) => {
      state.user = null;
      state.loading = true;
    },
    logoutUser: (state) => {
      state.user = null;
      state.loading = false;
    },
  },
});

export const { loginUser, fetchingUser,logoutUser } = authSlice.actions;
export default authSlice.reducer;
