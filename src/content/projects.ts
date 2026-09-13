// AUTO-DERIVED from the original index.html during the Next.js port.
// Safe to edit by hand — this is now the source of truth for the content.

import type { FeaturedProject, HistoryGroup } from './types';

export interface FeaturedProjectWithSize extends FeaturedProject {
  width: number;
  height: number;
}

export const featuredProjects: FeaturedProjectWithSize[] = [
  {
    "src": "https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=800&q=85",
    "alt": "Commercial Complex",
    "category": "Construction",
    "title": "Commercial Complex, JB",
    "text": "Multi-storey commercial development with full fit-out. Completed 2023.",
    "tall": true,
    "width": 800,
    "height": 533
  },
  {
    "src": "https://images.unsplash.com/photo-1527525443983-6e60c75fff46?w=600&q=85",
    "alt": "Plant Staffing",
    "category": "Manpower",
    "title": "Industrial Plant Staffing",
    "text": "80-strong workforce deployed for 12-month contract.",
    "tall": false,
    "width": 600,
    "height": 400
  },
  {
    "src": "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=85",
    "alt": "Facility Maintenance",
    "category": "Maintenance",
    "title": "Tech Park Facility Management",
    "text": "Ongoing preventive and corrective maintenance contract.",
    "tall": false,
    "width": 600,
    "height": 400
  },
  {
    "src": "https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?w=600&q=85",
    "alt": "Residential",
    "category": "Construction",
    "title": "Residential Development",
    "text": "48-unit residential complex in Johor Bahru.",
    "tall": false,
    "width": 600,
    "height": 400
  },
  {
    "src": "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=600&q=85",
    "alt": "Welding Team",
    "category": "Manpower",
    "title": "Welding Crew Deployment",
    "text": "Certified welding team for offshore fabrication project.",
    "tall": false,
    "width": 600,
    "height": 400
  },
  {
    "src": "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600&q=85",
    "alt": "Industrial Maintenance",
    "category": "Maintenance",
    "title": "Industrial Equipment Service",
    "text": "Full mechanical and electrical maintenance programme.",
    "tall": false,
    "width": 600,
    "height": 400
  },
  {
    "src": "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=85",
    "alt": "Office Building",
    "category": "Construction",
    "title": "Corporate Office Fit-Out",
    "text": "Full interior fit-out for 8-storey corporate HQ.",
    "tall": false,
    "width": 600,
    "height": 400
  },
  {
    "src": "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=600&q=85",
    "alt": "Engineers",
    "category": "Manpower",
    "title": "Engineering Team Supply",
    "text": "Civil and structural engineers for 18-month project.",
    "tall": false,
    "width": 600,
    "height": 400
  },
  {
    "src": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=85",
    "alt": "Infrastructure",
    "category": "Construction",
    "title": "Infrastructure Works, Iskandar",
    "text": "Road and drainage infrastructure for new township.",
    "tall": false,
    "width": 600,
    "height": 400
  }
];

export const projectFilters = [
  { value: 'all', label: 'All Projects' },
  { value: 'Construction', label: 'Construction' },
  { value: 'Manpower', label: 'Manpower' },
  { value: 'Maintenance', label: 'Maintenance' },
] as const;

