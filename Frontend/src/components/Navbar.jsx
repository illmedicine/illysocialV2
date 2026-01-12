import { useEffect } from 'react';

const Navbar = () => {
  useEffect(() => {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
      button.addEventListener('click', function() {
        const buttonText = this.textContent.toLowerCase();
        let targetSection;
        
        if (buttonText === 'home') {
          targetSection = document.getElementById('home');
        } else if (buttonText === 'store' || buttonText === 'shop') {
          targetSection = document.getElementById('shop');
        } else if (buttonText === 'about') {
          targetSection = document.getElementById('about');
        } else if (buttonText === 'contact') {
          targetSection = document.getElementById('contact');
        }
        
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }, []);

  return (
    <nav className="nav-tab">
      <div className="nav-logo">
        <span className="logo-text">Illy</span>
        <span className="logo-text-accent">social</span>
      </div>
      <div className="nav-buttons">
        <button className="nav-btn">Home</button>
        <button className="nav-btn">Store</button>
        <button className="nav-btn">About</button>
        <button className="nav-btn contact-btn">Contact</button>
      </div>
    </nav>
  );
};

export default Navbar;
