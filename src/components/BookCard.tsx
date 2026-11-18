import React from 'react';
import { Bookmark, CheckCircle2 } from 'lucide-react';
import { BookListing } from '../types/exchange';
import { BookCover } from './BookCover';
import { ConditionSlip } from './ConditionSlip';

interface BookCardProps {
  book: BookListing;
  isSaved: boolean;
  onToggleSave: (bookId: string) => void;
  onSelect: (book: BookListing) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  isSaved,
  onToggleSave,
  onSelect,
}) => {
  const savingsPct =
    book.retailPrice > book.price
      ? Math.round(((book.retailPrice - book.price) / book.retailPrice) * 100)
      : 0;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-[#E5DEC9] bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-warm">
      <button
        type="button"
        onClick={() => onSelect(book)}
        className="flex flex-1 flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#1B3B4B]"
      >
        <div className="relative p-2.5 pb-0">
          <BookCover
            src={book.coverImage}
            title={book.title}
            author={book.author}
            clothColor={book.clothColor}
          />
          <div className="absolute left-4 top-4">
            <ConditionSlip condition={book.condition} className="shadow-xs" />
          </div>
          {book.sold && (
            <div className="absolute inset-x-2.5 bottom-0 top-2.5 flex items-center justify-center rounded-[3px] bg-[#1C2226]/55">
              <span className="rounded-[4px] bg-[#FAF6EE] px-2.5 py-1 text-xs font-bold tracking-wide text-[#1C2226]">
                Exchanged
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between p-3 pt-2.5">
          <div>
            <p className="mb-1 flex items-center gap-1.5 truncate text-[11px] font-medium text-[#574239]">
              <span>{book.category}</span>
              {book.courseCode && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{book.courseCode}</span>
                </>
              )}
            </p>
            <h3 className="font-editorial line-clamp-2 text-[17px] font-semibold leading-[1.3] text-[#1C2226]">
              {book.title}
            </h3>
            <p className="mt-1 line-clamp-1 text-xs font-normal text-[#574239]">
              {book.author}
            </p>
          </div>

          <div className="mt-3 flex items-baseline justify-between gap-2 border-t border-[#E5DEC9]/70 pt-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className="tabular-nums text-[17px] font-bold text-[#1C2226]">
                ${book.price}
              </span>
              {book.retailPrice > book.price && (
                <span className="tabular-nums text-xs font-medium text-[#574239]/75 line-through">
                  ${book.retailPrice}
                </span>
              )}
            </div>
            {savingsPct >= 20 && (
              <span className="rounded-[4px] bg-[#D96528] px-1.5 py-0.5 text-[10px] font-bold tracking-[0.02em] text-white tabular-nums whitespace-nowrap">
                {savingsPct}% Off
              </span>
            )}
          </div>

          <div className="mt-1.5 flex items-center gap-1 text-[11px] text-[#574239]">
            <span className="truncate">{book.seller.name}</span>
            {book.seller.verified && (
              <CheckCircle2
                className="h-3 w-3 shrink-0 text-[#1E7B6E]"
                aria-label="Verified campus seller"
              />
            )}
            <span aria-hidden="true">·</span>
            <span className="shrink-0 truncate">{book.deliveryMode === 'Both' ? 'Pickup or Ship' : book.deliveryMode}</span>
          </div>
        </div>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSave(book.id);
        }}
        aria-label={isSaved ? `Remove ${book.title} from saved books` : `Save ${book.title}`}
        aria-pressed={isSaved}
        className="absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-[4px] border border-[#E5DEC9] bg-white/95 text-[#1B3B4B] transition-colors hover:bg-[#FAF6EE] focus-visible:outline-2 focus-visible:outline-[#1B3B4B]"
      >
        <Bookmark
          className={`h-4 w-4 ${isSaved ? 'fill-[#D96528] text-[#D96528]' : 'text-[#1B3B4B]'}`}
        />
      </button>
    </article>
  );
};
