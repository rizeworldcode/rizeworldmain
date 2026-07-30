import { Cpu, Repeat, Megaphone, BarChart } from 'lucide-react';

const METHODOLOGIES = [
  {
    title: "Marketing Automation",
    description: "We deploy advanced marketing automation and online marketing services to nurture leads, improve retention, and drive business growth through digital marketing.",
    icon: <Cpu size={24} className="text-white" />,
    color: "bg-blue-500"
  },
  {
    title: "Automated Workflow",
    description: "Our agency integrates automated workflows for lead generation and client management, optimizing digital business services and operational speed.",
    icon: <Repeat size={24} className="text-white" />,
    color: "bg-orange-500"
  },
  {
    title: "Ad Tech Platforms",
    description: "As a full service digital marketing agency, we handle ad tech configuration for programmatic campaigns, Google ads, and targeted social media marketing services.",
    icon: <Megaphone size={24} className="text-white" />,
    color: "bg-emerald-500"
  },
  {
    title: "Analytics and Reporting",
    description: "We build custom ROI dashboards and event tracking funnels, serving as a dedicated digital solutions company to monitor organic traffic growth.",
    icon: <BarChart size={24} className="text-white" />,
    color: "bg-purple-500"
  }
];

const SectionHeader = () => (
  <div className="max-w-5xl mx-auto text-center mb-16 md:mb-20">
    <h2 className="text-gray-900 font-bold leading-tight tracking-tight text-5xl md:text-6xl lg:text-7xl">
      Our Strategic <span className="text-orange-500">Methodology</span>
    </h2>
    <p className="mt-6 text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
      We leverage digital marketing solutions to streamline operations and enhance your online visibility.
    </p>
  </div>
);

export default function StrategySection() {
  return (
    <section className="relative overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12 py-24 md:py-32 bg-stone-50 border-t border-gray-200">
      <SectionHeader />
      
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          
          {METHODOLOGIES.map((item, index) => (
            <div key={index} className="group relative rounded-4xl overflow-hidden border border-gray-200 bg-white p-8 lg:p-12 transition-all duration-500 ease-in-out hover:-translate-y-2 hover:shadow-xl hover:border-orange-500/30 flex flex-col">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-md group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 ease-out ${item.color}`}>
                {item.icon}
              </div>
              <h3 className="text-black text-3xl font-bold leading-tight mb-5">{item.title}</h3>
              <p className="text-gray-600 text-lg leading-relaxed font-medium">{item.description}</p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
