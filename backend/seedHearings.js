const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const hearingModel = require("./src/models/HR_hearingModel");

const seedJobs = [
  {
    post: "Support Engineer",
    description: "Offer a wide range of services to help businesses establish.",
    salary: "$2,300 - $3,000 monthly",
    vacancy: "07 Person",
    experience: "2-3 Years",
    gender: "both",
    lastDate: new Date("2026-12-02"),
    overview: "As a Support Engineer at RizeWorld, you will play a pivotal role in maintaining system integrity, resolving technical customer inquiries, and collaborating with developers to ensure maximum user satisfaction.",
    keyResponsibilities: [
      "Help establish and implement custom solutions for client portal issues.",
      "Monitor, identify, and troubleshoot technical bugs and server queries.",
      "Collaborate with developers and design teams to prevent recursive errors.",
      "Ensure rapid turnaround and resolution times for urgent technical requests.",
      "Deliver precise documentation and user guides for complex setups."
    ],
    qulification: [
      "Graduate in Computer Science or Information Technology from a reputed university.",
      "Familiarity with modern web infrastructures, API routing, and cloud tools.",
      "Strong analytical mindset and client-first communication skills."
    ],
    whatWeOffer: [
      "Opportunities for professional growth and skill development.",
      "A dynamic and collaborative work environment where ingenuity is valued.",
      "Competitive salary and health benefits package.",
      "Annual international tour benefits."
    ],
    status: "active"
  },
  {
    post: "Junior WordPress Developer",
    description: "Develop and scale business-oriented content systems.",
    salary: "$2,300 - $3,000 monthly",
    vacancy: "07 Person",
    experience: "2-3 Years",
    gender: "both",
    lastDate: new Date("2026-12-02"),
    overview: "As a Junior WordPress Developer, you will play a key role in designing custom themes, optimizing site performance, and maintaining corporate blogs and databases.",
    keyResponsibilities: [
      "Write clean, responsive layouts and manage WordPress site migrations.",
      "Optimize databases, plugins, and page loading speeds.",
      "Work alongside graphic designers to translate UI/UX wireframes into functional pages.",
      "Conduct quality testing and resolve browser compatibility challenges.",
      "Deploy custom post types, fields, and taxonomies."
    ],
    qulification: [
      "Graduate in Software Engineering or equivalent field.",
      "Solid understanding of PHP, HTML5, CSS3, JS, and theme building.",
      "Experience working with REST API configurations."
    ],
    whatWeOffer: [
      "Opportunities for professional growth and skill development.",
      "A dynamic and collaborative work environment where ingenuity is valued.",
      "Competitive salary and health benefits package.",
      "Annual international tour benefits."
    ],
    status: "active"
  },
  {
    post: "Senior Digital Marketer",
    description: "Spearhead visual branding and market outreach.",
    salary: "$2,300 - $3,000 monthly",
    vacancy: "07 Person",
    experience: "2-3 Years",
    gender: "both",
    lastDate: new Date("2026-12-02"),
    overview: "As a Senior Digital Marketer at RizeWorld, you will play a pivotal role in creating and executing comprehensive digital marketing strategies for our diverse range of clients. You will be part of a collaborative team where creativity, data-driven insights, and strategic thinking converge to drive impactful results.",
    keyResponsibilities: [
      "Develop and implement end-to-end digital marketing campaigns, encompassing SEO, SEM, social media, email, and more.",
      "Analyze client objectives and industry trends to formulate effective and measurable digital strategies.",
      "Create compelling and engaging content across various digital platforms to enhance brand visibility and engagement.",
      "Collaborate with cross-functional teams, including designers and developers, to ensure seamless execution of campaigns.",
      "Monitor and analyze campaign performance, providing insightful reports and recommendations for optimization.",
      "Stay abreast of industry trends, emerging technologies, and digital marketing best practices."
    ],
    qulification: [
      "Preferably Business Graduate from a reputed public/private university.",
      "Proven digital marketing campaign success and Google Ad certifications.",
      "Experience with analytic tools (GA4, SEMRush, Hotjar)."
    ],
    whatWeOffer: [
      "Opportunities for professional growth and development.",
      "A dynamic and collaborative work environment where creativity is valued.",
      "Competitive salary and benefits package.",
      "International tour benefits."
    ],
    status: "active"
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.Mongo_URI);
    console.log("Database connected for seeding...");
    
    // Clear existing
    await hearingModel.deleteMany({});
    console.log("Cleaned existing hearings.");
    
    // Insert
    const inserted = await hearingModel.insertMany(seedJobs);
    console.log(`Successfully seeded ${inserted.length} hearings!`);
    
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
