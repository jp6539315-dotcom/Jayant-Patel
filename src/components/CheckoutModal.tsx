import React, { useState } from 'react';
import { CheckCircle2, MapPin, Truck, X } from 'lucide-react';
import { BookListing, OrderRecord } from '../types/exchange';
import { BookCover } from './BookCover';

interface CheckoutModalProps {
  items: BookListing[];
  onClose: () => void;
  onConfirmOrder: (order: OrderRecord) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  items,
  onClose,
  onConfirmOrder,
}) => {
  const [fulfillment, setFulfillment] = useState<'Campus Meetup' | 'Media Mail'>('Campus Meetup');
  const [meetupTime, setMeetupTime] = useState('Tomorrow · 2:30 PM');
  const [shippingAddress, setShippingAddress] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (items.length === 0 && !confirmedOrder) return null;

  const subtotal = items.reduce((sum, b) => sum + b.price, 0);
  const shippingFee = fulfillment === 'Media Mail' ? 4.5 : 0;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (fulfillment === 'Media Mail' && (!buyerName.trim() || !shippingAddress.trim())) {
      setError('Please enter your name and mailing address for Media Mail.');
      return;
    }

    const orderNumber = `FS-${Math.floor(1050 + Math.random() * 8900)}`;
    const primarySpot = items[0]?.meetupSpot || 'Main Library Courtyard';
    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber,
      items: items.map((b) => ({
        bookId: b.id,
        title: b.title,
        author: b.author,
        price: b.price,
        coverImage: b.coverImage,
        clothColor: b.clothColor,
      })),
      fulfillment,
      destination:
        fulfillment === 'Campus Meetup'
          ? `${primarySpot} · ${meetupTime}`
          : `${buyerName.trim()} — ${shippingAddress.trim()}`,
      shippingFee,
      total,
      status:
        fulfillment === 'Campus Meetup'
          ? 'Confirmed · Meetup scheduled'
          : 'Confirmed · Preparing Media Mail label',
      placedAt: 'Nov 18, 2026',
    };

    setConfirmedOrder(newOrder);
    onConfirmOrder(newOrder);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#1C2226]/55 backdrop-blur-[2px] sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-[12px] border border-[#E5DEC9] bg-[#FAF6EE] shadow-warm sm:max-w-lg sm:rounded-lg"
      >
        <div className="flex items-center justify-between border-b border-[#E5DEC9] bg-white px-5 py-3.5">
          <h2 id="checkout-title" className="font-editorial text-xl font-semibold text-[#1C2226]">
            {confirmedOrder ? 'Exchange Confirmed' : 'Complete Exchange'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close checkout"
            className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-[#E5DEC9] bg-white text-[#1C2226] hover:bg-[#F7F3EB]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {confirmedOrder ? (
          <div className="space-y-5 p-5 sm:p-6">
            <div className="rounded-lg border border-[#1E7B6E]/30 bg-[#E6F4F1] p-4">
              <div className="flex items-center gap-2 text-[#1E7B6E]">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-bold">
                  Order #{confirmedOrder.orderNumber} Confirmed
                </span>
              </div>
              <p className="mt-1.5 text-sm text-[#1C2226]">
                {confirmedOrder.status}
              </p>
              <p className="mt-1 text-xs text-[#574239]">{confirmedOrder.destination}</p>
            </div>

            <div className="space-y-2 rounded-lg border border-[#E5DEC9] bg-white p-4">
              {confirmedOrder.items.map((item) => (
                <div key={item.bookId} className="flex items-center justify-between text-sm">
                  <span className="font-editorial font-medium text-[#1C2226]">{item.title}</span>
                  <span className="font-bold tabular-nums">${item.price.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-[#E5DEC9] pt-2 text-sm font-bold text-[#1C2226]">
                <span>Total Paid</span>
                <span className="tabular-nums">${confirmedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="min-h-[48px] w-full rounded-[4px] bg-[#1B3B4B] px-5 py-3 text-sm font-semibold text-white hover:bg-[#152e3b]"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="space-y-5 p-5 sm:p-6">
            {/* Items Summary */}
            <div className="space-y-2.5 rounded-lg border border-[#E5DEC9] bg-white p-3.5">
              {items.map((book) => (
                <div key={book.id} className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="w-10 shrink-0">
                      <BookCover
                        src={book.coverImage}
                        title={book.title}
                        author={book.author}
                        clothColor={book.clothColor}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-editorial truncate text-sm font-semibold text-[#1C2226]">
                        {book.title}
                      </p>
                      <p className="text-xs text-[#574239]">{book.condition}</p>
                    </div>
                  </div>
                  <span className="shrink-0 font-bold tabular-nums text-[#1C2226]">
                    ${book.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Fulfillment Radio Selection */}
            <div className="space-y-2.5">
              <p className="text-xs font-bold tracking-[0.04em] uppercase text-[#1B3B4B]">
                Choose Handoff Method
              </p>

              <button
                type="button"
                role="radio"
                aria-checked={fulfillment === 'Campus Meetup'}
                onClick={() => setFulfillment('Campus Meetup')}
                className={`flex w-full items-start gap-3 rounded-lg border p-3.5 text-left transition-colors ${
                  fulfillment === 'Campus Meetup'
                    ? 'border-[1.5px] border-[#1B3B4B] bg-white'
                    : 'border-[#E5DEC9] bg-white/70'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#1B3B4B] ${
                    fulfillment === 'Campus Meetup' ? 'bg-[#1B3B4B]' : 'bg-white'
                  }`}
                >
                  {fulfillment === 'Campus Meetup' && (
                    <span className="h-2 w-2 rounded-full bg-[#FAF6EE]" />
                  )}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-[#1C2226]">
                      <MapPin className="h-4 w-4 text-[#1E7B6E]" />
                      Campus Library Meetup
                    </span>
                    <span className="text-xs font-bold text-[#1E7B6E]">Free</span>
                  </div>
                  <p className="mt-1 text-xs text-[#574239]">
                    Meet at {items[0]?.meetupSpot || 'Main Library Courtyard'} and inspect in person.
                  </p>
                </div>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={fulfillment === 'Media Mail'}
                onClick={() => setFulfillment('Media Mail')}
                className={`flex w-full items-start gap-3 rounded-lg border p-3.5 text-left transition-colors ${
                  fulfillment === 'Media Mail'
                    ? 'border-[1.5px] border-[#1B3B4B] bg-white'
                    : 'border-[#E5DEC9] bg-white/70'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#1B3B4B] ${
                    fulfillment === 'Media Mail' ? 'bg-[#1B3B4B]' : 'bg-white'
                  }`}
                >
                  {fulfillment === 'Media Mail' && (
                    <span className="h-2 w-2 rounded-full bg-[#FAF6EE]" />
                  )}
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm font-bold text-[#1C2226]">
                      <Truck className="h-4 w-4 text-[#1B3B4B]" />
                      Tracked Media Mail
                    </span>
                    <span className="text-xs font-bold tabular-nums text-[#1C2226]">$4.50</span>
                  </div>
                  <p className="mt-1 text-xs text-[#574239]">
                    Ships in padded mailer within 48 hours with tracking number.
                  </p>
                </div>
              </button>
            </div>

            {fulfillment === 'Campus Meetup' ? (
              <div>
                <label htmlFor="meetup-slot" className="block text-xs font-semibold text-[#1C2226]">
                  Preferred Meetup Window
                </label>
                <select
                  id="meetup-slot"
                  value={meetupTime}
                  onChange={(e) => setMeetupTime(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-[4px] border border-[#E5DEC9] bg-white px-3 text-sm text-[#1C2226] focus:border-[1.5px] focus:border-[#1B3B4B] focus:outline-none"
                >
                  <option>Today · 4:30 PM</option>
                  <option>Tomorrow · 11:00 AM</option>
                  <option>Tomorrow · 2:30 PM</option>
                  <option>Friday · 1:00 PM</option>
                </select>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label htmlFor="ship-name" className="block text-xs font-semibold text-[#1C2226]">
                    Recipient Name *
                  </label>
                  <input
                    id="ship-name"
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="Full name"
                    className="mt-1 h-11 w-full rounded-[4px] border border-[#E5DEC9] bg-white px-3 text-sm text-[#1C2226] focus:border-[1.5px] focus:border-[#1B3B4B] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="ship-addr" className="block text-xs font-semibold text-[#1C2226]">
                    Street Address &amp; Postal Code *
                  </label>
                  <input
                    id="ship-addr"
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="e.g. 214 College Ave, Apt 4B, 02138"
                    className="mt-1 h-11 w-full rounded-[4px] border border-[#E5DEC9] bg-white px-3 text-sm text-[#1C2226] focus:border-[1.5px] focus:border-[#1B3B4B] focus:outline-none"
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="rounded-[4px] bg-[#ffdad6] px-3 py-2 text-xs font-semibold text-[#93000a]">
                {error}
              </p>
            )}

            {/* Totals Ledger */}
            <div className="space-y-1.5 border-t border-[#E5DEC9] pt-3 text-sm">
              <div className="flex justify-between text-[#574239]">
                <span>Books subtotal</span>
                <span className="tabular-nums">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#574239]">
                <span>{fulfillment}</span>
                <span className="tabular-nums">
                  {shippingFee === 0 ? 'Free' : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between pt-1 text-base font-bold text-[#1C2226]">
                <span>Total</span>
                <span className="tabular-nums">${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              className="min-h-[48px] w-full rounded-[4px] bg-[#D96528] px-5 py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#9E3D00] active:scale-[0.98]"
            >
              Confirm Order · ${total.toFixed(2)}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
