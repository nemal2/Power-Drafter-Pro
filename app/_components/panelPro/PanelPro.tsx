import React from "react";
import { useEffect, useRef, useState } from 'react';
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs';
import Image from 'next/image';
import { Home } from 'lucide-react';

// Import components
import { NavItem } from "./NavItem";
import { FeatureCard } from "./FeatureCard";
import { PricingTier } from "./PricingTier";
import FAQItem from "./FAQItem";
import { FooterLink } from "./FooterLink";
import { SocialIcon } from "./SocialIcon";
import men from '@/public/110.png'; // Hero image
import panelProLogo from '@/public/111.png'; // Logo for nav and footer
import tt from '@/public/tt.png';
import star from '@/public/9.png';

// Import constants
import { 
  navItems, 
  features, 
  pricingTiers, 
  faqItems, 
  footerLinks, 
  socialIcons,
  comments,
  getCommentCardPosition
} from "./constants";

export default function PanelPro(): JSX.Element {
  // Add the timelineRef
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeComment, setActiveComment] = useState<number>(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<string>("Home");
  const [isAnnualBilling, setIsAnnualBilling] = useState<boolean>(false);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);

  // Add this useEffect for auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveComment((prev) => (prev + 1) % comments.length);
    }, 5000); // Change comment every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Set active page based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // Get all sections and determine which one is currently in view
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => {
        const sectionTop = (section as HTMLElement).offsetTop - 100;
        const sectionHeight = (section as HTMLElement).offsetHeight;
        const sectionId = section.getAttribute('id') || '';
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          // Capitalize first letter
          setActivePage(sectionId.charAt(0).toUpperCase() + sectionId.slice(1));
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Add the useEffect for scroll animation
  useEffect(() => {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement;
          const delay = target.dataset.delay || '0';
          setTimeout(() => {
            target.classList.add('opacity-100');
          }, parseInt(delay));
        }
      });
    }, observerOptions);

    const items = timelineRef.current?.querySelectorAll('.reveal-item');
    items?.forEach(item => {
      observer.observe(item);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleBillingPeriod = () => {
    // Only trigger flip if not already flipping
    if (!isFlipping) {
      // First update the billing state
      setIsAnnualBilling(!isAnnualBilling);
      
      // Use RAF for smoother animation start
      requestAnimationFrame(() => {
        // Then trigger the animation
        setIsFlipping(true);
        
        // Reset the flipping state after animation completes
        setTimeout(() => {
          setIsFlipping(false);
        }, 650); // Slightly longer than the animation duration to ensure completion
      });
    }
  };

  return (
    <div className="flex overflow-hidden flex-col bg-gradient-to-b from-white from-14% to-[rgba(104,179,159,0.84)] to-100%">
      {/* Add CSS styles for 3D transforms */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .transform-style-preserve-3d {
          transform-style: preserve-3d;
          will-change: transform;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .transition-transform {
          transition-property: transform;
        }
        .duration-600 {
          transition-duration: 600ms;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm px-5 sm:px-10 lg:px-20 py-4 w-full">
        <div className="flex gap-5 justify-between items-center w-full max-w-[1600px] mx-auto">
          <div className="flex gap-2 items-center self-stretch my-auto">
            <Image 
              src={panelProLogo} 
              alt="Panel Pro Logo" 
              width={40} 
              height={40} 
              className="h-auto"
            />
            <span className="text-2xl font-light text-black">
              Panel<span className="font-medium">Pro</span>
            </span>
          </div>
          
          {/* Breadcrumb - Desktop */}
          <div className="hidden md:hidden lg:hidden items-center text-sm text-gray-500 absolute right-5 sm:right-10 top-4">
            <Home size={16} className="text-cyan-700" />
            <span className="ml-2 text-cyan-800 font-medium">{activePage}</span>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden lg:flex overflow-hidden gap-2.5 items-center py-2 pr-4 text-lg text-black">
            <div className="flex gap-10 items-center self-stretch my-auto min-h-[29px]">
              {navItems.map((item, index) => (
                <NavItem key={index} text={item.text} sectionId={item.sectionId} />
              ))}
            </div>
          </div>
          
          <div className="flex gap-3 sm:gap-5 self-stretch my-auto text-base text-center"> 
            <RegisterLink>
              <button className="gap-2.5 self-stretch py-2 sm:py-3 px-3 sm:px-6 text-white bg-cyan-800 rounded-[50px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] 
                              transition-all duration-300 ease-in-out 
                              hover:bg-cyan-700 hover:shadow-[0px_6px_8px_rgba(0,0,0,0.3)] 
                              active:bg-cyan-900 active:transform active:scale-95">
                Sign up
              </button>
            </RegisterLink>
            
            <LoginLink postLoginRedirectURL="/dashboard">
              <button className="gap-2.5 self-stretch px-3 sm:px-7 py-2 sm:py-3 border-2 border-solid border-slate-600 rounded-[50px] text-slate-600 
                     transition-all duration-300 ease-in-out 
                     hover:border-cyan-700 hover:text-cyan-700 hover:shadow-[0px_0px_10px_rgba(14,116,144,0.3)] 
                     active:transform active:scale-95">
                Login
              </button>
            </LoginLink>
            
            {/* Mobile menu button - moved to the right */}
            <button 
              className="lg:hidden flex items-center"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu dropdown */}
        <div className={`${isMobileMenuOpen ? 'flex' : 'hidden'} lg:hidden absolute top-full left-0 right-0 bg-white shadow-md flex-col w-full z-50`}>
          {navItems.map((item, index) => (
            <a 
              key={index} 
              href={`#${item.sectionId}`} 
              className="py-3 px-5 hover:bg-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {item.text}
            </a>
          ))}
          
          {/* Breadcrumb - Mobile (inside dropdown) */}
          <div className="md:hidden flex items-center text-sm text-gray-500 py-3 px-5 border-t">
            <Home size={16} className="text-cyan-700" />
            <span className="ml-2 text-cyan-800 font-medium">{activePage}</span>
          </div>
        </div>
      </nav>

      {/* Add a spacer element to prevent content from being hidden under the fixed header */}
      <div className="h-[80px]"></div>

      <main>
        <section id="home" className="hero-section sm:px-10 lg:px-20 py-6 px-20 max-md:px-5 max-md:max-w-full sm:min-h-[calc(100vh-100px)] flex flex-col lg:flex-row relative overflow-hidden">
          {/* Background elements */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-200 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 -left-32 w-72 h-72 bg-teal-200 rounded-full opacity-20 blur-3xl"></div>
          
          {/* Left Column - Text Content */}
          <div className="flex flex-col w-full lg:w-3/5 justify-start text-center lg:text-left py-0 lg:pt-6 relative z-10">
            {/* Gradient accent line */}
            <div className="hidden lg:block h-1 w-24 bg-gradient-to-r from-cyan-500 to-teal-400 mb-6 mx-auto lg:ml-10"></div>
            
            {/* Subtitle */}
            <p className="text-cyan-700 font-medium mb-2 lg:ml-10">Electrical Panel Design Software</p>
            
            {/* Heading (appears first on all screens) */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-neutral-700 ml-0 md:ml-5 lg:ml-10 mb-4 md:mb-6 mt-6 md:mt-8 lg:mt-4 leading-tight">
              Design Your Perfect<br className="hidden md:block" /> Panel Board Online
            </h1>
            
            {/* Description text */}
            <p className="text-gray-600 max-w-lg mx-auto lg:mx-0 lg:ml-10 mb-8 text-base md:text-lg">
              Create professional electrical panel layouts with our intuitive drag-and-drop interface. Generate accurate quotations and export high-quality PDFs in minutes.
            </p>
            
            {/* Mobile Image (between heading and buttons on small screens) */}
            <div className="lg:hidden w-full mb-8 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-cyan-200 rounded-full opacity-30 blur-xl"></div>
                <Image 
                  src={men} 
                  alt="Panel board design illustration" 
                  className="max-w-[350px] sm:max-w-[450px] md:max-w-[450px] w-full h-auto relative z-10"
                  priority
                />
              </div>
            </div>
            
            {/* Buttons (appear after image on mobile, after heading on desktop) */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start lg:ml-10 mb-4 mt-4 lg:mt-2">
              <RegisterLink className="w-full sm:w-auto">
                <button className="w-full sm:w-[280px] gap-2.5 px-7 py-4 text-slate-700 bg-white bg-opacity-80 border border-slate-300 rounded-[50px] shadow-sm hover:shadow-md backdrop-blur-sm
                         transition-all duration-300 ease-in-out
                         hover:translate-y-[-2px] hover:border-slate-400
                         active:transform active:translate-y-1 flex items-center justify-center">
                  <span>Get started for free</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </RegisterLink>

              <button className="w-full sm:w-[280px] gap-2.5 px-7 py-4 uppercase text-white font-medium border-0
                         bg-gradient-to-r from-cyan-700 to-teal-600 rounded-[50px] shadow-lg 
                         transition-all duration-300 ease-in-out relative
                         hover:translate-y-[-2px] hover:shadow-xl hover:from-cyan-600 hover:to-teal-500
                         active:transform active:translate-y-1 flex items-center justify-center group overflow-hidden">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-400 to-teal-400 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-200" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                GET PREMIUM
              </button>
            </div>
            
            {/* Trust indicators */}
            {/* <div className="hidden md:flex items-center gap-6 mt-12 lg:ml-10">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`w-8 h-8 rounded-full border-2 border-white bg-gray-${i*100 + 200}`}></div>
                  ))}
                </div>
                <p className="ml-3 text-sm text-gray-600">Trusted by 5,000+ users</p>
              </div>
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg 
                      key={star}
                      className="w-4 h-4 text-yellow-400" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="ml-2 text-sm text-gray-600">4.9/5 rating</p>
              </div>
            </div> */}
          </div>
          
          {/* Right Column - Image (visible only on desktop) */}
          <div className="hidden lg:flex lg:w-2/5 items-center justify-center relative">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-cyan-200 to-teal-100 rounded-full opacity-40 blur-3xl"></div>
            <Image 
              src={men} 
              alt="Panel board design illustration" 
              className="max-w-full h-auto relative z-10"
              priority
            />
          </div>
        </section>

        <section id="features" className="features-section flex flex-col items-center px-5 sm:px-8 lg:px-12 py-16 sm:py-20 bg-neutral-100 bg-opacity-90">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-normal leading-8 text-neutral-700 text-center mb-10">
            Simplify Your Electrical Panel Design Process
          </h2>
          <div className="flex flex-col md:flex-row md:flex-wrap gap-8 justify-center items-center w-full max-w-6xl">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </section>
        
        <section id="timeline" className="bg-white flex flex-col lg:flex-row justify-center items-center py-16 sm:py-20" ref={timelineRef}>
          {/* left */}
          <div className="py-5 sm:py-10 flex flex-col items-center lg:items-end lg:pr-[50px] w-full lg:w-1/2">
            <Image
              src={tt} 
              alt="Panel board design illustration" 
              className="max-w-[300px] h-auto px-6"
            />
          </div>

          {/* right */}
          <div className="w-full lg:w-1/2 pt-4 px-6 lg:pl-2 lg:pr-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center lg:text-left">Streamlined Design Process</h2>
            
            <ol className="space-y-8">
              <li className="reveal-item opacity-0 transition-opacity duration-500 ease-in-out" data-delay="0">
                <div className="flex items-start">
                  <div className="bg-gradient-to-b from-[#7cbbA8] to-[#b5d5c0] rounded-sm w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-black font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Component Selection</h3>
                    <p className="text-gray-700">
                      Effortlessly choose from a comprehensive library of pre-configured electrical 
                      components, including circuit breakers, relays, and terminals.
                    </p>
                  </div>
                </div>
              </li>

              <li className="reveal-item opacity-0 transition-opacity duration-500 ease-in-out" data-delay="200">
                <div className="flex items-start">
                  <div className="bg-gradient-to-b from-[#7cbbA8] to-[#b5d5c0] rounded-sm w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-black font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">Panel Layout</h3>
                    <p className="text-gray-700 max-w-full sm:max-w-[400px]">
                      Drag and drop components onto the interactive panel board layout to create a 
                      visually appealing and functional design.
                    </p>
                  </div>
                </div>
              </li>
              
              <li className="reveal-item opacity-0 transition-opacity duration-500 ease-in-out" data-delay="400">
                <div className="flex items-start">
                  <div className="bg-gradient-to-b from-[#7cbbA8] to-[#b5d5c0] rounded-sm w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-black font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2">PDF Export</h3>
                    <p className="text-gray-700 max-w-full sm:max-w-[400px]">
                      Export panel designs and quotations as high-quality PDFs for easy sharing and printing.
                    </p>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section id="comment" className="bg-[rgb(223,247,233)] bg-[radial-gradient(circle,_rgba(223,247,233,1)_30%,_rgba(239,251,239,1)_100%)] py-12 sm:py-16 px-5 sm:px-10">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
            {/* Left side */}
            <div className="w-full lg:w-1/3 pr-5 lg:pr-10 flex flex-col justify-center mb-6 lg:mb-0 items-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-700 mb-6 text-center">
                What people say about Us.
              </h2>
              <div className="relative w-full max-w-[300px] h-[100px]">
                <Image 
                  src={star} 
                  alt="Star decoration" 
                  className="absolute left-[30%] top-0 h-auto"
                />
                <Image 
                  src={star} 
                  alt="Star decoration" 
                  className="absolute left-[60%] top-[50%] h-auto"
                />
              </div>
              
              {/* Dots for navigation */}
              <div className="flex space-x-3 mt-8">
                {[0, 1, 2, 3].map((index) => (
                  <button 
                    key={index}
                    aria-label={`View testimonial ${index + 1}`}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      activeComment === index 
                        ? 'bg-gradient-to-b from-[#7cbbA8] to-[#b5d5c0] w-6' 
                        : 'bg-gray-300'
                    }`}
                    onClick={() => setActiveComment(index)}
                  />
                ))}
              </div>
            </div>
            
            {/* Right side - Comment cards */}
            <div className="w-full lg:w-2/3 relative h-[400px] flex justify-center lg:justify-start">
              {comments.map((comment, index) => (
                <div 
                  key={index}
                  className={`absolute w-[90%] sm:w-[500px] bg-white p-4 sm:p-8 rounded shadow-lg border border-gray-100 transition-all duration-500 ease-in-out mx-auto left-0 right-0
                    ${getCommentCardPosition(index, activeComment, comments.length)}`}
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <Image 
                        src={comment.avatar} 
                        alt={comment.name} 
                        width={48} 
                        height={48} 
                        className="w-full h-full object-cover"
                      />
                    </div> 
                    <div>
                      <h4 className="font-bold text-lg">{comment.name}</h4>
                      <p className="text-gray-600 text-sm">{comment.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.text}</p>
                  <div className="flex items-center mt-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg 
                        key={star} 
                        className={`w-5 h-5 ${star <= comment.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="pricing-section flex flex-col items-center px-4 sm:px-10 lg:px-36 py-10 sm:py-16 md:py-20 lg:py-24 bg-slate-50">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-neutral-700">
            The Right Plan for You
          </h2>
          <div className="flex gap-4 sm:gap-6 items-center mt-4 sm:mt-6 md:mt-9 max-w-full w-[280px] sm:w-[320px]">
            <span className={`text-sm sm:text-base font-medium ${!isAnnualBilling ? 'text-cyan-800 font-bold' : 'text-gray-600'} transition-colors duration-300`}>
              Monthly
            </span>
            <button
              role="switch"
              aria-checked={isAnnualBilling}
              onClick={toggleBillingPeriod}
              className="relative w-14 sm:w-16 h-7 sm:h-8 bg-gray-200 rounded-full flex items-center transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-opacity-50"
            >
              <div 
                className={`w-5 sm:w-6 h-5 sm:h-6 rounded-full bg-cyan-700 shadow-md transform transition-transform duration-300 ${
                  isAnnualBilling ? 'ml-auto mr-1' : 'ml-1'
                }`} 
              />
            </button>
            <span className={`text-sm sm:text-base font-medium ${isAnnualBilling ? 'text-cyan-800 font-bold' : 'text-gray-600'} transition-colors duration-300`}>
              Annual <span className="text-xs font-bold text-green-600 ml-1">Save 20%</span>
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-5 mt-6 sm:mt-8 md:mt-9 w-full max-w-5xl">
            {pricingTiers.map((tier, index) => (
              <div key={index} className="w-full flex justify-center">
                <div className="w-full max-w-[350px]">
                  <PricingTier 
                    {...tier} 
                    isFlipping={isFlipping}
                    isAnnual={isAnnualBilling}
                    price={isAnnualBilling 
                      ? tier.price.startsWith("$0") 
                        ? tier.price 
                        : `$${Math.floor(parseInt(tier.price.replace(/\D/g, '')) * 0.8 * 12)}/year`
                      : tier.price
                    }
                    savingsText={isAnnualBilling && tier.isHighlighted ? "Save 20%" : tier.savingsText}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="faq-section flex flex-col items-center px-5 sm:px-10 lg:px-24 py-16 sm:py-20 bg-teal-50">
          <h2 className="text-3xl sm:text-4xl tracking-tight leading-none text-neutral-700 mb-3 text-center">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col items-center mt-8 max-w-full w-full sm:w-[540px]">
            {faqItems.map((item, index) => (
              <FAQItem key={index} question={item.question} answer={item.answer} />
            ))}
          </div>
        </section>
      </main>

      <footer id="footer" className="bg-emerald-950 px-5 sm:px-10 lg:px-16 py-14">
        <div className="flex flex-wrap gap-10 justify-between items-start max-w-[1240px] mx-auto">
          {/* PanelPro column - larger than others */}
          <div className="flex flex-col min-w-[240px] w-full sm:w-[350px]">
            <div className="flex items-center gap-3 mb-4">
              <Image 
                src={panelProLogo} 
                alt="Panel Pro Logo" 
                width={40} 
                height={40} 
                className="h-auto"
              />
              <h2 className="text-2xl font-extrabold tracking-wide text-neutral-50">
                PanelPro
              </h2>
            </div>
            <p className="mt-3 text-base tracking-wide leading-7 text-white text-opacity-60">
              Your go-to tool for designing electrical panel boards, offering
              intuitive tools and real-time cost calculations to streamline your
              workflow.
            </p>
          </div>

          <div className="flex flex-wrap w-full sm:w-auto">
            {/* Product column */}
            <div className="flex flex-col min-w-[160px] w-1/2 sm:w-auto mb-8 sm:mb-0">
              <h3 className="text-xl font-bold tracking-wide text-white mb-5">
                Product
              </h3>
              {footerLinks.slice(0, 3).map((link, index) => (
                <FooterLink key={index} text={link} />
              ))}
            </div>

            {/* About column */}
            <div className="flex flex-col min-w-[160px] w-1/2 sm:w-auto mb-8 sm:mb-0">
              <h3 className="text-xl font-bold tracking-wide text-white mb-5">
                About
              </h3>
              <FooterLink text="Our Story" />
              <FooterLink text="Team" />
              <FooterLink text="Careers" />
              <FooterLink text="Blog" />
            </div>

            {/* Contact Us column */}
            <div className="flex flex-col min-w-[160px] w-full sm:w-auto">
              <h3 className="text-xl font-bold tracking-wide text-white mb-5">
                Contact Us
              </h3>
              <div className="flex gap-5 mt-2">
                {socialIcons.map((icon, index) => (
                  <SocialIcon key={index} {...icon} />
                ))}
              </div>
              <FooterLink text="support@panelpro.com" />
              <FooterLink text="+1 (555) 123-4567" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
