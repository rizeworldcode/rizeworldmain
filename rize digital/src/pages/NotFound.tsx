import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import { FaAws } from 'react-icons/fa';
import {
  SiReact, SiNextdotjs, SiVuedotjs, SiNuxt, SiAngular, SiSvelte, SiVite, SiRedux, 
  SiJavascript, SiTypescript, SiHtml5, SiCss, SiTailwindcss, SiBootstrap, SiMui, 
  SiNodedotjs, SiExpress, SiNestjs, SiLaravel, SiDjango, SiFlask, SiSpringboot, SiDotnet,
  SiMongodb, SiMysql, SiPostgresql, SiSqlite, SiFirebase, SiSupabase, SiRedis, SiGit, 
  SiGithub, SiGitlab, SiBitbucket, SiDocker, SiKubernetes, SiGooglecloud, 
  SiCloudflare, SiVercel, SiNetlify, SiHostinger, SiLinux, SiUbuntu, 
  SiApple, SiCursor, SiWebstorm, SiAndroidstudio, SiIntellijidea, SiWordpress, SiShopify, 
  SiWebflow, SiFramer, SiAnthropic, SiGithubcopilot, SiGraphql, SiPostman, SiSwagger, 
  SiNpm, SiYarn, SiPnpm, SiGooglechrome, SiFirefox, SiSafari, SiOpera,
  SiFigma
} from 'react-icons/si';

interface PhysicsItem {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  rotation: number;
  angularVelocity: number;
}

