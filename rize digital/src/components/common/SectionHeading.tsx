import React from 'react';

interface SectionHeadingProps {
  titleLine1: React.ReactNode;
  titleLine2?: React.ReactNode;
  description: string;
}

export const SectionHeading = ({ titleLine1, titleLine2, description }: SectionHeadingProps) => (
  <div className="max-w-5xl mb-16">
    <h2 className="text-black font-semibold leading-tight tracking-tight text-4xl sm:text-5xl lg:text-6xl">
      {titleLine1}
      {titleLine2 && (
        <>
          <br className="hidden sm:block" />
          {' '}{titleLine2}
        </>
      )}
    </h2>
    <p className="mt-6 text-gray-300 text-lg md:text-xl leading-relaxed max-w-2xl">
      {description}
    </p>
  </div>
);
