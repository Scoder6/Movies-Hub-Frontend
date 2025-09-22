import { Movie, Comment, User } from '@/types';

export const mockMovies: Movie[] = [
  {
    id: 'premium6',
    _id: 'premium6',
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    year: 2014,
    director: 'Christopher Nolan',
    addedBy: { name: 'admin' },
    createdAt: new Date('2023-01-18').toISOString(),
    updatedAt: new Date('2023-01-18').toISOString(),
    genres: ['Adventure', 'Drama', 'Sci-Fi'],
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    images: [
      'https://images-na.ssl-images-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg',
      'https://images-na.ssl-images-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg'
    ],
    rating: 8.6,
    score: 110,
    upvotes: 115,
    downvotes: 5
  },
  {
    id: 'premium7',
    _id: 'premium7',
    title: 'Parasite',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    year: 2019,
    director: 'Bong Joon Ho',
    addedBy: { name: 'admin' },
    createdAt: new Date('2023-01-19').toISOString(),
    updatedAt: new Date('2023-01-19').toISOString(),
    genres: ['Comedy', 'Drama', 'Thriller'],
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
    images: [
      'https://images-na.ssl-images-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_FMjpg_UX1000_.jpg',
      'https://images-na.ssl-images-amazon.com/images/M/MV5BOWZlYjE4ZDYtNjhlNi00ZGQ0LTgxZmUtNmMwMWQwNGQyMjFjXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg'
    ],
    rating: 8.5,
    score: 105,
    upvotes: 110,
    downvotes: 5
  },
  {
    id: 'premium8',
    _id: 'premium8',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    year: 2010,
    director: 'Christopher Nolan',
    addedBy: { name: 'admin' },
    createdAt: new Date('2023-01-20').toISOString(),
    updatedAt: new Date('2023-01-20').toISOString(),
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Ellen Page'],
    images: [
      'https://images-na.ssl-images-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg',
      'https://images-na.ssl-images-amazon.com/images/M/MV5BMTk4OTY1Nzk5N15BMl5BanBnXkFtZTgwNjA5MDc3NjE@._V1_.jpg'
    ],
    rating: 8.8,
    score: 112,
    upvotes: 117,
    downvotes: 5
  },
  {
    id: 'premium9',
    _id: 'premium9',
    title: 'The Matrix',
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    year: 1999,
    director: 'Lana Wachowski, Lilly Wachowski',
    addedBy: { name: 'admin' },
    createdAt: new Date('2023-01-21').toISOString(),
    updatedAt: new Date('2023-01-21').toISOString(),
    genres: ['Action', 'Sci-Fi'],
    cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
    images: [
      'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
      'https://image.tmdb.org/t/p/original/9Xw0I5RV2ZqNLpul6lXKoviYg55.jpg'
    ],
    rating: 8.7,
    score: 108,
    upvotes: 113,
    downvotes: 5
  },
  {
    id: 'premium10',
    _id: 'premium10',
    title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    year: 1994,
    director: 'Quentin Tarantino',
    addedBy: { name: 'admin' },
    createdAt: new Date('2023-01-22').toISOString(),
    updatedAt: new Date('2023-01-22').toISOString(),
    genres: ['Crime', 'Drama'],
    cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'],
    images: [
      'https://images-na.ssl-images-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg',
      'https://images-na.ssl-images-amazon.com/images/M/MV5BMTkxMTA5OTAzMl5BMl5BanBnXkFtZTgwNjA5MDc3NjE@._V1_.jpg'
    ],
    rating: 8.9,
    score: 118,
    upvotes: 123,
    downvotes: 5
  },
  {
    id: '1',
    _id: '1',
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    year: 1994,
    director: 'Frank Darabont',
    addedBy: { name: 'admin' },
    createdAt: new Date('2023-01-15').toISOString(),
    updatedAt: new Date('2023-01-15').toISOString(),
    genres: ['Drama'],
    cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
    images: [
      'https://images-na.ssl-images-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_FMjpg_UX1000_.jpg',
      'https://images-na.ssl-images-amazon.com/images/M/MV5BODRmOTZmOWUtYTAyNS00ODAyLWJiZWItMmI1ZmFkZWUzODI0XkEyXkFqcGdeQXVyMTUzOTczNzYx._V1_.jpg'
    ],
    rating: 9.3,
    score: 125,
    upvotes: 130,
    downvotes: 5
  },
  {
    id: '2',
    _id: '2',
    title: 'The Godfather',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    year: 1972,
    director: 'Francis Ford Coppola',
    addedBy: { name: 'admin' },
    createdAt: new Date('2023-01-16').toISOString(),
    updatedAt: new Date('2023-01-16').toISOString(),
    genres: ['Crime', 'Drama'],
    cast: ['Marlon Brando', 'Al Pacino', 'James Caan'],
    images: [
      'https://images-na.ssl-images-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg',
      'https://images-na.ssl-images-amazon.com/images/M/MV5BZGIzNWYzN2YtMjcwYS00YjQ3LWI2NjMtOTNiYTUyYjE2MGNkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg'
    ],
    rating: 9.2,
    score: 120,
    upvotes: 125,
    downvotes: 5
  },
  {
    id: '3',
    _id: '3',
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    year: 2008,
    director: 'Christopher Nolan',
    addedBy: { name: 'admin' },
    createdAt: new Date('2023-01-17').toISOString(),
    updatedAt: new Date('2023-01-17').toISOString(),
    genres: ['Action', 'Crime', 'Drama'],
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    images: [
      'https://images-na.ssl-images-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg',
      'https://images-na.ssl-images-amazon.com/images/M/MV5BMTk4ODQzNDY3Ml5BMl5BanBnXkFtZTcwODA0NTM4Nw@@._V1_FMjpg_UX1000_.jpg'
    ],
    rating: 9.0,
    score: 115,
    upvotes: 120,
    downvotes: 5
  }
];

export const mockComments: Comment[] = [
  {
    _id: '1',
    movie: '1',
    body: 'One of the greatest movies ever made!',
    user: { 
      name: 'movieFan42', 
      _id: '2',
      email: 'user1@example.com',
      role: 'user'
    },
    createdAt: new Date('2023-02-01').toISOString()
  },
  {
    _id: '2',
    movie: '2',
    body: 'Marlon Brando was phenomenal in this role.',
    user: { 
      name: 'cinemaLover', 
      _id: '3',
      email: 'user2@example.com',
      role: 'user'
    },
    createdAt: new Date('2023-02-05').toISOString()
  },
  {
    _id: '3',
    movie: '3',
    body: 'Heath Ledger\'s Joker is legendary.',
    user: { 
      name: 'filmCritic101', 
      _id: '4',
      email: 'user3@example.com',
      role: 'user'
    },
    createdAt: new Date('2023-02-10').toISOString()
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    _id: '1',
    name: 'admin',
    email: 'admin@moviehub.com',
    role: 'admin',
    createdAt: new Date('2023-01-01').toISOString()
  },
  {
    id: '2',
    _id: '2',
    name: 'movieFan42',
    email: 'user1@example.com',
    role: 'user',
    createdAt: new Date('2023-01-10').toISOString()
  },
  {
    id: '3',
    _id: '3',
    name: 'cinemaLover',
    email: 'user2@example.com',
    role: 'user',
    createdAt: new Date('2023-01-15').toISOString()
  }
];