interface BrandConfig {
  id: string;
  name: string;
  gradient: string;
  textColor?: string;
  logo: React.ReactNode;
}

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const pupilLeftRef = useRef<SVGCircleElement>(null);
  const pupilRightRef = useRef<SVGCircleElement>(null);
  const [initialized, setInitialized] = useState(false);
  const [showCenter404, setShowCenter404] = useState(false);
  const [showButtons, setShowButtons] = useState(false);

  // Cache container width & height to completely eliminate layout thrashing
  const containerSize = useRef({ width: 1200, height: 800 });

  // Keep physics state in a ref for smooth 60fps loop
  const physicsItems = useRef<{ [key: string]: PhysicsItem }>({});
  const dragInfo = useRef<{
    itemId: string | null;
    startX: number;
    startY: number;
    lastMouseX: number;
    lastMouseY: number;
  }>({ itemId: null, startX: 0, startY: 0, lastMouseX: 0, lastMouseY: 0 });

  const brandDataset: BrandConfig[] = [
    // Original Brands (with custom SVGs scaled to 50% parent size)
    {
      id: 'badge-google',
      name: 'Google',
      gradient: 'from-white to-[#eeeeee]',
      logo: (
        <svg viewBox="0 0 24 24" className="w-[50%] h-[50%] glyph-raised pointer-events-none">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
      )
    },
    {
      id: 'badge-google-ads',
      name: 'Google Ads',
      gradient: 'from-white to-[#eeeeee]',
      logo: (
        <svg viewBox="0 0 24 24" className="w-[50%] h-[50%] glyph-raised pointer-events-none" fill="none">
          <path d="M15.5 3h-7L3 14.5l5.5 5.5L20 8.5 15.5 3z" fill="#FBBC05" />
          <path d="M20 8.5L8.5 20l3.5 3.5L23.5 12 20 8.5z" fill="#4285F4" />
        </svg>
      )
    },
    {
      id: 'badge-google-analytics',
      name: 'Google Analytics',
      gradient: 'from-[#ffd54f] to-[#ff8f00]',
      logo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-[50%] h-[50%] text-white glyph-raised pointer-events-none">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      )
    },
    {
      id: 'badge-google-business',
      name: 'Google Business Profile',
      gradient: 'from-[#42a5f5] to-[#1565c0]',
      logo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[50%] h-[50%] text-white glyph-raised pointer-events-none">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    {
      id: 'badge-gmail',
      name: 'Gmail',
      gradient: 'from-white to-[#eeeeee]',
      logo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[50%] h-[50%] text-red-500 glyph-raised pointer-events-none">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      )
    },
    {
      id: 'badge-google-search',
      name: 'Google Search Console',
      gradient: 'from-[#26a69a] to-[#00695c]',
      logo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[50%] h-[50%] text-white glyph-raised pointer-events-none">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          <path d="M2 12h20" />
        </svg>
      )
    },
    {
      id: 'badge-meta',
      name: 'Meta',
      gradient: 'from-[#0064e0] to-[#003d8a]',
      logo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="w-[50%] h-[50%] text-white glyph-raised pointer-events-none">
          <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4z" />
        </svg>
      )
    },
    {
      id: 'badge-facebook-ads',
      name: 'Facebook Ads',
      gradient: 'from-[#1877f2] to-[#0c51ab]',
      logo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[50%] h-[50%] text-white glyph-raised pointer-events-none">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      )
    },
    {
      id: 'badge-instagram-ads',
      name: 'Instagram Ads',
      gradient: 'from-[#f09433] via-[#e6683c] to-[#bc1888]',
      logo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[50%] h-[50%] text-white glyph-raised pointer-events-none">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    },
    {
      id: 'badge-microsoft',
      name: 'Microsoft',
      gradient: 'from-white to-[#eeeeee]',
      logo: (
        <svg viewBox="0 0 23 23" className="w-[50%] h-[50%] glyph-raised pointer-events-none">
          <path fill="#F25022" d="M0 0h10v10H0z" />
          <path fill="#7FBA00" d="M11 0h10v10H11z" />
          <path fill="#00A4EF" d="M0 11h10v10H0z" />
          <path fill="#FFB900" d="M11 11h10v10H11z" />
        </svg>
      )
    },
    {
      id: 'badge-bing',
      name: 'Bing',
      gradient: 'from-[#00838f] to-[#005662]',
      logo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-[50%] h-[50%] text-white glyph-raised pointer-events-none">
          <path d="M5 2h14v20L12 15l-7 7z" />
        </svg>
      )
    },
    {
      id: 'badge-bing-ads',
      name: 'Bing Ads',
      gradient: 'from-[#0097a7] to-[#006064]',
      logo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-[50%] h-[50%] text-white glyph-raised pointer-events-none">
          <path d="M5 2h14v20L12 15l-7 7z" />
        </svg>
      )
    },
    {
      id: 'badge-facebook',
      name: 'Facebook',
      gradient: 'from-[#1877f2] to-[#0d52ab]',
      logo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[50%] h-[50%] text-white glyph-raised pointer-events-none">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      )
    },
    {
      id: 'badge-instagram',
      name: 'Instagram',
      gradient: 'from-[#fcae3c] via-[#e1306c] to-[#833ab4]',
      logo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[50%] h-[50%] text-white glyph-raised pointer-events-none">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    },
    {
      id: 'badge-x-twitter',
      name: 'X',
      gradient: 'from-[#333333] to-[#0a0a0a]',
      logo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[50%] h-[50%] text-white glyph-raised pointer-events-none">
          <path d="M4 4l11.73 16h4.27L8.27 4H4z M4 20l6.77-6.77 M20 4l-6.77 6.77" />
        </svg>
      )
    },
    {
      id: 'badge-linkedin',
      name: 'LinkedIn',
      gradient: 'from-[#0a66c2] to-[#004182]',
      logo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[50%] h-[50%] text-white glyph-raised pointer-events-none">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      )
    },
    {
      id: 'badge-youtube',
      name: 'YouTube',
      gradient: 'from-[#ff0000] to-[#b30000]',
      logo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-[50%] h-[50%] text-white glyph-raised pointer-events-none">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
        </svg>
      )
    },
    {
      id: 'badge-tiktok',
      name: 'TikTok',
      gradient: 'from-[#010101] to-[#242424]',
      logo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-[#00f2fe] glyph-raised pointer-events-none">
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      )
    },
    {
      id: 'badge-pinterest',
      name: 'Pinterest',
      gradient: 'from-[#bd081c] to-[#8d0615]',
      logo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-white glyph-raised pointer-events-none">
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      )
    },
    {
      id: 'badge-snapchat',
      name: 'Snapchat',
      gradient: 'from-[#fffc00] to-[#ffd000]',
      logo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-black glyph-raised pointer-events-none">
          <path d="M12 2a3 3 0 0 0-3 3c0 3 4 5 4 8H8a3 3 0 0 0-3 3v2h14v-2a3 3 0 0 0-3-3h-5c0-3 4-5 4-8a3 3 0 0 0-3-3z" />
        </svg>
      )
    },
    {
      id: 'badge-threads',
      name: 'Threads',
      gradient: 'from-[#121212] to-[#000000]',
      logo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-11 h-11 text-white glyph-raised pointer-events-none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.5c-3 0-5.5-2-5.5-5.5s2.5-5.5 5.5-5.5 5.5 2.5 5.5 5.5-2.5 5.5-5.5 5.5z" />
        </svg>
      )
    },
    {
      id: 'badge-reddit',
      name: 'Reddit',
      gradient: 'from-[#ff4500] to-[#cc3700]',
      logo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-11 h-11 text-white glyph-raised pointer-events-none">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8V6h3M9 12c0-1.5 1.5-2.5 3-2.5s3 1 3 2.5" />
        </svg>
      )
    },
    {
      id: 'badge-discord',
      name: 'Discord',
      gradient: 'from-[#5865f2] to-[#3a45c3]',
      logo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-11 h-11 text-white glyph-raised pointer-events-none">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <circle cx="8" cy="12" r="2" />
          <circle cx="16" cy="12" r="2" />
        </svg>
      )
    },
    {
      id: 'badge-telegram',
      name: 'Telegram',
      gradient: 'from-[#229ed9] to-[#1777a5]',
      logo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-11 h-11 text-white glyph-raised pointer-events-none">
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      )
    },
    {
      id: 'badge-whatsapp',
      name: 'WhatsApp',
      gradient: 'from-[#25d366] to-[#18a24c]',
      logo: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-11 h-11 text-white glyph-raised pointer-events-none">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      )
    },

    // =========================================================================
    // NEW TECH STACK BRANDS (Using high-quality vector react-icons/si + safe SVGs)
    // =========================================================================
    { 
      id: 'tech-canva', 
      name: 'Canva', 
      gradient: 'from-[#00c4cc] to-[#7d2ae8]', 
      logo: (
        <svg viewBox="0 0 100 100" className="w-[50%] h-[50%] text-white pointer-events-none" fill="currentColor">
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="7"/>
          <text x="50" y="68" font-family="sans-serif" font-size="52" font-weight="900" text-anchor="middle">C</text>
        </svg>
      )
    },
    { id: 'tech-figma', name: 'Figma', gradient: 'from-[#0acf83] via-[#a259ff] to-[#ff7262]', logo: <SiFigma className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-adobe', name: 'Adobe', gradient: 'from-[#ff0000] to-[#9d0000]', logo: <SiApple className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { 
      id: 'tech-photoshop', 
      name: 'Photoshop', 
      gradient: 'from-[#001e36] to-[#00c8ff]', 
      logo: (
        <svg viewBox="0 0 100 100" className="w-[50%] h-[50%] text-[#00c8ff] pointer-events-none" fill="currentColor">
          <rect width="90" height="90" x="5" y="5" rx="18" fill="#001c3a" stroke="#00c8ff" strokeWidth="7"/>
          <text x="50" y="63" font-family="sans-serif" font-size="44" font-weight="bold" text-anchor="middle" fill="#00c8ff">Ps</text>
        </svg>
      )
    },
    { 
      id: 'tech-illustrator', 
      name: 'Illustrator', 
      gradient: 'from-[#330000] to-[#ff9a00]', 
      logo: (
        <svg viewBox="0 0 100 100" className="w-[50%] h-[50%] text-[#ff9a00] pointer-events-none" fill="currentColor">
          <rect width="90" height="90" x="5" y="5" rx="18" fill="#260000" stroke="#ff9a00" strokeWidth="7"/>
          <text x="50" y="63" font-family="sans-serif" font-size="44" font-weight="bold" text-anchor="middle" fill="#ff9a00">Ai</text>
        </svg>
      )
    },
    { 
      id: 'tech-aftereffects', 
      name: 'After Effects', 
      gradient: 'from-[#00005c] to-[#d19eff]', 
      logo: (
        <svg viewBox="0 0 100 100" className="w-[50%] h-[50%] text-[#d19eff] pointer-events-none" fill="currentColor">
          <rect width="90" height="90" x="5" y="5" rx="18" fill="#160030" stroke="#d19eff" strokeWidth="7"/>
          <text x="50" y="63" font-family="sans-serif" font-size="44" font-weight="bold" text-anchor="middle" fill="#d19eff">Ae</text>
        </svg>
      )
    },
    { id: 'tech-react', name: 'React', gradient: 'from-[#20232a] to-[#00d8ff]', logo: <SiReact className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-nextjs', name: 'Next.js', gradient: 'from-black to-[#222222]', logo: <SiNextdotjs className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-vuejs', name: 'Vue.js', gradient: 'from-[#35495e] to-[#41b883]', logo: <SiVuedotjs className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-nuxtjs', name: 'Nuxt.js', gradient: 'from-[#002e3b] to-[#00c58e]', logo: <SiNuxt className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-angular', name: 'Angular', gradient: 'from-[#c3002f] to-[#dd0031]', logo: <SiAngular className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-svelte', name: 'Svelte', gradient: 'from-[#ff3e00] to-[#b32b00]', logo: <SiSvelte className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-vite', name: 'Vite', gradient: 'from-[#646cff] to-[#bd34fe]', logo: <SiVite className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-redux', name: 'Redux', gradient: 'from-[#764abc] to-[#4c2d80]', logo: <SiRedux className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-javascript', name: 'JavaScript', gradient: 'from-[#f7df1e] to-[#cbb200]', logo: <SiJavascript className="w-[50%] h-[50%] text-black glyph-raised" /> },
    { id: 'tech-typescript', name: 'TypeScript', gradient: 'from-[#3178c6] to-[#1d4f85]', logo: <SiTypescript className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-html5', name: 'HTML5', gradient: 'from-[#e34c26] to-[#b03010]', logo: <SiHtml5 className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-css3', name: 'CSS3', gradient: 'from-[#264de4] to-[#1b3bb0]', logo: <SiCss className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-tailwind', name: 'Tailwind CSS', gradient: 'from-[#0f172a] to-[#06b6d4]', logo: <SiTailwindcss className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-bootstrap', name: 'Bootstrap', gradient: 'from-[#7952b3] to-[#4e327d]', logo: <SiBootstrap className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-mui', name: 'Material UI', gradient: 'from-[#00b0ff] to-[#007ac1]', logo: <SiMui className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { 
      id: 'tech-shadcn', 
      name: 'Shadcn UI', 
      gradient: 'from-[#18181b] to-black', 
      logo: (
        <svg viewBox="0 0 256 256" className="w-[50%] h-[50%] text-white glyph-raised pointer-events-none">
          <path fill="none" stroke="currentColor" strokeWidth="24" strokeLinecap="round" d="M208 48L48 208"/>
        </svg>
      )
    },
    { id: 'tech-nodejs', name: 'Node.js', gradient: 'from-[#333333] to-[#3f873f]', logo: <SiNodedotjs className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-express', name: 'Express.js', gradient: 'from-black to-[#252525]', logo: <SiExpress className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-nestjs', name: 'NestJS', gradient: 'from-[#e0234e] to-[#a61738]', logo: <SiNestjs className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-laravel', name: 'Laravel', gradient: 'from-[#ff2d20] to-[#b31b12]', logo: <SiLaravel className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-django', name: 'Django', gradient: 'from-[#092e20] to-[#051c13]', logo: <SiDjango className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-flask', name: 'Flask', gradient: 'from-black to-[#444444]', logo: <SiFlask className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-springboot', name: 'Spring Boot', gradient: 'from-[#6db33f] to-[#4f882b]', logo: <SiSpringboot className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-aspnet', name: 'ASP.NET', gradient: 'from-[#512bd4] to-[#391e9c]', logo: <SiDotnet className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-mongodb', name: 'MongoDB', gradient: 'from-[#13aa52] to-[#0b6330]', logo: <SiMongodb className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-mysql', name: 'MySQL', gradient: 'from-[#00758f] to-[#f29111]', logo: <SiMysql className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-postgresql', name: 'PostgreSQL', gradient: 'from-[#336791] to-[#204360]', logo: <SiPostgresql className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-sqlite', name: 'SQLite', gradient: 'from-[#003b57] to-[#00273b]', logo: <SiSqlite className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-firebase', name: 'Firebase', gradient: 'from-[#ffca28] to-[#f57c00]', logo: <SiFirebase className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-supabase', name: 'Supabase', gradient: 'from-[#1c1c1c] to-[#3ecf8e]', logo: <SiSupabase className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-redis', name: 'Redis', gradient: 'from-[#d82c20] to-[#991b12]', logo: <SiRedis className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-git', name: 'Git', gradient: 'from-[#f05032] to-[#b3351d]', logo: <SiGit className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-github', name: 'GitHub', gradient: 'from-[#24292e] to-black', logo: <SiGithub className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-gitlab', name: 'GitLab', gradient: 'from-[#e24329] to-[#fc6d26]', logo: <SiGitlab className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-bitbucket', name: 'Bitbucket', gradient: 'from-[#0052cc] to-[#003380]', logo: <SiBitbucket className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-docker', name: 'Docker', gradient: 'from-[#0db7ed] to-[#06688c]', logo: <SiDocker className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-kubernetes', name: 'Kubernetes', gradient: 'from-[#326ce5] to-[#1e469c]', logo: <SiKubernetes className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-aws', name: 'AWS', gradient: 'from-[#232f3e] to-[#ff9900]', logo: <FaAws className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-gcp', name: 'Google Cloud', gradient: 'from-white to-[#eeeeee]', logo: <SiGooglecloud className="w-[50%] h-[50%] text-black glyph-raised" /> },
    { 
      id: 'tech-azure', 
      name: 'Microsoft Azure', 
      gradient: 'from-[#0078d4] to-[#005a9e]', 
      logo: (
        <svg viewBox="0 0 24 24" className="w-[50%] h-[50%] text-white glyph-raised pointer-events-none" fill="currentColor">
          <path d="M0 18.92L9.46 2.5H24L12.3 22.8H0zm12.3-16.42L3.18 18.92h14.7L24 2.5H12.3z"/>
        </svg>
      )
    },
    { id: 'tech-cloudflare', name: 'Cloudflare', gradient: 'from-[#f38020] to-[#bf5f11]', logo: <SiCloudflare className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-vercel', name: 'Vercel', gradient: 'from-black to-[#222222]', logo: <SiVercel className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-netlify', name: 'Netlify', gradient: 'from-[#00ad9f] to-[#00736a]', logo: <SiNetlify className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-hostinger', name: 'Hostinger', gradient: 'from-[#673de6] to-[#4829a8]', logo: <SiHostinger className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-linux', name: 'Linux', gradient: 'from-black to-[#ffd32a]', logo: <SiLinux className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-ubuntu', name: 'Ubuntu', gradient: 'from-[#dd4814] to-[#9c300b]', logo: <SiUbuntu className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { 
      id: 'tech-windows', 
      name: 'Windows', 
      gradient: 'from-[#0078d7] to-[#005a9e]', 
      logo: (
        <svg viewBox="0 0 24 24" className="w-[50%] h-[50%] text-white glyph-raised pointer-events-none" fill="currentColor">
          <path d="M0 3.449L9.75 2.1v9.45H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.102zM10.8 1.95L24 0v11.6H10.8V1.95zm13.2 10.5v9.6l-13.2-1.95V12.45H24z"/>
        </svg>
      )
    },
    { id: 'tech-macos', name: 'macOS', gradient: 'from-[#a6a6a6] to-[#595959]', logo: <SiApple className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { 
      id: 'tech-vscode', 
      name: 'VS Code', 
      gradient: 'from-[#007acc] to-[#004e82]', 
      logo: (
        <svg viewBox="0 0 24 24" className="w-[50%] h-[50%] text-white glyph-raised pointer-events-none" fill="currentColor">
          <path d="M23.986 6.568l-3.328-1.528a.5.5 0 0 0-.672.32L17.76 12l2.227 6.64a.5.5 0 0 0 .672.32l3.328-1.528a1 1 0 0 0 .599-.916V7.484a1 1 0 0 0-.6-.916zM15.4 12l-6.843-5.26a1 1 0 0 0-1.488.196L.262 17.378a.5.5 0 0 0 .3.774l14.28 2.856a1 1 0 0 0 1.134-.736L17.5 12.3a.5.5 0 0 0-.3-.6H15.4z"/>
        </svg>
      )
    },
    { 
      id: 'tech-vs', 
      name: 'Visual Studio', 
      gradient: 'from-[#5c2d91] to-[#3a1a5e]', 
      logo: (
        <svg viewBox="0 0 24 24" className="w-[50%] h-[50%] text-white glyph-raised pointer-events-none" fill="currentColor">
          <path d="M17 3l-6.5 6L4 3.5.5 6l6 6-6 6L4 20.5l6.5-5.5 6.5 6 3.5-2.5v-19z"/>
        </svg>
      )
    },
    { id: 'tech-cursor', name: 'Cursor', gradient: 'from-black to-[#1a1a1a]', logo: <SiCursor className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-webstorm', name: 'WebStorm', gradient: 'from-[#000000] to-[#800080]', logo: <SiWebstorm className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-android', name: 'Android Studio', gradient: 'from-[#3ddc84] to-[#073042]', logo: <SiAndroidstudio className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-intellij', name: 'IntelliJ IDEA', gradient: 'from-black to-[#fe2857]', logo: <SiIntellijidea className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-wordpress', name: 'WordPress', gradient: 'from-[#21759b] to-[#134963]', logo: <SiWordpress className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-shopify', name: 'Shopify', gradient: 'from-[#96bf48] to-[#688a29]', logo: <SiShopify className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-webflow', name: 'Webflow', gradient: 'from-[#4353ff] to-[#2532c2]', logo: <SiWebflow className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-framer', name: 'Framer', gradient: 'from-[#0055ff] to-black', logo: <SiFramer className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { 
      id: 'tech-openai', 
      name: 'OpenAI', 
      gradient: 'from-[#10a37f] to-[#0b6c54]', 
      logo: (
        <svg viewBox="0 0 24 24" className="w-[50%] h-[50%] text-white glyph-raised pointer-events-none" fill="currentColor">
          <path d="M21.5 10c-.1-.7-.4-1.4-.9-1.9.4-.8.6-1.7.5-2.6-.1-.9-.5-1.7-1.1-2.3-.6-.6-1.4-1-2.3-1.1-.9-.1-1.8.1-2.6.5-.5-.5-1.2-.8-1.9-.9V1c0-.3-.1-.5-.3-.7s-.5-.3-.7-.3c-.3 0-.5.1-.7.3s-.3.5-.3.7v.7c-.7.1-1.4.4-1.9.9-.8-.4-1.7-.6-2.6-.5-.9.1-1.7.5-2.3 1.1-.6.6-1 1.4-1.1 2.3-.1.9.1 1.8.5 2.6-.5.5-.8 1.2-.9 1.9H1c-.3 0-.5.1-.7.3S0 9.7 0 10c0 .3.1.5.3.7s.5.3.7.3h.7c.1.7.4 1.4.9 1.9-.4.8-.6 1.7-.5 2.6.1.9.5 1.7 1.1 2.3.6.6 1.4 1 2.3 1.1.9.1 1.8-.1 2.6-.5.5.5 1.2.8 1.9.9v.7c0 .3.1.5.3.7s.5.3.7.3c.3 0,.5-.1.7-.3s.3-.5.3-.7v-.7c.7-.1 1.4-.4 1.9-.9.8.4 1.7.6 2.6.5.9-.1 1.7-.5 2.3-1.1.6-.6 1-1.4 1.1-2.3.1-.9-.1-1.8-.5-2.6.5-.5.8-1.2.9-1.9h.7c.3 0 .5-.1.7-.3s.3-.5.3-.7c0-.3-.1-.5-.3-.7s-.5-.3-.7-.3h-.7zm-9.5 6.4c-1.1 0-2.1-.4-2.8-1.2-.8-.8-1.2-1.8-1.2-2.8s.4-2.1 1.2-2.8c.8-.8 1.8-1.2 2.8-1.2s2.1.4 2.8 1.2c.8.8 1.2 1.8 1.2 2.8s-.4 2.1-1.2 2.8c-.7.8-1.7 1.2-2.8 1.2z"/>
        </svg>
      )
    },
    { 
      id: 'tech-chatgpt', 
      name: 'ChatGPT', 
      gradient: 'from-[#10a37f] to-black', 
      logo: (
        <svg viewBox="0 0 24 24" className="w-[50%] h-[50%] text-white glyph-raised pointer-events-none" fill="currentColor">
          <path d="M21.5 10c-.1-.7-.4-1.4-.9-1.9.4-.8.6-1.7.5-2.6-.1-.9-.5-1.7-1.1-2.3-.6-.6-1.4-1-2.3-1.1-.9-.1-1.8.1-2.6.5-.5-.5-1.2-.8-1.9-.9V1c0-.3-.1-.5-.3-.7s-.5-.3-.7-.3c-.3 0-.5.1-.7.3s-.3.5-.3.7v.7c-.7.1-1.4.4-1.9.9-.8-.4-1.7-.6-2.6-.5-.9.1-1.7.5-2.3 1.1-.6.6-1 1.4-1.1 2.3-.1.9.1 1.8.5 2.6-.5.5-.8 1.2-.9 1.9H1c-.3 0-.5.1-.7.3S0 9.7 0 10c0 .3.1.5.3.7s.5.3.7.3h.7c.1.7.4 1.4.9 1.9-.4.8-.6 1.7-.5 2.6.1.9.5 1.7 1.1 2.3.6.6 1.4 1 2.3 1.1.9.1 1.8-.1 2.6-.5.5.5 1.2.8 1.9.9v.7c0 .3.1.5.3.7s.5.3.7.3c.3 0,.5-.1.7-.3s.3-.5.3-.7v-.7c.7-.1 1.4-.4 1.9-.9.8.4 1.7.6 2.6.5.9-.1 1.7-.5 2.3-1.1.6-.6 1-1.4 1.1-2.3.1-.9-.1-1.8-.5-2.6.5-.5.8-1.2.9-1.9h.7c.3 0 .5-.1.7-.3s.3-.5.3-.7c0-.3-.1-.5-.3-.7s-.5-.3-.7-.3h-.7zm-9.5 6.4c-1.1 0-2.1-.4-2.8-1.2-.8-.8-1.2-1.8-1.2-2.8s.4-2.1 1.2-2.8c.8-.8 1.8-1.2 2.8-1.2s2.1.4 2.8 1.2c.8.8 1.2 1.8 1.2 2.8s-.4 2.1-1.2 2.8c-.7.8-1.7 1.2-2.8 1.2z"/>
        </svg>
      )
    },
    { id: 'tech-claude', name: 'Claude', gradient: 'from-[#d97706] to-[#78350f]', logo: <SiAnthropic className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { 
      id: 'tech-gemini', 
      name: 'Gemini', 
      gradient: 'from-[#1a73e8] to-[#9c27b0]', 
      logo: (
        <svg viewBox="0 0 24 24" className="w-[50%] h-[50%] text-white glyph-raised pointer-events-none" fill="currentColor">
          <path d="M12 2a1 1 0 0 0-1 .73C10.15 6.6 6.6 10.15 2.73 11a1 1 0 0 0 0 2c3.87.85 7.42 4.4 8.27 8.27a1 1 0 0 0 2 0c.85-3.87 4.4-7.42 8.27-8.27a1 1 0 0 0 0-2c-3.87-.85-7.42-4.4-8.27-8.27A1 1 0 0 0 12 2z"/>
        </svg>
      )
    },
    { id: 'tech-copilot', name: 'GitHub Copilot', gradient: 'from-black to-[#7a2ae8]', logo: <SiGithubcopilot className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { 
      id: 'tech-rest', 
      name: 'REST API', 
      gradient: 'from-[#2b2b2b] to-black', 
      logo: (
        <svg viewBox="0 0 24 24" className="w-[50%] h-[50%] text-white glyph-raised pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M21 12H3M12 3v18"/>
        </svg>
      )
    },
    { id: 'tech-graphql', name: 'GraphQL', gradient: 'from-[#e10098] to-[#990066]', logo: <SiGraphql className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-postman', name: 'Postman', gradient: 'from-[#ff6c37] to-[#cc4b1f]', logo: <SiPostman className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-swagger', name: 'Swagger', gradient: 'from-[#85ea2d] to-[#5a9c1c]', logo: <SiSwagger className="w-[50%] h-[50%] text-black glyph-raised" /> },
    { id: 'tech-npm', name: 'npm', gradient: 'from-[#cb3837] to-[#8c2222]', logo: <SiNpm className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-yarn', name: 'Yarn', gradient: 'from-[#2c8ebb] to-[#1b5c7d]', logo: <SiYarn className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-pnpm', name: 'pnpm', gradient: 'from-[#f9ad19] to-[#bf7f0f]', logo: <SiPnpm className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-chrome', name: 'Chrome', gradient: 'from-white to-[#eeeeee]', logo: <SiGooglechrome className="w-[50%] h-[50%] text-black glyph-raised" /> },
    { id: 'tech-firefox', name: 'Firefox', gradient: 'from-[#ff9500] to-[#ff2d55]', logo: <SiFirefox className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { id: 'tech-safari', name: 'Safari', gradient: 'from-[#00c6ff] to-[#0072ff]', logo: <SiSafari className="w-[50%] h-[50%] text-white glyph-raised" /> },
    { 
      id: 'tech-edge', 
      name: 'Microsoft Edge', 
      gradient: 'from-[#0078d7] to-[#00bfff]', 
      logo: (
        <svg viewBox="0 0 24 24" className="w-[50%] h-[50%] text-white glyph-raised pointer-events-none" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c7.2 0 10-4.5 10-10H12v3h6.5c-.8 2-3 4-6.5 4-3.5 0-6.5-3-6.5-7s3-7 6.5-7c3 0 5 1.5 6 3h3.5C20 4.5 16.5 2 12 2z"/>
        </svg>
      )
    },
    { id: 'tech-opera', name: 'Opera', gradient: 'from-[#ff1b2d] to-[#b30e1b]', logo: <SiOpera className="w-[50%] h-[50%] text-white glyph-raised" /> }
  ];

  // Mobile: limit to 12 icons. Desktop: all 106 icons.
  // Using screen.width (actual device width) so DevTools on desktop doesn't falsely trigger mobile mode.
  const isMobile = typeof window !== 'undefined' && window.screen.width < 768;
  const visibleBrands = isMobile ? brandDataset.slice(0, 12) : brandDataset;

  // Base physics items list
  const baseItemsList = [
    { id: 'shape-orange-star', type: 'shape' },
    { id: 'shape-teal-star', type: 'shape' },
    { id: 'shape-blue-blob', type: 'shape' },
    { id: 'shape-yellow-flower', type: 'shape' },
    { id: 'shape-pink-arch', type: 'shape' },
    { id: 'shape-blue-heart', type: 'shape' }
  ];

  // Combine static shapes + visible brand squircles into itemsList
  const itemsList = [
    ...baseItemsList,
    ...visibleBrands.map(b => ({ id: b.id, type: 'badge' }))
  ];

  // Dynamically configure defaultSizes for all elements (squircles are sized dynamically)
  const defaultSizes: { [key: string]: { w: number; h: number } } = {
    'shape-orange-star': { w: 150, h: 150 },
    'shape-teal-star': { w: 160, h: 160 },
    'shape-blue-blob': { w: 80, h: 80 },
    'shape-yellow-flower': { w: 130, h: 130 },
    'shape-pink-arch': { w: 200, h: 100 },
    'shape-blue-heart': { w: 90, h: 90 }
  };
  visibleBrands.forEach((b, index) => {
    // Distribute sizes: 70px, 85px, 100px, 115px, 130px deterministic based on index
    const size = 70 + (index % 5) * 15;
    defaultSizes[b.id] = { w: size, h: size };
  });

  useEffect(() => {
    if (!containerRef.current) return;

    // Use ResizeObserver to automatically get the dynamic height/width of the div
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 50 && height > 50) {
          containerSize.current = { width, height };
        }
      }
    });
    resizeObserver.observe(containerRef.current);

    const timer404 = setTimeout(() => {
      setShowCenter404(true);
    }, 1500);

    const timerButtons = setTimeout(() => {
      setShowButtons(true);
    }, 2300);

    const containerWidth = containerSize.current.width;

    // Initialize physics state for each element - BYPASS getBoundingClientRect to prevent load latency
    itemsList.forEach((item, index) => {
      const itemW = defaultSizes[item.id].w;
      const itemH = defaultSizes[item.id].h;

      // Distribute items across the width at the top (above viewport to fall down)
      const x = Math.random() * (containerWidth - itemW);
      // Stagger vertical fall layout further since we have 100+ items
      const y = -itemH - (index * 60);

      physicsItems.current[item.id] = {
        id: item.id,
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 2 + 1.5,
        width: itemW,
        height: itemH,
        rotation: 0, // Keeps icons perfectly upright
        angularVelocity: 0 // No rotation velocity
      };
    });

    setInitialized(true);

    let animationFrameId: number;
    const gravity = 0.45;
    const bounce = 0.62;
    const friction = 0.99;
    const groundFriction = 0.95;

    const updatePhysics = () => {
      const { width: cWidth, height: cHeight } = containerSize.current;

      // Skip updating if size is still too small
      if (cHeight < 150 || cWidth < 150) {
        animationFrameId = requestAnimationFrame(updatePhysics);
        return;
      }

      const keys = Object.keys(physicsItems.current);
      
      // Pass 1: Apply physics forces and update position for active elements
      keys.forEach((id) => {
        const item = physicsItems.current[id];
        if (dragInfo.current.itemId === id) return;

        item.vy += gravity;
        item.vx *= friction;
        item.vy *= friction;
        item.angularVelocity = 0; // Lock rotation updates

        item.x += item.vx;
        item.y += item.vy;
      });

      // Pass 2: Element-to-element elastic circle collisions
      for (let i = 0; i < keys.length; i++) {
        for (let j = i + 1; j < keys.length; j++) {
          const itemA = physicsItems.current[keys[i]];
          const itemB = physicsItems.current[keys[j]];

          const rA = itemA.width / 2;
          const rB = itemB.width / 2;
          const cxA = itemA.x + rA;
          const cyA = itemA.y + rA;
          const cxB = itemB.x + rB;
          const cyB = itemB.y + rB;

          const dx = cxB - cxA;
          const dy = cyB - cyA;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDist = rA + rB;

          if (distance < minDist && distance > 0) {
            const overlap = minDist - distance;
            const nx = dx / distance;
            const ny = dy / distance;

            // Resolve overlapping by shifting elements
            const isADragged = dragInfo.current.itemId === itemA.id;
            const isBDragged = dragInfo.current.itemId === itemB.id;

            if (isADragged) {
              itemB.x += nx * overlap;
              itemB.y += ny * overlap;
            } else if (isBDragged) {
              itemA.x -= nx * overlap;
              itemA.y -= ny * overlap;
            } else {
              itemA.x -= nx * overlap * 0.5;
              itemA.y -= ny * overlap * 0.5;
              itemB.x += nx * overlap * 0.5;
              itemB.y += ny * overlap * 0.5;
            }

            // Calculate relative velocity along the normal vector
            const rvx = itemB.vx - itemA.vx;
            const rvy = itemB.vy - itemA.vy;
            const velAlongNormal = rvx * nx + rvy * ny;

            if (velAlongNormal < 0) {
              const restitution = 0.55; // Bounciness factor
              let impulse = -(1 + restitution) * velAlongNormal;
              impulse /= 2; // Split impulse equally between items

              if (!isADragged) {
                itemA.vx -= impulse * nx;
                itemA.vy -= impulse * ny;
              }
              if (!isBDragged) {
                itemB.vx += impulse * nx;
                itemB.vy += impulse * ny;
              }
            }
          }
        }
      }

      // Pass 3: Apply wall/floor constraints and render styles (with NO rotation)
      keys.forEach((id) => {
        const item = physicsItems.current[id];
        const el = itemsRef.current[id];
        if (!el) return;

        // If currently being dragged, update position via mouse
        if (dragInfo.current.itemId === id) {
          el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0)`;
          return;
        }

        // Collision with bottom floor (automatically bounded inside container)
        if (item.y + item.height >= cHeight - 15) {
          item.y = cHeight - 15 - item.height;
          item.vy = -item.vy * bounce;
          item.vx *= groundFriction;
        }

        // Collision with left/right walls
        if (item.x <= 0) {
          item.x = 0;
          item.vx = -item.vx * bounce;
        } else if (item.x + item.width >= cWidth) {
          item.x = cWidth - item.width;
          item.vx = -item.vx * bounce;
        }

        // Apply translation directly to DOM elements (No rotation applied)
        el.style.transform = `translate3d(${item.x}px, ${item.y}px, 0)`;
      });

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);

    // Mouse movement listener for googly eyes tracking
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const starItem = physicsItems.current['shape-orange-star'];
      if (!starItem || !pupilLeftRef.current || !pupilRightRef.current || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Calculate absolute center position of the star in client coordinates
      const starCenterX = containerRect.left + starItem.x + starItem.width / 2;
      const starCenterY = containerRect.top + starItem.y + starItem.height / 2;

      // Eye pupil tracking math
      const dx = e.clientX - starCenterX;
      const dy = e.clientY - starCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      
      // Maximum displacement of pupil inside the eye
      const maxDisp = 2.5;
      const dispX = (dx / dist) * maxDisp;
      const dispY = (dy / dist) * maxDisp;

      // Update pupil coordinates relative to their eye centers
      pupilLeftRef.current.setAttribute('cx', (45 + dispX).toString());
      pupilLeftRef.current.setAttribute('cy', (50 + dispY).toString());
      pupilRightRef.current.setAttribute('cx', (55 + dispX).toString());
      pupilRightRef.current.setAttribute('cy', (50 + dispY).toString());
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      clearTimeout(timer404);
      clearTimeout(timerButtons);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [initialized]);

  // Pointer interaction logic for Drag and Throw
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement | HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (!containerRef.current) return;
    
    const target = e.currentTarget;
    target.setPointerCapture(e.pointerId);

    const item = physicsItems.current[id];
    if (!item) return;

    const rect = target.getBoundingClientRect();

    dragInfo.current = {
      itemId: id,
      startX: e.clientX - rect.left,
      startY: e.clientY - rect.top,
      lastMouseX: e.clientX,
      lastMouseY: e.clientY
    };

    item.vx = 0;
    item.vy = 0;
    item.angularVelocity = 0;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement | HTMLAnchorElement>) => {
    const { itemId, startX, startY, lastMouseX, lastMouseY } = dragInfo.current;
    if (!itemId) return;

    const item = physicsItems.current[itemId];
    const el = itemsRef.current[itemId];
    if (!item || !el || !containerRef.current) return;

    const { width: cWidth, height: cHeight } = containerSize.current;

    // Calculate new position bounded inside container
    const containerRect = containerRef.current.getBoundingClientRect();
    let newX = e.clientX - containerRect.left - startX;
    let newY = e.clientY - containerRect.top - startY;

    // Boundary constraints
    newX = Math.max(0, Math.min(newX, cWidth - item.width));
    newY = Math.max(-200, Math.min(newY, cHeight - 15 - item.height));

    // Calculate velocity based on drag speed
    item.vx = (e.clientX - lastMouseX) * 0.8;
    item.vy = (e.clientY - lastMouseY) * 0.8;

    item.x = newX;
    item.y = newY;

    dragInfo.current.lastMouseX = e.clientX;
    dragInfo.current.lastMouseY = e.clientY;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement | HTMLAnchorElement>) => {
    const { itemId } = dragInfo.current;
    if (itemId) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    dragInfo.current.itemId = null;
  };

  return (
    <>
      <SEO 
        title="404 Page Not Found | RizeWorld" 
        description="Sorry, the page you are looking for doesn't exist, may have been moved, or the URL is incorrect." 
        noIndex={true}
      />
      
      {/* Custom Styles for 3D Squircle app icons */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .will-change-transform {
          will-change: transform;
        }
        
        /* Enable GPU Acceleration for smooth 60fps renders */
        .squircle-3d, .shape-3d-orange, .shape-3d-teal, .shape-3d-yellow, .shape-3d-pink, .shape-3d-heart {
          will-change: transform;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        /* 3D App Icon Squircle CSS Style matching the reference Instagram icon */
        .squircle-3d {
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(0, 0, 0, 0.15);
          box-shadow: 
            inset -5px -5px 10px rgba(0, 0, 0, 0.35), 
            inset 5px 5px 10px rgba(255, 255, 255, 0.6), 
            0px 8px 18px rgba(0, 0, 0, 0.22);
          position: absolute;
          transition: transform 0.1s ease;
        }
        
        /* Raised SVG Glyph / Typography */
        .glyph-raised {
          filter: drop-shadow(3px 3px 3px rgba(0, 0, 0, 0.35));
        }

        /* 3D Shape Gradients */
        .shape-3d-orange {
          background: radial-gradient(circle at 35% 35%, #ffd2b3 0%, #fcae7d 50%, #d8763c 100%);
          box-shadow: inset -6px -6px 12px rgba(0,0,0,0.35), inset 6px 6px 12px rgba(255,255,255,0.5), 4px 4px 15px rgba(0,0,0,0.2);
        }
        .shape-3d-teal {
          background: radial-gradient(circle at 35% 35%, #46dfd9 0%, #10a19d 50%, #005a57 100%);
          box-shadow: inset -6px -6px 12px rgba(0,0,0,0.35), inset 6px 6px 12px rgba(255,255,255,0.5), 4px 4px 15px rgba(0,0,0,0.2);
        }
        .shape-3d-yellow {
          background: radial-gradient(circle at 35% 35%, #fffa87 0%, #f7ec09 50%, #af9f00 100%);
          box-shadow: inset -6px -6px 12px rgba(0,0,0,0.35), inset 6px 6px 12px rgba(255,255,255,0.5), 4px 4px 15px rgba(0,0,0,0.2);
        }
        .shape-3d-pink {
          background: radial-gradient(circle at 50% 10%, #ffb3cc 0%, #ff75a0 60%, #b32a55 100%);
          box-shadow: inset -6px -6px 12px rgba(0,0,0,0.35), inset 6px 6px 12px rgba(255,255,255,0.5), 4px 4px 15px rgba(0,0,0,0.2);
        }
        .shape-3d-heart {
          background: radial-gradient(circle at 35% 35%, #7ea2ff 0%, #3b82f6 50%, #1d3b88 100%);
          box-shadow: inset -6px -6px 12px rgba(0,0,0,0.35), inset 6px 6px 12px rgba(255,255,255,0.5), 4px 4px 15px rgba(0,0,0,0.2);
        }

        /* 3D Embossed centerpiece style */
        .centerpiece-404 {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -240%) scale(0.9);
          opacity: 0;
          transition: transform 1.5s cubic-bezier(0.175, 0.885, 0.32, 1.15), opacity 1.2s ease;
          pointer-events: none;
          z-index: 40;
        }
        .centerpiece-404.enter {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
      `}</style>

      {/* Main 404 Container (Strict viewport height to prevent scrolling off-screen) */}
      <div 
        className="h-[100dvh] w-full bg-[#f3efe8] relative overflow-hidden flex flex-col font-sans select-none"
        role="main"
      >
        


        {/* Physics Canvas Area - Full Width Canvas (no max-width constraints) */}
        <div 
          ref={containerRef} 
          className="flex-1 w-full relative overflow-hidden"
        >
          
          {/* Falling 3D Embossed Centerpiece & Buttons */}
          <div className={`centerpiece-404 ${showCenter404 ? 'enter' : ''} flex flex-col items-center justify-center`}>
            <div className="flex items-center leading-none select-none" style={{ gap: '0.05em' }}>
              {['4', '0', '4'].map((digit, i) => (
                <span
                  key={i}
                  className="text-[11rem] sm:text-[18rem] md:text-[24rem] font-black tracking-tighter leading-none"
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(90deg, #FF2020 0%, #8B0000 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  {digit}
                </span>
              ))}
            </div>
            <div 
              className={`flex gap-4 mt-[-10px] sm:mt-[-25px] transition-all duration-700 ease-out transform ${
                showButtons ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
              } z-50`}
            >
              <Link 
                to="/" 
                className="bg-gradient-to-br from-[#2b2b2b] to-[#0c0c0c] text-white px-8 py-3.5 rounded-full font-black text-xs sm:text-sm tracking-wider uppercase shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.35),_inset_4px_4px_8px_rgba(255,255,255,0.2),_0px_8px_16px_rgba(0,0,0,0.25)] hover:scale-105 transition-transform pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                GO TO HOME
              </Link>
              <Link 
                to="/services" 
                className="bg-gradient-to-br from-[#fffa87] via-[#f7ec09] to-[#bfb300] text-black px-8 py-3.5 rounded-full font-black text-xs sm:text-sm tracking-wider uppercase shadow-[inset_-4px_-4px_8px_rgba(0,0,0,0.35),_inset_4px_4px_8px_rgba(255,255,255,0.6),_0px_8px_16px_rgba(0,0,0,0.2)] hover:scale-105 transition-transform pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                OUR SERVICES
              </Link>
            </div>
          </div>
          
          {/* ========================================================================= */}
          {/* GEOMETRIC SHAPES */}
          {/* ========================================================================= */}

          {/* Orange Spiky Star with Eyes */}
          <div
            id="shape-orange-star"
            ref={(el) => { itemsRef.current['shape-orange-star'] = el; }}
            onPointerDown={(e) => handlePointerDown(e, 'shape-orange-star')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute cursor-grab active:cursor-grabbing select-none touch-none z-30 will-change-transform shape-3d-orange rounded-full p-2 flex items-center justify-center"
            style={{ width: '150px', height: '150px', left: 0, top: 0 }}
          >
            <svg width="130" height="130" viewBox="0 0 100 100" className="text-white fill-current pointer-events-none drop-shadow-md">
              <path d="M50 0 L58 35 L93 15 L70 45 L100 60 L65 65 L80 95 L50 75 L20 95 L35 65 L0 60 L30 45 L7 15 L42 35 Z" fill="rgba(255,255,255,0.1)" />
              <circle cx="45" cy="50" r="7" fill="white" />
              <circle ref={pupilLeftRef} cx="45" cy="50" r="3" fill="black" />
              <circle cx="55" cy="50" r="7" fill="white" />
              <circle ref={pupilRightRef} cx="55" cy="50" r="3" fill="black" />
            </svg>
          </div>

          {/* Teal Curved Star */}
          <div
            id="shape-teal-star"
            ref={(el) => { itemsRef.current['shape-teal-star'] = el; }}
            onPointerDown={(e) => handlePointerDown(e, 'shape-teal-star')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute cursor-grab active:cursor-grabbing select-none touch-none z-30 will-change-transform shape-3d-teal rounded-full p-2 flex items-center justify-center"
            style={{ width: '160px', height: '160px', left: 0, top: 0 }}
          >
            <svg width="130" height="130" viewBox="0 0 100 100" className="text-white fill-current pointer-events-none drop-shadow-lg">
              <path d="M50 0 C50 30 70 50 100 50 C70 50 50 70 50 100 C50 70 30 50 0 50 C30 50 50 30 50 0 Z" fill="rgba(255,255,255,0.25)" />
            </svg>
          </div>

          {/* Blue Circle / Blob - Glossy 3D Sphere */}
          <div
            id="shape-blue-blob"
            ref={(el) => { itemsRef.current['shape-blue-blob'] = el; }}
            onPointerDown={(e) => handlePointerDown(e, 'shape-blue-blob')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute cursor-grab active:cursor-grabbing select-none touch-none z-30 will-change-transform"
            style={{ width: '80px', height: '80px', left: 0, top: 0 }}
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 via-blue-600 to-blue-900 shadow-[inset_-8px_-8px_16px_rgba(0,0,0,0.5),_inset_8px_8px_16px_rgba(255,255,255,0.4),_3px_3px_12px_rgba(0,0,0,0.3)] relative overflow-hidden pointer-events-none">
              <div className="absolute top-2 left-4 w-4 h-2 bg-white/60 rounded-full rotate-[-30deg]" />
            </div>
          </div>

          {/* Yellow Flower */}
          <div
            id="shape-yellow-flower"
            ref={(el) => { itemsRef.current['shape-yellow-flower'] = el; }}
            onPointerDown={(e) => handlePointerDown(e, 'shape-yellow-flower')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute cursor-grab active:cursor-grabbing select-none touch-none z-30 will-change-transform shape-3d-yellow rounded-full p-2 flex items-center justify-center"
            style={{ width: '130px', height: '130px', left: 0, top: 0 }}
          >
            <svg width="110" height="110" viewBox="0 0 100 100" className="text-white fill-current pointer-events-none drop-shadow-md">
              <path d="M50 15 C55 30 65 30 70 15 C75 30 85 35 75 45 C85 55 80 65 65 60 C55 75 45 75 35 60 C20 65 15 55 25 45 C15 35 25 30 30 15 C35 30 45 30 50 15 Z" fill="rgba(255,255,255,0.3)" />
            </svg>
          </div>

          {/* Pink Semi-circle / Arch */}
          <div
            id="shape-pink-arch"
            ref={(el) => { itemsRef.current['shape-pink-arch'] = el; }}
            onPointerDown={(e) => handlePointerDown(e, 'shape-pink-arch')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute cursor-grab active:cursor-grabbing select-none touch-none z-30 will-change-transform shape-3d-pink rounded-t-full flex items-center justify-center"
            style={{ width: '200px', height: '100px', left: 0, top: 0 }}
          >
            <svg width="180" height="90" viewBox="0 0 100 50" className="text-white fill-current pointer-events-none drop-shadow-lg">
              <path d="M 0,50 A 50,50 0 0,1 100,50 Z" fill="rgba(255,255,255,0.25)" />
            </svg>
          </div>

          {/* Blue Heart */}
          <div
            id="shape-blue-heart"
            ref={(el) => { itemsRef.current['shape-blue-heart'] = el; }}
            onPointerDown={(e) => handlePointerDown(e, 'shape-blue-heart')}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute cursor-grab active:cursor-grabbing select-none touch-none z-30 will-change-transform shape-3d-heart rounded-full p-3 flex items-center justify-center"
            style={{ width: '90px', height: '90px', left: 0, top: 0 }}
          >
            <svg width="70" height="70" viewBox="0 0 100 100" className="text-white fill-current pointer-events-none drop-shadow-md">
              <path d="M12 4.435C10.011-.54 3.966-.948 1.455 2.146-1.503 5.79.167 12.188 5.753 17.51L12 23l6.247-5.49c5.586-5.322 7.256-11.72 4.298-15.364-2.51-3.094-8.556-2.686-10.545 2.29z" transform="scale(4) translate(-2, -2)" fill="rgba(255,255,255,0.35)" />
            </svg>
          </div>

          {/* ========================================================================= */}
          {/* DYNAMIC BRAND & TECH SQUIRCLES (100+ Icons with Staggered Sizes) */}
          {/* ========================================================================= */}
          {visibleBrands.map((brand) => (
            <div
              key={brand.id}
              id={brand.id}
              ref={(el) => { itemsRef.current[brand.id] = el; }}
              onPointerDown={(e) => handlePointerDown(e, brand.id)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className={`squircle-3d bg-gradient-to-br ${brand.gradient} cursor-grab active:cursor-grabbing will-change-transform z-30 flex items-center justify-center`}
              style={{ 
                left: 0, 
                top: 0,
                width: `${defaultSizes[brand.id]?.w || 100}px`,
                height: `${defaultSizes[brand.id]?.h || 100}px`,
                borderRadius: `${(defaultSizes[brand.id]?.w || 100) * 0.24}px`
              }}
            >
              <div className="pointer-events-none w-full h-full flex items-center justify-center">
                {brand.logo}
              </div>
            </div>
          ))}



        </div>

      </div>
    </>
  );
}
