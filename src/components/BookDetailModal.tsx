import React from 'react';
import {
  Bookmark,
  CheckCircle2,
  MapPin,
  MessageSquare,
  ShoppingBag,
  Truck,
  X,
} from 'lucide-react';
import { BookListing } from '../types/exchange';
import { BookCover } from './BookCover';
import { ConditionSlip } from './ConditionSlip';

interface BookDetailModalProps {
  book: BookListing | null;
  isSaved: boolean;
  isInBag: boolean;
  onClose: () => void;
  onToggleSave: (bookId: string) => void;
  onAddToBag: (bookId: string) => void;
  onBuyNow: (book: BookListing) => void;
  onMessageSeller: (book: BookListing) => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({
  book,
  isSaved,
  isInBag,
  onClose,
  onToggleSave,
  onAddToBag,
  onBuyNow,
  onMessageSeller,
}) => {
  if (!book) return null;

  const savingsPct =
    book.retailPrice > book.price
      ? Math.round(((book.retailPrice - book.price) / book.retailPrice) * 100)
      : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#1C2226]/55 backdrop-blur-[2px] sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-detail-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-[12px] border border-[#E5DEC9] bg-[#FAF6EE] shadow-warm sm:max-w-3xl sm:rounded-lg"
      >
        {/* Sticky Top Bar inside Sheet/Modal */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E5DEC9] bg-[#FAF6EE]/95 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#574239]">
            <span>{book.category}</span>
            {book.courseCode && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-[#1B3B4B]">{book.courseCode}</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span>Listed {book.listedAt}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close book details"
            className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-[#E5DEC9] bg-white text-[#1C2226] hover:bg-[#F1EDE6]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-12 sm:p-6">
          {/* Left: Cover & Price Lockup */}
          <div className="sm:col-span-5">
            <div className="mx-auto max-w-[240px] sm:max-w-none">
              <BookCover
                src={book.coverImage}
                title={book.title}
                author={book.author}
                clothColor={book.clothColor}
              />
            </div>

            <div className="mt-4 rounded-lg border border-[#E5DEC9] bg-white p-3.5">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs font-medium text-[#574239]">Exchange Price</span>
                  <div className="flex items-baseline gap-2">
                    <span className="tabular-nums text-2xl font-bold text-[#1C2226]">
                      ${book.price}
                    </span>
                    {book.retailPrice > book.price && (
                      <span className="tabular-nums text-sm text-[#574239]/75 line-through">
                        ${book.retailPrice} retail
                      </span>
                    )}
                  </div>
                </div>
                {savingsPct > 0 && (
                  <span className="rounded-[4px] bg-[#D96528] px-2 py-1 text-xs font-bold text-white tabular-nums">
                    Save {savingsPct}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Metadata, Condition, Seller & Actions */}
          <div className="flex flex-col justify-between space-y-5 sm:col-span-7">
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <ConditionSlip condition={book.condition} />
                  <span className="text-xs font-medium text-[#574239]">
                    {book.edition}
                  </span>
                </div>
                <h2
                  id="book-detail-title"
                  className="font-editorial text-[26px] font-semibold leading-[1.2] text-[#1C2226]"
                >
                  {book.title}
                </h2>
                <p className="mt-1 text-sm font-medium text-[#574239]">by {book.author}</p>
                <p className="mt-1 text-xs tabular-nums text-[#574239]">
                  ISBN-13: {book.isbn}
                </p>
              </div>

              <div className="rounded-lg border border-[#E5DEC9] bg-white p-3.5">
                <p className="text-xs font-bold tracking-[0.03em] uppercase text-[#1B3B4B]">
                  Seller Inspection Note
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[#1C2226]">
                  {book.conditionNote}
                </p>
              </div>

              {/* Handoff & Seller Box */}
              <div className="space-y-2.5 rounded-lg border border-[#E5DEC9] bg-white p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-bold text-[#1C2226]">
                      <span>{book.seller.name}</span>
                      {book.seller.verified && (
                        <CheckCircle2 className="h-4 w-4 text-[#1E7B6E]" />
                      )}
                    </p>
                    <p className="text-xs text-[#574239]">
                      {book.seller.department} · {book.seller.completedExchanges} exchanges · ★ {book.seller.rating}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 border-t border-[#E5DEC9] pt-2.5 text-xs text-[#574239]">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#1B3B4B]" />
                    <span>Campus meetup: {book.meetupSpot}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-3.5 w-3.5 shrink-0 text-[#1B3B4B]" />
                    <span>
                      Delivery: {book.deliveryMode === 'Both' ? 'Campus Meetup or Media Mail ($4.50)' : book.deliveryMode}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              {book.sold ? (
                <div className="rounded-[4px] border border-[#E5DEC9] bg-[#F1EDE6] px-4 py-3 text-center text-sm font-semibold text-[#574239]">
                  This edition has already been exchanged.
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-2.5 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => onBuyNow(book)}
                      className="inline-flex min-h-[48px] flex-1 items-center justify-center rounded-[4px] bg-[#D96528] px-5 py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#9E3D00] active:scale-[0.98]"
                    >
                      Buy Now · ${book.price}
                    </button>
                    <button
                      type="button"
                      onClick={() => onAddToBag(book.id)}
                      className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[4px] border-[1.5px] px-4 py-3 text-sm font-semibold transition-colors ${
                        isInBag
                          ? 'border-[#1E7B6E] bg-[#E6F4F1] text-[#1E7B6E]'
                          : 'border-[#1B3B4B] bg-white text-[#1B3B4B] hover:bg-[#1B3B4B] hover:text-white'
                      }`}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>{isInBag ? 'In Bag' : 'Add to Bag'}</span>
                    </button>
                  </div>

                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => onMessageSeller(book)}
                      className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-[4px] bg-[#1B3B4B] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#152e3b]"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Message Seller</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleSave(book.id)}
                      className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-[4px] border border-[#E5DEC9] bg-white px-4 py-2.5 text-xs font-semibold text-[#1C2226] hover:bg-[#F7F3EB]"
                    >
                      <Bookmark
                        className={`h-4 w-4 ${
                          isSaved ? 'fill-[#D96528] text-[#D96528]' : 'text-[#1B3B4B]'
                        }`}
                      />
                      <span>{isSaved ? 'Saved' : 'Save'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
