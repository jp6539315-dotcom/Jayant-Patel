import React, { useMemo, useState } from 'react';
import { ArrowRight, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import { BookCategory, BookListing } from '../types/exchange';
import { HERO_IMAGE_PATH } from '../data/initialCatalog';
import { BookCard } from './BookCard';

interface ExploreViewProps {
  books: BookListing[];
  savedIds: string[];
  bagIds: string[];
  onToggleSave: (bookId: string) => void;
  onSelectBook: (book: BookListing) => void;
  onNavigateSearch: () => void;
  onNavigateSell: () => void;
  onOpenBag: () => void;
}

const CATEGORIES: ('All' | BookCategory)[] = [
  'All',
  'Textbooks',
  'Design & Art',
  'Sciences',
  'Literature',
  'Philosophy',
];

type SortOption = 'newest' | 'price-asc' | 'savings-desc';

export const ExploreView: React.FC<ExploreViewProps> = ({
  books,
  savedIds,
  bagIds,
  onToggleSave,
  onSelectBook,
  onNavigateSearch,
  onNavigateSell,
  onOpenBag,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | BookCategory>('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const availableBooks = useMemo(() => {
    const filtered = books.filter((b) => {
      if (b.sold) return false;
      if (selectedCategory !== 'All' && b.category !== selectedCategory) return false;
      return true;
    });

    if (sortBy === 'price-asc') {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'savings-desc') {
      return [...filtered].sort((a, b) => {
        const savA = (a.retailPrice - a.price) / (a.retailPrice || 1);
        const savB = (b.retailPrice - b.price) / (b.retailPrice || 1);
        return savB - savA;
      });
    }
    return filtered;
  }, [books, selectedCategory, sortBy]);

  const totalRetailValue = useMemo(
    () => books.filter((b) => !b.sold).reduce((acc, b) => acc + (b.retailPrice - b.price), 0),
    [books]
  );

  return (
    <div className="space-y-8">
      {/* Editorial Hero Masthead */}
      <section className="overflow-hidden rounded-lg border border-[#E5DEC9] bg-white">
        <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
          <div className="flex flex-col justify-between p-5 sm:p-8 lg:col-span-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.04em] uppercase text-[#9E3D00]">
                Campus &amp; Community Book Commons
              </p>
              <h1 className="font-editorial mt-2.5 text-[30px] font-semibold leading-[1.18] tracking-[-0.015em] text-[#1C2226] sm:text-[40px] sm:leading-[1.15] [text-wrap:balance]">
                Pass good editions forward at half the bookstore price.
              </h1>
              <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-[#574239] sm:text-base">
                Buy verified textbooks, design monographs, and annotated classics directly from students and fellows on campus—with zero listing fees.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onNavigateSearch}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[4px] bg-[#D96528] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#9E3D00] active:scale-[0.98] whitespace-nowrap shrink-0"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onNavigateSell}
                className="inline-flex min-h-[44px] items-center justify-center rounded-[4px] border-[1.5px] border-[#1B3B4B] bg-transparent px-5 py-2.5 text-sm font-semibold text-[#1B3B4B] transition-colors duration-150 hover:bg-[#1B3B4B] hover:text-white active:scale-[0.98] whitespace-nowrap shrink-0"
              >
                List a Book
              </button>
            </div>
          </div>

          <div className="relative min-h-[220px] bg-[#F1EDE6] lg:col-span-6 lg:min-h-[340px]">
            <img
              src={HERO_IMAGE_PATH}
              alt="Sunlit oak reading table stacked with hardcover textbooks and literary editions"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1C2226]/30 via-transparent to-transparent lg:bg-gradient-to-r lg:from-white/15 lg:via-transparent"
            />
          </div>
        </div>

        {/* Clean Exchange Ledger Strip */}
        <div className="grid grid-cols-2 divide-y divide-[#E5DEC9] border-t border-[#E5DEC9] bg-[#F7F3EB] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          <div className="px-4 py-3 sm:px-5">
            <p className="text-[11px] font-semibold text-[#574239]">Active Volumes</p>
            <p className="tabular-nums mt-0.5 text-base font-bold text-[#1C2226]">
              {books.filter((b) => !b.sold).length} books listed
            </p>
          </div>
          <div className="px-4 py-3 sm:px-5">
            <p className="text-[11px] font-semibold text-[#574239]">Student Savings</p>
            <p className="tabular-nums mt-0.5 text-base font-bold text-[#1E7B6E]">
              ${totalRetailValue} off retail
            </p>
          </div>
          <div className="px-4 py-3 sm:px-5">
            <p className="text-[11px] font-semibold text-[#574239]">Campus Handoff</p>
            <p className="mt-0.5 text-base font-bold text-[#1C2226]">0% platform fee</p>
          </div>
          <div className="px-4 py-3 sm:px-5">
            <p className="text-[11px] font-semibold text-[#574239]">Verified Sellers</p>
            <p className="mt-0.5 text-base font-bold text-[#1B3B4B]">Campus ID checked</p>
          </div>
        </div>
      </section>

      {/* Catalog Filter & Toolbar */}
      <section aria-label="Book Catalog">
        <div className="flex flex-col gap-3 border-b border-[#E5DEC9] pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-editorial text-[24px] font-semibold leading-tight text-[#1C2226] sm:text-[28px]">
              Current Exchange Shelf
            </h2>
            <p className="mt-0.5 text-sm text-[#574239]">
              Inspected editions available for campus meetup or tracked Media Mail.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 rounded-[4px] border border-[#E5DEC9] bg-white px-3 py-2">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#574239]" />
              <label htmlFor="explore-sort" className="sr-only">
                Sort books
              </label>
              <select
                id="explore-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-xs font-semibold text-[#1C2226] focus:outline-none"
              >
                <option value="newest">Sort: Recently Listed</option>
                <option value="price-asc">Sort: Lowest Price</option>
                <option value="savings-desc">Sort: Highest Discount</option>
              </select>
            </div>

            {bagIds.length > 0 && (
              <button
                type="button"
                onClick={onOpenBag}
                className="inline-flex min-h-[38px] items-center gap-2 rounded-[4px] bg-[#1B3B4B] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#152e3b] whitespace-nowrap shrink-0"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span className="tabular-nums">Bag ({bagIds.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div
          role="tablist"
          aria-label="Filter by book category"
          className="no-scrollbar mt-4 flex items-center gap-2 overflow-x-auto pb-1"
        >
          {CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedCategory(category)}
                className={`min-h-[40px] rounded-[4px] border px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 ${
                  active
                    ? 'border-[#1B3B4B] bg-[#1B3B4B] text-white'
                    : 'border-[#E5DEC9] bg-white text-[#1C2226] hover:border-[#1B3B4B]/50 hover:bg-[#F7F3EB]'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Book Listing Grid: 2-column mobile, 3-column tablet, 4-column desktop */}
        {availableBooks.length === 0 ? (
          <div className="mt-8 rounded-lg border border-[#E5DEC9] bg-white p-10 text-center">
            <p className="font-editorial text-xl font-semibold text-[#1C2226]">
              No active listings in {selectedCategory}
            </p>
            <p className="mt-1.5 text-sm text-[#574239]">
              Try another category or be the first to list an edition from your shelf.
            </p>
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className="mt-4 inline-flex min-h-[42px] items-center rounded-[4px] border-[1.5px] border-[#1B3B4B] px-4 py-2 text-xs font-semibold text-[#1B3B4B] hover:bg-[#1B3B4B] hover:text-white"
            >
              Show All Books
            </button>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {availableBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                isSaved={savedIds.includes(book.id)}
                onToggleSave={onToggleSave}
                onSelect={onSelectBook}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
