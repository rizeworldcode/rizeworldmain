export default function HeroSection() {
  return (
    <>
      {/* Spacer to protect against fixed Header overlap */}
      <div className="w-full min-h-[100px] lg:min-h-[120px]" />

      {/* Flex spacer to push content to bottom on large screens */}
      <div className="flex-1 min-h-8" />

      {/* Bottom Row */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 hero-content-entrance">
        
        {/* Hero Headline */}
        <h1 className="text-hero max-w-lg xl:max-w-2xl mb-4 lg:mb-8 text-white!" style={{ WebkitTextFillColor: "#ffffff", color: "#ffffff" }}>
        <br />
       <span style={{ fontFamily: "var(--font-sans)", fontStyle: "italic", fontWeight: 400, WebkitTextFillColor: "#ffffff" }} className="text-white! brightness-90"></span>
        </h1>

      </div>
    </>
  );
}
