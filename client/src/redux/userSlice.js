import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    },
    loginFailure: (state) => {
      state.loading = false;
      state.error = true;
    },
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = false;
    },
    subscription: (state, action) => {
      if (!state.currentUser) return;
      const channelId = action.payload;
      const subs = state.currentUser.subscribedUsers || [];

      if (subs.includes(channelId)) {
        // unsubscribe
        state.currentUser.subscribedUsers = subs.filter(
          (id) => id !== channelId
        );
      } else {
        // subscribe
        state.currentUser.subscribedUsers = [...subs, channelId];
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, subscription } =
  userSlice.actions;

export default userSlice.reducer;
