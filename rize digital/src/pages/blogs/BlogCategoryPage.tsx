import { useParams, Navigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight, Tag } from 'lucide-react';
import SEO from '../../components/common/SEO';
import Breadcrumbs from '../../components/common/Breadcrumbs';
import InternalLinkSection from '../../components/common/InternalLinkSection';
import BLOG_CATEGORIES from '../../data/blogCategories';

export default function BlogCategoryPage() {
  const { categorySlug } = useParams();
  const category = BLOG_CATEGORIES.find(c => c.slug === categorySlug);

  if (!category) {
    return <Navigate to="/blogs" replace />;
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://rizeworld.in/" },
      { "@type": "ListItem", "position": 2, "name": "Blogs", "item": "https://rizeworld.in/blogs" },
      { "@type": "ListItem", "position": 3, "name": category.name, "item": `https://rizeworld.in/blogs/category/${category.slug}` }
    ]
  };

  // Other categories for cross-linking
  const otherCategories = BLOG_CATEGORIES.filter(c => c.slug !== categorySlug);

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-24 text-left font-sans selection:bg-orange-500 selection:text-white">
      <SEO
        title={`${category.name} Blog Articles & Guides | RizeWorld`}
        description={category.description}
        canonicalUrl={`https://rizeworld.in/blogs/category/${category.slug}`}
        schema={[breadcrumbSchema]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Breadcrumbs items={[
          { name: "Blogs", path: "/blogs" },
          { name: category.name }
        ]} />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-orange-500 flex items-center gap-2 mb-4">
            <Tag className="w-4 h-4" /> Blog Category
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-gray-950 uppercase tracking-tighter mb-6">
            {category.name}
          </h1>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            {category.description}
          </p>
        </div>

        {/* CTA to service page */}
        <div className="bg-white border border-gray-200/80 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mb-16">
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Related Service</span>
            <span className="text-sm font-bold text-gray-950">{category.name} services by RizeWorld</span>
          </div>
          <Link
            to={category.servicePath}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-full transition-all shrink-0"
          >
            Explore Service <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Coming soon placeholder */}
        <div className="bg-white border border-gray-200/80 rounded-[2.5rem] p-12 md:p-20 text-center">
          <Sparkles className="w-12 h-12 text-orange-500/30 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-black text-gray-950 uppercase tracking-tight mb-4">
            Articles Coming Soon
          </h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
            We are curating expert {category.name.toLowerCase()} guides and insights. Check back soon or explore our blog for the latest content.
          </p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 border border-gray-200 hover:border-orange-500 text-gray-700 hover:text-orange-500 font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-full transition-all"
          >
            Browse All Blogs <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* Other Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500 block mb-2">Explore More</span>
          <h2 className="text-2xl md:text-3xl font-black text-gray-950 uppercase tracking-tight">
            Other Categories
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {otherCategories.map((cat, idx) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Link
                to={`/blogs/category/${cat.slug}`}
                className="bg-white border border-gray-200/80 rounded-2xl p-5 flex items-center gap-3 hover:border-orange-500/40 hover:shadow-md transition-all duration-300 group block"
              >
                <Tag size={14} className="text-gray-400 group-hover:text-orange-500 transition-colors shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 group-hover:text-orange-500 transition-colors">
                  {cat.name}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <InternalLinkSection />
    </div>
  );
}
