# Website Architecture and Tech Stack Overview

You are an expert Frontend Developer and Designer. I am providing you with the full technical architecture of my business website, **Rize Digital** (a modern creative digital marketing, branding, and web development agency). 

Use this overview to design layout revisions, write components, add features, or refine the user interface according to my instructions.

---

## 🛠️ Tech Stack & Key Libraries
- **Framework**: React 19 (Vite, TypeScript)
- **Routing**: `react-router-dom` (v7)
- **Styling**: Tailwind CSS (v4) with custom CSS in `src/index.css` and `src/App.css`
- **Animations**: `framer-motion` (v12) and `gsap` (v3) for premium micro-interactions and smooth scroll/reveal animations.
- **Icons**: `lucide-react`
- **Interactive Elements**: Particles background using `react-tsparticles` and `tsparticles-slim` for a futuristic feel.

---

## 📂 Project Structure & Key Pages

### 1. Main Infrastructure
- **`src/main.tsx`**: Entry point.
- **`src/App.tsx`**: Sets up routing for all main pages, layouts, and includes common elements like `Header`, `Footer`, `ScrollToTop`, `PopupModal`, and `FloatingButtons` (WhatsApp/Phone).

### 2. Core Pages (`src/pages/`)
- **Home (`Home.tsx`)**: Premium agency home page utilizing interactive sections:
  - Hero section with animations.
  - Services Grid showcasing agency core offerings.
  - Switzerland-style Pricing structure.
  - Mailbox Reveal/interactive elements.
  - Business Growth Metrics cards.
  - Strategic process sections, Awards, and Client Case Studies.
- **About (`About.tsx`)**: Detailing the company values, story, vision, and team statistics.
- **Team (`Team.tsx`)**: Interactive listing of agency experts, developers, and designers.
- **Portfolio (`Portfolio.tsx`) & Project Details (`ProjectDetails.tsx`)**: Highlighting case studies and completed work for clients.
- **Blogs (`Blogs.tsx`) & Blog Details (`BlogDetails.tsx`)**: Educational content about branding, UI/UX, and marketing.
- **Careers (`Careers.tsx`) & Job Details (`JobDetails.tsx`)**: Open job positions, forms to apply, and descriptions.
- **Contact (`Contact.tsx`)**: Interactive query form, maps, and coordinates.
- **Policies**: Legal pages (`PrivacyPolicy.tsx`, `TermsOfService.tsx`, `AccessibilityArrangements.tsx`).

### 3. Service-Specific Pages (`src/pages/services/`)
We have dedicated pages for each service offering to maximize conversions and SEO value:
- **Main Services**:
  - `DigitalMarketingService.tsx`
  - `WebDevelopment.tsx`
  - `WordPressDevelopmentServices.tsx`
  - `CustomWebsiteDevelopment.tsx`
  - `EcommerceDevelopment.tsx`
  - `GraphicDesign.tsx`
  - `UiUxDesign.tsx`
  - `PaidAds.tsx`
  - `SearchEngineOptimization.tsx`
  - `SocialMediaMarketing.tsx`
  - `ContentMarketing.tsx`
- **City-Specific Landing Pages (SEO-focused)**:
  - `CityLandingPageTemplate.tsx` (Reusable Template)
  - `DigitalMarketingAgencyInAlwar.tsx`
  - `DigitalMarketingAgencyInChandigarh.tsx`
  - `DigitalMarketingAgencyInIndore.tsx`
  - `DigitalMarketingAgencyInPrayagraj.tsx`
  - `DigitalMarketingAgencyInUdaipur.tsx`

### 4. Components (`src/components/`)
- **`common/`**: `Header.tsx`, `Footer.tsx`, `PrimaryButton.tsx`, `ContactForm.tsx`, `FloatingButtons.tsx`, `PopupModal.tsx`, `ScrollToTop.tsx`, `SectionHeading.tsx`, `StarBackground.tsx`.
- **`home/`**: Modular sub-sections including `HeroSection`, `ServicesGridSection`, `PricingSwiss`, `MailboxRevealSection`, `BusinessGrowthModern`, `AwardsSection`, `CaseStudiesSection`, `GrowthLabsSection`, `ThoughtLeadershipSection`.

### 5. Static & Asset Data (`src/data/` & `src/types/`)
- Pure structured typescript datasets for `services.ts`, `projects.ts`, `careers.ts`, `awards.ts`, `growthLabs.ts`, and `footer.ts` to keep JSX components clean and content-driven.

---

## 🎨 Design System & Aesthetic Principles
- **Visuals**: Modern, clean, tech-forward, high-conversion look. High contrast layout featuring vibrant accents, clean borders, glassmorphic cards, and dark theme variables.
- **Animations**: Staggered fades, slide-ups on viewport entry, hover scales, and clean page transitions.

---

## 🎯 What I want to change:
*(Insert your changes here. E.g. "I want to redesign the pricing section to look like a premium cards table," or "I want to add a dark-mode toggle to the Header," etc.)*
