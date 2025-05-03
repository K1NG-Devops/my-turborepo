import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiCloseCircleFill } from "react-icons/ri";

const styles = {
  link: "hover:text-white hover:bg-pink-500 transition-colors duration-700 px-2 py-1 rounded-lg",
};

function Navbar() {
  const [IsMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!IsMenuOpen);
  }
  return (
    <nav className="navbar top-0 md:sticky left-0 w-full bg-primary text-base-content shadow-md md:bg-slate-50">
      <div className="w-full max-w-7xl mx-auto px-4 flex items-center justify-between py-3">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-pink-700 dark:text-pink-500 flex items-center gap-2">
          Young Eagles
        </Link>
        {/* Desktop Nav */}
        <ul className="flex gap-x-4 hidden md:flex">
          <li><Link to="/" className={styles.link}>Home</Link></li>
          <li><Link to="about" className={styles.link}>About</Link></li>
          <li><Link to="programs" className={styles.link}>Programs</Link></li>
          {/* <li><Link to="admission" className={styles.link}>Admission</Link></li> */}
          <li><Link to="contact" className={styles.link}>Contact</Link></li>
        </ul>
        <div className="cursor-pointer md:hidden">
          {IsMenuOpen ? (
            <RiCloseCircleFill className="h-6 w-6" onClick={toggleMenu} />
          ) : (
            <GiHamburgerMenu className="h-6 w-6" onClick={toggleMenu} />
          )}
        </div>
      </div>
      {IsMenuOpen && (
        <ul className="md:hidden flex flex-col gap-y-6 text-center">
          <li><Link to="/" className={`${styles.link} block`} onClick={() => setIsMenuOpen(false)}>Home</Link></li>
          <li><Link to="about" className={`${styles.link} block`} onClick={() => setIsMenuOpen(false)}>About</Link></li>
          <li><Link to="programs" className={`${styles.link} block`} onClick={() => setIsMenuOpen(false)}>Programs</Link></li>
          <li><Link to="admission" className={`${styles.link} block`} onClick={() => setIsMenuOpen(false)}>Admission</Link></li>
          <li><Link to="contact" className={`${styles.link} block`} onClick={() => setIsMenuOpen(false)}>Contact</Link></li>
        </ul>
      )}
    </nav>
  )
}

export default Navbar