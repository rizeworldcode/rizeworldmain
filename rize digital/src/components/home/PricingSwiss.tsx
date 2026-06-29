"use client";

import React from "react";

interface PricingTier {
    letter: string;
    name: string;
    price?: string | number;
    priceLabel?: string;
}

interface PricingSwissProps {
    title?: string;
    title2?: string;
    description?: string;
    badgeText?: string;
    tiers?: PricingTier[];
    backgroundColor?: string;
    containerBgColor?: string;
    containerBorderColor?: string;
    containerShadowColor?: string;
    titleColor?: string;
    badgeBgColor?: string;
    badgeTextColor?: string;
    tierBgColor?: string;
    tierHoverBgColor?: string;
    tierBorderColor?: string;
    tierLetterColor?: string;
    tierNameColor?: string;
    tierPriceColor?: string;
    tierPriceLabelColor?: string;
    buttonBgColor?: string;
    buttonTextColor?: string;
    buttonHoverBgColor?: string;
    buttonHoverTextColor?: string;
    buttonBorderColor?: string;
    buttonText?: string;
}

const PricingSwiss: React.FC<PricingSwissProps> = ({
    title = "PRI",
    title2 = "CING",
    description,
    backgroundColor = "#FAFAF8",
    containerBgColor = "#ffffff",
    containerBorderColor = "#E5E7EB",
    containerShadowColor = "rgba(26, 86, 219, 0.08)",
    titleColor = "#111827",
    badgeText = "International\nStyle\nSystem",
    tiers = [
        { letter: "A", name: "Basic", price: 20, priceLabel: "PER MONTH" },
        { letter: "B", name: "Standard", price: 40, priceLabel: "PER MONTH" },
        { letter: "C", name: "Premium", price: 60, priceLabel: "PER MONTH" },
    ],
    badgeBgColor = "#1A56DB",
    badgeTextColor = "#ffffff",
    tierBgColor = "#ffffff",
    tierHoverBgColor = "#EFF6FF",
    tierBorderColor = "#E5E7EB",
    tierLetterColor = "#111827",
    tierNameColor = "#374151",
    tierPriceColor = "#1A56DB",
    tierPriceLabelColor = "#6B7280",
    buttonBgColor = "#1A56DB",
    buttonTextColor = "#ffffff",
    buttonHoverBgColor = "#4F46E5",
    buttonHoverTextColor = "#ffffff",
    buttonBorderColor = "#1A56DB",
    buttonText = "Select",
}) => {
    return (
        <div className="min-h-screen p-4 flex items-center justify-center font-sans" style={{ backgroundColor, color: titleColor }}>
            <div className="max-w-6xl w-full border-4" style={{ backgroundColor: containerBgColor, borderColor: containerBorderColor, boxShadow: `12px 12px 0px 0px ${containerShadowColor}` }}>
                <div className="grid grid-cols-1 lg:grid-cols-12" style={{ borderColor: containerBorderColor, borderBottomWidth: '4px' }}>
                    <div className="lg:col-span-8 p-12 border-b-4 lg:border-b-0 lg:border-r-4 flex flex-col justify-center" style={{ borderColor: containerBorderColor }}>
                        <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8]">
                            {title}<br />{title2}
                        </h1>
                        {description && (
                            <p className="mt-8 text-xl font-medium max-w-lg leading-relaxed" style={{ color: titleColor }}>
                                {description}
                            </p>
                        )}
                    </div>
                    <div className="lg:col-span-4 p-8 flex items-center justify-center" style={{ backgroundColor: badgeBgColor }}>
                        <div className="font-bold text-xl uppercase transform -rotate-12" style={{ color: badgeTextColor }}>
                            {badgeText.split('\n').map((line, i) => <React.Fragment key={i}>{line}{i < badgeText.split('\n').length - 1 && <br />}</React.Fragment>)}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3">
                    {tiers.map((tier, i) => (
                        <div key={i} className="group relative h-96 overflow-hidden border-b-4 md:border-b-0 md:border-r-4 last:border-r-0" style={{ borderColor: tierBorderColor }}>
                            <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" style={{ backgroundColor: tierHoverBgColor }} />

                            <div className="relative h-full p-8 flex flex-col justify-between" style={{ backgroundColor: tierBgColor }}>
                                <div>
                                    <h3 className="text-8xl font-black mb-2" style={{ color: tierLetterColor }}>{tier.letter}</h3>
                                    <p className="font-bold uppercase tracking-widest text-sm" style={{ color: tierNameColor }}>
                                        {tier.name}
                                    </p>
                                </div>

                                {tier.price !== undefined && (
                                    <div className="text-right">
                                        <div className="text-4xl font-bold" style={{ color: tierPriceColor }}>{tier.price}</div>
                                        {tier.priceLabel && <div className="text-xs font-mono mt-2" style={{ color: tierPriceLabelColor }}>{tier.priceLabel}</div>}
                                    </div>
                                )}

                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <button className="px-8 py-3 font-bold uppercase border-2 transition-colors" style={{ backgroundColor: buttonBgColor, color: buttonTextColor, borderColor: buttonBorderColor }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = buttonHoverBgColor; e.currentTarget.style.color = buttonHoverTextColor; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = buttonBgColor; e.currentTarget.style.color = buttonTextColor; }}>
                                        {buttonText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PricingSwiss;
