import { Outlet } from "react-router-dom"
import Navbar from "../Navbar/Navbar"
export default function Layout() {
    return (
        <main className="flex flex-col w-full h-full">
            <header>
                <Navbar />
            </header>
            <section className="flex flex-col justify-center items-center h-full w-full pt-28">
                <Outlet />
            </section>
        </main>
    )
}
