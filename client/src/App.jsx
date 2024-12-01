import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout/Layout";

function App() {
  return (
    <>
      <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar 
          newestOnTop 
          closeOnClick 
          rtl={false} 
          pauseOnFocusLoss 
          draggable 
          pauseOnHover 
          theme="light" 
      /> 
      <Layout />
    </>
  )
}

export default App
