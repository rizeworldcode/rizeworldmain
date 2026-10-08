import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  isDark?: boolean;
}

export default function Breadcrumbs({ items, isDark }: BreadcrumbsProps) {
  return (
    <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider mb-8 ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
      <Link to="/" className={isDark ? "hover:text-amber-400 transition-colors" : "hover:text-rize-primary transition-colors"}>Home</Link>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1.5">
          <ChevronRight size={10} className={isDark ? "text-zinc-600 shrink-0" : "text-gray-400 shrink-0"} />
          {item.path ? (
            <Link to={item.path} className={isDark ? "hover:text-amber-400 transition-colors" : "hover:text-rize-primary transition-colors"}>
              {item.name}
            </Link>
          ) : (
            <span className={isDark ? "text-amber-400" : "text-rize-primary"}>{item.name}</span>
          )}
        </span>
      ))}
    </div>
  );
}
