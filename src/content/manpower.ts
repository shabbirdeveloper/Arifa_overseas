// AUTO-DERIVED from the original index.html during the Next.js port.
// Safe to edit by hand — this is now the source of truth for the content.

import type { ManpowerCategory } from './types';

export interface ManpowerCategoryWithSize extends ManpowerCategory {
  width: number;
  height: number;
}

export const manpowerCategories: ManpowerCategoryWithSize[] = [
  {
    "number": "01",
    "tag": "Category One",
    "headingHtml": "Engineers & <em>Supervisors</em>",
    "paragraphs": [
      "Our engineering professionals are qualified, experienced, and ready to lead your project to success. From site engineers and project supervisors to specialised MEP and structural engineers, we provide the technical expertise your project demands.",
      "All our engineers hold relevant qualifications and are registered with Malaysian professional bodies where applicable."
    ],
    "skills": [
      "Civil Engineers",
      "Structural Engineers",
      "Mechanical Engineers",
      "Electrical Engineers",
      "Site Supervisors",
      "QA/QC Engineers",
      "Safety Officers",
      "Project Coordinators"
    ],
    "image": "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=900&q=85",
    "imageAlt": "Engineers",
    "reverse": false,
    "cta": "Request Engineers →",
    "width": 900,
    "height": 600
  },
  {
    "number": "02",
    "tag": "Category Two",
    "headingHtml": "Certified <em>Welders</em>",
    "paragraphs": [
      "Our certified welders are experienced in a wide range of welding techniques and materials. Whether you need precision TIG welding for stainless steel or heavy-duty structural arc welding, our team delivers consistent, high-quality results every time.",
      "All welders hold valid certifications and are tested to international welding standards."
    ],
    "skills": [
      "MIG Welding",
      "TIG Welding",
      "Arc Welding",
      "Gas Welding",
      "Structural Steel",
      "Stainless Steel",
      "Pipe Welding",
      "Underwater Welding"
    ],
    "image": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=900&q=85",
    "imageAlt": "Welders",
    "reverse": true,
    "cta": "Request Welders →",
    "width": 900,
    "height": 600
  },
  {
    "number": "03",
    "tag": "Category Three",
    "headingHtml": "Licensed <em>Electricians</em>",
    "paragraphs": [
      "Our licensed electricians are skilled in all aspects of electrical installation, testing, and maintenance. From LV and MV systems to industrial electrical panels and smart building systems, our team brings technical expertise and a safety-first approach to every job.",
      "All electricians hold valid Electrical Supervisor (ES) and Electrical Chargeman (EC) licences issued by the Energy Commission of Malaysia."
    ],
    "skills": [
      "LV Installation",
      "MV Systems",
      "Electrical Panels",
      "Wiring & Cabling",
      "Testing & Commissioning",
      "Industrial Electrical",
      "Emergency Lighting",
      "CCTV & ELV"
    ],
    "image": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=900&q=85",
    "imageAlt": "Electricians",
    "reverse": false,
    "cta": "Request Electricians →",
    "width": 900,
    "height": 600
  },
  {
    "number": "04",
    "tag": "Category Four",
    "headingHtml": "General <em>Laborers</em>",
    "paragraphs": [
      "Our general laborers are the backbone of every construction project. Hardworking, reliable, and experienced on active construction sites, they are ready to be deployed at short notice to support your project needs.",
      "All general laborers are registered, briefed on site safety procedures, and managed under experienced supervisors."
    ],
    "skills": [
      "Site Clearing",
      "Material Handling",
      "Concreting",
      "Masonry Support",
      "Scaffolding",
      "Demolition",
      "Cleaning & Housekeeping",
      "Loading & Unloading"
    ],
    "image": "/images/gallery/g7.png",
    "imageAlt": "General Laborers",
    "reverse": true,
    "cta": "Request Laborers →",
    "width": 600,
    "height": 600
  }
];