export const projectHistory: HistoryGroup[] = [
  {
    "badge": "🔵 2018–2026",
    "badgeStyle": "background:linear-gradient(135deg,rgba(56,189,248,0.3),rgba(14,165,233,0.5));border:1px solid var(--blue);animation:pulseBadge 2s infinite;",
    "title": "Current Ongoing Projects",
    "cards": [
      {
        "num": "25",
        "client": "JIANGSU (Steel Structure) Malaysia",
        "value": "🟢 On Going",
        "valueStyle": "",
        "ongoing": true,
        "highlight": false,
        "mega": false,
        "megaBadge": "",
        "title": "Manpower Supply — JABIL / COSMX / AVALON Project",
        "scope": "Providing manpower supply for Project JABIL / COSMX / AVALON (2025–2026)",
        "tags": [
          {
            "label": "Manpower",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Steel Structure",
            "style": "",
            "ongoing": false
          },
          {
            "label": "On Going",
            "style": "",
            "ongoing": true
          }
        ]
      },
      {
        "num": "26",
        "client": "Malaysia Marine & Heavy Engineering",
        "value": "🟢 On Going",
        "valueStyle": "",
        "ongoing": true,
        "highlight": false,
        "mega": false,
        "megaBadge": "",
        "title": "Oil & Gas Engineering Experts",
        "scope": "Manpower supply — engineering experts in oil & gas industries (2024–2026)",
        "tags": [
          {
            "label": "Engineering",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Oil & Gas",
            "style": "",
            "ongoing": false
          },
          {
            "label": "On Going",
            "style": "",
            "ongoing": true
          }
        ]
      },
      {
        "num": "27",
        "client": "PGEO Edible Oils Sdn Bhd",
        "value": "🟢 On Going",
        "valueStyle": "",
        "ongoing": true,
        "highlight": false,
        "mega": false,
        "megaBadge": "",
        "title": "Maintenance Team Support",
        "scope": "Providing manpower supply to assist Maintenance Team (2025–2026)",
        "tags": [
          {
            "label": "Manpower",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Maintenance",
            "style": "",
            "ongoing": false
          },
          {
            "label": "On Going",
            "style": "",
            "ongoing": true
          }
        ]
      },
      {
        "num": "28",
        "client": "Natural Oleochemical Sdn Bhd",
        "value": "🟢 On Going",
        "valueStyle": "",
        "ongoing": true,
        "highlight": false,
        "mega": false,
        "megaBadge": "",
        "title": "Reliability Maintenance Team Support",
        "scope": "Providing manpower supply to assist Reliability Maintenance Team (2025–2026)",
        "tags": [
          {
            "label": "Manpower",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Reliability",
            "style": "",
            "ongoing": false
          },
          {
            "label": "On Going",
            "style": "",
            "ongoing": true
          }
        ]
      },
      {
        "num": "29",
        "client": "DCN Holding Sdn Bhd",
        "value": "🟢 On Going",
        "valueStyle": "",
        "ongoing": true,
        "highlight": false,
        "mega": false,
        "megaBadge": "",
        "title": "Fire Protection Works — Block C1",
        "scope": "Work Order for Fire Protection Works — Electrical Service, Block C1 (2025–2026)",
        "tags": [
          {
            "label": "Electrical",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Fire Protection",
            "style": "",
            "ongoing": false
          },
          {
            "label": "On Going",
            "style": "",
            "ongoing": true
          }
        ]
      },
      {
        "num": "30",
        "client": "Guardseal Solutions Sdn Bhd",
        "value": "🟢 On Going",
        "valueStyle": "",
        "ongoing": true,
        "highlight": false,
        "mega": false,
        "megaBadge": "",
        "title": "Manpower Supply",
        "scope": "Providing manpower supply services (2026)",
        "tags": [
          {
            "label": "Manpower",
            "style": "",
            "ongoing": false
          },
          {
            "label": "2026",
            "style": "",
            "ongoing": false
          },
          {
            "label": "On Going",
            "style": "",
            "ongoing": true
          }
        ]
      }
    ]
  },
  {
    "badge": "2024",
    "badgeStyle": "background:linear-gradient(135deg,var(--blue-dark),#0369a1);",
    "title": "Latest Project",
    "cards": [
      {
        "num": "24",
        "client": "Seremban Engineering SDN BHD",
        "value": "RM 7,000,000",
        "valueStyle": "color:#fbbf24;font-size:1.3rem;font-weight:500;",
        "ongoing": false,
        "highlight": false,
        "mega": true,
        "megaBadge": "🏆 Flagship Project",
        "title": "Intel Falcon Project (Kulim)",
        "scope": "Piping installation with full equipment supply — Intel's state-of-the-art semiconductor facility in Kulim Hi-Tech Park, Kedah",
        "tags": [
          {
            "label": "Piping",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Equipment",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Intel",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Kulim",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Kedah",
            "style": "",
            "ongoing": false
          },
          {
            "label": "RM 7M",
            "style": "background:rgba(251,191,36,0.15);border-color:rgba(251,191,36,0.3);color:#fbbf24;",
            "ongoing": false
          }
        ]
      }
    ]
  },
  {
    "badge": "2023",
    "badgeStyle": "background:rgba(56,189,248,0.3);border:1px solid var(--blue);",
    "title": "2023 Projects",
    "cards": [
      {
        "num": "18",
        "client": "Variety Scores",
        "value": "RM 1,500,000",
        "valueStyle": "color:#fbbf24;",
        "ongoing": false,
        "highlight": true,
        "mega": false,
        "megaBadge": "",
        "title": "SAMSUNG SDI — Mechanical Works",
        "scope": "Full mechanical works for Samsung SDI facility — global battery manufacturer project",
        "tags": [
          {
            "label": "Mechanical",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Samsung SDI",
            "style": "",
            "ongoing": false
          }
        ]
      },
      {
        "num": "19",
        "client": "Bluebros E&C SDN BHD",
        "value": "RM 350,000",
        "valueStyle": "",
        "ongoing": false,
        "highlight": false,
        "mega": false,
        "megaBadge": "",
        "title": "SAMSUNG SDI — Ducting Installation",
        "scope": "Skilled workforce supply for ducting installation works",
        "tags": [
          {
            "label": "Manpower",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Ducting",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Samsung SDI",
            "style": "",
            "ongoing": false
          }
        ]
      },
      {
        "num": "20",
        "client": "Xiao Li Engineering & Co.",
        "value": "RM 100,000",
        "valueStyle": "",
        "ongoing": false,
        "highlight": false,
        "mega": false,
        "megaBadge": "",
        "title": "SAMSUNG SDI — RC Civil Works",
        "scope": "Manpower supply for reinforced concrete (RC) civil works",
        "tags": [
          {
            "label": "Civil",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Manpower",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Samsung SDI",
            "style": "",
            "ongoing": false
          }
        ]
      },
      {
        "num": "21",
        "client": "North Air Conditioning Malaysia",
        "value": "RM 1,000,000",
        "valueStyle": "color:#fbbf24;",
        "ongoing": false,
        "highlight": true,
        "mega": false,
        "megaBadge": "",
        "title": "INTEL Project (Pulau Pinang) — RC Manpower",
        "scope": "Full RC (reinforced concrete) manpower supply for Intel's Penang facility expansion",
        "tags": [
          {
            "label": "Civil",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Intel",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Penang",
            "style": "",
            "ongoing": false
          }
        ]
      },
      {
        "num": "22",
        "client": "S1 Corporation",
        "value": "RM 500,000",
        "valueStyle": "",
        "ongoing": false,
        "highlight": false,
        "mega": false,
        "megaBadge": "",
        "title": "INTEL Project (Pulau Pinang) — Firefighting",
        "scope": "Skilled workforce supply for firefighting system installation",
        "tags": [
          {
            "label": "Manpower",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Intel",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Firefighting",
            "style": "",
            "ongoing": false
          }
        ]
      },
      {
        "num": "23",
        "client": "Potential System SDN BHD",
        "value": "RM 1,500,000",
        "valueStyle": "color:#fbbf24;",
        "ongoing": false,
        "highlight": true,
        "mega": false,
        "megaBadge": "",
        "title": "SAMSUNG SDI — CCTV & IT Manpower",
        "scope": "CCTV installation and IT manpower supply for Samsung SDI facility",
        "tags": [
          {
            "label": "CCTV",
            "style": "",
            "ongoing": false
          },
          {
            "label": "IT",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Samsung SDI",
            "style": "",
            "ongoing": false
          }
        ]
      }
    ]
  },
  {
    "badge": "2017–2019",
    "badgeStyle": "background:var(--blue-dark);",
    "title": "Major Multi-Year Projects",
    "cards": [
      {
        "num": "09",
        "client": "Keafer (M) Sdn Bhd",
        "value": "RM 10,748,280",
        "valueStyle": "color:#fbbf24;",
        "ongoing": false,
        "highlight": true,
        "mega": false,
        "megaBadge": "",
        "title": "RAPID — Manpower Supply",
        "scope": "Full manpower supply for RAPID project — one of Malaysia's largest petrochemical developments",
        "tags": [
          {
            "label": "Manpower",
            "style": "",
            "ongoing": false
          },
          {
            "label": "RAPID",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Pengerang",
            "style": "",
            "ongoing": false
          }
        ]
      },
      {
        "num": "10",
        "client": "PS Peru Vision Sdn Bhd",
        "value": "RM 4,350,000",
        "valueStyle": "color:#fbbf24;",
        "ongoing": false,
        "highlight": true,
        "mega": false,
        "megaBadge": "",
        "title": "Simalanjau Tokoyama Project (Bintulu)",
        "scope": "Erection & dismantling of tubular scaffold — large-scale industrial project in Sarawak",
        "tags": [
          {
            "label": "Scaffolding",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Bintulu",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Sarawak",
            "style": "",
            "ongoing": false
          }
        ]
      },
      {
        "num": "11",
        "client": "West Gate Petroleum Sdn Bhd",
        "value": "RM 7,550,000",
        "valueStyle": "color:#fbbf24;",
        "ongoing": false,
        "highlight": true,
        "mega": false,
        "megaBadge": "",
        "title": "TGAST Project (Terengganu)",
        "scope": "Fabrication & installation of 75,000 dia pipes + skilled manpower supply (2018–2019)",
        "tags": [
          {
            "label": "Fabrication",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Pipeline",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Terengganu",
            "style": "",
            "ongoing": false
          }
        ]
      },
      {
        "num": "12",
        "client": "SINOPEC Engineering Group",
        "value": "RM 3,850,000",
        "valueStyle": "color:#fbbf24;",
        "ongoing": false,
        "highlight": true,
        "mega": false,
        "megaBadge": "",
        "title": "Tanjung Bin 4 Coal Project (Johor)",
        "scope": "Fabrication & installation of 35,000 dia pipes + manpower supply (2018–2019)",
        "tags": [
          {
            "label": "Fabrication",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Power Plant",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Johor",
            "style": "",
            "ongoing": false
          }
        ]
      },
      {
        "num": "13–17",
        "client": "PETROFAC / Gabungan / FONCO",
        "value": "RM 12.6M+ (combined)",
        "valueStyle": "",
        "ongoing": false,
        "highlight": false,
        "mega": false,
        "megaBadge": "",
        "title": "RAPID — Multiple Contracts",
        "scope": "Manpower supply · Painting & piping punch list · Grating modification & installation for multiple contractors at RAPID Pengerang",
        "tags": [
          {
            "label": "Manpower",
            "style": "",
            "ongoing": false
          },
          {
            "label": "RAPID",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Multi-Contract",
            "style": "",
            "ongoing": false
          }
        ]
      }
    ]
  },
  {
    "badge": "2018",
    "badgeStyle": "",
    "title": "2018 Projects",
    "cards": [
      {
        "num": "01",
        "client": "CABOT (M) Sdn Bhd",
        "value": "RM 850,000",
        "valueStyle": "",
        "ongoing": false,
        "highlight": false,
        "mega": false,
        "megaBadge": "",
        "title": "EMSB — EMAX TIC Project Kerteh",
        "scope": "Fabrication & installation for 2,000t structure; fabrication & installation for 2,000 dia pipe",
        "tags": [
          {
            "label": "Fabrication",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Installation",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Kerteh",
            "style": "",
            "ongoing": false
          }
        ]
      },
      {
        "num": "02",
        "client": "BOVIS (M) Sdn Bhd",
        "value": "RM 150,000",
        "valueStyle": "",
        "ongoing": false,
        "highlight": false,
        "mega": false,
        "megaBadge": "",
        "title": "B. Braun Extension Project (Penang)",
        "scope": "Provide 30 manpower for scaffolding and insulation works",
        "tags": [
          {
            "label": "Manpower",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Scaffolding",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Penang",
            "style": "",
            "ongoing": false
          }
        ]
      },
      {
        "num": "03",
        "client": "B. Braun (M) Sdn Bhd",
        "value": "RM 30,000",
        "valueStyle": "",
        "ongoing": false,
        "highlight": false,
        "mega": false,
        "megaBadge": "",
        "title": "Cabot Shutdown 2011",
        "scope": "Remove and reinstall insulation at MUF Roof (PD2 area)",
        "tags": [
          {
            "label": "Insulation",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Maintenance",
            "style": "",
            "ongoing": false
          }
        ]
      },
      {
        "num": "04",
        "client": "TOYO-M Engineering",
        "value": "RM 250,000",
        "valueStyle": "",
        "ongoing": false,
        "highlight": false,
        "mega": false,
        "megaBadge": "",
        "title": "Mega Project at Meru Setia Alam",
        "scope": "Provide manpower for scaffolding erection & dismantling",
        "tags": [
          {
            "label": "Scaffolding",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Manpower",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Selangor",
            "style": "",
            "ongoing": false
          }
        ]
      },
      {
        "num": "05",
        "client": "Jehantech Sdn Bhd",
        "value": "RM 650,000",
        "valueStyle": "",
        "ongoing": false,
        "highlight": false,
        "mega": false,
        "megaBadge": "",
        "title": "Tanjung Bin 3×700W Coal Fired Power Plant",
        "scope": "Fabrication, installation & commissioning for 2,000 dia pipe",
        "tags": [
          {
            "label": "Fabrication",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Power Plant",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Johor",
            "style": "",
            "ongoing": false
          }
        ]
      },
      {
        "num": "06",
        "client": "Rekayasa Industri Malaysia",
        "value": "RM 198,000",
        "valueStyle": "",
        "ongoing": false,
        "highlight": false,
        "mega": false,
        "megaBadge": "",
        "title": "Scaffold Work at Proton City, Tanjung Malim",
        "scope": "Scaffolding for sports area, admin office, showroom, galleries & car park",
        "tags": [
          {
            "label": "Scaffolding",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Perak",
            "style": "",
            "ongoing": false
          }
        ]
      },
      {
        "num": "07",
        "client": "Pembinaan Pureon Sdn Bhd",
        "value": "RM 1,150,000",
        "valueStyle": "color:#fbbf24;",
        "ongoing": false,
        "highlight": true,
        "mega": false,
        "megaBadge": "",
        "title": "Manipal Dental Clinic (Ayer Keroh, Melaka)",
        "scope": "Scaffolding for 10-storey clinic & dental college",
        "tags": [
          {
            "label": "Scaffolding",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Melaka",
            "style": "",
            "ongoing": false
          },
          {
            "label": "High-Rise",
            "style": "",
            "ongoing": false
          }
        ]
      },
      {
        "num": "08",
        "client": "TPSC Engineering (M) Sdn Bhd",
        "value": "RM 74,000",
        "valueStyle": "",
        "ongoing": false,
        "highlight": false,
        "mega": false,
        "megaBadge": "",
        "title": "NPK Fertilizer Plant (Gurun)",
        "scope": "Fabrication & installation of 1,000t structure, 200t equipment & 5,000 dia pipeline",
        "tags": [
          {
            "label": "Fabrication",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Pipeline",
            "style": "",
            "ongoing": false
          },
          {
            "label": "Kedah",
            "style": "",
            "ongoing": false
          }
        ]
      }
    ]
  }
];
