import { NavLink, Outlet } from "react-router-dom";

export default function ManageAcount() {
    const id = localStorage.getItem('userId')
    return (
        <div className="flex w-full h-full">
            <aside className="w-1/4 h-full">
                <nav className="flex flex-col justify-start ps-16">
                    <NavLink className={'p-4 transition-colors duration-300 hover:bg-[#3a0ca3] hover:text-white'} to={'/manage-account/editar-perfil/'+id}>
                        Editar perfil
                    </NavLink>
                </nav>
            </aside>
            <section className="flex justify-start w-3/4 ps-16">
                <Outlet />
            </section>
        </div>
    )
}
