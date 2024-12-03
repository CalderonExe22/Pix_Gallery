import { Outlet } from "react-router-dom"
import Navbar from "../Navbar/Navbar"
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function Layout() {
    return (
        <main className="flex flex-col w-full h-auto">
            <header>
                <Navbar />
            </header>
            <section className="flex flex-col justify-center items-center h-full w-full mt-48">
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
                <Outlet />
            </section>
        </main>
    )
}
