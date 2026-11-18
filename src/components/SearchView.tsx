import React, { useMemo, useState } from 'react';
import { Check, Search, X } from 'lucide-react';
import { BookCategory, BookCondition, BookListing } from '../types/exchange';
import { BookCard } from './BookCard';

interface SearchViewProps {
  books: BookListing[];
  savedIds: string[];
  onToggleSave: (bookId: string) => void;
  onSelectBook: (book: BookListing) => void;
}

const ALL_CONDITIONS: BookCondition[] = ['Like New', 'Gently Used', 'Acceptable'];
const ALL_CATEGORIES: ('All' | BookCategory)[] = [
  'All',
  'Textbooks',
  'Design & Art',
  'Sciences',
  'Literature',
  'Philosophy',
];

const QUICK_TOPICS = ['CS 312', 'Bauhaus', 'Homer', 'Botany', 'Economics', '978-0-300'];

type PriceCap = 'any' | '15' | '30' | '50';
type DeliveryFilter = 'any' | 'Campus Meetup' | 'Media Mail';

export const SearchView: React.FC<SearchViewProps> = ({
  books,
  savedIds,
  onToggleSave,
  onSelectBook,
}) => {
  const [query, setQuery] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<BookCondition[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'All' | BookCategory>('All');
  const [priceCap, setPriceCap] = useState<PriceCap>('any');
  const [deliveryFilter, setDeliveryFilter] = useState<DeliveryFilter>('any');

  const toggleCondition = (cond: BookCondition) => {
    setSelectedConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  const resetFilters = () => {
    setQuery('');
    setSelectedConditions([]);
    setSelectedCategory('All');
    setPriceCap('any');
    setDeliveryFilter('any');
  };

  const hasActiveFilters =
    query.trim().length > 0 ||
    selectedConditions.length > 0 ||
    selectedCategory !== 'All' ||
    priceCap !== 'any' ||
    deliveryFilter !== 'any';

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((book) => {
      if (book.sold) return false;

      if (q) {
        const haystack = [
          book.title,
          book.author,
          book.isbn,
          book.courseCode || '',
          book.category,
          book.edition,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      if (selectedCategory !== 'All' && book.category !== selectedCategory) return false;
      if (selectedConditions.length > 0 && !selectedConditions.includes(book.condition)) {
        return false;
      }
      if (priceCap !== 'any' && book.price > Number(priceCap)) return false;

      if (deliveryFilter !== 'any') {
        if (book.deliveryMode !== 'Both' && book.deliveryMode !== deliveryFilter) {
          return false;
        }
      }

      return true;
    });
  }, [books, query, selectedCategory, selectedConditions, priceCap, deliveryFilter]);

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E5DEC9] pb-4">
        <h1 className="font-editorial text-[28px] font-semibold leading-tight text-[#1C2226]">
          Search the Exchange
        </h1>
        <p className="mt-1 text-sm text-[#574239]">
          Find textbooks by course code, author, title, or 13-digit ISBN.
        </p>

        {/* Search Input */}
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#574239]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, author, or ISBN..."
              aria-label="Search by title, author, or ISBN"
              className="h-12 w-full rounded-[4px] border border-[#E5DEC9] bg-white pl-10 pr-10 text-sm text-[#1C2226] placeholder:text-[#574239]/70 transition-colors focus:border-[1.5px] focus:border-[#1B3B4B] focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search query"
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-[4px] text-[#574239] hover:bg-[#F7F3EB]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex min-h-[44px] items-center justify-center rounded-[4px] border-[1.5px] border-[#1B3B4B] px-4 text-xs font-semibold text-[#1B3B4B] transition-colors hover:bg-[#1B3B4B] hover:text-white whitespace-nowrap shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Quick Topic Shortcuts */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#574239]">Quick searches:</span>
          {QUICK_TOPICS.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => setQuery(term)}
              className="rounded-[4px] border border-[#E5DEC9] bg-white px-2.5 py-1 text-xs font-medium text-[#1B3B4B] transition-colors hover:border-[#1B3B4B] hover:bg-[#F7F3EB]"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Filters + Results Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Filter Ledger */}
        <aside className="space-y-5 rounded-lg border border-[#E5DEC9] bg-white p-4 sm:p-5 lg:col-span-3 lg:self-start">
          <div>
            <h2 className="text-xs font-bold tracking-[0.04em] uppercase text-[#1B3B4B]">
              Subject Category
            </h2>
            <div className="mt-2.5 flex flex-wrap gap-1.5 lg:flex-col">
              {ALL_CATEGORIES.map((cat) => {
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-[4px] px-2.5 py-1.5 text-left text-xs font-semibold transition-colors ${
                      active
                        ? 'bg-[#1B3B4B] text-white'
                        : 'bg-[#FAF6EE] text-[#1C2226] hover:bg-[#F1EDE6]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[#E5DEC9] pt-4">
            <h2 className="text-xs font-bold tracking-[0.04em] uppercase text-[#1B3B4B]">
              Book Condition
            </h2>
            <div className="mt-3 space-y-2.5">
              {ALL_CONDITIONS.map((cond) => {
                const checked = selectedConditions.includes(cond);
                return (
                  <button
                    key={cond}
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    onClick={() => toggleCondition(cond)}
                    className="flex min-h-[36px] w-full items-center gap-3 text-left text-sm font-medium text-[#1C2226]"
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border-[1.5px] border-[#1B3B4B] transition-colors ${
                        checked ? 'bg-[#1B3B4B] text-[#FAF6EE]' : 'bg-white'
                      }`}
                    >
                      {checked && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
                    </span>
                    <span>{cond}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[#E5DEC9] pt-4">
            <h2 className="text-xs font-bold tracking-[0.04em] uppercase text-[#1B3B4B]">
              Maximum Price
            </h2>
            <div className="mt-3 space-y-2.5" role="radiogroup" aria-label="Maximum Price">
              {(
                [
                  { value: 'any', label: 'Any price' },
                  { value: '15', label: 'Under $15' },
                  { value: '30', label: 'Under $30' },
                  { value: '50', label: 'Under $50' },
                ] as { value: PriceCap; label: string }[]
              ).map((option) => {
                const selected = priceCap === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setPriceCap(option.value)}
                    className="flex min-h-[36px] w-full items-center gap-3 text-left text-sm font-medium text-[#1C2226]"
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#1B3B4B] transition-colors ${
                        selected ? 'bg-[#1B3B4B]' : 'bg-white'
                      }`}
                    >
                      {selected && <span className="h-2 w-2 rounded-full bg-[#FAF6EE]" />}
                    </span>
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[#E5DEC9] pt-4">
            <h2 className="text-xs font-bold tracking-[0.04em] uppercase text-[#1B3B4B]">
              Handoff Method
            </h2>
            <div className="mt-3 space-y-2.5" role="radiogroup" aria-label="Handoff Method">
              {(
                [
                  { value: 'any', label: 'Pickup or Shipping' },
                  { value: 'Campus Meetup', label: 'Campus Meetup only' },
                  { value: 'Media Mail', label: 'Media Mail shipping' },
                ] as { value: DeliveryFilter; label: string }[]
              ).map((option) => {
                const selected = deliveryFilter === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setDeliveryFilter(option.value)}
                    className="flex min-h-[36px] w-full items-center gap-3 text-left text-sm font-medium text-[#1C2226]"
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#1B3B4B] transition-colors ${
                        selected ? 'bg-[#1B3B4B]' : 'bg-white'
                      }`}
                    >
                      {selected && <span className="h-2 w-2 rounded-full bg-[#FAF6EE]" />}
                    </span>
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Results Grid */}
        <div className="lg:col-span-9">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-[#1C2226] tabular-nums">
              Showing {results.length} {results.length === 1 ? 'edition' : 'editions'}
            </p>
          </div>

          {results.length === 0 ? (
            <div className="rounded-lg border border-[#E5DEC9] bg-white p-10 text-center">
              <p className="font-editorial text-xl font-semibold text-[#1C2226]">
                No matching editions found
              </p>
              <p className="mt-1.5 text-sm text-[#574239]">
                Widen your price ceiling or clear selected conditions to see more books.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 inline-flex min-h-[44px] items-center rounded-[4px] bg-[#1B3B4B] px-5 py-2 text-xs font-semibold text-white hover:bg-[#152e3b]"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {results.map((book) => (
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
        </div>
      </div>
    </div>
  );
};
