import { useDispatch } from "react-redux"
import { useEffect } from "react"
import { IsAuthenticated } from "./features/auth/authSlicer";
import Layout from "./components/Layout/Layout";

function App() {

  const dispatch = useDispatch()
  
  useEffect(()=>{
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    if(accessToken && refreshToken){
        dispatch(IsAuthenticated(true))
    }
  },[dispatch])

  return (
    <Layout />
  )
}

export default App
