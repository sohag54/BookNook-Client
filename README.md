# BookNook - Small Online Library (Frontend)

> A modern, responsive web application for book lovers to explore catalogs, add books, borrow titles, and track returns.

- **Live Website**: [https://booknook-client.vercel.app](https://booknook-client.vercel.app) *(or your deployed production URL)*
- **Frontend Repository**: [https://github.com/sohag54/BookNook-Client](https://github.com/sohag54/BookNook-Client)
- **Backend Repository**: [https://github.com/sohag54/BookNook-Server](https://github.com/sohag54/BookNook-Server)

---

## Key Features & Capabilities

1. **Authentication with BetterAuth & Google OAuth**:
   - Secure email/password registration with real-time password strength validation (minimum 6 characters, at least 1 uppercase and 1 lowercase letter).
   - One-click Google Social Sign-In.
   - Session-to-JWT bridge providing cryptographically verified tokens for backend protected API requests.
   - Robust session persistence across page refreshes and browser reloads.

2. **Interactive Home Page with Swiper Carousel & Dynamic New Arrivals**:
   - Dynamic banner carousel featuring 3 animated slides highlighting core library actions.
   - "New Arrivals" section fetching the 6 most recently added library books directly from the backend API.
   - Additional curated informational sections: "How BookNook Works" (3-step borrowing guide) and "Popular Reading Categories".

3. **Comprehensive Book Catalog (`/books`) & Real-Time Filtering**:
   - Search books instantly by title or author name.
   - Category filtering (Fiction, Non-Fiction, Sci-Fi, Biography, Mystery, Fantasy, History, Self-Help).
   - Available copies indicator badges with visual out-of-stock indicators.
   - Responsive grid layout (1 column mobile, 2 columns tablet, 3 columns desktop).

4. **Private Book Details (`/books/:id`) & Safe Borrowing System**:
   - Route protected by authentication; unauthenticated visitors are redirected to Login with return callback preservation.
   - Displays full book metadata, cover art, author, category, description, and available copies.
   - Interactive Borrow Modal with return date selection and user information prefill.
   - Zero available copies disabling and duplicate borrow prevention.

5. **Personalized Library Dashboard (`/my-books` & `/my-borrows`)**:
   - **My Books**: Dedicated management page for books added by the logged-in user. Provides prefilled Edit modal (`PATCH /books/:id`) and Delete confirmation modal (`DELETE /books/:id`) with backend ownership validation.
   - **My Borrows**: Clean tabular list of books borrowed by the user, displaying book title, cover, borrow date, and return deadline.
   - Single-click Return functionality with confirmation modal that safely restores library book inventory and removes the active borrow record.

6. **Responsive Design & Dark Mode Support**:
   - Fully responsive layout optimized for mobile screens, tablets, and desktop displays.
   - Fluid mobile navigation drawer with hamburger toggle and user profile modal.
   - Theme toggle supporting both Light and Dark themes with persistent local storage.
   - Custom 404 Page Not Found with a "Back to Home" button and full-page loading indicators.

---

## Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Authentication**: [BetterAuth](https://www.better-auth.com/) with official MongoDB adapter
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **Carousel**: [Swiper](https://swiperjs.com/)

---

## Environment Variables Configuration

Create a `.env.local` file in the `booknook-client` root directory based on `.env.example`:

```env
# Client Base URL
BETTER_AUTH_URL=http://localhost:3000

# BetterAuth Secret (generate a random 32+ character string)
BETTER_AUTH_SECRET=your_better_auth_secret_here

# MongoDB Connection String (shared with BetterAuth adapter)
MONGODB_URI=your_mongodb_atlas_connection_string

# Express Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Google OAuth (Optional / Production)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

---

## Getting Started Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sohag54/BookNook-Client.git
   cd BookNook-Client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Copy `.env.example` to `.env.local` and add your database and backend connection details.

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## Backend Repository
The corresponding Express & MongoDB backend is located at:
[https://github.com/sohag54/BookNook-Server](https://github.com/sohag54/BookNook-Server)
