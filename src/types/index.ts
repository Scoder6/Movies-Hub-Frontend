import { ReactNode } from "react";
import { Key } from "readline";

export interface Movie {
  _id: string;
  title: string;
  description: string;
  images?: string[];
  genres?: string[];
  year?: number;
  addedBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  upvotes: number;
  downvotes: number;
  score: number;
}

export interface Comment {
  _id: Key;
  user: any;
  body: ReactNode;
  id: string;
  movieId: string;
  content: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: string;
}

export interface Vote {
  id: string;
  movieId: string;
  userId: string;
  type: 'upvote' | 'downvote';
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}