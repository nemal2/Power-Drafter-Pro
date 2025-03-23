import React from "react";
import { BiCustomize, BiCalculator } from "react-icons/bi";
import { FaFilePdf } from "react-icons/fa6";

export const navItems = [
  { text: 'Home', sectionId: 'home' },
  { text: 'Features', sectionId: 'features' },
  { text: 'Pricing', sectionId: 'pricing' },
  { text: 'FAQ', sectionId: 'faq' },
  { text: 'Contact', sectionId: 'footer' },

];

interface Feature {
  title: string;
  icon: React.ReactNode;
  description: string;
}

export const features: Feature[] = [
  {
    title: "Intuitive Design Interface",
    icon: <BiCustomize />,
    description:
      "Easily create and customize electrical panel board designs with our user-friendly drag-and-drop interface.",
  },
  {
    title: "Real-Time Cost Calculation",
    icon: <BiCalculator />,
    description:
      "Automatically update the total price of components used as you design, ensuring budget accuracy.",
  },
  {
    title: "Quotation Generation",
    icon: <FaFilePdf />,
    description:
      "Instantly generate detailed quotations with a single click, saving time and ensuring precision.",
  },
];

interface PricingTier {
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

export const faqQuestions: string[] = [
  "What is PowerDraft Designer?",
  "Is there a free version of PowerDraft Designer?",
  "How does the real-time cost calculation work?",
  "Can I upgrade my plan at any time?",
  "What kind of support is available?",
];

export const footerLinks: string[] = ["Home", "Features", "Pricing", "FAQ", "Log in"];

interface SocialIcon {
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