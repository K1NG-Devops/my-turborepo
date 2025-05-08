import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiCloseCircleFill } from "react-icons/ri";
import logo from "../assets/logo.jpg";
import useRedirect from "../hooks/useRedirect";

const styles = {
  link: "hover:text-white hover:bg-pink-500 transition-colors duration-700 px-2 py-1 rounded-lg",
};

function Navbar() {
  const [IsMenuOpen, setIsMenuOpen] = useState(false);
  const redirect = useRedirect();

  const toggleMenu = () => setIsMenuOpen(!IsMenuOpen);
  const handleRedirect = (path) => redirect(path, 2000);

  return (
    <nav className="navbar top-0 md:sticky left-0 w-full bg-blue-100 text-base-content shadow-md md:bg-slate-50">
      <div className="w-full max-w-7xl mx-auto px-4 flex items-center justify-between py-3">
        <Link to="/home" className="text-2xl font-bold text-pink-700 dark:text-pink-500 flex items-center gap-2">
          <img src={logo} alt="Young Eagles Logo" className="h-12 w-12 rounded-full" />
          Young Eagles
        </Link>
        {/* Desktop Nav */}
        <ul className="flex gap-x-4 hidden md:flex">
          <li><Link to="/home" className={styles.link}>Home</Link></li>
          {/* <li><Link to="/about" className={styles.link}>About</Link></li> */}
          <li><Link to="/programs" className={styles.link}>Programs</Link></li>
          {/* <li><Link to="/contact" className={styles.link}>Contact</Link></li> */}

          <li
            onClick={() => {
              toggleMenu();
              setTimeout(() => {
                window.location.href = "/projects";
              }, 2000);
            }}
            className={`${styles.link} cursor-pointer`}
          >
            Projects
          </li>

          <li
            onClick={() => redirect("/parent", 2000)}
            className={`${styles.link} cursor-pointer`}
          >
            Dashboard
          </li>
          <li><Link to="/popupload" className={`${styles.link} bg-pink-500`}>Upload POP</Link></li>
        </ul>
        <div className="cursor-pointer md:hidden" aria-label="Toggle Menu">
          {IsMenuOpen ? (
            <RiCloseCircleFill className="h-6 w-6" onClick={toggleMenu} />
          ) : (
            <GiHamburgerMenu className="h-6 w-6" onClick={toggleMenu} />
          )}
        </div>
      </div>
      {/* Mobile Nav */}
      {IsMenuOpen && (
        <ul className="md:hidden flex flex-col gap-y-6 text-center pb-4">
          <li><Link to="/home" className={`${styles.link} block`} onClick={toggleMenu}>Home</Link></li>
          <li><Link to="/programs" className={`${styles.link} block`} onClick={toggleMenu}>Programs</Link></li>
          <li
            onClick={() => {
              toggleMenu();
              setTimeout(() => {
                window.location.href = "/projects"; // or full Angular app URL
              }, 2000); // 2000ms = 2 seconds
            }}
            className={`${styles.link} block`}
          >
            Projects
          </li>          
          {/* <li><Link to="/admission" className={`${styles.link} block`} onClick={toggleMenu}>Admission</Link></li> */}
          {/* <li><Link to="/contact" className={`${styles.link} block`} onClick={toggleMenu}>Contact</Link></li> */}
          <li
            onClick={() => redirect("/parent", 2000)}
            className={`styles.link} cursor-pointer`}
          >
            Dashboard
          </li>
          <li><Link to="/popupload" className={`${styles.link} block bg-pink-500`} onClick={toggleMenu}>Upload POP</Link></li>
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
