import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  role: null, // Rol del usuario
  isLoading: true, // Estado de carga
  isAuthenticated: false, // Estado de autenticación
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.role = action.payload.role;
      state.isAuthenticated = action.payload.isAuthenticated;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    clearUserData: (state) => {
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUserData, setLoading, clearUserData } = userSlice.actions;
export default userSlice.reducer;