import React, { useState, useEffect } from 'react';
import logoImage from '../assets/imaan logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const goHome = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  const scrollToSection = (sectionId) => {
    setIsOpen(false);
    // Small delay to allow menu to close before scrolling
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80; // Account for fixed navbar
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <>
      <nav className={`bg-charcoal border-b border-bronze/20 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a 
              href="/" 
              onClick={goHome}
              className="flex items-center hover:opacity-80 transition-opacity cursor-pointer z-50"
            >
              <img 
                src={logoImage} 
                alt="Imaan Fihlani Logo" 
                className="h-8 w-8 sm:h-10 sm:w-10 mr-2 sm:mr-3"
              />
              <span className="text-gold text-lg sm:text-xl md:text-3xl font-luxury tracking-wider">
                IMAAN FIHLANI
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('about')} className="text-text-dark hover:text-gold transition-colors duration-300 text-sm tracking-wider uppercase font-sans">
                ABOUT
              </button>
              <button onClick={() => scrollToSection('services')} className="text-text-dark hover:text-gold transition-colors duration-300 text-sm tracking-wider uppercase font-sans">
                SERVICES
              </button>
              <button onClick={() => scrollToSection('portfolio')} className="text-text-dark hover:text-gold transition-colors duration-300 text-sm tracking-wider uppercase font-sans">
                PORTFOLIO
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-text-dark hover:text-gold transition-colors duration-300 text-sm tracking-wider uppercase font-sans">
                CONTACT
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className={`md:hidden text-gold z-50 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-charcoal/95 backdrop-blur-md z-40 transition-all duration-500 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        style={{ top: '60px' }}
      >
        <div className="h-full overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-6">
            <div className="w-full max-w-sm">
              {/* Menu Links */}
              <div className="space-y-6 text-center mb-8">
                <button 
                  onClick={() => scrollToSection('about')}
                  className="block w-full text-2xl font-luxury text-text-dark hover:text-gold py-3 transition-colors duration-300"
                >
                  ABOUT
                </button>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="block w-full text-2xl font-luxury text-text-dark hover:text-gold py-3 transition-colors duration-300"
                >
                  SERVICES
                </button>
                <button 
                  onClick={() => scrollToSection('portfolio')}
                  className="block w-full text-2xl font-luxury text-text-dark hover:text-gold py-3 transition-colors duration-300"
                >
                  PORTFOLIO
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="block w-full text-2xl font-luxury text-text-dark hover:text-gold py-3 transition-colors duration-300"
                >
                  CONTACT
                </button>
              </div>

              {/* Social Links */}
              <div className="flex justify-center space-x-8 pt-6 border-t border-bronze/20">
                <a 
                  href="https://www.linkedin.com/in/imaan-fihlani-599bb1151" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold-rich transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                
                <a 
                  href="https://wa.me/27760147175" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold-rich transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.677-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-[60px]"></div>
    </>
  );
};

export default Navbar;