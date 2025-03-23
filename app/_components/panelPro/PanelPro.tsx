import React from "react";
import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs';
import Image from 'next/image';

// Import components
import { NavItem } from "./NavItem";
import { FeatureCard } from "./FeatureCard";
import { PricingTier } from "./PricingTier";
import { FAQItem } from "./FAQItem";
import { FooterLink } from "./FooterLink";
import { SocialIcon } from "./SocialIcon";
import men from '@/public/110.png'

// Import constants
import { 
  navItems, 
  features, 
  pricingTiers, 
  faqQuestions, 
  footerLinks, 
  socialIcons 
} from "./constants";



export default function PanelPro(): JSX.Element {
  return (
    <div className="flex overflow-hidden flex-col bg-white">
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
      <section  id="home" className="hero-section mt-1 px-20 max-md:px-5 max-md:max-w-full min-h-[calc(100vh-100px)] flex flex-row max-md:flex-col">
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

        <section  id="features" className="features-section flex flex-col items-center px-12 py-20 bg-neutral-100 bg-opacity-90 max-md:px-5">
          <h2 className="text-3xl font-semibold tracking-normal leading-8 text-neutral-700">
            Simplify Your Electrical Panel Design Process
          </h2>
          <div className="flex overflow-hidden flex-wrap gap-10 justify-between items-center px-36 mt-6 max-w-full w-[1414px] max-md:px-5">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
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
            {faqQuestions.map((question, index) => (
              <FAQItem key={index} question={question} />
            ))}
          </div>
        </section>
      </main>

      <footer id="footer" className="bg-emerald-950 px-16 py-14 max-md:px-5">
        <div className="flex flex-wrap gap-10 justify-between items-start max-w-[1240px] mx-auto">
          <div className="flex flex-col min-w-[240px] w-[302px]">
            <h2 className="text-2xl font-extrabold tracking-wide text-neutral-50">
              PanelPro
            </h2>
            <p className="mt-7 text-base tracking-wide leading-7 text-white text-opacity-60">
              Your go-to tool for designing electrical panel boards, offering
              intuitive tools and real-time cost calculations to streamline your
              workflow.
            </p>
          </div>
          <div className="flex gap-10 min-w-[240px]">
            <div className="flex flex-col">
              <h3 className="text-xl font-bold tracking-wide text-white">
                Product
              </h3>
              {footerLinks.map((link, index) => (
                <FooterLink key={index} text={link} />
              ))}
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-bold tracking-wide text-white">
                Contact Us
              </h3>
              <div className="flex gap-10 mt-5">
                {socialIcons.map((icon, index) => (
                  <SocialIcon key={index} {...icon} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}