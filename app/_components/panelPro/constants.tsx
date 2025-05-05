import React from "react";
import { BiCustomize, BiCalculator } from "react-icons/bi";
import { FaFilePdf } from "react-icons/fa6";
import m1 from '@/public/avatar/1.png'
import g1 from '@/public/avatar/2.png'
import g2 from '@/public/avatar/3.png'
import m2 from '@/public/avatar/4.png'



export const navItems = [
  { text: 'Home', sectionId: 'home' },
  { text: 'Features', sectionId: 'features' },
  { text: 'Pricing', sectionId: 'pricing' },
  { text: 'FAQ', sectionId: 'faq' },
  { text: 'Contact', sectionId: 'footer' },
];

export interface Feature {
  title: string;
  icon: React.ReactNode;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const features: Feature[] = [
  {
    title: "Intuitive Design Interface",
    icon: (
      <div className="bg-gradient-to-b from-[#7cbba8] from-14% to-[#B5D5C0] to-100% p-3 rounded-full flex items-center justify-center">
        <BiCustomize className="text-white text-2xl" />
      </div>),
    description:
      "Easily create and customize electrical panel board designs with our user-friendly drag-and-drop interface.",
  },
  {
    title: "Real-Time Cost Calculation",
    icon: (
      <div className="bg-gradient-to-b from-[#7cbba8] from-14% to-[#B5D5C0] to-100% p-3 rounded-full flex items-center justify-center">
        <BiCalculator className="text-white text-2xl" />
      </div>),
    description:
      "Automatically update the total price of components used as you design, ensuring budget accuracy.",
  },
  {
    title: "Quotation Generation",
    icon: (
      <div className="bg-gradient-to-b from-[#7cbba8] from-14% to-[#B5D5C0] to-100% p-3 rounded-full flex items-center justify-center">
        <FaFilePdf className="text-white text-2xl" />
      </div>),
    description:
      "Instantly generate detailed quotations with a single click, saving time and ensuring precision.",
  },
];

export interface PricingTier {
  name: string;
  features: string[];
  price: number;
  buttonText: string;
  isHighlighted?: boolean;
  savingsText?: string;
}

export const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    features: [
      "Feature 1",
      "Feature 2",
      "Feature 3",
      "Exclusive Deals",
      "Feature 5",
    ],
    price: 123,
    buttonText: "Choose",
  },
  {
    name: "Base",
    features: [
      "Feature 1",
      "Feature 2",
      "Feature 3",
      "Exclusive Deals",
      "Feature 5",
    ],
    price: 123,
    buttonText: "Choose",
  },
  {
    name: "Pro",
    features: [
      "Feature 1",
      "Feature 2",
      "Feature 3",
      "Exclusive Deals",
      "Feature 5",
    ],
    price: 123,
    buttonText: "Try 1 month",
    isHighlighted: true,
    savingsText: "Save $40",
  },
];


export const faqItems: FAQItem[] = [
  {
    question: "What is PowerDraft Designer?",
    answer: "PowerDraft Designer is a comprehensive software solution for creating electrical panel board designs. It offers an intuitive drag-and-drop interface, real-time cost calculation, and professional quotation generation to streamline your design process."
  },
  {
    question: "Is there a free version of PowerDraft Designer?",
    answer: "Yes, we offer a free tier with basic functionality to help you get started. You can upgrade to our paid plans anytime to access more advanced features and capabilities."
  },
  {
    question: "How does the real-time cost calculation work?",
    answer: "Our software automatically calculates the total cost of your design as you add or remove components. Each component in our library has associated pricing data that updates in real-time, ensuring your budget estimates are always accurate."
  },
  {
    question: "Can I upgrade my plan at any time?",
    answer: "Absolutely! You can upgrade your plan at any time through your account dashboard. The new features will be immediately available, and we'll only charge you the prorated difference for the remainder of your billing cycle."
  },
  {
    question: "What kind of support is available?",
    answer: "We offer comprehensive support including detailed documentation, video tutorials, email support, and live chat during business hours. Our Pro plan includes priority support with faster response times."
  }
];
export const footerLinks: string[] = ["Home", "Features", "Pricing", "FAQ", "Log in"];

export interface SocialIcon {
  src: string;
  alt: string;
}

export const socialIcons: SocialIcon[] = [
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/b6a5520b894bf075760a2c950c12fc56a643bbb4989624bf2b0bab4d3faa1f49?placeholderIfAbsent=true&apiKey=29a73afb14654dba9949ec01adec667c",
    alt: "Facebook",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/077425e8bfc9582689cd0830d39a9faa29bdc40df9567b6e584182f284fd4d15?placeholderIfAbsent=true&apiKey=29a73afb14654dba9949ec01adec667c",
    alt: "Twitter",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/61adb5a453fae0e9831c69c9e02b17d640975c4e595d775f813a7882b3b5a674?placeholderIfAbsent=true&apiKey=29a73afb14654dba9949ec01adec667c",
    alt: "Instagram",
  },
  {
    src: "https://cdn.builder.io/api/v1/image/assets/TEMP/2dd3c29f361222e32e07d4ddba85fbe7f6f1e446c97ee7eff24f047ac257edab?placeholderIfAbsent=true&apiKey=29a73afb14654dba9949ec01adec667c",
    alt: "LinkedIn",
  },
];

// New additions for the comments section
export interface Comment {
  name: string;
  role: string;
  avatar: string;
  text: string;
  rating: number;
}

export const comments: Comment[] = [
  {
    name: "Sarah Johnson",
    role: "Electrical Engineer",
    avatar: "/avatar/1.png", // You'll need to add these images to your public folder
    text: "PanelPro has completely transformed how I design electrical panels. The intuitive interface and component library save me hours on each project.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Project Manager",
    avatar: "/avatar/2.png",
    text: "The ability to export professional PDFs directly from the app has streamlined our documentation process. Our clients are impressed with the quality.",
    rating: 4
  },
  {
    name: "Elena Rodriguez",
    role: "Industrial Designer",
    avatar: "/avatar/3.png",
    text: "I appreciate how easy it is to make changes and see cost updates in real-time. PanelPro has become an essential tool for our team.",
    rating: 5
  },
  {
    name: "David Kim",
    role: "Automation Specialist",
    avatar: "/avatar/4.png",
    text: "The customer support is exceptional. Any questions I've had were answered promptly, and the team is always open to feature suggestions.",
    rating: 5
  }
];

// Helper function for comment card positioning
export const getCommentCardPosition = (index: number, activeIndex: number, totalComments: number): string => {
  if (index === activeIndex) {
    return "z-30 top-0 left-0 opacity-100 scale-100";
  } else if (index === (activeIndex + 1) % totalComments) {
    return "z-20 top-6 left-6 opacity-90 scale-95";
  } else if (index === (activeIndex + 2) % totalComments) {
    return "z-10 top-12 left-12 opacity-80 scale-90";
  } else {
    return "z-0 top-16 left-16 opacity-70 scale-85";
  }
};
