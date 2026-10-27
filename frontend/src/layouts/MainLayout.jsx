import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"

import Navbar from "../components/Navbar/Navbar.jsx"
import Footer from "../components/Footer/Footer.jsx"

function MainLayout () {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])

    return (
        <>
            <Navbar />
            <main>
                {/* {Children} */}
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default MainLayout