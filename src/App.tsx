import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Compass,
  Library,
  MessageSquare,
  Plus,
  Search,
  ShoppingBag,
} from 'lucide-react';
import {
  ActiveTab,
  BookListing,
  MessageThread,
  OrderRecord,
} from './types/exchange';
import {
  INITIAL_BOOKS,
  INITIAL_ORDERS,
  INITIAL_THREADS,
} from './data/initialCatalog';
import { ExploreView } from './components/ExploreView';
import { SearchView } from './components/SearchView';
import { SellView } from './components/SellView';
import { InboxView } from './components/InboxView';
import { BookshelfView } from './components/BookshelfView';
import { BookDetailModal } from './components/BookDetailModal';
import { CheckoutModal } from './components/CheckoutModal';

const STORAGE_KEY = 'folio_spine_exchange_v1';

interface StoredState {
  books: BookListing[];
  savedIds: string[];
  bagIds: string[];
  threads: MessageThread[];
  orders: OrderRecord[];
}

function loadInitialState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StoredState>;
      if (Array.isArray(parsed.books) && parsed.books.length > 0) {
        return {
          books: parsed.books,
          savedIds: Array.isArray(parsed.savedIds) ? parsed.savedIds : ['bk-01', 'bk-03'],
          bagIds: Array.isArray(parsed.bagIds) ? parsed.bagIds : [],
          threads: Array.isArray(parsed.threads) ? parsed.threads : INITIAL_THREADS,
          orders: Array.isArray(parsed.orders) ? parsed.orders : INITIAL_ORDERS,
        };
      }
    }
  } catch {
    // Fallback to default state
  }
  return {
    books: INITIAL_BOOKS,
    savedIds: ['bk-01', 'bk-03'],
    bagIds: [],
    threads: INITIAL_THREADS,
    orders: INITIAL_ORDERS,
  };
}

