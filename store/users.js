import { createSlice } from "@reduxjs/toolkit";
const usersSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    /* checkUser: (state, action) => {
      if (state) {
        state.loggedIn = action.payload;
        //console.log("LoggedIn:" + action.payload);
      }
    },
    setActiveUser: (state, action) => {
      state.push({ loggedIn: true });
      //console.log("LoggedIn:" + action.payload);
    }, */
    setUserInfo: (state, action) => {
      state.push({ userInfo: action.payload });
    },
  },
});

export const { checkUser, setActiveUser, setUserInfo } = usersSlice.actions;
export default usersSlice.reducer;
