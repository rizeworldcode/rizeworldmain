export interface StateCustomContent {
  eyebrow?: string;
  heroHeadline?: string;
  heroDescription?: string;
  presenceSubtitle?: string;
  cityDescriptions?: Record<string, string>;
  marketFit?: {
    headline: string;
    paragraphs: string[];
  };
  whyChoose?: {
    headline: string;
    description?: string;
    points?: { title: string; desc: string }[];
    bullets?: string[];
    closingText?: string;
  };
  approach?: {
    headline: string;
    steps: { number: string; title: string; desc: string }[];
  };
  whoWeWorkWith?: {
    headline: string;
    items: string[];
  };
  expansionSection?: {
    headline: string;
    paragraphs: string[];
    ctaText?: string;
    ctaButton?: string;
    ctaLink?: string;
  };
  faqs?: { question: string; answer: string }[];
  cta?: {
    headline: string;
    text: string;
    buttonText: string;
  };
}

export const STATE_CUSTOM_CONTENT: Record<string, StateCustomContent> = {
  "delhi-ncr": {
    eyebrow: "Delhi NCR",
    heroHeadline: "DIGITAL MARKETING IN DELHI NCR",
    heroDescription: "RizeWorld helps businesses across Delhi NCR build a stronger online presence through SEO, paid advertising, social media, content, and performance-focused web solutions. Our strategies are tailored to local markets, customer behavior, and business goals.",
    cityDescriptions: {
      "delhi": "Digital marketing strategies for businesses targeting customers across the capital.",
      "noida": "SEO, paid campaigns, web development, and social media solutions for growing brands.",
      "gurgaon": "Performance-driven digital marketing for startups, companies, and established businesses.",
      "faridabad": "Local SEO and online marketing solutions designed to improve visibility and lead generation.",
      "ghaziabad": "Customized digital strategies that help local businesses reach and convert nearby customers."
    },
    marketFit: {
      headline: "Digital Marketing That Fits the Delhi NCR Market",
      paragraphs: [
        "Delhi NCR is home to businesses ranging from local stores and professional services to startups, eCommerce brands, and established companies. Reaching the right audience here requires more than simply being visible online.",
        "At RizeWorld, we combine SEO, PPC, social media marketing, content, and website development to create a digital strategy around your business. We focus on bringing relevant visitors to your website, improving engagement, and turning online visibility into meaningful enquiries and sales.",
        "Whether you operate from Delhi, Noida, Gurgaon, Faridabad, or Ghaziabad, our team can build a strategy based on your target audience and market."
      ]
    },
    whyChoose: {
      headline: "Why Choose RizeWorld in Delhi NCR?",
      points: [
        {
          title: "Local Understanding, Wider Experience",
          desc: "Every business has a different audience. A local service provider in Delhi may need a very different approach from a technology company targeting customers across NCR. We look at your business, competitors, audience, location, and goals before deciding which channels deserve your attention."
        },
        {
          title: "One Team for Multiple Digital Needs",
          desc: "Instead of managing SEO, advertising, social media, and web development separately, you can bring these activities under one digital marketing team."
        },
        {
          title: "Focus on Business Outcomes",
          desc: "Traffic is useful, but it is not the only goal. Our strategies focus on metrics that matter to the business, including relevant traffic, enquiries, conversions, and overall online growth."
        }
      ]
    },
    approach: {
      headline: "Our Approach",
      steps: [
        {
          number: "01",
          title: "Understand",
          desc: "We first understand your business, audience, competitors, and current online presence."
        },
        {
          number: "02",
          title: "Plan",
          desc: "We identify the right channels, keywords, content opportunities, and campaign priorities."
        },
        {
          number: "03",
          title: "Execute",
          desc: "Our team works on SEO, content, advertising, social media, or web development based on the agreed strategy."
        },
        {
          number: "04",
          title: "Measure & Improve",
          desc: "Performance is monitored regularly so we can identify what is working and where improvements are needed."
        }
      ]
    },
    whoWeWorkWith: {
      headline: "Who We Work With",
      items: [
        "Local businesses",
        "Startups",
        "eCommerce brands",
        "Professional service providers",
        "Real estate businesses",
        "Healthcare businesses",
        "Education companies",
        "B2B companies",
        "Technology companies",
        "Established brands"
      ]
    },
    faqs: [
      {
        question: "What digital marketing services does RizeWorld offer in Delhi NCR?",
        answer: "RizeWorld offers SEO, local SEO, Google Ads and PPC management, social media marketing, content marketing, website development, and other digital marketing solutions based on business requirements."
      },
      {
        question: "Can you help a local business in Delhi get more customers online?",
        answer: "Yes. We can create a local-focused strategy using SEO, Google Business Profile optimization, location-based content, paid advertising, and other relevant channels."
      },
      {
        question: "Do you provide digital marketing services in Noida and Gurgaon?",
        answer: "Yes. Our Delhi NCR services cover Delhi, Noida, Gurgaon, Faridabad, and Ghaziabad, with strategies adjusted according to the target market and business."
      },
      {
        question: "How long does SEO take to show results?",
        answer: "SEO is a long-term process, and the timeline depends on factors such as competition, website condition, industry, keywords, and the work being carried out. Consistent optimization and quality content generally produce stronger results over time."
      },
      {
        question: "Is PPC suitable for businesses in Delhi NCR?",
        answer: "PPC can be useful when you want to reach potential customers quickly. Campaigns can be targeted by location, keywords, audience, device, and other factors to make the advertising budget more focused."
      },
      {
        question: "Do you create websites along with digital marketing?",
        answer: "Yes. RizeWorld provides website development and can align the website structure, content, user experience, and SEO requirements with the overall marketing strategy."
      }
    ],
    cta: {
      headline: "Ready to Grow Your Business Online?",
      text: "Your customers are already searching, comparing, and making decisions online. The right digital strategy can help your business become easier to find and easier to trust. Talk to RizeWorld about your digital marketing goals in Delhi NCR.",
      buttonText: "Talk to RizeWorld"
    }
  },
  "rajasthan": {
    eyebrow: "Digital Marketing in Rajasthan",
    heroHeadline: "Digital Marketing in Rajasthan",
    heroDescription: "RizeWorld helps businesses across Rajasthan build a stronger online presence through practical digital marketing strategies, SEO, paid advertising, social media, content, and website development. Our approach is focused on understanding the local market, reaching the right audience, and turning online visibility into meaningful business growth. Whether you run a local business in Jaipur, a growing brand in Udaipur, an eCommerce store in Kota, or a service-based business in Jodhpur or Alwar, we create digital strategies around your goals rather than using the same approach for every business.",
    presenceSubtitle: "We work with businesses across key cities in Rajasthan, helping them improve their search visibility, attract relevant customers, and build a consistent digital presence.",
    cityDescriptions: {
      "jaipur": "RizeWorld provides digital marketing and SEO solutions for businesses in Jaipur. From local SEO and Google visibility to social media and paid campaigns, we help brands reach customers searching for their products and services.",
      "udaipur": "For businesses in Udaipur, we combine SEO, content, social media, and website strategies to build long-term online visibility and generate relevant enquiries.",
      "kota": "Our digital marketing solutions for Kota businesses are designed around audience research, search intent, and measurable growth. We help local businesses compete online and connect with potential customers.",
      "jodhpur": "RizeWorld helps Jodhpur businesses improve their online presence with SEO, website development, paid advertising, and social media marketing tailored to their market.",
      "alwar": "We help businesses in Alwar strengthen their local search presence and attract customers through SEO, digital advertising, content, and conversion-focused websites."
    },
    whyChoose: {
      headline: "Why Choose RizeWorld in Rajasthan?",
      description: "Every city and every business has a different audience. Instead of relying on a fixed marketing formula, we look at your industry, competitors, customers, and current online presence before planning the work.",
      bullets: [
        "Strategies built around your business goals",
        "SEO that targets relevant search terms",
        "Local visibility for location-based businesses",
        "Content written for real users, not just search engines",
        "Performance-focused advertising",
        "Websites designed with usability and conversions in mind",
        "Regular tracking and optimization"
      ]
    },
    expansionSection: {
      headline: "Grow Your Business Beyond Your Local Market",
      paragraphs: [
        "Having a strong local presence is a good starting point, but your digital presence can reach customers far beyond one city. RizeWorld helps Rajasthan businesses build a foundation that can support growth across India and international markets as well.",
        "Whether your goal is more local enquiries, better Google rankings, online sales, or stronger brand awareness, we can build a strategy around where your business is today and where you want it to go."
      ],
      ctaText: "Ready to grow your business online?",
      ctaButton: "Let's Talk →",
      ctaLink: "/contact"
    },
    faqs: [
      {
        question: "What does a digital marketing agency in Rajasthan do?",
        answer: "A digital marketing agency helps businesses attract customers through online channels such as search engines, social media, paid advertising, content, and websites. The exact strategy depends on the business and its target audience."
      },
      {
        question: "Can RizeWorld help with local SEO in Rajasthan?",
        answer: "Yes. We can help businesses improve their local search presence through location-focused SEO, business profile optimization, relevant content, and other local search activities."
      },
      {
        question: "Which Rajasthan cities does RizeWorld serve?",
        answer: "RizeWorld currently has dedicated location pages for Jaipur, Udaipur, Kota, Jodhpur, and Alwar. We can also work with businesses outside these cities depending on their requirements."
      },
      {
        question: "How long does SEO take to show results?",
        answer: "SEO is a long-term process, and results depend on factors such as competition, website condition, industry, keywords, and the amount of work involved. Some improvements can happen relatively quickly, while stronger organic growth usually takes consistent effort over time."
      },
      {
        question: "Do you provide Google Ads and paid advertising?",
        answer: "Yes. We provide paid advertising solutions designed to help businesses reach relevant audiences, generate enquiries, increase website traffic, and support sales."
      },
      {
        question: "Can you manage social media along with SEO?",
        answer: "Yes. SEO and social media can be managed together as part of a broader digital marketing strategy. This helps maintain a consistent brand presence across different online channels."
      }
    ]
  },
  "maharashtra": {
    eyebrow: "Digital Marketing in Maharashtra",
    heroHeadline: "Digital Marketing in Maharashtra",
    heroDescription: "RizeWorld helps businesses across Maharashtra build a stronger digital presence through SEO, paid advertising, social media marketing, content, and website development. We combine practical strategies with a clear understanding of the audience and competition in each market we serve. From established businesses in Mumbai and Pune to growing brands in Nagpur, Thane, and Navi Mumbai, our approach is built around business goals rather than a one-size-fits-all marketing formula.",
    presenceSubtitle: "We work with businesses across key Maharashtra markets, helping them improve search visibility, connect with relevant audiences, and create digital experiences that support long-term growth.",
    cityDescriptions: {
      "mumbai": "Mumbai is a highly competitive market where businesses need a clear and consistent online presence. Our SEO, PPC, social media, and website solutions help brands reach relevant customers and compete more effectively online.",
      "pune": "We help Pune businesses build visibility through search optimization, content, paid campaigns, social media, and conversion-focused websites tailored to their goals.",
      "nagpur": "For businesses in Nagpur, we create practical digital strategies focused on improving local visibility, attracting relevant traffic, and generating meaningful enquiries.",
      "thane": "RizeWorld helps businesses in Thane strengthen their online presence through SEO, local search optimization, paid advertising, social media, and web development.",
      "navi-mumbai": "We help Navi Mumbai businesses connect with their target audience through a combination of search, content, advertising, social media, and user-focused web solutions."
    },
    whyChoose: {
      headline: "Why RizeWorld?",
      description: "Maharashtra has a diverse business landscape, and the approach that works for one market may not work exactly the same way in another. We consider your industry, audience, competition, location, and business goals before deciding where your marketing efforts should focus. Our approach combines:",
      bullets: [
        "Search visibility and SEO",
        "Local market targeting",
        "Performance advertising",
        "Social media",
        "Content strategy",
        "Website development",
        "UI/UX and creative design",
        "Ongoing performance improvement"
      ],
      closingText: "The goal isn't simply to bring more visitors to your website. It's to attract relevant people who are more likely to engage with your business."
    },
    expansionSection: {
      headline: "From Local Reach to Wider Growth",
      paragraphs: [
        "Your business may start by targeting customers in Mumbai, Pune, Nagpur, Thane, or Navi Mumbai, but a strong digital foundation can help you expand beyond your immediate market.",
        "RizeWorld helps businesses build strategies that can evolve as their goals change—from improving local visibility today to reaching customers across Maharashtra, India, or international markets tomorrow."
      ]
    },
    cta: {
      headline: "Ready to Grow Your Business?",
      text: "Whether you're building your presence in one Maharashtra city or preparing to reach a wider audience, RizeWorld can help you create a digital strategy around your next stage of growth.",
      buttonText: "Talk to RizeWorld"
    },
    faqs: [
      {
        question: "What digital marketing services does RizeWorld provide in Maharashtra?",
        answer: "RizeWorld provides SEO, local SEO, Google Ads and PPC, social media marketing, content marketing, website development, UI/UX design, and other digital solutions based on business requirements."
      },
      {
        question: "Which cities in Maharashtra does RizeWorld serve?",
        answer: "RizeWorld currently has dedicated location pages for Mumbai, Pune, Nagpur, Thane, and Navi Mumbai."
      },
      {
        question: "Can you help my business improve its local visibility?",
        answer: "Yes. Local SEO and location-focused digital strategies can help businesses become more visible to customers searching for relevant products or services in their target areas."
      },
      {
        question: "Do you provide SEO services in Mumbai and Pune?",
        answer: "Yes. SEO strategies can be tailored for businesses in Mumbai, Pune, and other markets depending on their industry, competition, audience, and objectives."
      },
      {
        question: "Can you run Google Ads for businesses in Maharashtra?",
        answer: "Yes. PPC campaigns can be targeted according to location, keywords, audience, budget, and conversion goals."
      },
      {
        question: "Do you provide social media marketing along with SEO?",
        answer: "Yes. Social media can be combined with SEO, content, paid advertising, and other channels to create a more consistent digital marketing strategy."
      }
    ]
  },
  "karnataka": {
    eyebrow: "Digital Marketing in Karnataka",
    heroHeadline: "Digital Marketing in Karnataka",
    heroDescription: "RizeWorld helps businesses across Karnataka strengthen their online presence through SEO, paid advertising, social media marketing, content, and website development. Our strategies are built around the needs of each business, its audience, competition, and local market. Whether you are a growing business in Bangalore or a local brand in Mysore, we focus on improving visibility, attracting relevant traffic, and turning online activity into meaningful business opportunities.",
    presenceSubtitle: "We work with businesses across key Karnataka markets, helping them improve search visibility, connect with relevant audiences, and create digital experiences that support long-term growth.",
    cityDescriptions: {
      "bangalore": "Bangalore is a competitive market with businesses across technology, startups, professional services, ecommerce, healthcare, education, and more. RizeWorld helps businesses improve their search visibility and reach the right customers through SEO, Google Ads, social media, content, and website solutions.",
      "mysore": "For businesses in Mysore, building a strong local presence can make it easier for potential customers to discover their services online. RizeWorld combines local SEO, content, social media, paid advertising, and user-friendly websites to help businesses attract relevant audiences and generate enquiries."
    },
    marketFit: {
      headline: "A Strategy Built Around Your Market",
      paragraphs: [
        "Karnataka has a diverse business landscape, so the same digital marketing strategy may not work equally well everywhere. A business targeting customers in Bangalore may need a different approach from a local business serving Mysore.",
        "At RizeWorld, we consider your industry, target audience, competition, location, and business objectives before planning campaigns. This helps us focus on the channels that are most relevant to your growth rather than simply doing more marketing."
      ]
    },
    expansionSection: {
      headline: "From Local Visibility to Wider Growth",
      paragraphs: [
        "A strong local presence can be the starting point for bigger opportunities. With the right combination of SEO, content, advertising, social media, and website optimization, businesses can gradually expand beyond their immediate market and reach customers across Karnataka and other regions."
      ]
    },
    whyChoose: {
      headline: "Why Choose RizeWorld?",
      bullets: [
        "Strategies based on your business goals",
        "SEO focused on relevant search intent",
        "Local visibility for location-based businesses",
        "Performance-focused Google Ads campaigns",
        "Content created for both users and search engines",
        "Responsive and conversion-focused websites",
        "Ongoing tracking and optimization"
      ]
    },
    faqs: [
      {
        question: "What does a digital marketing agency in Karnataka do?",
        answer: "A digital marketing agency helps businesses improve their online presence through services such as SEO, paid advertising, social media marketing, content marketing, and website development."
      },
      {
        question: "Which cities in Karnataka does RizeWorld serve?",
        answer: "RizeWorld currently provides digital marketing solutions for businesses in Bangalore and Mysore."
      },
      {
        question: "Do you provide SEO services in Karnataka?",
        answer: "Yes. Our SEO work focuses on improving search visibility, attracting relevant visitors, and supporting long-term organic growth."
      },
      {
        question: "Can you help my business with local SEO?",
        answer: "Yes. Local SEO can help businesses become more visible for searches related to their services and location, particularly when customers are looking for nearby providers."
      },
      {
        question: "Do you provide Google Ads and PPC services?",
        answer: "Yes. We can help businesses plan and manage paid search campaigns based on their target audience, services, budget, and business goals."
      },
      {
        question: "Can you manage social media along with SEO?",
        answer: "Yes. SEO and social media can be managed together as part of a broader digital marketing strategy, helping businesses improve visibility and maintain consistent communication with their audience."
      }
    ],
    cta: {
      headline: "Ready to Grow Your Business in Karnataka?",
      text: "Whether you're targeting customers in Bangalore, Mysore, or across Karnataka, RizeWorld can help you build a practical digital strategy focused on visibility, traffic, leads, and sustainable growth.",
      buttonText: "Talk to RizeWorld"
    }
  },
  "uttar-pradesh": {
    eyebrow: "Digital Marketing in Uttar Pradesh",
    heroHeadline: "Digital Marketing in Uttar Pradesh",
    heroDescription: "RizeWorld helps businesses across Uttar Pradesh strengthen their online presence through SEO, paid advertising, social media marketing, content, and website development. We create practical digital strategies based on the business type, target audience, competition, and local market. From established businesses in Lucknow and Kanpur to growing brands in Prayagraj, our focus is on improving online visibility, reaching relevant customers, and creating opportunities for sustainable growth.",
    presenceSubtitle: "We work with businesses across key Uttar Pradesh markets, helping them improve search visibility, connect with relevant audiences, and create digital experiences that support long-term growth.",
    cityDescriptions: {
      "lucknow": "Lucknow has a diverse business environment covering professional services, education, healthcare, retail, hospitality, and growing local brands. RizeWorld helps businesses improve their digital presence through SEO, local SEO, Google Ads, social media marketing, content, and website solutions.",
      "kanpur": "For businesses in Kanpur, reaching customers online can create new opportunities beyond traditional local marketing. Our strategies combine search optimization, paid advertising, social media, content, and website development to help businesses build visibility and attract relevant enquiries.",
      "prayagraj": "Businesses in Prayagraj can benefit from a digital presence that makes their products and services easier to discover online. RizeWorld works across SEO, local search, paid campaigns, social media, content, and web solutions to create a strategy aligned with the business's goals."
    },
    marketFit: {
      headline: "Digital Strategies for Different Markets",
      paragraphs: [
        "Uttar Pradesh has a wide range of businesses and audiences, so digital marketing needs to be adapted to the market rather than following a fixed formula.",
        "A business targeting customers in Lucknow may have different search behavior and competition from one operating in Kanpur or Prayagraj. RizeWorld considers factors such as industry, location, target audience, competition, and business goals when planning campaigns.",
        "The objective is not simply to increase online activity, but to build a digital presence that supports real business growth."
      ]
    },
    expansionSection: {
      headline: "Turning Online Visibility Into Opportunities",
      paragraphs: [
        "Good digital marketing connects different parts of your online presence. SEO can bring relevant visitors to your website, useful content can answer their questions, paid advertising can reach high-intent audiences, and a well-designed website can make it easier for visitors to enquire or purchase.",
        "RizeWorld brings these channels together to create a more consistent and practical digital marketing approach."
      ]
    },
    whyChoose: {
      headline: "Why Choose RizeWorld?",
      bullets: [
        "Strategies built around your business objectives",
        "SEO focused on relevant search intent",
        "Local SEO for location-based businesses",
        "Performance-focused Google Ads campaigns",
        "Content created for users as well as search engines",
        "Responsive and user-friendly websites",
        "Continuous monitoring and optimization"
      ]
    },
    faqs: [
      {
        question: "What does a digital marketing agency in Uttar Pradesh do?",
        answer: "A digital marketing agency helps businesses improve their online presence through SEO, paid advertising, social media marketing, content marketing, website development, and other digital strategies."
      },
      {
        question: "Which cities in Uttar Pradesh does RizeWorld serve?",
        answer: "RizeWorld currently provides digital marketing solutions in Lucknow, Kanpur, and Prayagraj."
      },
      {
        question: "Do you provide SEO services in Uttar Pradesh?",
        answer: "Yes. Our SEO services focus on improving organic visibility, attracting relevant visitors, and supporting long-term online growth."
      },
      {
        question: "Can you help with local SEO?",
        answer: "Yes. Local SEO can help businesses become more visible for searches related to their services and location, making it easier for nearby customers to find them."
      },
      {
        question: "Do you provide Google Ads and PPC services?",
        answer: "Yes. We can create and manage paid advertising campaigns based on your audience, business objectives, services, and budget."
      },
      {
        question: "Can SEO and social media marketing work together?",
        answer: "Yes. SEO and social media can complement each other by helping businesses build visibility, distribute useful content, and maintain a consistent online presence."
      }
    ],
    cta: {
      headline: "Ready to Grow Your Business in Uttar Pradesh?",
      text: "Whether you're targeting customers in Lucknow, Kanpur, Prayagraj, or other parts of Uttar Pradesh, RizeWorld can help you build a practical digital strategy focused on visibility, relevant traffic, leads, and sustainable growth.",
      buttonText: "Let's Build Your Presence"
    }
  },
  "punjab": {
    eyebrow: "Digital Marketing in Punjab",
    heroHeadline: "Digital Marketing in Punjab",
    heroDescription: "RizeWorld helps businesses across Punjab build a stronger online presence through SEO, paid advertising, social media marketing, content, and website development. Our digital strategies are shaped around the business, its target audience, competition, and the market it operates in. From growing businesses in Mohali and Chandigarh to established brands in Ludhiana, we focus on improving online visibility, attracting relevant customers, and creating digital experiences that support business growth.",
    presenceSubtitle: "We work with businesses across key Punjab markets, helping them improve search visibility, connect with relevant audiences, and create digital experiences that support long-term growth.",
    cityDescriptions: {
      "mohali": "Mohali has a growing business and technology ecosystem, making a strong online presence increasingly important for local brands. RizeWorld helps businesses improve visibility through SEO, local SEO, Google Ads, social media, content marketing, and website solutions.",
      "ludhiana": "Businesses in Ludhiana can use digital channels to reach customers beyond traditional local markets. Our strategies combine SEO, paid advertising, social media, content, and web development to help businesses attract relevant audiences and generate meaningful enquiries.",
      "chandigarh": "Chandigarh has businesses across professional services, education, healthcare, hospitality, retail, and other sectors. RizeWorld creates digital marketing strategies that bring together search visibility, advertising, content, social media, and website optimization to support business goals."
    },
    marketFit: {
      headline: "Digital Marketing That Fits the Punjab Market",
      paragraphs: [
        "Punjab has a diverse business environment, with local businesses, service providers, manufacturers, retailers, professional firms, and growing online brands. Each business may have different customers, competitors, and growth priorities.",
        "RizeWorld considers your industry, target audience, location, competition, and business objectives when developing a digital strategy. Instead of using the same approach for every business, we focus on the channels and activities that are most relevant to your goals."
      ]
    },
    expansionSection: {
      headline: "Building a Stronger Online Presence",
      paragraphs: [
        "Digital marketing works best when different channels support one another. SEO can bring relevant visitors to your website, content can help answer their questions, social media can build awareness, and paid advertising can reach people with stronger purchase intent.",
        "RizeWorld brings these elements together to create a practical strategy focused on visibility, engagement, enquiries, and long-term growth."
      ]
    },
    whyChoose: {
      headline: "Why Choose RizeWorld?",
      bullets: [
        "Strategies built around your business goals",
        "SEO focused on relevant search intent",
        "Local SEO for location-based visibility",
        "Performance-focused Google Ads campaigns",
        "Content created for users and search engines",
        "Responsive and user-friendly websites",
        "Ongoing tracking and campaign optimization"
      ]
    },
    faqs: [
      {
        question: "What does a digital marketing agency in Punjab do?",
        answer: "A digital marketing agency helps businesses improve their online presence through SEO, paid advertising, social media marketing, content marketing, website development, and related digital strategies."
      },
      {
        question: "Which cities in Punjab does RizeWorld serve?",
        answer: "RizeWorld currently provides digital marketing solutions in Mohali, Ludhiana, and Chandigarh."
      },
      {
        question: "Do you provide SEO services in Punjab?",
        answer: "Yes. Our SEO strategies focus on improving search visibility, attracting relevant organic traffic, and supporting sustainable online growth."
      },
      {
        question: "Can you help my business with local SEO?",
        answer: "Yes. Local SEO can help businesses become more visible for location-based searches and connect with customers looking for nearby products or services."
      },
      {
        question: "Do you provide Google Ads and PPC services?",
        answer: "Yes. We can plan and manage Google Ads campaigns based on your target audience, services, competition, budget, and business goals."
      },
      {
        question: "Can social media marketing be combined with SEO?",
        answer: "Yes. SEO and social media can work together as part of a broader digital strategy, helping businesses improve visibility and maintain consistent communication with their audience."
      }
    ],
    cta: {
      headline: "Ready to Grow Your Business in Punjab?",
      text: "Whether you're targeting customers in Mohali, Ludhiana, Chandigarh, or other parts of Punjab, RizeWorld can help you build a practical digital strategy focused on visibility, relevant traffic, leads, and sustainable growth.",
      buttonText: "Talk to RizeWorld"
    }
  },
  "tamil-nadu": {
    eyebrow: "Digital Marketing in Tamil Nadu",
    heroHeadline: "Digital Marketing in Tamil Nadu",
    heroDescription: "RizeWorld helps businesses across Tamil Nadu build a stronger online presence through SEO, paid advertising, social media marketing, content, and website development. Our approach is tailored to the business, its target audience, competition, and the market it serves. From established businesses in Chennai to growing brands in Coimbatore, we focus on improving online visibility, attracting relevant customers, and creating digital strategies that support long-term business growth.",
    presenceSubtitle: "We work with businesses across key Tamil Nadu markets, helping them improve search visibility, connect with relevant audiences, and create digital experiences that support long-term growth.",
    cityDescriptions: {
      "chennai": "Chennai has a diverse business environment spanning technology, healthcare, education, manufacturing, professional services, retail, and more. RizeWorld helps businesses improve their online presence through SEO, local SEO, Google Ads, social media marketing, content, and website solutions.",
      "coimbatore": "Businesses in Coimbatore can use digital channels to reach local customers as well as audiences beyond the city. RizeWorld combines SEO, paid advertising, social media, content, and website development to help businesses improve visibility and create more opportunities online."
    },
    marketFit: {
      headline: "A Digital Strategy Built Around Your Business",
      paragraphs: [
        "Tamil Nadu has a broad mix of industries and business models, so a digital strategy should be based on the individual business rather than a fixed formula.",
        "A company targeting customers in Chennai may have different requirements from a business serving Coimbatore. RizeWorld considers your industry, audience, location, competition, and business objectives when planning campaigns.",
        "Our goal is to focus on the digital channels that are most relevant to your business and help turn online visibility into meaningful opportunities."
      ]
    },
    expansionSection: {
      headline: "Connecting Visibility With Business Growth",
      paragraphs: [
        "Digital marketing is more effective when SEO, content, social media, advertising, and your website work together.",
        "Search optimization can bring relevant visitors, useful content can help them make informed decisions, paid campaigns can reach high-intent audiences, and a well-structured website can make it easier for visitors to enquire or take action.",
        "RizeWorld brings these elements together to create a practical digital marketing approach focused on visibility, engagement, leads, and sustainable growth."
      ]
    },
    whyChoose: {
      headline: "Why Choose RizeWorld?",
      bullets: [
        "Strategies built around your business objectives",
        "SEO focused on relevant search intent",
        "Local SEO for location-based businesses",
        "Performance-focused Google Ads campaigns",
        "Content created for users and search engines",
        "Responsive and user-friendly websites",
        "Ongoing monitoring and optimization"
      ]
    },
    faqs: [
      {
        question: "What does a digital marketing agency in Tamil Nadu do?",
        answer: "A digital marketing agency helps businesses improve their online presence through SEO, paid advertising, social media marketing, content marketing, website development, and other digital strategies."
      },
      {
        question: "Which cities in Tamil Nadu does RizeWorld serve?",
        answer: "RizeWorld currently provides digital marketing solutions in Chennai and Coimbatore."
      },
      {
        question: "Do you provide SEO services in Tamil Nadu?",
        answer: "Yes. Our SEO strategies focus on improving search visibility, attracting relevant organic traffic, and supporting long-term online growth."
      },
      {
        question: "Can you help with local SEO?",
        answer: "Yes. Local SEO can help businesses become more visible for location-based searches and make it easier for nearby customers to discover their services."
      },
      {
        question: "Do you provide Google Ads and PPC services?",
        answer: "Yes. We can plan and manage paid advertising campaigns based on your target audience, services, budget, competition, and business goals."
      },
      {
        question: "Can SEO and social media marketing work together?",
        answer: "Yes. Both channels can support a broader digital marketing strategy by helping businesses improve visibility, distribute useful content, and communicate with their audience."
      }
    ],
    cta: {
      headline: "Ready to Grow Your Business in Tamil Nadu?",
      text: "Whether you're targeting customers in Chennai, Coimbatore, or other parts of Tamil Nadu, RizeWorld can help you build a practical digital strategy focused on visibility, relevant traffic, leads, and sustainable growth.",
      buttonText: "Talk to RizeWorld"
    }
  },
  "madhya-pradesh": {
    eyebrow: "Digital Marketing in Madhya Pradesh",
    heroHeadline: "Digital Marketing in Madhya Pradesh",
    heroDescription: "RizeWorld helps businesses across Madhya Pradesh build a stronger online presence through SEO, paid advertising, social media marketing, content, and website development. Our strategies are designed around each business's audience, competition, location, and growth objectives. From established businesses in Indore to growing brands in Bhopal, we focus on improving online visibility, attracting relevant customers, and creating digital strategies that support sustainable business growth.",
    presenceSubtitle: "We work with businesses across key Madhya Pradesh markets, helping them improve search visibility, connect with relevant audiences, and create digital experiences that support long-term growth.",
    cityDescriptions: {
      "indore": "Indore has a diverse business environment with companies across professional services, retail, education, healthcare, hospitality, technology, and other sectors. RizeWorld helps businesses strengthen their online presence through SEO, local SEO, Google Ads, social media, content marketing, and website solutions.",
      "bhopal": "Businesses in Bhopal can use digital channels to reach local customers and expand their visibility beyond traditional markets. RizeWorld combines SEO, paid advertising, social media, content, and website development to create strategies focused on relevant traffic, enquiries, and business growth."
    },
    marketFit: {
      headline: "Digital Marketing That Fits Your Market",
      paragraphs: [
        "Madhya Pradesh has businesses across many different industries, and their digital marketing requirements can vary significantly. A business targeting customers in Indore may need a different strategy from one serving customers in Bhopal.",
        "RizeWorld considers your industry, target audience, location, competition, and business goals when planning a campaign. This allows us to focus on the channels that are most relevant instead of following a one-size-fits-all approach."
      ]
    },
    expansionSection: {
      headline: "From Online Visibility to Real Opportunities",
      paragraphs: [
        "Digital marketing should do more than bring visitors to a website. SEO, content, social media, advertising, and web design should work together to guide potential customers toward meaningful actions such as enquiries, bookings, or purchases.",
        "RizeWorld combines these channels to create a practical digital presence focused on visibility, engagement, leads, and long-term growth."
      ]
    },
    whyChoose: {
      headline: "Why Choose RizeWorld?",
      bullets: [
        "Strategies built around your business goals",
        "SEO focused on relevant search intent",
        "Local SEO for location-based businesses",
        "Performance-focused Google Ads campaigns",
        "Content created for users and search engines",
        "Responsive and user-friendly websites",
        "Ongoing monitoring and optimization"
      ]
    },
    faqs: [
      {
        question: "What does a digital marketing agency in Madhya Pradesh do?",
        answer: "A digital marketing agency helps businesses improve their online presence through SEO, paid advertising, social media marketing, content marketing, website development, and related digital strategies."
      },
      {
        question: "Which cities in Madhya Pradesh does RizeWorld serve?",
        answer: "RizeWorld currently provides digital marketing solutions in Indore and Bhopal."
      },
      {
        question: "Do you provide SEO services in Madhya Pradesh?",
        answer: "Yes. Our SEO strategies focus on improving organic search visibility, attracting relevant visitors, and supporting long-term online growth."
      },
      {
        question: "Can you help with local SEO in Madhya Pradesh?",
        answer: "Yes. Local SEO can help businesses improve visibility for location-based searches and make it easier for nearby customers to find their products or services."
      },
      {
        question: "Do you provide Google Ads and PPC services?",
        answer: "Yes. We can plan and manage paid campaigns based on your target audience, services, competition, budget, and business objectives."
      },
      {
        question: "Can SEO and social media marketing work together?",
        answer: "Yes. SEO and social media can complement one another by helping businesses improve visibility, share useful content, and maintain consistent communication with their audience."
      }
    ],
    cta: {
      headline: "Ready to Grow Your Business in Madhya Pradesh?",
      text: "Whether you're targeting customers in Indore, Bhopal, or other parts of Madhya Pradesh, RizeWorld can help you build a practical digital strategy focused on visibility, relevant traffic, leads, and sustainable growth.",
      buttonText: "Talk to RizeWorld"
    }
  },
  "kerala": {
    eyebrow: "Digital Marketing in Kerala",
    heroHeadline: "Digital Marketing in Kerala",
    heroDescription: "RizeWorld helps businesses across Kerala build a stronger online presence through SEO, paid advertising, social media marketing, content, and website development. Our approach is based on understanding each business, its target audience, competition, and local market rather than using the same strategy for everyone. From established businesses in Kochi to growing brands in Trivandrum, we focus on improving online visibility, attracting relevant customers, and creating digital strategies that support long-term growth.",
    presenceSubtitle: "We work with businesses across key Kerala markets, helping them improve search visibility, connect with relevant audiences, and create digital experiences that support long-term growth.",
    cityDescriptions: {
      "kochi": "Kochi has a diverse business environment with companies and local brands across technology, tourism, healthcare, education, retail, hospitality, and professional services. RizeWorld helps businesses strengthen their digital presence through SEO, local SEO, Google Ads, social media, content marketing, and website solutions.",
      "trivandrum": "Businesses in Trivandrum can use digital channels to reach local customers as well as wider audiences. RizeWorld combines SEO, paid advertising, social media, content, and website development to help businesses improve visibility and create more meaningful opportunities online."
    },
    marketFit: {
      headline: "A Strategy Built Around Your Business",
      paragraphs: [
        "Kerala has a varied business landscape, from tourism and hospitality to healthcare, education, technology, retail, and professional services. Different businesses require different approaches to reach their customers online.",
        "A business targeting customers in Kochi may have different priorities from one serving Trivandrum. RizeWorld considers your industry, target audience, location, competition, and business goals before developing a digital marketing strategy.",
        "The focus is on selecting the channels that are relevant to your business and using them effectively rather than simply increasing the number of marketing activities."
      ]
    },
    expansionSection: {
      headline: "Connecting Online Visibility With Growth",
      paragraphs: [
        "SEO can help people discover your business, useful content can answer their questions, social media can build engagement, and paid advertising can reach audiences with stronger intent. Your website then provides the experience that can turn visitors into enquiries or customers.",
        "RizeWorld brings these elements together to create a practical digital marketing approach focused on visibility, relevant traffic, leads, and sustainable growth."
      ]
    },
    whyChoose: {
      headline: "Why Choose RizeWorld?",
      bullets: [
        "Strategies built around your business objectives",
        "SEO focused on relevant search intent",
        "Local SEO for location-based businesses",
        "Performance-focused Google Ads campaigns",
        "Content created for users and search engines",
        "Responsive and user-friendly websites",
        "Ongoing monitoring and optimization"
      ]
    },
    faqs: [
      {
        question: "What does a digital marketing agency in Kerala do?",
        answer: "A digital marketing agency helps businesses improve their online presence through SEO, paid advertising, social media marketing, content marketing, website development, and related digital strategies."
      },
      {
        question: "Which cities in Kerala does RizeWorld serve?",
        answer: "RizeWorld currently provides digital marketing solutions in Kochi and Trivandrum."
      },
      {
        question: "Do you provide SEO services in Kerala?",
        answer: "Yes. Our SEO strategies focus on improving organic search visibility, attracting relevant traffic, and supporting long-term online growth."
      },
      {
        question: "Can you help with local SEO in Kerala?",
        answer: "Yes. Local SEO can help businesses improve their visibility for location-based searches and make it easier for nearby customers to discover their products or services."
      },
      {
        question: "Do you provide Google Ads and PPC services?",
        answer: "Yes. We can plan and manage paid advertising campaigns based on your target audience, services, competition, budget, and business objectives."
      },
      {
        question: "Can SEO and social media marketing work together?",
        answer: "Yes. SEO and social media can complement each other by improving visibility, distributing useful content, and helping businesses maintain consistent communication with their audience."
      }
    ],
    cta: {
      headline: "Ready to Grow Your Business in Kerala?",
      text: "Whether you're targeting customers in Kochi, Trivandrum, or other parts of Kerala, RizeWorld can help you build a practical digital strategy focused on visibility, relevant traffic, leads, and sustainable growth.",
      buttonText: "Talk to RizeWorld"
    }
  }
};
