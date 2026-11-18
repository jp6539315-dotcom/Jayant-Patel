import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Send } from 'lucide-react';
import { MessageThread } from '../types/exchange';
import { BookCover } from './BookCover';

interface InboxViewProps {
  threads: MessageThread[];
  activeThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onSendMessage: (threadId: string, text: string) => void;
  onAcceptOffer: (threadId: string, amount: number) => void;
}

const QUICK_REPLIES = [
  'Is this edition still available?',
  'Can we meet at the Main Library today?',
  'Would you accept pickup after 4 PM?',
];

export const InboxView: React.FC<InboxViewProps> = ({
  threads,
  activeThreadId,
  onSelectThread,
  onSendMessage,
  onAcceptOffer,
}) => {
  const [draft, setDraft] = useState('');
  const [mobileShowingChat, setMobileShowingChat] = useState(Boolean(activeThreadId));

  const currentThread =
    threads.find((t) => t.id === activeThreadId) || threads[0] || null;

  const handleChooseThread = (id: string) => {
    onSelectThread(id);
    setMobileShowingChat(true);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentThread || !draft.trim()) return;
    onSendMessage(currentThread.id, draft.trim());
    setDraft('');
  };

  return (
    <div className="space-y-4">
      <div className="border-b border-[#E5DEC9] pb-4">
        <h1 className="font-editorial text-[28px] font-semibold leading-tight text-[#1C2226]">
          Exchange Inbox
        </h1>
        <p className="mt-1 text-sm text-[#574239]">
          Coordinate campus meetups, check condition details, or confirm book offers.
        </p>
      </div>

      {threads.length === 0 ? (
        <div className="rounded-lg border border-[#E5DEC9] bg-white p-10 text-center">
          <p className="font-editorial text-xl font-semibold text-[#1C2226]">
            No conversations yet
          </p>
          <p className="mt-1.5 text-sm text-[#574239]">
            Tap “Message Seller” on any book listing to ask about editions or arrange a handoff.
          </p>
        </div>
      ) : (
        <div className="grid min-h-[520px] grid-cols-1 overflow-hidden rounded-lg border border-[#E5DEC9] bg-white lg:grid-cols-12">
          {/* Thread List */}
          <div
            className={`border-b border-[#E5DEC9] lg:col-span-4 lg:border-b-0 lg:border-r ${
              mobileShowingChat ? 'hidden lg:block' : 'block'
            }`}
          >
            <div className="border-b border-[#E5DEC9] bg-[#F7F3EB] px-4 py-3">
              <p className="text-xs font-bold tracking-[0.04em] uppercase text-[#1B3B4B] tabular-nums">
                Active Threads ({threads.length})
              </p>
            </div>
            <div className="divide-y divide-[#E5DEC9]">
              {threads.map((thread) => {
                const isSelected = currentThread?.id === thread.id;
                const lastMsg = thread.messages[thread.messages.length - 1];
                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => handleChooseThread(thread.id)}
                    className={`flex w-full items-start gap-3 p-3.5 text-left transition-colors ${
                      isSelected ? 'bg-[#FAF6EE]' : 'bg-white hover:bg-[#FAF6EE]/60'
                    }`}
                  >
                    <div className="w-11 shrink-0">
                      <BookCover
                        src={thread.bookCover}
                        title={thread.bookTitle}
                        author={thread.peerName}
                        clothColor={thread.clothColor}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1 truncate text-sm font-bold text-[#1C2226]">
                          {thread.peerName}
                          {thread.peerVerified && (
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#1E7B6E]" />
                          )}
                        </span>
                        <span className="shrink-0 text-[11px] font-medium text-[#574239]">
                          {lastMsg?.timestamp || ''}
                        </span>
                      </div>
                      <p className="truncate text-xs font-semibold text-[#9E3D00]">
                        {thread.bookTitle} · <span className="tabular-nums">${thread.bookPrice}</span>
                      </p>
                      <p className="mt-1 line-clamp-1 text-xs text-[#574239]">
                        {lastMsg ? lastMsg.text : 'Start a conversation'}
                      </p>
                    </div>
                    {thread.unread && (
                      <span className="mt-1 shrink-0 rounded-[4px] bg-[#D96528] px-1.5 py-0.5 text-[10px] font-bold text-white">
                        New
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Conversation Pane */}
          {currentThread && (
            <div
              className={`flex flex-col lg:col-span-8 ${
                mobileShowingChat ? 'flex' : 'hidden lg:flex'
              }`}
            >
              {/* Thread Header */}
              <div className="flex items-center justify-between gap-3 border-b border-[#E5DEC9] bg-[#F7F3EB] px-4 py-3">
                <div className="flex min-w-0 items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setMobileShowingChat(false)}
                    aria-label="Back to inbox threads"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border border-[#E5DEC9] bg-white text-[#1B3B4B] lg:hidden"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h2 className="truncate text-sm font-bold text-[#1C2226]">
                        {currentThread.peerName}
                      </h2>
                      <span className="text-xs text-[#574239]">· {currentThread.peerDepartment}</span>
                    </div>
                    <p className="truncate text-xs font-medium text-[#574239]">
                      Regarding: {currentThread.bookTitle} (
                      <span className="font-bold tabular-nums text-[#1C2226]">
                        ${currentThread.bookPrice}
                      </span>
                      )
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Stream */}
              <div className="flex-1 space-y-3 overflow-y-auto bg-[#FAF6EE]/50 p-4">
                {currentThread.messages.map((msg) => {
                  const isMe = msg.sender === 'me';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed sm:max-w-[72%] ${
                          isMe
                            ? 'bg-[#1B3B4B] text-white'
                            : 'border border-[#E5DEC9] bg-white text-[#1C2226]'
                        }`}
                      >
                        <p>{msg.text}</p>
                        {msg.offerAmount && !isMe && (
                          <div className="mt-2.5 flex items-center justify-between gap-3 border-t border-[#E5DEC9] pt-2">
                            <span className="text-xs font-semibold text-[#574239]">
                              Offer: <strong className="tabular-nums text-[#1C2226]">${msg.offerAmount}</strong>
                            </span>
                            <button
                              type="button"
                              onClick={() => onAcceptOffer(currentThread.id, msg.offerAmount!)}
                              className="rounded-[4px] bg-[#1E7B6E] px-2.5 py-1 text-xs font-semibold text-white hover:bg-[#176157]"
                            >
                              Accept Offer
                            </button>
                          </div>
                        )}
                      </div>
                      <span className="mt-1 px-1 text-[11px] text-[#574239]">
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Quick Replies + Composer */}
              <div className="border-t border-[#E5DEC9] bg-white p-3 sm:p-4">
                <div className="no-scrollbar mb-2.5 flex items-center gap-2 overflow-x-auto pb-1">
                  {QUICK_REPLIES.map((reply) => (
                    <button
                      key={reply}
                      type="button"
                      onClick={() => onSendMessage(currentThread.id, reply)}
                      className="rounded-[4px] border border-[#E5DEC9] bg-[#FAF6EE] px-2.5 py-1 text-xs font-medium text-[#1B3B4B] hover:border-[#1B3B4B] whitespace-nowrap shrink-0"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
                <form onSubmit={handleSend} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Write a message about pickup or condition..."
                    aria-label="Message input"
                    className="h-11 flex-1 rounded-[4px] border border-[#E5DEC9] bg-white px-3.5 text-sm text-[#1C2226] placeholder:text-[#574239]/65 focus:border-[1.5px] focus:border-[#1B3B4B] focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim()}
                    className="inline-flex h-11 items-center justify-center gap-1.5 rounded-[4px] bg-[#D96528] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#9E3D00] disabled:opacity-45 whitespace-nowrap shrink-0"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
