'use client';

import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  logoUrl?: string;
  alt?: string;
  className?: string;
  href?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  logoUrl = '/logo.svg',
  alt = 'eLab Digital Studio Logo',
  className = 'h-14 sm:h-16 w-auto',
  href = '/',
}) => {
  const content = (
    <div className="inline-flex items-center justify-center transition-transform hover:scale-105">
      <img
        src={logoUrl || '/logo.svg'}
        alt={alt}
        className={`${className} object-contain`}
      />
    </div>
  );

  if (href) {
    return <Link href={href} className="inline-block">{content}</Link>;
  }

  return content;
};
