export interface Job {
  id: string;
  title: string;
  subtitle: string;
  salary: string;
  vacancy: string;
  experience: string;
  education: string;
  gender: string;
  deadline: string;
  location: string;
  overview: string;
  responsibilities: string[];
  qualifications: string[];
  offers: string[];
}

export const JOBS: Job[] = [
  {
    id: "support-engineer",
    title: "Support Engineer",
    subtitle: "Offer a wide range of services to help businesses establish.",
    salary: "$2,300 - $3,000 monthly",
    vacancy: "07 Person",
    experience: "2-3 Years",
    education: "Bachelor Completed",
    gender: "Male/Female",
    deadline: "02/12/2026",
    location: "C-198, near Telco Circle, UIT colony, Shalimar Nagar, Alwar, Rajasthan 301001",
    overview: "As a Support Engineer at RizeWorld, you will play a pivotal role in maintaining system integrity, resolving technical customer inquiries, and collaborating with developers to ensure maximum user satisfaction.",
    responsibilities: [
      "Help establish and implement custom solutions for client portal issues.",
      "Monitor, identify, and troubleshoot technical bugs and server queries.",
      "Collaborate with developers and design teams to prevent recursive errors.",
      "Ensure rapid turnaround and resolution times for urgent technical requests.",
      "Deliver precise documentation and user guides for complex setups."
    ],
    qualifications: [
      "Graduate in Computer Science or Information Technology from a reputed university.",
      "Familiarity with modern web infrastructures, API routing, and cloud tools.",
      "Strong analytical mindset and client-first communication skills."
    ],
    offers: [
      "Opportunities for professional growth and skill development.",
      "A dynamic and collaborative work environment where ingenuity is valued.",
      "Competitive salary and health benefits package.",
      "Annual international tour benefits."
    ]
  },
  {
    id: "jr-wp-developer",
    title: "Junior WordPress Developer",
    subtitle: "Develop and scale business-oriented content systems.",
    salary: "$2,300 - $3,000 monthly",
    vacancy: "07 Person",
    experience: "2-3 Years",
    education: "Bachelor Completed",
    gender: "Male/Female",
    deadline: "02/12/2026",
    location: "Remote / Hybrid",
    overview: "As a Junior WordPress Developer, you will play a key role in designing custom themes, optimizing site performance, and maintaining corporate blogs and databases.",
    responsibilities: [
      "Write clean, responsive layouts and manage WordPress site migrations.",
      "Optimize databases, plugins, and page loading speeds.",
      "Work alongside graphic designers to translate UI/UX wireframes into functional pages.",
      "Conduct quality testing and resolve browser compatibility challenges.",
      "Deploy custom post types, fields, and taxonomies."
    ],
    qualifications: [
      "Graduate in Software Engineering or equivalent field.",
      "Solid understanding of PHP, HTML5, CSS3, JS, and theme building.",
      "Experience working with REST API configurations."
    ],
    offers: [
      "Opportunities for professional growth and skill development.",
      "A dynamic and collaborative work environment where ingenuity is valued.",
      "Competitive salary and health benefits package.",
      "Annual international tour benefits."
    ]
  },
  {
    id: "sr-digital-marketer",
    title: "Senior Digital Marketer",
    subtitle: "Spearhead visual branding and market outreach.",
    salary: "$2,300 - $3,000 monthly",
    vacancy: "07 Person",
    experience: "2-3 Years",
    education: "Bachelor Completed",
    gender: "Male/Female",
    deadline: "02/12/2026",
    location: "C-198, near Telco Circle, UIT colony, Shalimar Nagar, Alwar, Rajasthan 301001",
    overview: "As a Senior Digital Marketer at RizeWorld, you will play a pivotal role in creating and executing comprehensive digital marketing strategies for our diverse range of clients. You will be part of a collaborative team where creativity, data-driven insights, and strategic thinking converge to drive impactful results.",
    responsibilities: [
      "Develop and implement end-to-end digital marketing campaigns, encompassing SEO, SEM, social media, email, and more.",
      "Analyze client objectives and industry trends to formulate effective and measurable digital strategies.",
      "Create compelling and engaging content across various digital platforms to enhance brand visibility and engagement.",
      "Collaborate with cross-functional teams, including designers and developers, to ensure seamless execution of campaigns.",
      "Monitor and analyze campaign performance, providing insightful reports and recommendations for optimization.",
      "Stay abreast of industry trends, emerging technologies, and digital marketing best practices."
    ],
    qualifications: [
      "Preferably Business Graduate from a reputed public/private university.",
      "Proven digital marketing campaign success and Google Ad certifications.",
      "Experience with analytic tools (GA4, SEMRush, Hotjar)."
    ],
    offers: [
      "Opportunities for professional growth and development.",
      "A dynamic and collaborative work environment where creativity is valued.",
      "Competitive salary and benefits package.",
      "International tour benefits."
    ]
  }
];
