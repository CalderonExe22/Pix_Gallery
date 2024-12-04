import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosApi from "../../services/axiosApi";

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (data,{rejectWithValue}) => {
        try {
            const response = await axiosApi.post('users/login/',{
                email: data.email,
                password: data.password
            }) 
            console.log(response)
            if(response.status === 200){
                console.log(response.data)
                localStorage.setItem('accessToken', response.data.tokens.access)
                localStorage.setItem('refreshToken', response.data.tokens.refresh)
                localStorage.setItem('userId', response.data.id)
                return response.data
            }
        } catch (error) {
            const responseError = error.response?.data
            const errorMessage = responseError?.non_field_errors?.join(', ') ||
            responseError?.detail
            return rejectWithValue(errorMessage);
        }
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, {rejectWithValue}) => {
        try{
            const response = await axiosApi.post('users/logout/', {
                refresh: localStorage.getItem('refreshToken') // Si es necesario enviar el refreshToken
            })
            if(response.status === 205){
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
                return true
            }
        }catch(error){
            return rejectWithValue(error.response?.data || 'Error al cerrar sesión');
        }
    }
)

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (data,{rejectWithValue}) => {
        try {
            const response = await axiosApi.post('users/register/',{
                username: data.username,
                email: data.email,
                password1: data.password1,
                password2: data.password2
            })
            if(response.status === 201){
                localStorage.setItem('accessToken', response.data.tokens.access)
                localStorage.setItem('refreshToken', response.data.tokens.refresh)
                localStorage.setItem('userId', response.data.id)
                return response.data
            }
        } catch (error) {
            const responseError = error.response?.data
            const errorMessage =
                responseError?.detail ||
                Object.values(responseError || {}).join(" || ") || // Unir errores en un string
                "Error desconocido en el registro"
            return rejectWithValue(errorMessage)
        }
    }
) 

export const userData = createAsyncThunk(
    'auth/userData',
    async(_, {rejectWithValue}) => {
        try {
            const response = await axiosApi.get('users/user/')
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Error en recuperar datos del usuario')
        }
    }
)