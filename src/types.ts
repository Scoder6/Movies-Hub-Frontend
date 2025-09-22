export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Movie {
  _id: string;
  title: string;
  description: string;
  addedBy: User;
  createdAt: string;
  upvotes?: number;
  downvotes?: number;
  score?: number;
  userVote?: 'up' | 'down';
}

export interface Comment {
  _id: string;
  body: string;
  user: User;
  movie: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}
