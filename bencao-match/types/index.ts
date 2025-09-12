export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  age?: number;
  bio?: string;
  denomination?: string;
  location?: {
    city: string;
    state: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  interests?: string[];
  lookingFor?: 'friendship' | 'dating' | 'marriage';
  isVerified?: boolean;
  isPremium?: boolean;
  createdAt: Date;
  lastActive: Date;
}

export interface Match {
  id: string;
  userId1: string;
  userId2: string;
  user1: User;
  user2: User;
  createdAt: Date;
  lastMessage?: Message;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  text: string;
  type?: 'text' | 'image' | 'verse' | 'prayer';
  timestamp: Date;
  read: boolean;
}

export interface CommunityPost {
  id: string;
  userId: string;
  user: User;
  content: string;
  type: 'text' | 'verse' | 'prayer' | 'testimony';
  likes: string[];
  comments: Comment[];
  createdAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  text: string;
  createdAt: Date;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: User;
  attendees: string[];
  imageUrl?: string;
  type: 'worship' | 'bible-study' | 'fellowship' | 'service' | 'other';
  maxAttendees?: number;
}

export interface SwipeAction {
  userId: string;
  targetUserId: string;
  action: 'like' | 'pass';
  timestamp: Date;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}