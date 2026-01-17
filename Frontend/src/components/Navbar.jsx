import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, signout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

    const handleNavigation = (type) => {
    // Sections to scroll to on the home page
    const scrollSections = ["shop", "about", "contact"];

    if (scrollSections.includes(type)) {
      if (location.pathname === "/") {
        // If on home page, scroll to section
        const element = document.getElementById(type);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      } else {
        // If on another page, navigate to home and pass section to scroll to
        navigate("/", { state: { scrollTo: type } });
      }
    } else {
      // Handle regular page navigation
      switch (type) {
        case "home":
          if (location.pathname === "/") {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            navigate("/");
          }
          break;
        case "signup":
          navigate("/signup");
          break;
        case "signin":
          navigate("/signin");
          break;
        default:
          break;
      }
    }
    setMenuOpen(false); // Close menu on navigation
  };

  const handleSignOut = async () => {
    try {
      await signout();
      navigate("/signin");
    } catch (error) {
      console.error("Failed to sign out", error);
    }
  };

  useEffect(() => {
    const closeMenu = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  return (
    <nav className="nav-tab">
      <div className="nav-logo">
        <span className="logo-text">Illy</span>
        <span className="logo-text-accent">social</span>
      </div>
      <div className={`nav-buttons ${menuOpen ? "active" : ""}`}>
        <button className="nav-btn" onClick={() => handleNavigation("home")}>Home</button>
        <button className="nav-btn" onClick={() => handleNavigation("shop")}>Store</button>
        <button className="nav-btn" onClick={() => handleNavigation("about")}>About</button>
        <button className="nav-btn contact-btn" onClick={() => handleNavigation("contact")}>Contact</button>

        {currentUser ? (
          <div className="profile-menu-container" ref={profileRef}>
            <div className="profile-icon" onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
              {currentUser.email[0].toUpperCase()}
            </div>
            {profileMenuOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-email">{currentUser.email}</div>
                <button className="dropdown-signout" onClick={handleSignOut}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="nav-btn" onClick={() => handleNavigation("signup")}>Sign Up</button>
            <button className="nav-btn" onClick={() => handleNavigation("signin")}>Sign In</button>
          </>
        )}
      </div>
      <div className={`menu-toggle ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
        <div className="hamburger"></div>
      </div>
    </nav>
  );
};

export default Navbar;