import { configureStore } from "@reduxjs/toolkit";
import authSlicer from '../features/auth/authSlicer'

export const store = configureStore({
    reducer : {
        auth: authSlicer, 
    }
})