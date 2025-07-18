import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import PrayerTimesTicker from '@/components/prayer-times-ticker';
import IslamicDate from '@/components/islamic-date';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [showAdminLink, setShowAdminLink] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  // Add admin panel link on long press
  useEffect(() => {
    let pressTimer: ReturnType<typeof setTimeout>;
    
    const handleLongPress = () => {
      pressTimer = setTimeout(() => {
        setShowAdminLink(prev => !prev);
      }, 2000); // 2 seconds long press
    };
    
    const clearTimer = () => {
      clearTimeout(pressTimer);
    };
    
    document.addEventListener('mousedown', handleLongPress);
    document.addEventListener('mouseup', clearTimer);
    document.addEventListener('mouseleave', clearTimer);
    
    return () => {
      document.removeEventListener('mousedown', handleLongPress);
      document.removeEventListener('mouseup', clearTimer);
      document.removeEventListener('mouseleave', clearTimer);
      clearTimeout(pressTimer);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const menuToggle = document.getElementById('menu-toggle');
      const mobileMenu = document.getElementById('mobile-menu');
      
      if (
        menuToggle && 
        mobileMenu && 
        !menuToggle.contains(event.target as Node) && 
        !mobileMenu.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 shadow-md bg-white transition-shadow duration-300", 
      scrolled ? "shadow-lg" : "shadow-md"
    )}>
      {/* Prayer times ticker in the same line */}
      <div className="overflow-hidden bg-[#0C6E4E] text-white">
        <PrayerTimesTicker />
      </div>
      
      <nav className="mx-auto px-3 py-2">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className="text-2xl md:text-3xl font-heading text-[#0C6E4E]">
                <span className="font-arabic">جامع مسجد نبوی قریشی ہاشمی</span>
                <span className="text-xs md:text-sm block text-[#8D3333]">Jamia Masjid Nabvi Qureshi Hashmi</span>
              </div>
            </div>
          </Link>
          
          {/* Desktop Menu - Optimized spacing */}
          <div className="hidden md:flex space-x-3 lg:space-x-5 items-center">
            <Link href="/">
              <div className={cn(
                "text-[#0C6E4E] hover:text-[#D4AF37] transition-colors cursor-pointer text-sm lg:text-base", 
                location === "/" && "font-medium"
              )}>
                Home
              </div>
            </Link>
            <Link href="/history">
              <div className={cn(
                "text-[#0C6E4E] hover:text-[#D4AF37] transition-colors cursor-pointer text-sm lg:text-base", 
                location === "/history" && "font-medium"
              )}>
                History
              </div>
            </Link>
            <Link href="/services">
              <div className={cn(
                "text-[#0C6E4E] hover:text-[#D4AF37] transition-colors cursor-pointer text-sm lg:text-base", 
                location === "/services" && "font-medium"
              )}>
                Services
              </div>
            </Link>
            <Link href="/madrasa">
              <div className={cn(
                "text-[#0C6E4E] hover:text-[#D4AF37] transition-colors cursor-pointer text-sm lg:text-base", 
                location === "/madrasa" && "font-medium"
              )}>
                Madrasa
              </div>
            </Link>
            <Link href="/community">
              <div className={cn(
                "text-[#0C6E4E] hover:text-[#D4AF37] transition-colors cursor-pointer text-sm lg:text-base", 
                location === "/community" && "font-medium"
              )}>
                Community
              </div>
            </Link>
            <div className="hidden lg:block">
              <Link href="/contact">
                <div className={cn(
                  "text-[#0C6E4E] hover:text-[#D4AF37] transition-colors cursor-pointer text-sm lg:text-base", 
                  location === "/contact" && "font-medium"
                )}>
                  Contact
                </div>
              </Link>
            </div>
            <div className="hidden lg:block">
              <Link href="/vision">
                <div className={cn(
                  "text-[#0C6E4E] hover:text-[#D4AF37] transition-colors cursor-pointer text-sm lg:text-base", 
                  location === "/vision" && "font-medium"
                )}>
                  Vision
                </div>
              </Link>
            </div>
            <div className="hidden lg:block">
              <Link href="/platform">
                <div className={cn(
                  "text-[#0C6E4E] hover:text-[#D4AF37] transition-colors cursor-pointer text-sm lg:text-base", 
                  location === "/platform" && "font-medium"
                )}>
                  Platform
                </div>
              </Link>
            </div>
            <div className="hidden lg:block">
              <Link href="/about">
                <div className={cn(
                  "text-[#0C6E4E] hover:text-[#D4AF37] transition-colors cursor-pointer text-sm lg:text-base", 
                  location === "/about" && "font-medium"
                )}>
                  About
                </div>
              </Link>
            </div>
            <Link href="/donate">
              <div className="bg-[#D4AF37] hover:bg-opacity-90 text-white px-3 py-1.5 rounded-md transition-colors cursor-pointer text-sm lg:text-base">
                Donate
              </div>
            </Link>
            
            {/* Social Media Icons - Only visible on large screens */}
            <div className="hidden xl:flex items-center space-x-2 ml-2">
              <a href="https://web.facebook.com/profile.php?id=61574983740248" target="_blank" rel="noopener noreferrer" className="text-[#0C6E4E] hover:text-[#D4AF37] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                </svg>
              </a>
              <a href="https://youtube.com/shorts/5neIWBULmWg?si=PmXoQmGGhG3Z3Gwu" target="_blank" rel="noopener noreferrer" className="text-[#0C6E4E] hover:text-[#D4AF37] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-youtube" viewBox="0 0 16 16">
                  <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
                </svg>
              </a>
              <a href="https://whatsapp.com/channel/0029VaQQ3Od8KMqdPTwxNd0D" target="_blank" rel="noopener noreferrer" className="text-[#0C6E4E] hover:text-[#D4AF37] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                </svg>
              </a>
              {showAdminLink && (
                <Link href="/admin/auth" className="text-[#0C6E4E] hover:text-[#D4AF37] transition-colors bg-green-50 px-2 py-1 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                  </svg>
                </Link>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Button - With faster animation */}
          <div className="md:hidden">
            <button 
              id="menu-toggle" 
              className="text-[#0C6E4E] p-1"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-6 h-6"
              >
                {isMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="4" y1="18" x2="20" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu - Optimized for fast loading and better UX */}
        <div 
          id="mobile-menu" 
          className={cn(
            "md:hidden bg-white rounded-lg shadow-lg fixed left-0 right-0 z-50 transition-all duration-200 ease-in-out max-h-[80vh] overflow-y-auto",
            isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
          )}
          style={{top: '70px'}}
        >
          <div className="grid grid-cols-2 gap-1 p-2">
            <Link href="/" onClick={closeMenu}>
              <div className="px-3 py-2 hover:bg-[#F7F3E9] transition-colors cursor-pointer rounded text-center">
                Home
              </div>
            </Link>
            <Link href="/history" onClick={closeMenu}>
              <div className="px-3 py-2 hover:bg-[#F7F3E9] transition-colors cursor-pointer rounded text-center">
                History
              </div>
            </Link>
            <Link href="/services" onClick={closeMenu}>
              <div className="px-3 py-2 hover:bg-[#F7F3E9] transition-colors cursor-pointer rounded text-center">
                Services
              </div>
            </Link>
            <Link href="/madrasa" onClick={closeMenu}>
              <div className="px-3 py-2 hover:bg-[#F7F3E9] transition-colors cursor-pointer rounded text-center">
                Madrasa
              </div>
            </Link>
            <Link href="/community" onClick={closeMenu}>
              <div className="px-3 py-2 hover:bg-[#F7F3E9] transition-colors cursor-pointer rounded text-center">
                Community
              </div>
            </Link>
            <Link href="/contact" onClick={closeMenu}>
              <div className="px-3 py-2 hover:bg-[#F7F3E9] transition-colors cursor-pointer rounded text-center">
                Contact
              </div>
            </Link>
            <Link href="/vision" onClick={closeMenu}>
              <div className="px-3 py-2 hover:bg-[#F7F3E9] transition-colors cursor-pointer rounded text-center">
                Vision
              </div>
            </Link>
            <Link href="/platform" onClick={closeMenu}>
              <div className="px-3 py-2 hover:bg-[#F7F3E9] transition-colors cursor-pointer rounded text-center">
                Platform
              </div>
            </Link>
            <Link href="/about" onClick={closeMenu}>
              <div className="px-3 py-2 hover:bg-[#F7F3E9] transition-colors cursor-pointer rounded text-center">
                About Us
              </div>
            </Link>
          </div>
          
          <Link href="/donate" onClick={closeMenu}>
            <div className="bg-[#D4AF37] mx-4 my-2 text-center text-white px-3 py-2 rounded-md cursor-pointer">
              Donate
            </div>
          </Link>
          
          {/* Social Media Links - Grid layout for better mobile experience */}
          <div className="grid grid-cols-4 gap-2 mx-4 my-3">
            <a href="https://web.facebook.com/profile.php?id=61574983740248" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-[#F7F3E9] p-2 rounded text-[#0C6E4E] hover:text-[#D4AF37]" onClick={closeMenu}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
              </svg>
            </a>
            <a href="https://youtube.com/shorts/5neIWBULmWg?si=PmXoQmGGhG3Z3Gwu" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-[#F7F3E9] p-2 rounded text-[#0C6E4E] hover:text-[#D4AF37]" onClick={closeMenu}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-youtube" viewBox="0 0 16 16">
                <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
              </svg>
            </a>
            <a href="https://whatsapp.com/channel/0029VaQQ3Od8KMqdPTwxNd0D" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-[#F7F3E9] p-2 rounded text-[#0C6E4E] hover:text-[#D4AF37]" onClick={closeMenu}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
                <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
              </svg>
            </a>
            {showAdminLink && (
              <Link href="/admin/auth" onClick={closeMenu} className="flex items-center justify-center bg-green-100 p-2 rounded text-[#0C6E4E] hover:text-[#D4AF37]">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                </svg>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
