import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface BookCoverProps {
  src?: string;
  title: string;
  author: string;
  clothColor?: string;
  className?: string;
}

export const BookCover: React.FC<BookCoverProps> = ({
  src,
  title,
  author,
  clothColor = '#1B3B4B',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const showImage = Boolean(src) && !imgError;

  if (showImage) {
    return (
      <div
        className={`relative aspect-[3/4] w-full overflow-hidden rounded-[3px] bg-[#F1EDE6] shadow-spine ${className}`}
      >
        <img
          src={src}
          alt={`Cover of ${title} by ${author}`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/15 to-transparent"
        />
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: clothColor }}
      className={`relative flex aspect-[3/4] w-full flex-col justify-between overflow-hidden rounded-[3px] p-4 text-[#FAF6EE] shadow-spine ${className}`}
    >
      {/* Subtle bound spine groove */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-3 border-r border-white/15 bg-black/15"
      />
      <div className="pl-2.5 pt-1">
        <span className="block text-[10px] font-semibold tracking-wider uppercase text-[#FAF6EE]/75">
          Academic Edition
        </span>
      </div>
      <div className="my-auto pl-2.5">
        <div className="mb-3 h-px w-8 bg-[#FAF6EE]/35" />
        <p className="font-editorial line-clamp-4 text-base font-semibold leading-snug text-[#FAF6EE] sm:text-lg">
          {title}
        </p>
      </div>
      <div className="flex items-end justify-between border-t border-white/15 pl-2.5 pt-2.5">
        <span className="line-clamp-1 text-[11px] font-medium text-[#FAF6EE]/85">
          {author}
        </span>
        <BookOpen className="h-3.5 w-3.5 shrink-0 text-[#FAF6EE]/65" />
      </div>
    </div>
  );
};
