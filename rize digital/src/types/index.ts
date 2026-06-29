export interface CaseStudy {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
}

export interface StrategyCardType {
  badgeColor: string;
  badgeText: string;
  borderColor: string;
  title: string;
  description: string;
  logos: string[];
  glowColor?: string;
  isFeatured?: boolean;
}

export interface GrowthLab {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  video?: string;
  description: string;
}

export interface ThoughtLeadershipCard {
  id: string;
  image: string;
  title: string;
  source: string;
  date?: string;
  aspectRatio?: 'portrait' | 'square' | 'landscape';
}

export interface AwardTrophy {
  id: string;
  award: string;
  platform: string;
  year: string;
}
