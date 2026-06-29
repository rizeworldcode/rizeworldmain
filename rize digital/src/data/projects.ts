export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  images: string[];
  fallback: string;
  desc: string;
}

export const PROJECTS: Project[] = [
  {
    id: "7one",
    title: "7one",
    category: "Fragrances & Perfumes",
    image: "/1920X1000/7one/7one.jpg",
    images: [
      "/1920X1000/7one/7one.jpg",
      "/1920X1000/7one/7 one (1).png",
      "/1920X1000/7one/7 oneee.jpg",
      "/1920X1000/7one/7oneee.jpg"
    ],
    fallback: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800",
    desc: "Premium fragrance brand identity crafted for 7one — featuring luxury Eau de Parfum collections for men & women including White Lion, Ocean Drift and Roxx Eagle."
  },
  {
    id: "avantika",
    title: "Avantika",
    category: "Fine Dine Restaurant",
    image: "/1920X1000/avantika/AVANTIKA.jpg",
    images: [
      "/1920X1000/avantika/AVANTIKA.jpg",
      "/1920X1000/avantika/Avantika p2.jpg",
      "/1920X1000/avantika/avantika p.jpg",
      "/1920X1000/avantika/avantikaa.jpg"
    ],
    fallback: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800",
    desc: "Visual brand identity and digital marketing design for Avantika Fine Dine — showcasing vibrant food photography, menu aesthetics and a rich multi-cuisine dining experience."
  },
  {
    id: "b-infra",
    title: "Bhavik Infrastructure",
    category: "Residential Projects",
    image: "/1920X1000/b infra/infra.jpg",
    images: [
      "/1920X1000/b infra/infra.jpg",
      "/1920X1000/b infra/b infra p.jpg",
      "/1920X1000/b infra/bi.jpg",
      "/1920X1000/b infra/infra 2.jpg"
    ],
    fallback: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    desc: "Premium real estate branding and digital presentation for Bhavik Infrastructure — Your Dream Property, Our Trusted Service. Luxury villa and residential project marketing."
  },
  {
    id: "daily-prints",
    title: "Daily Prints",
    category: "Uniform Supply",
    image: "/1920X1000/daily prints/DAILY PRINTS.jpg",
    images: [
      "/1920X1000/daily prints/DAILY PRINTS.jpg",
      "/1920X1000/daily prints/DAILY PRINTS 2.jpg",
      "/1920X1000/daily prints/dppp 1920x100.jpg",
      "/1920X1000/daily prints/dppp2.jpg"
    ],
    fallback: "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?auto=format&fit=crop&q=80&w=800",
    desc: "Bold hospitality uniform branding for Daily Prints — Uniforms that stand out. Showcasing professional staff apparel for hotels, restaurants and corporate establishments."
  },
  {
    id: "mansukh",
    title: "Mansukh Restaurant",
    category: "Dining Experience",
    image: "/1920X1000/mansukh/MANSUKH.jpg",
    images: [
      "/1920X1000/mansukh/MANSUKH.jpg",
      "/1920X1000/mansukh/avantika p3.jpg",
      "/1920X1000/mansukh/avantikap4.jpg",
      "/1920X1000/mansukh/mansukh p.jpg"
    ],
    fallback: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800",
    desc: "The Elegant Dining Experience — Savor Every Moment. Premium visual storytelling, social media campaign and brand identity for Mansukh Restaurant."
  },
  {
    id: "old-rao",
    title: "Old Rao Hotel",
    category: "Dining & Cuisine",
    image: "/1920X1000/old rao/old rao.jpg",
    images: [
      "/1920X1000/old rao/old rao.jpg",
      "/1920X1000/old rao/old p 2.jpg",
      "/1920X1000/old rao/old p.jpg",
      "/1920X1000/old rao/old rao 1920x1000.jpg"
    ],
    fallback: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800",
    desc: "Turning Taste Into a Brand Experience — Complete rebranding and digital marketing strategy for Old Rao Hotel, celebrating authentic Indian cuisine with rich visual storytelling."
  },
  {
    id: "shiv-nutrition",
    title: "Shiv Nutrition",
    category: "Sports & Performance Nutrition",
    image: "/1920X1000/shiv nutrition/shiv (1).jpg",
    images: [
      "/1920X1000/shiv nutrition/shiv (1).jpg",
      "/1920X1000/shiv nutrition/Shiv p 2.jpg",
      "/1920X1000/shiv nutrition/Shiv p 3.jpg",
      "/1920X1000/shiv nutrition/shiv p4.jpg"
    ],
    fallback: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800",
    desc: "High-energy sports nutrition brand design for Shiv Nutrition — bold visuals, performance-focused branding and supplement marketing for athletes and fitness enthusiasts."
  },
  {
    id: "south-street",
    title: "South Street",
    category: "South Indian Restaurant",
    image: "/1920X1000/south street/Southstreets.jpg",
    images: [
      "/1920X1000/south street/Southstreets.jpg",
      "/1920X1000/south street/SS.jpg",
      "/1920X1000/south street/south p.jpg",
      "/1920X1000/south street/south p2.jpg"
    ],
    fallback: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=800",
    desc: "Authentic South Indian Delights — Eat Healthy, Live Strong. Vibrant digital branding showcasing crispy dosas, soft idlis, biryani and fresh South Indian flavors."
  },
  {
    id: "yoga",
    title: "Sushanti Dhyanyoga",
    category: "Yoga Practices",
    image: "/1920X1000/yoga/yoga.jpg",
    images: [
      "/1920X1000/yoga/yoga.jpg",
      "/1920X1000/yoga/YOGA BANNERR.jpg",
      "/1920X1000/yoga/YOGAAAAA.jpg",
      "/1920X1000/yoga/YOGAaa.jpg"
    ],
    fallback: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
    desc: "Find Your Balance — A Place of Life Transformation. Serene and inspiring digital brand identity for Sushanti Dhyanyoga, a certified yoga wellness studio."
  },
  {
    id: "dwps",
    title: "Delhi World Public School",
    category: "Community & Learning",
    image: "/1920X1000/dwps/school.jpg.jpeg",
    images: [
      "/1920X1000/dwps/school.jpg.jpeg"
    ],
    fallback: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=800",
    desc: "Comprehensive digital branding, educational portal, and admissions platform designed for Delhi World Public School, enhancing student enrollment and online academic experience."
  },
  {
    id: "zoniraz-jewel",
    title: "Zoniraz Jewel",
    category: "Jewellery & Accessories",
    image: "/1920X1000/zoniraj/zoniraj.png",
    images: [
      "/1920X1000/zoniraj/zoniraj.png"
    ],
    fallback: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800",
    desc: "Elegant jewellery brand identity, social media aesthetics, and premium visual design crafted to highlight the luxury and craftsmanship of Zoniraz Jewel."
  },
  {
    id: "autodetox",
    title: "Autodetox",
    category: "Auto Detailing",
    image: "/1920X1000/autodetox/auodetox.png",
    images: [
      "/1920X1000/autodetox/auodetox.png"
    ],
    fallback: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=800",
    desc: "Shine That Turns Head — Premium car care branding for Autodetox, Alwar. Services include Car Wash, Ceramic Coating, Denting & Painting, PPF and Mechanical Work."
  },
  {
    id: "bhavik-dairy",
    title: "Bhavik Dairy",
    category: "Food & Cuisine",
    image: "/1920X1000/bhavik dairy/bhavik dairy.jpeg",
    images: [
      "/1920X1000/bhavik dairy/bhavik dairy.jpeg"
    ],
    fallback: "https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&q=80&w=800",
    desc: "Golden Goodness Naturally — Timeless Purity for a Healthier You. Brand packaging and identity design for Bhavik Dairy's premium pure desi ghee and dairy products."
  },
  {
    id: "golden-gym",
    title: "Golden Fitness Studio",
    category: "Lifestyle & Wellness",
    image: "/1920X1000/golden gym/golden gym.jpeg",
    images: [
      "/1920X1000/golden gym/golden gym.jpeg"
    ],
    fallback: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    desc: "No Excuses. Just Start. — Powerful gym branding and social media design for Golden Fitness Studio. One workout can change your day — inspiring members to push their limits."
  },
  {
    id: "hotel-rj02",
    title: "Hotel RJ-02",
    category: "Hospitality",
    image: "/1920X1000/hotal rj-02/hotel.jpg.jpeg",
    images: [
      "/1920X1000/hotal rj-02/hotel.jpg.jpeg"
    ],
    fallback: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    desc: "Luxury Hotel branding for RJ-02 — Hotel, Restaurant, Banquet & Bar. A unit of Bharti's Enterprise. Premium hospitality visual identity and digital marketing for Alwar locations."
  },
  {
    id: "jain-event",
    title: "Jain Event Planner",
    category: "Banquet & Events",
    image: "/1920X1000/jain event/jain events.jpeg",
    images: [
      "/1920X1000/jain event/jain events.jpeg"
    ],
    fallback: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800",
    desc: "Creating Moments, Serving Happiness — You Celebrate, We Cater! Complete branding for Jain Event Planner & Caterers, Patiala. Covering Weddings, Birthdays, Corporate Events and more."
  },
  {
    id: "kafesa",
    title: "Kafesa by Tija Cafe",
    category: "Ambience & Experience",
    image: "/1920X1000/kafesa/KAFESA.jpg.jpeg",
    images: [
      "/1920X1000/kafesa/KAFESA.jpg.jpeg"
    ],
    fallback: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800",
    desc: "Taste the Real Goodness — Aesthetic cafe branding and social media design for Kafesa by Tija Cafe, capturing artisan brunch culture with waffles, fresh coffee and vibrant presentation."
  },
  {
    id: "mobile-master",
    title: "Mobile Master",
    category: "Electronics & Accessories",
    image: "/1920X1000/mobile master/mobile master.jpeg",
    images: [
      "/1920X1000/mobile master/mobile master.jpeg"
    ],
    fallback: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800",
    desc: "Welcome to Mobile Master — 100% Authentic Products, Best Quality Accessories, Expert Repair Services. Complete retail store branding for mobile accessories and gadgets, Alwar."
  },
  {
    id: "roastro",
    title: "Roastro Coffee House",
    category: "Dining Experience",
    image: "/1920X1000/roastro/roastro.jpeg",
    images: [
      "/1920X1000/roastro/roastro.jpeg"
    ],
    fallback: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800",
    desc: "Special Custom Roast — Coffee House & Café. Premium visual branding for Roastro Coffee House, Alwar, featuring cozy ambience photography, artisan coffee culture and rich interiors."
  },
  {
    id: "sigdi",
    title: "Sigdi Resort",
    category: "Multi-Cuisine Dining",
    image: "/1920X1000/sigdi/sigdi.jpeg",
    images: [
      "/1920X1000/sigdi/sigdi.jpeg"
    ],
    fallback: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800",
    desc: "Pure Veg — A Multi Cuisine Restaurant. Digital marketing and branding for Sigdi Resort featuring a grand buffet spread, festive dining setups and a full resort booking experience."
  },
  {
    id: "hydrowash",
    title: "Hydrowash",
    category: "Auto Detailing",
    image: "/1920X1000/hydrowahs/CAR_WASH.jpg.jpeg",
    images: [
      "/1920X1000/hydrowahs/CAR_WASH.jpg.jpeg"
    ],
    fallback: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=800",
    desc: "Professional Car Wash Service by Hydrowash — offering premium detailing solutions including Car In & Out Wash, Deep Interior Clean, Ceramic Wash and Compounding."
  },

  {
    id: "easy-eyes",
    title: "Easy Eyes",
    category: "Design",
    image: "/1920X1000/easy%20eyes/Easy%20Eye%20.jpg.jpeg",
    images: [
      "/1920X1000/easy%20eyes/Easy%20Eye%20.jpg.jpeg"
    ],
    fallback: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=800",
    desc: "Easy Eyes branding and visual identity."
  },
  {
    id: "ambhuti",
    title: "Ambhuti",
    category: "Art",
    image: "/1920X1000/ambhuti/Ambhuti%20.jpg.jpeg",
    images: [
      "/1920X1000/ambhuti/Ambhuti%20.jpg.jpeg"
    ],
    fallback: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&q=80&w=800",
    desc: "Ambhuti visual branding project."
  }
];
