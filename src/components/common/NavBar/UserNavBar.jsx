import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { supabase } from "../../../supabaseClient";
import store from "../../../redux/store";
import { logout } from "../../../redux/auth/actions";
import {
  Search
} from "lucide-react";

export default function MerchantNavbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const dropdownRef = useRef(null);
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    store.dispatch(logout());
    await supabase.auth.signOut();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full bg-gradient-to-r from-[#1b1f2c] to-[#0f2936] border border-white/10 rounded-full p-2 px-4 shadow-inner mt-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        {/* Logo and Desktop Navigation */}
        <div className="flex gap-6">
          {/* Logo */}
          <h1
            onClick={() => navigate("/dashboard")}
            className="text-2xl h-6 font-grifter cursor-pointer text-cyan-300"
          >
            SMART
          </h1>

          {/* Desktop Nav Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-md font-aeonik text-white/80 hover:text-cyan-400 transition"
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/checkout")}
              className="text-md font-aeonik text-white/80 hover:text-cyan-400 transition"
            >
              Checkout
            </button>
          </div>
        </div>

        {/* Search - Desktop only */}
        <div className="ml-auto flex items-center justify-end">
          <div className="w-full max-w-md flex items-center bg-transparent border border-white/20 rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Search"
              className="flex-1 bg-transparent outline-none font-aeonik text-md text-white placeholder-white/60"
            />
            <Search size={16} className="text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}