import React, { useState } from 'react';
import { BookPlus, Check, Upload } from 'lucide-react';
import {
  BookCategory,
  BookCondition,
  BookListing,
  DeliveryMode,
} from '../types/exchange';
import { COVER_PRESETS, ISBN_LOOKUP_SAMPLES } from '../data/initialCatalog';
import { BookCover } from './BookCover';
import { ConditionSlip } from './ConditionSlip';

interface SellViewProps {
  onPublishBook: (newBook: BookListing) => void;
  onCancel: () => void;
}

const CATEGORIES: BookCategory[] = [
  'Textbooks',
  'Design & Art',
  'Sciences',
  'Literature',
  'Philosophy',
];

const CONDITIONS: { value: BookCondition; hint: string }[] = [
  { value: 'Like New', hint: 'Crisp spine, clean pages, zero writing' },
  { value: 'Gently Used', hint: 'Minor shelf wear or neat pencil notes' },
  { value: 'Acceptable', hint: 'Solid binding, heavier highlighting/wear' },
];

const CLOTH_COLORS = [
  { label: 'Deep Ink Navy', hex: '#1B3B4B' },
  { label: 'Vintage Teal', hex: '#1E7B6E' },
  { label: 'Ember Terracotta', hex: '#9E3D00' },
  { label: 'Scholarly Umber', hex: '#574239' },
];

