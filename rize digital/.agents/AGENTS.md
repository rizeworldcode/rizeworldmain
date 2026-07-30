# Rize Digital Project Memory & Guidelines

This document serves as the persistent context memory for Antigravity coding agents working on the **Rize Digital** project. 

---

## 🚀 Work Accomplished (Latest Status)

1. **Hero Section Redesign & Refinement**:
   - Implemented the custom layout featuring a typewriter heading ("Unlock Top Marketing Talent..."), concentric spinning orbits with styled brand/tool icons, a dynamic count-up badge (20k+ Specialists), and an auto-scrolling partner logo ticker.
   - Removed the static `/hero/BANNER1.jpg.jpeg` image.
   - Integrated the 3D `<Ballpit />` component from React Bits.
   - **WebGL Fallback**: Handled WebGL crash context issues gracefully. If WebGL is unavailable or fails, it falls back to a CSS-animated floating bubble layer utilizing `#ff5722`, `#1a56db`, and `#22c55e` blurred bubbles so the interface remains beautiful.
   - **Typewriter Fix**: Corrected the `useEffect` interval cleanup logic by using a robust length-based text indexing solution (`prev.length`) to resolve duplicated letters and typos caused by React 19 strict development double-mount cycles.
   - **Brand/Tool Orbit Icons**: Replaced the static human avatars in the concentric spinning orbits with interactive styled vector/brand tool icons (Photoshop, React, SEO, Figma, Google Ads, Illustrator, Instagram, WordPress, Premiere Pro) featuring custom drop-shadow neon glow matching their brands and smooth scale-up transitions on hover.
   - **Orbits Layout Alignment**: Shifted the orbit circles down and increased top padding/margin to prevent the top of the circles from overlapping with or going behind the sticky header navigation bar.

2. **Blog & Category Filtering**:
   - Replaced all placeholder prototyping blogs with 5 key-mapped, SEO-optimized articles in `Blogs.tsx` and `BlogDetails.tsx` spanning categories: Digital Marketing, SEO, Social Media, PPC, and Web Design.
   - Converted static category link tags into interactive stateful buttons on `Blogs.tsx` to allow seamless single-page blog category filtering.
   - Linked blogs to corresponding service categories: `digital-marketing`, `web-development`, `seo`, `paid-ads`, and `social-media-marketing`.

3. **About Page Updates**:
   - Replaced banner image `/images/about/rizeworld.jpg.jpeg` with `/images/about/about 1.png` using `object-contain bg-neutral-100/50` to prevent details from clipping.
   - Replaced the first and second column images in the "Who We Are?" grid section with `/images/about/about 2.png` and `/images/about/about 3.png` respectively.

4. **Client Testimonial & Avatar Correctness**:
   - Replaced generic client reviews in `CityLandingPageTemplate.tsx` with the requested 5 real client profiles: `Harsh Tiwari`, `Mr. Ajit Singh`, `Mr. Sajan Chandel`, `Mr. Rahul Bhugra`, and `Mr. Neeraj Lamba` along with their local image assets (`/video/harsh tiwari.jpeg`, etc.).

---

## 🎨 Design System & Developer Constraints

1. **Excel Color Coding Rule**:
   - **Black cell background/text** = Primary Keyword.
   - **Green cell background/text** = Secondary Keywords.
   - **Red cell background/text** = LSI Keywords.
   - Use these keywords diligently when writing service pages and blogs content.

2. **Vite Development Loop**:
   - Do not attempt to run external execution setups on the sandboxed terminal (which resolves paths relative to directories). Rely on hot-reloading for UI validation.

3. **Image Fit Constraints**:
   - When users report image cropping issues in banner components, always combine `object-contain` with a neutral background style (e.g. `bg-neutral-100/50`) instead of `object-cover`.
