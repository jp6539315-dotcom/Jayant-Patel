import React, { useState } from 'react';
import { BookPlus, CheckCircle2, ShoppingBag, Trash2 } from 'lucide-react';
import { BookListing, OrderRecord } from '../types/exchange';
import { BookCard } from './BookCard';
import { BookCover } from './BookCover';
import { ConditionSlip } from './ConditionSlip';

interface BookshelfViewProps {
  books: BookListing[];
  savedIds: string[];
  bagIds: string[];
  orders: OrderRecord[];
  initialSection?: 'listings' | 'saved' | 'orders';
  onToggleSave: (bookId: string) => void;
  onSelectBook: (book: BookListing) => void;
  onToggleSold: (bookId: string) => void;
  onDeleteListing: (bookId: string) => void;
  onRemoveFromBag: (bookId: string) => void;
  onCheckoutBag: () => void;
  onNavigateSell: () => void;
  onNavigateExplore: () => void;
}

export const BookshelfView: React.FC<BookshelfViewProps> = ({
  books,
  savedIds,
  bagIds,
  orders,
  initialSection = 'listings',
  onToggleSave,
  onSelectBook,
  onToggleSold,
  onDeleteListing,
  onRemoveFromBag,
  onCheckoutBag,
  onNavigateSell,
  onNavigateExplore,
}) => {
  const [section, setSection] = useState<'listings' | 'saved' | 'orders'>(initialSection);

  const ownListings = books.filter((b) => b.isOwnListing);
  const savedBooks = books.filter((b) => savedIds.includes(b.id));
  const bagBooks = books.filter((b) => bagIds.includes(b.id) && !b.sold);
  const bagSubtotal = bagBooks.reduce((sum, b) => sum + b.price, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-[#E5DEC9] pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-editorial text-[28px] font-semibold leading-tight text-[#1C2226]">
            My Bookshelf
          </h1>
          <p className="mt-1 text-sm text-[#574239]">
            Manage your active listings, saved editions, exchange bag, and order receipts.
          </p>
        </div>
        <button
          type="button"
          onClick={onNavigateSell}
          className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-[4px] bg-[#D96528] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#9E3D00] whitespace-nowrap shrink-0"
        >
          <BookPlus className="h-4 w-4" />
          <span>List a Book</span>
        </button>
      </div>

      {/* Section Tabs */}
      <div
        role="tablist"
        aria-label="Bookshelf sections"
        className="flex flex-wrap items-center gap-2"
      >
        {(
          [
            { id: 'listings', label: `My Listings (${ownListings.length})` },
            { id: 'saved', label: `Saved Books (${savedBooks.length})` },
            { id: 'orders', label: `Bag & Orders (${bagBooks.length + orders.length})` },
          ] as const
        ).map((tab) => {
          const active = section === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSection(tab.id)}
              className={`min-h-[40px] rounded-[4px] border px-4 py-1.5 text-xs font-semibold tabular-nums transition-colors ${
                active
                  ? 'border-[#1B3B4B] bg-[#1B3B4B] text-white'
                  : 'border-[#E5DEC9] bg-white text-[#1C2226] hover:bg-[#F7F3EB]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Section 1: My Listings */}
      {section === 'listings' && (
        <div className="space-y-4">
          {ownListings.length === 0 ? (
            <div className="rounded-lg border border-[#E5DEC9] bg-white p-10 text-center">
              <p className="font-editorial text-xl font-semibold text-[#1C2226]">
                Your seller shelf is empty
              </p>
              <p className="mt-1.5 text-sm text-[#574239]">
                List textbooks or novels from previous terms and earn back up to 60% of retail.
              </p>
              <button
                type="button"
                onClick={onNavigateSell}
                className="mt-4 inline-flex min-h-[44px] items-center rounded-[4px] bg-[#D96528] px-5 py-2 text-xs font-semibold text-white hover:bg-[#9E3D00]"
              >
                Create First Listing
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {ownListings.map((book) => (
                <div
                  key={book.id}
                  className="flex flex-col gap-4 rounded-lg border border-[#E5DEC9] bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-16 shrink-0">
                      <BookCover
                        src={book.coverImage}
                        title={book.title}
                        author={book.author}
                        clothColor={book.clothColor}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <ConditionSlip condition={book.condition} />
                        {book.sold && (
                          <span className="rounded-[4px] bg-[#1C2226] px-2 py-0.5 text-[11px] font-semibold text-white">
                            Exchanged
                          </span>
                        )}
                      </div>
                      <h3 className="font-editorial mt-1.5 text-lg font-semibold leading-snug text-[#1C2226]">
                        {book.title}
                      </h3>
                      <p className="text-xs text-[#574239]">
                        {book.author} · <strong className="tabular-nums text-[#1C2226]">${book.price}</strong> · {book.meetupSpot}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleSold(book.id)}
                      className="min-h-[38px] rounded-[4px] border-[1.5px] border-[#1B3B4B] px-3 py-1.5 text-xs font-semibold text-[#1B3B4B] hover:bg-[#1B3B4B] hover:text-white whitespace-nowrap"
                    >
                      {book.sold ? 'Mark Available' : 'Mark Sold'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteListing(book.id)}
                      aria-label={`Remove ${book.title}`}
                      className="inline-flex min-h-[38px] items-center gap-1 rounded-[4px] border border-[#E5DEC9] px-3 py-1.5 text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/40"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Section 2: Saved Books */}
      {section === 'saved' && (
        <div>
          {savedBooks.length === 0 ? (
            <div className="rounded-lg border border-[#E5DEC9] bg-white p-10 text-center">
              <p className="font-editorial text-xl font-semibold text-[#1C2226]">
                No saved editions yet
              </p>
              <p className="mt-1.5 text-sm text-[#574239]">
                Bookmark books while browsing to compare prices and editions here.
              </p>
              <button
                type="button"
                onClick={onNavigateExplore}
                className="mt-4 inline-flex min-h-[44px] items-center rounded-[4px] border-[1.5px] border-[#1B3B4B] px-5 py-2 text-xs font-semibold text-[#1B3B4B] hover:bg-[#1B3B4B] hover:text-white"
              >
                Explore Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {savedBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  isSaved={true}
                  onToggleSave={onToggleSave}
                  onSelect={onSelectBook}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Section 3: Bag & Orders */}
      {section === 'orders' && (
        <div className="space-y-6">
          {/* Active Exchange Bag */}
          <div className="rounded-lg border border-[#E5DEC9] bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5DEC9] pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-[#1B3B4B]" />
                <h2 className="font-editorial text-xl font-semibold text-[#1C2226]">
                  Exchange Bag ({bagBooks.length})
                </h2>
              </div>
              {bagBooks.length > 0 && (
                <p className="text-sm font-bold tabular-nums text-[#1C2226]">
                  Subtotal: ${bagSubtotal}
                </p>
              )}
            </div>

            {bagBooks.length === 0 ? (
              <p className="py-5 text-sm text-[#574239]">
                Your bag is empty. Add editions from the catalog to check out together.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {bagBooks.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 border-b border-[#E5DEC9]/60 pb-3 last:border-b-0 last:pb-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="w-12 shrink-0">
                        <BookCover
                          src={item.coverImage}
                          title={item.title}
                          author={item.author}
                          clothColor={item.clothColor}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-editorial truncate text-base font-semibold text-[#1C2226]">
                          {item.title}
                        </p>
                        <p className="text-xs text-[#574239]">
                          {item.condition} · <strong className="tabular-nums text-[#1C2226]">${item.price}</strong>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveFromBag(item.id)}
                      className="rounded-[4px] px-2.5 py-1.5 text-xs font-semibold text-[#574239] hover:bg-[#FAF6EE] hover:text-[#ba1a1a]"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onCheckoutBag}
                    className="inline-flex min-h-[46px] w-full items-center justify-center rounded-[4px] bg-[#D96528] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#9E3D00] sm:w-auto"
                  >
                    Proceed to Checkout (${bagSubtotal})
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Confirmed Order Ledger */}
          <div className="space-y-3">
            <h2 className="font-editorial text-xl font-semibold text-[#1C2226]">
              Order History ({orders.length})
            </h2>
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border border-[#E5DEC9] bg-white p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5DEC9] pb-3">
                  <div>
                    <p className="text-xs font-bold tracking-[0.02em] uppercase text-[#1B3B4B] tabular-nums">
                      Order #{order.orderNumber} · {order.placedAt}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-[#1E7B6E]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{order.status}</span>
                    </p>
                  </div>
                  <p className="text-base font-bold tabular-nums text-[#1C2226]">
                    Total: ${order.total.toFixed(2)}
                  </p>
                </div>

                <div className="mt-3 space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.bookId}
                      className="flex items-center justify-between text-sm text-[#1C2226]"
                    >
                      <span className="font-editorial font-medium">{item.title}</span>
                      <span className="font-semibold tabular-nums">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                  <p className="pt-1 text-xs text-[#574239]">
                    {order.fulfillment}: {order.destination}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
