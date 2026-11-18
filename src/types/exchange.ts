export type ActiveTab = 'explore' | 'search' | 'sell' | 'inbox' | 'bookshelf';

export type BookCondition = 'Like New' | 'Gently Used' | 'Acceptable';

export type BookCategory =
  | 'Textbooks'
  | 'Design & Art'
  | 'Literature'
  | 'Philosophy'
  | 'Sciences';

export type DeliveryMode = 'Campus Meetup' | 'Media Mail' | 'Both';

export interface SellerInfo {
  name: string;
  handle: string;
  department: string;
  verified: boolean;
  completedExchanges: number;
  rating: string;
}

export interface BookListing {
  id: string;
  title: string;
  author: string;
  isbn: string;
  edition: string;
  courseCode?: string;
  category: BookCategory;
  condition: BookCondition;
  conditionNote: string;
  price: number;
  retailPrice: number;
  coverImage?: string;
  clothColor?: string;
  deliveryMode: DeliveryMode;
  meetupSpot: string;
  seller: SellerInfo;
  isOwnListing?: boolean;
  sold?: boolean;
  listedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'me' | 'peer';
  text: string;
  timestamp: string;
  offerAmount?: number;
}

export interface MessageThread {
  id: string;
  bookId: string;
  bookTitle: string;
  bookPrice: number;
  bookCover?: string;
  clothColor?: string;
  peerName: string;
  peerDepartment: string;
  peerVerified: boolean;
  unread: boolean;
  messages: ChatMessage[];
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  items: {
    bookId: string;
    title: string;
    author: string;
    price: number;
    coverImage?: string;
    clothColor?: string;
  }[];
  fulfillment: 'Campus Meetup' | 'Media Mail';
  destination: string;
  shippingFee: number;
  total: number;
  status: string;
  placedAt: string;
}
