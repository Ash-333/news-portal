# News Portal Features

A comprehensive Next.js-based news portal application with full bilingual support (English/Nepali), user authentication, and interactive features.

## 1. Core Content Features

### Articles

- **Article Listing**: Paginated article lists with filtering by category, author, tag
- **Featured Articles**: Hero/Banner articles on homepage
- **Breaking News**: Special marking for breaking news articles
- **Popular Articles**: View-count based popular articles
- **Latest News**: Most recent articles feed
- **Related Articles**: Contextually related article suggestions
- **Article Search**: Full-text search across articles
- **View Tracking**: Automatic view count increment
- **Social Sharing**: Share buttons for social media platforms
- **Article Tags**: Tag-based article organization

### Categories (10 total)

- Politics (राजनीति)
- Business (व्यापार)
- Sports (खेलकुद)
- Entertainment (मनोरञ्जन)
- Technology (प्रविधि)
- Health (स्वास्थ्य)
- Education (शिक्षा)
- World (विश्व)
- National (राष्ट्रिय)
- Opinion (विचार)

### Authors

- Author profiles with bio and avatar
- Author-specific article pages
- Author article counts

## 2. User Authentication

- **User Registration**: Email/password registration
- **Login**: JWT-based authentication with access/refresh tokens
- **Password Reset**: Forgot password and reset password flows
- **Token Management**: Automatic token refresh
- **Session Persistence**: localStorage-based session management

Note: Email verification was removed as it's not implemented in the backend.

## 3. Media Features

### Videos

- Video gallery with pagination
- Video player integration

### Audio News

- Audio news list with category filtering
- Audio playback support

### Images

- Featured images for articles
- Image optimization
- Sitemap for images (SEO)

## 4. Interactive Features

### Comments

- Post comments on articles
- Like/unlike comments
- Report inappropriate comments
- Delete own comments

### Polls

- View active polls
- Vote in polls
- View poll results
- Session-based voting prevention

### Horoscopes

- Daily horoscope predictions
- Zodiac sign-based filtering
- Date-based predictions

### Flash Updates

- Breaking news ticker
- Real-time breaking news updates
- Flash update sidebar

## 5. Advertising System

- **Ad Positions**: Fixed ad positions across the site
- **Ad Management**: Backend ad management
- **Ad Click Tracking**: Track ad clicks
- **Random Ad Selection**: Random ad display per position

## 6. Bilingual Support

- **Language Context**: React context for language state
- **English/Nepali**: Full bilingual content support
- **Language Switcher**: In-header language toggle
- **Server-Side Language**: Language selection works for server-rendered pages via URL params and cookies

## 7. SEO Features

- **News Sitemap**: XML sitemap for news articles
- **Image Sitemap**: XML sitemap for images
- **JSON-LD**: Structured data for articles and website
- **Meta Tags**: Dynamic meta tags per page
- **OpenGraph**: Social sharing metadata

## 8. Pages/Routes

### Main Pages

- `/` - Homepage (Hero, Category sections, Latest news, Polls, Videos)
- `/article/[slug]` - Article detail page
- `/category/[slug]` - Category-based article listing
- `/author/[slug]` - Author profile and articles
- `/tag/[slug]` - Tag-based article listing
- `/search` - Search results page
- `/videos` - Video gallery
- `/audio` - Audio news page
- `/flash-updates` - Flash updates page

### Static Pages

- `/about` - About page
- `/contact` - Contact page
- `/privacy` - Privacy policy
- `/terms` - Terms of service

### User Pages

- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Forgot password
- `/reset-password` - Reset password
- `/verify-email` - Email verification (placeholder)

## 9. UI Components

### Layout

- Header with navigation
- Footer with links
- Mobile bottom bar
- Breaking news ticker
- Top bar

### Article Components

- ArticleCard - Preview card
- ArticleContent - Body content
- ArticleNavigation - Next/Previous
- ArticleTags - Tag display
- ArticleViewTracker - View counting
- AuthorBox - Author info
- CommentSection - Comments
- PopularArticles - Popular list
- RelatedArticles - Related list
- ShareBar - Social sharing

### Section Components

- HeroSection - Featured articles
- CategorySection - Category blocks
- LatestNewsSection - News list
- LatestUpdatesSidebar - Sidebar updates
- SportsSection - Sports news
- FullWidthArticlesSection - Wide articles
- VideoSection - Video grid

### UI Components (Shadcn)

- Button, Card, Dialog
- Dropdown Menu
- Input, Textarea
- Tabs, Accordion
- Table, Pagination
- Tooltip, Popover
- Avatar, Badge
- **Select**: Custom dropdown select component

## 10. API Endpoints

### Articles

- `GET /api/articles` - List articles
- `GET /api/articles/:slug` - Get article
- `POST /api/articles/:slug/view` - Increment view

### Auth

- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/refresh-token` - Refresh token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Comments

- `GET /api/articles/:slug/comments` - Get comments (by slug)
- `POST /api/comments` - Post comment
- `POST /api/comments/:id/like` - Like comment
- `POST /api/comments/:id/report` - Report comment
- `DELETE /api/comments/:id` - Delete comment

### Polls

- `GET /api/polls` - Get polls
- `GET /api/polls/:id` - Get poll
- `POST /api/polls/:id` - Vote in poll
- `GET /api/polls/:id/results` - Get results

### Other APIs

- `GET /api/categories` - Categories
- `GET /api/flash-updates` - Flash updates
- `GET /api/horoscopes` - Horoscopes
- `GET /api/videos` - Videos
- `GET /api/audio-news` - Audio news
- `GET /api/ads` - Ads

## 11. Technical Features

- **Next.js 14+**: App Router architecture
- **TypeScript**: Full type safety
- **Tailwind CSS**: Styling
- **Shadcn UI**: Component library
- **React Context**: State management
- **API Client**: Centralized API fetching
- **Error Handling**: Graceful error handling
- **Loading States**: Skeleton loaders

## 12. Data Types

- Articles with rich content (HTML)
- Categories with colors
- Authors with profiles
- Comments with threading
- Polls with options
- Horoscopes with predictions
- Flash updates with timestamps
- Videos with thumbnails
- Audio with transcripts
- Ads with positioning

## Recent Updates (2026-04-05)

- Added server-side language selection support via middleware
- Added auth endpoints: /api/auth/me, /api/auth/logout, /api/auth/profile, /api/auth/change-password
- Fixed comment auth - now shows correct user
- Removed mock data (weather, market widgets)
- Added tag management and tag selection in article forms
- Created custom Select component for better UX