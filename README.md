# Twitter Clone Application

A modern Twitter-like social media application built with Next.js and NestJS, featuring real-time interactions, user authentication, and a responsive design with dark mode support.

## Features

- **User Authentication**: Secure registration and login with JWT-based authentication
- **Post Creation**: Create posts with text and images (supports base64 image uploads)
- **Social Interactions**:
  - Like and unlike posts
  - Comment on posts
  - Repost functionality (regular repost and quote repost)
- **User Profiles**:
  - Customizable user profiles
  - View user posts and statistics
  - Follow/unfollow users
- **Feed System**:
  - Personalized feed showing posts from followed users
  - Pagination support for efficient loading
- **Search**: Search for users by username or email
- **Theme Support**: Light and dark mode toggle

## Technology Stack

### Backend

- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for database management
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **Passport** - Authentication middleware
- **bcrypt** - Password hashing

### Frontend

- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TanStack Query (React Query)** - Data fetching and state management
- **Styled Components** - CSS-in-JS styling
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hook Form** - Form management

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **PostgreSQL** (v12 or higher)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd twitter-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=3001
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=db_namme

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d
```

**Important**: Change `JWT_SECRET` to a secure random string in production.

### 3. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE twitter;
```

The application will automatically create the required tables on first run using TypeORM migrations.

### 4. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
BACKEND_URL=http://localhost:3001
```

## Running the Application

### Start Backend Server

```bash
cd backend
npm run start:dev
```

The backend server will start on `http://localhost:3001`

### Start Frontend Application

```bash
cd frontend
npm run dev
```

The frontend application will start on `http://localhost:3000`

## Development

### Backend Commands

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests

### Frontend Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

```
twitter-app/
├── backend/
│   ├── src/
│   │   ├── auth/          # Authentication module
│   │   ├── comment/       # Comments functionality
│   │   ├── follow/        # Follow/unfollow system
│   │   ├── like/          # Like functionality
│   │   ├── post/          # Posts management
│   │   ├── users/         # User management
│   │   └── main.ts        # Application entry point
│   ├── .env.example       # Environment variables template
│   └── package.json
│
└── frontend/
    ├── app/               # Next.js app directory
    │   ├── home/          # Home feed page
    │   ├── login/         # Login page
    │   ├── register/      # Registration page
    │   ├── profile/       # User profile pages
    │   └── api/           # API proxy routes
    ├── components/        # Reusable components
    ├── contexts/          # React contexts (Auth, Theme)
    ├── services/          # API service functions
    └── package.json
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Posts

- `GET /posts` - Get all posts (paginated)
- `GET /posts/feed` - Get personalized feed
- `POST /posts` - Create new post or repost
- `GET /posts/user/:username` - Get user's posts
- `GET /posts/:id` - Get single post
- `DELETE /posts/:id` - Delete post
- `DELETE /posts/unrepost/:id` - Remove repost

### Users

- `GET /users/search?q=query` - Search users
- `GET /users/profile` - Get current user profile
- `PATCH /users/profile` - Update profile
- `GET /users/:username` - Get user by username
- `POST /users/:userId/follow` - Follow user
- `POST /users/:userId/unfollow` - Unfollow user

### Likes

- `POST /likes/:postId` - Like a post
- `DELETE /likes/:postId` - Unlike a post

### Comments

- `GET /comments/:postId` - Get post comments
- `POST /comments/:postId` - Create comment

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected routes with guards
- CORS configuration
- Input validation and sanitization

## License

UNLICENSED
