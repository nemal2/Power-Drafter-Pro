import React from "react";
import { useEffect, useRef,useState } from 'react';
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs';
import Image from 'next/image';

// Import components
import { NavItem } from "./NavItem";
import { FeatureCard } from "./FeatureCard";
import { PricingTier } from "./PricingTier";
import FAQItem from "./FAQItem";
import { FooterLink } from "./FooterLink";
import { SocialIcon } from "./SocialIcon";
import men from '@/public/110.png';
import tt from '@/public/tt.png';
import star from '@/public/9.png';

// Import constants
import { 
  navItems, 
  features, 
  pricingTiers, 
  faqItems, 
  footerLinks, 
  socialIcons ,
  comments,
  getCommentCardPosition

} from "./constants";

export default function PanelPro(): JSX.Element {
  // Add the timelineRef
  const timelineRef = useRef<HTMLDivElement>(null);
  const [activeComment, setActiveComment] = useState<number>(0);

  // Add this useEffect for auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveComment((prev) => (prev + 1) % comments.length);
    }, 5000); // Change comment every 5 seconds
    
    return () => clearInterval(interval);
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

  return (
    <div className="flex overflow-hidden flex-col bg-gradient-to-b from-white from-14% to-[rgba(104,179,159,0.84)] to-100%">
      <header className="flex overflow-hidden flex-col w-full max-md:max-w-full">
        <nav className="flex gap-5 justify-between items-center px-20 pb-3.5 w-full max-md:px-5 max-md:max-w-full">
          <div className="flex gap-2.5 items-center self-stretch my-auto text-2xl font-light text-black">
            Panel<span className="font-medium">Pro</span>
          </div>
          <div className="flex overflow-hidden gap-2.5 items-center py-8 pr-32 pl-24 text-lg text-black max-md:px-5">
            <div className="flex gap-10 items-center self-stretch my-auto min-h-[29px] min-w-[240px] w-[423px]">
              {navItems.map((item, index) => (
                <NavItem key={index} text={item.text} sectionId={item.sectionId} />
              ))}
            </div>
          </div>
          <div className="flex gap-5 self-stretch my-auto text-base text-center">
          <RegisterLink>
              <button className="gap-2.5 self-stretch py-3 px-6 text-white bg-cyan-800 rounded-[50px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] max-md:px-5 
                                transition-all duration-300 ease-in-out 
                                hover:bg-cyan-700 hover:shadow-[0px_6px_8px_rgba(0,0,0,0.3)] 
                                active:bg-cyan-900 active:transform active:scale-95">
                Sign up
              </button>
            </RegisterLink>
                        
            <LoginLink postLoginRedirectURL="/dashboard">
              <button className="gap-2.5 self-stretch px-7 py-3 border-2 border-solid border-slate-600 rounded-[50px] text-slate-600 max-md:px-5 
                     transition-all duration-300 ease-in-out 
                     hover:border-cyan-700 hover:text-cyan-700 hover:shadow-[0px_0px_10px_rgba(14,116,144,0.3)] 
                     active:transform active:scale-95">
                Login
              </button>
            </LoginLink>
          </div>
        </nav>
      </header>

      <main>
      <section id="home" className="hero-section mt-1 px-20 max-md:px-5 max-md:max-w-full min-h-[calc(100vh-100px)] flex flex-row max-md:flex-col">
      {/* Left Column - Text Content */}
      <div className="flex flex-col w-1/2 max-md:w-full justify-center">
        <h1 className="text-7xl font-bold text-neutral-700 max-md:text-4xl ml-10 mb-10 mt-[-50px]">
          Design Your Perfect Panel Board Online
        </h1>
        <div className="flex flex-wrap gap-3 mt-20 max-w-full text-lg text-center">
        <RegisterLink>
          <button className="flex-auto gap-2.5 px-7 py-4 text-white bg-cyan-800 rounded-[50px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] max-md:px-5
                     transition-all duration-300 ease-in-out
                     hover:bg-cyan-700 hover:shadow-[0px_6px_10px_rgba(0,0,0,0.3)] hover:-translate-y-1
                     active:transform active:translate-y-1">
            Get started for free
          </button>
        </RegisterLink>

        <button className="flex-auto gap-2.5 px-7 py-4 uppercase border-2 border-solid border-slate-600 rounded-[50px] text-slate-600 max-md:px-5
                     transition-all duration-300 ease-in-out
                     hover:border-cyan-700 hover:text-cyan-700 hover:shadow-[0px_6px_10px_rgba(0,0,0,0.1)] hover:-translate-y-1
                     active:transform active:translate-y-1">
          GET PREMIUM
        </button>
      </div>

      </div>
      
      {/* Right Column - Image */}
      <div className="w-1/2 max-md:w-full max-md:mt-10 flex items-center justify-center ml-[200px]">
        <Image 
          src={men} 
          alt="Panel board design illustration" 
          className="max-w-full h-auto"
        />
      </div>
    </section>

        <section id="features" className="features-section flex flex-col items-center px-12 py-20 bg-neutral-100 bg-opacity-90 max-md:px-5">
          <h2 className="text-3xl font-semibold tracking-normal leading-8 text-neutral-700">
            Simplify Your Electrical Panel Design Process
          </h2>
          <div className="flex overflow-hidden flex-wrap gap-10 justify-between items-center px-36 mt-6 max-w-full w-[1414px] max-md:px-5">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </section>
        
        <section id="timeline" className="bg-white flex flex-row justify-center items-center max-md:flex-col" ref={timelineRef}>

{/* left */}
<div className="py-10 flex flex-col items-end pr-[50px] w-1/2 max-md:w-full max-md:items-center -ml-3">

    <Image
      src={tt} 
      alt="Panel board design illustration" 
      className="max-w-[320px] h-[550px] px-6"
    />
  </div>

  {/* right */}
  <div className="w-1/2 pt-4 pl-2 pr-12 max-md:w-full max-md:px-6 max-md:pt-10">

  <h2 className="text-3xl font-bold mb-10">Streamlined Design Process</h2>
    
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
            <p className="text-gray-700 max-w-[400px]">
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
            <p className="text-gray-700 max-w-[400px]">
              Export panel designs and quotations as high-quality PDFs for easy sharing and printing.
            </p>
          </div>
        </div>
      </li>
    </ol>
  </div>
</section>

<section id="comment" className="bg-[rgb(223,247,233)] bg-[radial-gradient(circle,_rgba(223,247,233,1)_30%,_rgba(239,251,239,1)_100%)] py-20 px-10 max-md:px-5  ">
  <div className="max-w-7xl mx-auto flex flex-row max-md:flex-col">
    {/* Left side */}
    <div className="w-1/3 pr-10 flex flex-col justify-center max-md:w-full max-md:mb-10 ml-44">
      <h2 className="text-4xl font-bold text-neutral-700 mb-8 " >
        What people say about Us.
      </h2>
      <Image 
          src={star} 
          alt="Panel board design illustration" 
          className=" h-auto ml-[150px]"
        />
      <Image 
          src={star} 
          alt="Panel board design illustration" 
          className="ml-[250px] h-auto"
        />
      
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
     <div className="w-2/3 relative h-[400px] max-md:w-full mt-28">
      {comments.map((comment, index) => (
        <div 
          key={index}
          className={`absolute w-[500px] bg-white p-8 rounded shadow-lg border border-gray-100 transition-all duration-500 ease-in-out  ml-6
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




        <section id="pricing" className="pricing-section flex flex-col items-center px-36 py-28 bg-slate-50 max-md:px-5">
          <h2 className="text-4xl font-bold text-center text-neutral-700">
            The Right Plan for You
          </h2>
          <div className="flex gap-6 items-center mt-9 max-w-full w-[283px]">
            <label className="grow text-base font-bold text-right text-black">
              Bill Monthly
            </label>
            <button
              role="switch"
              aria-checked="false"
              className="flex flex-col justify-center items-start p-1 bg-slate-400 rounded-[62px]"
            >
              <div className="flex w-4 h-4 bg-cyan-800 rounded-full" />
            </button>
            <label className="text-base text-black">Bill Annualy</label>
          </div>
          <div className="flex gap-5 mt-9 max-md:flex-col">
            {pricingTiers.map((tier, index) => (
              <PricingTier key={index} {...tier} />
            ))}
          </div>
        </section>

        <section id="faq" className="faq-section flex flex-col items-center px-24 py-14 bg-teal-50 max-md:px-5">
  <h2 className="text-4xl tracking-tight leading-none text-neutral-700">
    Frequently Asked Questions
  </h2>
  <div className="flex flex-col items-center mt-8 max-w-full w-[540px]">
    {faqItems.map((item, index) => (
      <FAQItem key={index} question={item.question} answer={item.answer} />
    ))}
  </div>
</section>
      </main>

      <footer id="footer" className="bg-emerald-950 px-16 py-14 max-md:px-5">
  <div className="flex flex-wrap gap-10 justify-between items-start max-w-[1240px] mx-auto">
    {/* PanelPro column - larger than others */}
    <div className="flex flex-col min-w-[240px] w-[350px] max-md:w-full">
      <h2 className="text-2xl font-extrabold tracking-wide text-neutral-50">
        PanelPro
      </h2>
      <p className="mt-7 text-base tracking-wide leading-7 text-white text-opacity-60">
        Your go-to tool for designing electrical panel boards, offering
        intuitive tools and real-time cost calculations to streamline your
        workflow.
      </p>
    </div>

    {/* Product column */}
    <div className="flex flex-col min-w-[160px] max-md:w-1/2">
      <h3 className="text-xl font-bold tracking-wide text-white mb-5">
        Product
      </h3>
      {footerLinks.slice(0, 3).map((link, index) => (
        <FooterLink key={index} text={link} />
      ))}
    </div>

    {/* About column */}
    <div className="flex flex-col min-w-[160px] max-md:w-1/2">
      <h3 className="text-xl font-bold tracking-wide text-white mb-5">
        About
      </h3>
      <FooterLink text="Our Story" />
      <FooterLink text="Team" />
      <FooterLink text="Careers" />
      <FooterLink text="Blog" />
    </div>

    {/* Contact Us column */}
    <div className="flex flex-col min-w-[160px] max-md:w-full">
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
</footer>

    </div>
  );
}
