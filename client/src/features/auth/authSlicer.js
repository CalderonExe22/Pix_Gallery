import { createSlice } from "@reduxjs/toolkit";
import { loginUser, logoutUser, registerUser, userData } from "./authThunk";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: !!(localStorage.getItem("accessToken") && localStorage.getItem("refreshToken")),
        user: null,
        error: null,
        errorLogin : null,
        errorRegister: null,
        loading: false,
        isLoading: false
    },
    reducers: {
        IsAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading =  true
                state.errorLogin = false
            })
            .addCase(loginUser.fulfilled,(state, action) => {
                state.user = action.payload.user
                state.isLoading = true
                state.loading = false
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false
                state.errorLogin = action.payload || 'Error desconocido al iniciar sesión'
            })
            .addCase(registerUser.pending, (state) => {
                state.loading = false
                state.errorRegister = null
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload.user
                state.loading = false
                state.isLoading = true
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false
                state.errorRegister = action.payload || 'Error en el registro'
            })
            .addCase(logoutUser.fulfilled, (state) =>{
                state.user = null
                state.isLoading = false
            })
            .addCase(userData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userData.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload; // Guardamos los datos del usuario en el estado
            })
            .addCase(userData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})
export const { IsAuthenticated } = authSlice.actions
export default authSlice.reducer