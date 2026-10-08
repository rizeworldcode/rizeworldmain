import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, PhoneCall, AlertCircle } from 'lucide-react';
import { HiRocketLaunch } from 'react-icons/hi2';
import { getPackageById } from '../data/pricingData';
import SEO from '../components/common/SEO';

export default function PackageProposal() {
  const { packageId } = useParams<{ packageId: string }>();
  const navigate = useNavigate();

  const pkg = packageId ? getPackageById(packageId) : undefined;

  if (!pkg) {
    return (
      <div className="min-h-screen bg-stone-100 pt-40 pb-20 px-4 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
          <AlertCircle className="w-12 h-12 text-[#c25e00] mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Package Proposal Not Found</h1>
          <p className="text-sm text-gray-600 mb-6">
            The requested package proposal does not exist or may have been updated.
          </p>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 bg-[#c25e00] hover:bg-[#a34e00] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <ArrowLeft size={16} /> View All Packages
          </Link>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-stone-100/90 pt-32 pb-24 text-left font-sans print:p-0 print:m-0 print:bg-white">
      <SEO
        title={`${pkg.name} Proposal | RizeWorld Digital`}
        description={`Formal proposal and scope of deliverables for ${pkg.name} (${pkg.categoryTitle}).`}
        canonicalUrl={`https://rizeworld.in/pricing/${pkg.id}`}
      />

      {/* Top Floating Control Bar (Hidden on Print) */}
      <div className="max-w-4xl mx-auto px-4 mb-6 print:hidden">
        <div className="bg-white/95 backdrop-blur-md border border-stone-200 rounded-2xl p-3 sm:p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => navigate(`/pricing?category=${pkg.category}`)}
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-700 hover:text-[#c25e00] transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Pricing ({pkg.categoryTitle})
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-full transition-colors cursor-pointer border border-stone-300"
            >
              <Printer size={15} /> Print / Save PDF
            </button>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-[#c25e00] hover:bg-[#a34e00] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition-colors shadow-sm cursor-pointer"
            >
              <PhoneCall size={14} /> Accept Proposal
            </Link>
          </div>
        </div>
      </div>

      {/* Main Executive Proposal Document Sheet */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white border border-stone-300/80 rounded-sm p-6 sm:p-12 md:p-14 shadow-lg print:border-none print:shadow-none print:p-0 print:m-0 print:w-full">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-4">
            {/* Logo */}
            <div className="shrink-0">
              <Link to="/">
                <img
                  src="/images/logo/RW.png"
                  alt="RizeWorld"
                  className="h-12 md:h-14 w-auto object-contain"
                />
              </Link>
              <div className="w-36 h-0.5 bg-[#c25e00] mt-2.5" />
            </div>

            {/* Document Titles */}
            <div className="sm:text-right">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#c25e00] leading-tight tracking-tight">
                {pkg.proposalTitle}
              </h1>
              <p className="text-base sm:text-lg font-medium text-gray-700 mt-1">
                {pkg.name}
              </p>
            </div>
          </div>

          {/* Full-width Divider Line */}
          <div className="border-t-2 border-[#c25e00] my-6 sm:my-8" />

          {/* Prepared For Section */}
          <section className="mb-8">
            <h2 className="text-lg font-serif font-bold text-[#c25e00] mb-1.5">
              Prepared For
            </h2>
            <p className="text-sm font-semibold text-gray-900">
              Valued Client / Business Growth Partner
            </p>
          </section>

          {/* Package Overview Section */}
          <section className="mb-8">
            <h2 className="text-lg font-serif font-bold text-[#c25e00] mb-2.5">
              Package Overview
            </h2>
            <div className="space-y-1.5 text-sm text-gray-800">
              <p className="leading-relaxed">
                <span className="font-bold text-gray-950">Ideal For: </span>
                <span className="text-gray-700">{pkg.idealFor}</span>
              </p>
            </div>
          </section>

          {/* Features Included Section (Formal Table) */}
          <section className="mb-8">
            <h2 className="text-lg font-serif font-bold text-[#c25e00] mb-3">
              Features Included
            </h2>

            <div className="overflow-x-auto border border-[#c25e00]/90">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#c25e00] text-white font-serif">
                    <th className="py-2.5 px-3 w-12 text-center text-xs font-bold border-r border-[#d97706]/40">
                      #
                    </th>
                    <th className="py-2.5 px-4 w-1/3 sm:w-2/5 text-xs font-bold border-r border-[#d97706]/40 uppercase tracking-wider">
                      Feature
                    </th>
                    <th className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-300">
                  {pkg.featureCategories && pkg.featureCategories.length > 0 ? (
                    (() => {
                      let counter = 0;
                      return pkg.featureCategories.map((group, gIdx) => (
                        <React.Fragment key={gIdx}>
                          <tr className="bg-amber-50/80 border-t-2 border-b border-[#c25e00]/30 font-bold text-gray-900">
                            <td colSpan={3} className="py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-[#c25e00]">
                              {group.category}
                            </td>
                          </tr>
                          {group.items.map((item, itemIdx) => {
                            counter++;
                            return (
                              <tr
                                key={itemIdx}
                                className="hover:bg-amber-50/30 transition-colors border-t border-gray-200"
                              >
                                <td className="py-2.5 px-3 text-center text-xs text-gray-600 font-semibold border-r border-gray-300">
                                  {counter}
                                </td>
                                <td className="py-2.5 px-4 text-xs font-bold text-gray-900 border-r border-gray-300">
                                  {item.feature}
                                </td>
                                <td className="py-2.5 px-4 text-xs text-gray-700 leading-snug">
                                  {item.details}
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      ));
                    })()
                  ) : (
                    pkg.tableFeatures.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-amber-50/30 transition-colors"
                      >
                        <td className="py-2.5 px-3 text-center text-xs text-gray-600 font-semibold border-r border-gray-300">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-4 text-xs font-bold text-gray-900 border-r border-gray-300">
                          {item.feature}
                        </td>
                        <td className="py-2.5 px-4 text-xs text-gray-700 leading-snug">
                          {item.details}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Investment & Scope Section */}
          <section className="mb-8">
            <h2 className="text-lg font-serif font-bold text-[#c25e00] mb-3">
              Investment & Scope
            </h2>

            <div className="border border-[#c25e00] p-3 sm:p-3.5 bg-white font-bold text-sm text-gray-900">
              {pkg.name}
            </div>

            <p className="text-xs italic text-gray-600 mt-2 leading-relaxed">
              Note: {pkg.investmentNote || "More content, stronger branding, improved engagement, and dedicated account support for businesses ready to scale."}
            </p>
          </section>

          {/* Not Included Section */}
          {pkg.notIncluded && pkg.notIncluded.length > 0 && (
            <section className="mb-8 p-5 bg-stone-50 border border-stone-200">
              <h2 className="text-sm font-serif font-bold text-[#c25e00] mb-2.5">
                Not Included
              </h2>
              <ul className="space-y-1.5 text-xs text-gray-700">
                {pkg.notIncluded.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-gray-400 font-bold">-</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Payment Terms Section */}
          {pkg.paymentTerms && pkg.paymentTerms.length > 0 && (
            <section className="mb-8 p-5 bg-amber-50/50 border border-[#c25e00]/30 rounded-sm">
              <h2 className="text-sm font-serif font-bold text-[#c25e00] mb-2.5">
                Payment Terms
              </h2>
              <ul className="space-y-1.5 text-xs text-gray-800">
                {pkg.paymentTerms.map((term, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-[#c25e00] font-bold text-sm leading-none">•</span>
                    <span className="font-medium">{term}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Proposal Validity Footer */}
          <div className="border-t border-gray-300 pt-4 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-gray-500">
            <p>This proposal is valid for 15 days from the date of sharing.</p>
            <p className="font-mono text-[10px] text-gray-400">
              Ref: RW-PROP-{pkg.id.toUpperCase()}
            </p>
          </div>

          {/* Bottom Call to Action (Hidden on Print) */}
          <div className="mt-10 pt-6 border-t-2 border-[#c25e00]/20 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
            <div>
              <p className="text-xs font-bold uppercase text-gray-500">Ready to move forward?</p>
              <p className="text-base font-bold text-gray-950">Let's initiate your campaign with RizeWorld.</p>
            </div>
            <Link
              to="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#c25e00] hover:bg-[#a34e00] text-white px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-md"
            >
              <HiRocketLaunch size={15} /> Contact & Get Started
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