export default function App() {
  const [state, setState] = useState<StoredState>(loadInitialState);
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [selectedBook, setSelectedBook] = useState<BookListing | null>(null);
  const [checkoutBooks, setCheckoutBooks] = useState<BookListing[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(
    state.threads[0]?.id ?? null
  );
  const [bookshelfSection, setBookshelfSection] = useState<
    'listings' | 'saved' | 'orders'
  >('listings');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const handleToggleSave = (bookId: string) => {
    setState((prev) => {
      const exists = prev.savedIds.includes(bookId);
      const nextSaved = exists
        ? prev.savedIds.filter((id) => id !== bookId)
        : [...prev.savedIds, bookId];
      showToast(exists ? 'Removed from saved books' : 'Saved to My Bookshelf');
      return { ...prev, savedIds: nextSaved };
    });
  };

  const handleAddToBag = (bookId: string) => {
    setState((prev) => {
      if (prev.bagIds.includes(bookId)) {
        showToast('Removed from Exchange Bag');
        return { ...prev, bagIds: prev.bagIds.filter((id) => id !== bookId) };
      }
      showToast('Added to Exchange Bag');
      return { ...prev, bagIds: [...prev.bagIds, bookId] };
    });
  };

  const handleBuyNow = (book: BookListing) => {
    setSelectedBook(null);
    setCheckoutBooks([book]);
  };

  const handleCheckoutBag = () => {
    const items = state.books.filter(
      (b) => state.bagIds.includes(b.id) && !b.sold
    );
    if (items.length > 0) {
      setCheckoutBooks(items);
    }
  };

  const handleConfirmOrder = (order: OrderRecord) => {
    const purchasedIds = new Set(order.items.map((i) => i.bookId));
    setState((prev) => ({
      ...prev,
      books: prev.books.map((b) =>
        purchasedIds.has(b.id) ? { ...b, sold: true } : b
      ),
      bagIds: prev.bagIds.filter((id) => !purchasedIds.has(id)),
      orders: [order, ...prev.orders],
    }));
  };

  const handlePublishBook = (newBook: BookListing) => {
    setState((prev) => ({
      ...prev,
      books: [newBook, ...prev.books],
    }));
    setActiveTab('explore');
    showToast(`Listed “${newBook.title}” on the exchange`);
  };

  const handleToggleSold = (bookId: string) => {
    setState((prev) => ({
      ...prev,
      books: prev.books.map((b) =>
        b.id === bookId ? { ...b, sold: !b.sold } : b
      ),
    }));
  };

  const handleDeleteListing = (bookId: string) => {
    setState((prev) => ({
      ...prev,
      books: prev.books.filter((b) => b.id !== bookId),
      savedIds: prev.savedIds.filter((id) => id !== bookId),
      bagIds: prev.bagIds.filter((id) => id !== bookId),
    }));
    showToast('Listing removed from your shelf');
  };

  const handleMessageSeller = (book: BookListing) => {
    const existing = state.threads.find((t) => t.bookId === book.id);
    if (existing) {
      setActiveThreadId(existing.id);
      setSelectedBook(null);
      setActiveTab('inbox');
      return;
    }

    const newThread: MessageThread = {
      id: `th-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      bookPrice: book.price,
      bookCover: book.coverImage,
      clothColor: book.clothColor,
      peerName: book.seller.name,
      peerDepartment: book.seller.department,
      peerVerified: book.seller.verified,
      unread: false,
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: 'me',
          text: `Hi ${book.seller.name.split(' ')[0]}, is your copy of “${book.title}” still available for ${book.meetupSpot}?`,
          timestamp: 'Just now',
        },
      ],
    };

    setState((prev) => ({
      ...prev,
      threads: [newThread, ...prev.threads],
    }));
    setActiveThreadId(newThread.id);
    setSelectedBook(null);
    setActiveTab('inbox');
  };

  const handleSelectThread = (threadId: string) => {
    setActiveThreadId(threadId);
    setState((prev) => ({
      ...prev,
      threads: prev.threads.map((t) =>
        t.id === threadId ? { ...t, unread: false } : t
      ),
    }));
  };

  const handleSendMessage = (threadId: string, text: string) => {
    setState((prev) => ({
      ...prev,
      threads: prev.threads.map((t) =>
        t.id === threadId
          ? {
              ...t,
              unread: false,
              messages: [
                ...t.messages,
                {
                  id: `m-${Date.now()}`,
                  sender: 'me',
                  text,
                  timestamp: 'Just now',
                },
              ],
            }
          : t
      ),
    }));
  };

  const handleAcceptOffer = (threadId: string, amount: number) => {
    const thread = state.threads.find((t) => t.id === threadId);
    if (!thread) return;
    setState((prev) => ({
      ...prev,
      books: prev.books.map((b) =>
        b.id === thread.bookId ? { ...b, price: amount } : b
      ),
      threads: prev.threads.map((t) =>
        t.id === threadId
          ? {
              ...t,
              bookPrice: amount,
              messages: [
                ...t.messages,
                {
                  id: `m-${Date.now()}`,
                  sender: 'me',
                  text: `Offer of $${amount} accepted! Let’s meet at the Humanities Annex Cafe.`,
                  timestamp: 'Just now',
                },
              ],
            }
          : t
      ),
    }));
    showToast(`Accepted $${amount} offer`);
  };

  const unreadCount = state.threads.filter((t) => t.unread).length;
  const activeBagCount = state.bagIds.filter((id) =>
    state.books.some((b) => b.id === id && !b.sold)
  ).length;

  const navigateTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] text-[#1C2226]">
      {/* Desktop Top Navigation Bar (Strict 3-Zone Contract) */}
      <header className="sticky top-0 z-30 hidden border-b border-[#E5DEC9] bg-[#FAF6EE]/92 backdrop-blur-md md:block">
        <div className="mx-auto flex h-16 max-w-[1120px] items-center justify-between gap-8 px-8">
          {/* Zone 1: Single text wordmark */}
          <button
            type="button"
            onClick={() => navigateTab('explore')}
            className="font-editorial text-[22px] font-semibold tracking-[-0.01em] text-[#1B3B4B] whitespace-nowrap shrink-0"
          >
            Folio &amp; Spine
          </button>

          {/* Zone 2: Concise single-line text nav links */}
          <nav aria-label="Primary navigation" className="flex items-center gap-7">
            {(
              [
                { id: 'explore', label: 'Explore' },
                { id: 'search', label: 'Search' },
                {
                  id: 'inbox',
                  label: unreadCount > 0 ? `Inbox (${unreadCount})` : 'Inbox',
                },
                {
                  id: 'bookshelf',
                  label:
                    activeBagCount > 0
                      ? `My Bookshelf (${activeBagCount})`
                      : 'My Bookshelf',
                },
              ] as { id: ActiveTab; label: string }[]
            ).map((link) => {
              const active = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => {
                    if (link.id === 'bookshelf') setBookshelfSection('listings');
                    navigateTab(link.id);
                  }}
                  className={`border-b-2 py-1 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'border-[#D96528] text-[#1C2226]'
                      : 'border-transparent text-[#574239] hover:text-[#1B3B4B]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={() => navigateTab('sell')}
              className="inline-flex min-h-[40px] items-center justify-center rounded-[4px] bg-[#D96528] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#9E3D00] active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              List a Book
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Compact Header (48px) */}
      <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-[#E5DEC9] bg-[#FAF6EE]/92 px-4 backdrop-blur-md md:hidden">
        <button
          type="button"
          onClick={() => navigateTab('explore')}
          className="font-editorial text-xl font-semibold tracking-[-0.01em] text-[#1B3B4B] whitespace-nowrap"
        >
          Folio &amp; Spine
        </button>

        <div className="flex items-center gap-1">
          {activeBagCount > 0 && (
            <button
              type="button"
              onClick={() => {
                setBookshelfSection('orders');
                navigateTab('bookshelf');
              }}
              aria-label={`View bag with ${activeBagCount} items`}
              className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-[#E5DEC9] bg-white px-2.5 text-xs font-semibold text-[#1B3B4B] tabular-nums"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>{activeBagCount}</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mx-auto max-w-[1120px] px-4 pb-24 pt-5 sm:px-6 md:px-8 md:pb-14 md:pt-8">
        {activeTab === 'explore' && (
          <ExploreView
            books={state.books}
            savedIds={state.savedIds}
            bagIds={state.bagIds}
            onToggleSave={handleToggleSave}
            onSelectBook={setSelectedBook}
            onNavigateSearch={() => navigateTab('search')}
            onNavigateSell={() => navigateTab('sell')}
            onOpenBag={() => {
              setBookshelfSection('orders');
              navigateTab('bookshelf');
            }}
          />
        )}

        {activeTab === 'search' && (
          <SearchView
            books={state.books}
            savedIds={state.savedIds}
            onToggleSave={handleToggleSave}
            onSelectBook={setSelectedBook}
          />
        )}

        {activeTab === 'sell' && (
          <SellView
            onPublishBook={handlePublishBook}
            onCancel={() => navigateTab('explore')}
          />
        )}

        {activeTab === 'inbox' && (
          <InboxView
            threads={state.threads}
            activeThreadId={activeThreadId}
            onSelectThread={handleSelectThread}
            onSendMessage={handleSendMessage}
            onAcceptOffer={handleAcceptOffer}
          />
        )}

        {activeTab === 'bookshelf' && (
          <BookshelfView
            books={state.books}
            savedIds={state.savedIds}
            bagIds={state.bagIds}
            orders={state.orders}
            initialSection={bookshelfSection}
            onToggleSave={handleToggleSave}
            onSelectBook={setSelectedBook}
            onToggleSold={handleToggleSold}
            onDeleteListing={handleDeleteListing}
            onRemoveFromBag={handleAddToBag}
            onCheckoutBag={handleCheckoutBag}
            onNavigateSell={() => navigateTab('sell')}
            onNavigateExplore={() => navigateTab('explore')}
          />
        )}
      </main>

      {/* Quiet Editorial Footer (Desktop) */}
      <footer className="hidden border-t border-[#E5DEC9] bg-[#F7F3EB] py-8 md:block">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between px-8 text-xs text-[#574239]">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#1B3B4B]" />
            <span className="font-semibold text-[#1C2226]">Folio &amp; Spine</span>
            <span>· Campus &amp; Community Book Exchange</span>
          </div>
          <p>Peer-to-peer textbook &amp; literature commons · Zero listing commission</p>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation Bar (64px + elevated Ember Amber Sell dock) */}
      <nav
        aria-label="Mobile bottom navigation"
        className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-[#E5DEC9] bg-[#FAF6EE]/92 backdrop-blur-md shadow-warm md:hidden"
      >
        <div className="grid h-full grid-cols-5 items-center px-1">
          <button
            type="button"
            onClick={() => navigateTab('explore')}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-semibold ${
              activeTab === 'explore' ? 'text-[#9E3D00]' : 'text-[#574239]'
            }`}
          >
            <Compass className="h-5 w-5" />
            <span>Explore</span>
          </button>

          <button
            type="button"
            onClick={() => navigateTab('search')}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-semibold ${
              activeTab === 'search' ? 'text-[#9E3D00]' : 'text-[#574239]'
            }`}
          >
            <Search className="h-5 w-5" />
            <span>Search</span>
          </button>

          <div className="flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={() => navigateTab('sell')}
              aria-label="List a Book"
              className={`-mt-5 flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-[#FAF6EE] shadow-warm transition-transform active:scale-95 ${
                activeTab === 'sell'
                  ? 'bg-[#1B3B4B] text-white'
                  : 'bg-[#D96528] text-white'
              }`}
            >
              <Plus className="h-5 w-5 stroke-[2.5]" />
            </button>
            <span
              className={`mt-0.5 text-[10px] font-semibold ${
                activeTab === 'sell' ? 'text-[#1B3B4B]' : 'text-[#574239]'
              }`}
            >
              Sell
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigateTab('inbox')}
            className={`relative flex flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-semibold ${
              activeTab === 'inbox' ? 'text-[#9E3D00]' : 'text-[#574239]'
            }`}
          >
            <MessageSquare className="h-5 w-5" />
            <span>Inbox</span>
            {unreadCount > 0 && (
              <span className="absolute right-3 top-1 rounded-[4px] bg-[#D96528] px-1 text-[9px] font-bold text-white tabular-nums">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setBookshelfSection('listings');
              navigateTab('bookshelf');
            }}
            className={`flex flex-col items-center justify-center gap-0.5 py-1 text-[10px] font-semibold ${
              activeTab === 'bookshelf' ? 'text-[#9E3D00]' : 'text-[#574239]'
            }`}
          >
            <Library className="h-5 w-5" />
            <span>Bookshelf</span>
          </button>
        </div>
      </nav>

      {/* Book Detail Modal / Bottom Sheet */}
      <BookDetailModal
        book={selectedBook}
        isSaved={selectedBook ? state.savedIds.includes(selectedBook.id) : false}
        isInBag={selectedBook ? state.bagIds.includes(selectedBook.id) : false}
        onClose={() => setSelectedBook(null)}
        onToggleSave={handleToggleSave}
        onAddToBag={handleAddToBag}
        onBuyNow={handleBuyNow}
        onMessageSeller={handleMessageSeller}
      />

      {/* Checkout Modal */}
      {checkoutBooks.length > 0 && (
        <CheckoutModal
          items={checkoutBooks}
          onClose={() => setCheckoutBooks([])}
          onConfirmOrder={handleConfirmOrder}
        />
      )}

      {/* Subtle Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-[4px] border border-[#E5DEC9] bg-[#1B3B4B] px-4 py-2 text-xs font-semibold text-[#FAF6EE] shadow-warm md:bottom-6"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
