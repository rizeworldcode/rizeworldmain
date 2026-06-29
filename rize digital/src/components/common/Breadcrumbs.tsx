import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold uppercase tracking-wider mb-8">
      <Link to="/" className="hover:text-rize-primary transition-colors">Home</Link>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-1.5">
          <ChevronRight size={10} className="text-gray-400 shrink-0" />
          {item.path ? (
            <Link to={item.path} className="hover:text-rize-primary transition-colors">
              {item.name}
            </Link>
          ) : (
            <span className="text-rize-primary">{item.name}</span>
          )}
        </span>
      ))}
    </div>
  );
}