export const SellView: React.FC<SellViewProps> = ({ onPublishBook, onCancel }) => {
  const [isbn, setIsbn] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [edition, setEdition] = useState('Hardcover Edition');
  const [courseCode, setCourseCode] = useState('');
  const [category, setCategory] = useState<BookCategory>('Textbooks');
  const [condition, setCondition] = useState<BookCondition>('Like New');
  const [conditionNote, setConditionNote] = useState(
    'Clean pages, intact binding, stored in a smoke-free study.'
  );
  const [retailPrice, setRetailPrice] = useState('72');
  const [price, setPrice] = useState('32');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('Both');
  const [meetupSpot, setMeetupSpot] = useState('Main Library Courtyard');
  const [coverImage, setCoverImage] = useState<string | undefined>(COVER_PRESETS[0].path);
  const [clothColor, setClothColor] = useState<string>('#1B3B4B');
  const [isbnMessage, setIsbnMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleIsbnLookup = (codeToCheck?: string) => {
    const cleaned = (codeToCheck ?? isbn).replace(/[^0-9X]/gi, '');
    if (codeToCheck) setIsbn(codeToCheck);
    const match = ISBN_LOOKUP_SAMPLES[cleaned];
    if (match) {
      setTitle(match.title);
      setAuthor(match.author);
      setEdition(match.edition);
      setCategory(match.category);
      setRetailPrice(String(match.retailPrice));
      setPrice(String(Math.round(match.retailPrice * 0.45)));
      setCourseCode(match.courseCode);
      setIsbnMessage(`Edition matched: ${match.title}`);
      setFormError(null);
    } else {
      setIsbnMessage('ISBN not in quick index—fill title and author below.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCoverImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const parsedPrice = Math.max(1, Number(price) || 0);
  const parsedRetail = Math.max(parsedPrice, Number(retailPrice) || parsedPrice);
  const discountPct =
    parsedRetail > parsedPrice
      ? Math.round(((parsedRetail - parsedPrice) / parsedRetail) * 100)
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      setFormError('Please enter both the book title and author name.');
      return;
    }

    const newListing: BookListing = {
      id: `bk-${Date.now()}`,
      title: title.trim(),
      author: author.trim(),
      isbn: isbn.trim() || '978-0-000-00000-0',
      edition: edition.trim() || 'Standard Edition',
      courseCode: courseCode.trim() ? courseCode.trim().toUpperCase() : undefined,
      category,
      condition,
      conditionNote: conditionNote.trim() || 'Good reading copy.',
      price: parsedPrice,
      retailPrice: parsedRetail,
      coverImage,
      clothColor,
      deliveryMode,
      meetupSpot: meetupSpot.trim() || 'Main Library Courtyard',
      seller: {
        name: 'You (Active Listing)',
        handle: '@reader_you',
        department: 'Campus Member',
        verified: true,
        completedExchanges: 8,
        rating: '5.00',
      },
      isOwnListing: true,
      listedAt: 'Just now',
    };

    onPublishBook(newListing);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E5DEC9] pb-4">
        <h1 className="font-editorial text-[28px] font-semibold leading-tight text-[#1C2226]">
          List a Book on the Exchange
        </h1>
        <p className="mt-1 text-sm text-[#574239]">
          Pass along finished coursework or literary editions directly to fellow readers with zero commission.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-8">
          {/* ISBN Quick Lookup */}
          <div className="rounded-lg border border-[#E5DEC9] bg-white p-4 sm:p-5">
            <label
              htmlFor="sell-isbn"
              className="block text-xs font-bold tracking-[0.04em] uppercase text-[#1B3B4B]"
            >
              ISBN-13 Quick Fill (Optional)
            </label>
            <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
              <input
                id="sell-isbn"
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="e.g. 9780262033848"
                className="h-11 flex-1 rounded-[4px] border border-[#E5DEC9] bg-white px-3.5 text-sm text-[#1C2226] placeholder:text-[#574239]/60 focus:border-[1.5px] focus:border-[#1B3B4B] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleIsbnLookup()}
                className="inline-flex min-h-[44px] items-center justify-center rounded-[4px] border-[1.5px] border-[#1B3B4B] px-4 text-xs font-semibold text-[#1B3B4B] hover:bg-[#1B3B4B] hover:text-white whitespace-nowrap shrink-0"
              >
                Lookup ISBN
              </button>
            </div>
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-[#574239]">
              <span>Try sample:</span>
              {Object.entries(ISBN_LOOKUP_SAMPLES).map(([code, info]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleIsbnLookup(code)}
                  className="rounded-[4px] bg-[#FAF6EE] px-2 py-1 font-medium text-[#1B3B4B] hover:bg-[#F1EDE6]"
                >
                  {info.courseCode} ({code.slice(-4)})
                </button>
              ))}
            </div>
            {isbnMessage && (
              <p className="mt-2 text-xs font-semibold text-[#1E7B6E]">{isbnMessage}</p>
            )}
          </div>

          {/* Core Book Details */}
          <div className="space-y-4 rounded-lg border border-[#E5DEC9] bg-white p-4 sm:p-5">
            <h2 className="font-editorial text-xl font-semibold text-[#1C2226]">
              Book Details
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="sell-title" className="block text-xs font-semibold text-[#1C2226]">
                  Book Title *
                </label>
                <input
                  id="sell-title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Introduction to Algorithms"
                  className="mt-1.5 h-11 w-full rounded-[4px] border border-[#E5DEC9] bg-white px-3.5 text-sm text-[#1C2226] focus:border-[1.5px] focus:border-[#1B3B4B] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="sell-author" className="block text-xs font-semibold text-[#1C2226]">
                  Author(s) *
                </label>
                <input
                  id="sell-author"
                  type="text"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Thomas H. Cormen"
                  className="mt-1.5 h-11 w-full rounded-[4px] border border-[#E5DEC9] bg-white px-3.5 text-sm text-[#1C2226] focus:border-[1.5px] focus:border-[#1B3B4B] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="sell-edition" className="block text-xs font-semibold text-[#1C2226]">
                  Edition / Binding
                </label>
                <input
                  id="sell-edition"
                  type="text"
                  value={edition}
                  onChange={(e) => setEdition(e.target.value)}
                  placeholder="e.g. 4th Hardcover Edition"
                  className="mt-1.5 h-11 w-full rounded-[4px] border border-[#E5DEC9] bg-white px-3.5 text-sm text-[#1C2226] focus:border-[1.5px] focus:border-[#1B3B4B] focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="sell-category" className="block text-xs font-semibold text-[#1C2226]">
                  Category
                </label>
                <select
                  id="sell-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as BookCategory)}
                  className="mt-1.5 h-11 w-full rounded-[4px] border border-[#E5DEC9] bg-white px-3 text-sm text-[#1C2226] focus:border-[1.5px] focus:border-[#1B3B4B] focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="sell-course" className="block text-xs font-semibold text-[#1C2226]">
                  Course Code (Optional)
                </label>
                <input
                  id="sell-course"
                  type="text"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g. ARCH 204"
                  className="mt-1.5 h-11 w-full rounded-[4px] border border-[#E5DEC9] bg-white px-3.5 text-sm text-[#1C2226] focus:border-[1.5px] focus:border-[#1B3B4B] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Condition & Pricing */}
          <div className="space-y-4 rounded-lg border border-[#E5DEC9] bg-white p-4 sm:p-5">
            <h2 className="font-editorial text-xl font-semibold text-[#1C2226]">
              Condition &amp; Exchange Price
            </h2>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {CONDITIONS.map((item) => {
                const selected = condition === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setCondition(item.value)}
                    className={`flex flex-col items-start rounded-[4px] border p-3 text-left transition-colors ${
                      selected
                        ? 'border-[1.5px] border-[#1B3B4B] bg-[#FAF6EE]'
                        : 'border-[#E5DEC9] bg-white hover:bg-[#FAF6EE]/60'
                    }`}
                  >
                    <div className="flex w-full items-center justify-between">
                      <ConditionSlip condition={item.value} />
                      {selected && <Check className="h-4 w-4 text-[#1B3B4B]" />}
                    </div>
                    <span className="mt-2 text-xs leading-snug text-[#574239]">{item.hint}</span>
                  </button>
                );
              })}
            </div>

            <div>
              <label htmlFor="sell-note" className="block text-xs font-semibold text-[#1C2226]">
                Condition Notes (Highlighting, corners, inserts)
              </label>
              <textarea
                id="sell-note"
                rows={2}
                value={conditionNote}
                onChange={(e) => setConditionNote(e.target.value)}
                className="mt-1.5 w-full rounded-[4px] border border-[#E5DEC9] bg-white p-3 text-sm text-[#1C2226] focus:border-[1.5px] focus:border-[#1B3B4B] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="sell-price" className="block text-xs font-semibold text-[#1C2226]">
                  Your Asking Price ($)
                </label>
                <input
                  id="sell-price"
                  type="number"
                  min={1}
                  max={500}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-[4px] border border-[#E5DEC9] bg-white px-3.5 text-sm font-bold tabular-nums text-[#1C2226] focus:border-[1.5px] focus:border-[#1B3B4B] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="sell-retail" className="block text-xs font-semibold text-[#1C2226]">
                  Original Retail Price ($)
                </label>
                <input
                  id="sell-retail"
                  type="number"
                  min={1}
                  max={600}
                  value={retailPrice}
                  onChange={(e) => setRetailPrice(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-[4px] border border-[#E5DEC9] bg-white px-3.5 text-sm tabular-nums text-[#574239] focus:border-[1.5px] focus:border-[#1B3B4B] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="sell-delivery" className="block text-xs font-semibold text-[#1C2226]">
                  Handoff Option
                </label>
                <select
                  id="sell-delivery"
                  value={deliveryMode}
                  onChange={(e) => setDeliveryMode(e.target.value as DeliveryMode)}
                  className="mt-1.5 h-11 w-full rounded-[4px] border border-[#E5DEC9] bg-white px-3 text-sm text-[#1C2226] focus:border-[1.5px] focus:border-[#1B3B4B] focus:outline-none"
                >
                  <option value="Both">Campus Meetup or Media Mail</option>
                  <option value="Campus Meetup">Campus Meetup only</option>
                  <option value="Media Mail">Media Mail shipping only</option>
                </select>
              </div>
              <div>
                <label htmlFor="sell-spot" className="block text-xs font-semibold text-[#1C2226]">
                  Preferred Campus Meetup Spot
                </label>
                <input
                  id="sell-spot"
                  type="text"
                  value={meetupSpot}
                  onChange={(e) => setMeetupSpot(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-[4px] border border-[#E5DEC9] bg-white px-3.5 text-sm text-[#1C2226] focus:border-[1.5px] focus:border-[#1B3B4B] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Cover Selection */}
          <div className="space-y-3 rounded-lg border border-[#E5DEC9] bg-white p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-editorial text-xl font-semibold text-[#1C2226]">
                Edition Cover Photo
              </h2>
              <label className="inline-flex min-h-[36px] cursor-pointer items-center gap-1.5 rounded-[4px] border border-[#1B3B4B] px-3 py-1.5 text-xs font-semibold text-[#1B3B4B] hover:bg-[#FAF6EE]">
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="sr-only"
                />
              </label>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
              {COVER_PRESETS.map((preset) => {
                const active = coverImage === preset.path;
                return (
                  <button
                    key={preset.path}
                    type="button"
                    onClick={() => setCoverImage(preset.path)}
                    className={`overflow-hidden rounded-[4px] border p-1 text-left transition-colors ${
                      active ? 'border-[1.5px] border-[#D96528] bg-[#FAF6EE]' : 'border-[#E5DEC9]'
                    }`}
                  >
                    <img
                      src={preset.path}
                      alt={preset.label}
                      referrerPolicy="no-referrer"
                      className="aspect-[3/4] w-full rounded-[2px] object-cover"
                    />
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => setCoverImage(undefined)}
                className={`flex flex-col items-center justify-center rounded-[4px] border p-2 text-center text-[11px] font-semibold ${
                  !coverImage
                    ? 'border-[1.5px] border-[#D96528] bg-[#FAF6EE] text-[#1C2226]'
                    : 'border-[#E5DEC9] text-[#574239]'
                }`}
              >
                <span
                  style={{ backgroundColor: clothColor }}
                  className="mb-1.5 h-8 w-6 rounded-[2px]"
                />
                Clothbound
              </button>
            </div>

            {!coverImage && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-semibold text-[#574239]">Binding color:</span>
                {CLOTH_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setClothColor(c.hex)}
                    aria-label={c.label}
                    style={{ backgroundColor: c.hex }}
                    className={`h-7 w-7 rounded-[4px] border-2 ${
                      clothColor === c.hex ? 'border-[#D96528]' : 'border-transparent'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {formError && (
            <div className="rounded-[4px] border border-[#ba1a1a]/30 bg-[#ffdad6] px-4 py-3 text-sm font-medium text-[#93000a]">
              {formError}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-[4px] bg-[#D96528] px-6 py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#9E3D00] active:scale-[0.98] sm:flex-none"
            >
              <BookPlus className="h-4 w-4" />
              <span>Publish Listing</span>
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex min-h-[48px] items-center justify-center rounded-[4px] border-[1.5px] border-[#1B3B4B] px-5 py-3 text-sm font-semibold text-[#1B3B4B] hover:bg-[#1B3B4B] hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Live Listing Card Preview */}
        <aside className="lg:col-span-4">
          <div className="sticky top-20 rounded-lg border border-[#E5DEC9] bg-[#F7F3EB] p-5">
            <p className="text-xs font-bold tracking-[0.04em] uppercase text-[#574239]">
              Live Catalog Card Preview
            </p>
            <div className="mx-auto mt-4 max-w-[260px] rounded-lg border border-[#E5DEC9] bg-white p-3">
              <div className="relative">
                <BookCover
                  src={coverImage}
                  title={title || 'Untitled Academic Volume'}
                  author={author || 'Author Name'}
                  clothColor={clothColor}
                />
                <div className="absolute left-2 top-2">
                  <ConditionSlip condition={condition} />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-[11px] font-medium text-[#574239]">
                  {category}
                  {courseCode ? ` · ${courseCode.toUpperCase()}` : ''}
                </p>
                <h3 className="font-editorial mt-0.5 line-clamp-2 text-[17px] font-semibold leading-snug text-[#1C2226]">
                  {title || 'Untitled Academic Volume'}
                </h3>
                <p className="mt-0.5 line-clamp-1 text-xs text-[#574239]">
                  {author || 'Author Name'}
                </p>
                <div className="mt-3 flex items-baseline justify-between border-t border-[#E5DEC9]/70 pt-2.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="tabular-nums text-[17px] font-bold text-[#1C2226]">
                      ${parsedPrice}
                    </span>
                    {parsedRetail > parsedPrice && (
                      <span className="tabular-nums text-xs text-[#574239]/75 line-through">
                        ${parsedRetail}
                      </span>
                    )}
                  </div>
                  {discountPct >= 20 && (
                    <span className="rounded-[4px] bg-[#D96528] px-1.5 py-0.5 text-[10px] font-bold text-white tabular-nums">
                      {discountPct}% Off
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
