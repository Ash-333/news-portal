# Complete React Native Mobile App Requirements for News Portal

## Project Overview

Build a production-ready React Native mobile application for the existing News Portal project using Expo and Expo Router's file-based routing. The app must provide a native mobile experience that integrates seamlessly with the backend APIs from both the admin_panel and public_portal.

## Core Requirements

### 1. Technical Stack
- **Framework**: React Native with Expo SDK
- **Navigation**: Expo Router with file-based routing
- **State Management**: TanStack Query (React Query) + React Context
- **Authentication**: JWT-based with automatic token refresh
- **Storage**: AsyncStorage for persistence
- **Styling**: React Native StyleSheet with consistent design system
- **Language Support**: Bilingual (English/Nepali) with context-based switching

### 2. Backend Integration
- **API Base URL**: Connect to existing backend endpoints
- **Authentication**: JWT tokens with refresh mechanism
- **Data Fetching**: RESTful API integration with error handling
- **Real-time Updates**: Support for breaking news and flash updates
- **Offline Support**: Cache management and offline indicators

## Application Features

### 3. Core Screens & Navigation

#### Tab-based Navigation Structure:
- **Home** (index.tsx): Main feed with breaking news, featured articles, categories, polls
- **Categories** (categories.tsx): Browse articles by category with horizontal scrolling
- **Profile** (profile.tsx): User profile, settings, language switching

#### Additional Screens:
- **Article Detail** (article/[slug].tsx): Full article view with comments and sharing
- **Login** (auth/login.tsx): Email/password authentication
- **Register** (auth/register.tsx): User registration form
- **Search** (search.tsx): Global article search with filters

### 4. Content Features

#### Articles Management:
- List articles with pagination and filtering
- Display featured and breaking news prominently
- Article detail with rich content, author info, and metadata
- View count tracking and social sharing
- Bookmark functionality for authenticated users
- Related articles suggestions

#### Categories System:
- Display all available categories
- Category-based article filtering
- Horizontal scrolling category selector
- Category-specific article feeds

#### Multimedia Content:
- Video articles with YouTube integration
- Audio news with playback controls
- Image galleries and featured images
- Media optimization for mobile devices

### 5. User Authentication & Profile

#### Authentication Flow:
- Login with email/password
- Registration with validation
- Password reset via email
- JWT token management with automatic refresh
- Persistent login state across app restarts
- Secure logout functionality

#### Profile Management:
- View and edit user profile
- Change password functionality
- Language preference settings
- Account deletion (if required)

### 6. Interactive Features

#### Comments System:
- View article comments with threading
- Post new comments (authenticated users only)
- Like/unlike comments
- Report inappropriate comments
- Delete own comments
- Real-time comment updates

#### Polls & Voting:
- Display active polls on home screen
- Vote in polls (one vote per user per poll)
- View poll results and statistics
- Session-based voting prevention



### 7. Bilingual Support (English/Nepali)

#### Language System:
- Complete English/Nepali translation coverage
- Context-based language switching
- Persistent language preference
- System language auto-detection
- RTL support for Nepali text
- Localized date and number formatting

#### Translation Keys Required:
- All UI text and labels
- Error messages and notifications
- Article content (title, excerpt, body)
- Category names and descriptions
- User interface elements

### 8. Advanced Features

#### Push Notifications:
- Breaking news alerts
- Article recommendations
- Poll updates
- Comment replies
- Customizable notification preferences

#### Offline Support:
- Cache recent articles for offline reading
- Sync when online
- Offline indicators and error states

#### Search & Discovery:
- Full-text article search
- Filter by category, author, date
- Search suggestions and history
- Voice search capability

#### Social Features:
- Article sharing to social media
- Deep linking support
- QR code article sharing
- Social media integration

## Technical Implementation Requirements

### 9. Architecture & File Structure

```
news-portal-mobile/
├── app/                          # Expo Router screens (file-based routing)
│   ├── _layout.tsx              # Root layout with providers
│   ├── (tabs)/                  # Tab navigation group
│   │   ├── _layout.tsx         # Tab layout configuration
│   │   ├── index.tsx           # Home screen
│   │   ├── categories.tsx      # Categories screen
│   │   └── profile.tsx         # Profile screen
│   ├── article/[slug].tsx      # Dynamic article detail
│   ├── auth/login.tsx          # Login screen
│   ├── auth/register.tsx       # Registration screen
│   └── search.tsx              # Search screen
├── components/                  # Reusable UI components
│   ├── ui/                     # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Loading.tsx
│   ├── ArticleCard.tsx         # Article preview component
│   ├── ArticleContent.tsx      # Article detail renderer
│   ├── CategoryCard.tsx        # Category display
│   ├── CommentItem.tsx         # Comment display
│   ├── CommentSection.tsx      # Comments management
│   ├── PollCard.tsx            # Poll voting component
│   ├── BookmarkButton.tsx      # Bookmark toggle
│   ├── BreakingNews.tsx        # Breaking news ticker
│   └── LanguageSwitcher.tsx    # Language selection
├── contexts/                   # React contexts
│   ├── AuthContext.tsx         # Authentication state
│   └── LanguageContext.tsx     # Language management
├── hooks/                      # Custom React hooks
│   ├── useArticles.ts          # Article data management
│   ├── useAuth.ts              # Authentication helpers
│   ├── useCategories.ts        # Category data
│   ├── useComments.ts          # Comment management
│   └── usePolls.ts             # Poll interactions
├── lib/                        # Utilities and configurations
│   ├── api/                    # API integration
│   │   ├── client.ts           # Base API client with auth
│   │   ├── articles.ts         # Article API methods
│   │   ├── auth.ts             # Authentication APIs
│   │   ├── categories.ts       # Category APIs
│   │   ├── comments.ts         # Comment APIs
│   │   ├── polls.ts            # Poll APIs
│   │   ├── videos.ts           # Video APIs
│   │   ├── audio.ts            # Audio APIs
│   │   └── notifications.ts    # Push notification setup
│   ├── constants.ts            # App constants and config
│   ├── utils.ts                # Utility functions
│   └── validation.ts           # Form validation helpers
├── types/                      # TypeScript type definitions
│   ├── index.ts                # Main type exports
│   ├── api.ts                  # API response types
│   ├── article.ts              # Article-related types
│   ├── user.ts                 # User and auth types
│   └── ui.ts                   # UI component types
├── assets/                     # Static assets
│   ├── images/                 # App images and icons
│   ├── fonts/                  # Custom fonts
│   └── animations/             # Lottie animations
├── app.json                    # Expo configuration
├── package.json                # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

### 10. API Integration Details

#### Base API Client Requirements:
- Automatic JWT token attachment to requests
- Token refresh on 401 responses
- Error handling with user-friendly messages
- Request/response logging in development
- Timeout handling and retry logic
- Offline detection and queue management

#### Required API Endpoints Integration:
- **Articles**: GET /api/articles (with filters), GET /api/articles/:slug, POST /api/articles/:slug/view
- **Categories**: GET /api/categories, GET /api/categories/:slug/articles
- **Authentication**: POST /api/auth/login, POST /api/auth/register, POST /api/auth/refresh-token, GET /api/auth/me
- **Comments**: GET /api/articles/:slug/comments, POST /api/comments, DELETE /api/comments/:id
- **Polls**: GET /api/polls, POST /api/polls/:id/vote, GET /api/polls/:id/results
- **User Profile**: PUT /api/auth/profile, POST /api/auth/change-password
- **Media**: GET /api/videos, GET /api/audio-news, GET /api/flash-updates

### 11. UI/UX Requirements

#### Design System:
- Consistent color palette and typography
- Responsive design for different screen sizes
- Dark/light theme support (optional)
- Accessible components with proper contrast
- Loading states and skeleton screens
- Error states with retry options

#### Mobile-Specific Features:
- Pull-to-refresh on all list screens
- Infinite scrolling with pagination
- Swipe gestures for navigation
- Native platform-specific behaviors
- Optimized touch targets (44pt minimum)
- Fast app startup and navigation

### 12. Performance Requirements

#### Optimization Targets:
- First contentful paint < 2 seconds
- Time to interactive < 3 seconds
- Bundle size < 50MB (including all assets)
- Smooth 60fps scrolling and animations
- Memory usage < 200MB on modern devices

#### Caching Strategy:
- Article content caching for offline reading
- Image optimization and progressive loading
- API response caching with TanStack Query
- Asset preloading for critical screens

### 13. Testing Requirements

#### Unit Tests:
- API client functions
- Custom hooks logic
- Utility functions
- Component rendering logic

#### Integration Tests:
- Authentication flows
- API integration
- Navigation flows
- Form submissions

#### E2E Tests:
- Complete user journeys
- Cross-platform compatibility
- Performance benchmarks

### 14. Deployment & Distribution

#### Build Configuration:
- Separate development and production builds
- Environment-specific API endpoints
- Code signing and security
- Bundle optimization and tree shaking

#### App Store Requirements:
- iOS App Store submission ready
- Google Play Store submission ready
- Proper app icons and screenshots
- Privacy policy and terms of service
- App description and keywords

#### CI/CD Setup:
- Automated testing pipeline
- Automated build and deployment
- Beta testing distribution
- Crash reporting integration

## Quality Assurance Checklist

### 15. Functional Requirements
- [ ] All screens load without errors
- [ ] Authentication flow works completely
- [ ] Article reading and navigation works
- [ ] Comments posting and viewing works
- [ ] Polls display and voting works
- [ ] Language switching works throughout app
- [ ] Search functionality works with filters
- [ ] Push notifications work (when implemented)
- [ ] Offline mode works for cached content

### 16. Technical Requirements
- [ ] No TypeScript errors or warnings
- [ ] No ESLint errors or warnings
- [ ] Bundle size within limits
- [ ] Performance benchmarks met
- [ ] Memory usage within limits
- [ ] All API calls handle errors properly
- [ ] Loading states implemented everywhere
- [ ] Proper error boundaries implemented

### 17. Platform-Specific Requirements
- [ ] iOS builds successfully and runs on device
- [ ] Android builds successfully and runs on device
- [ ] All platform-specific features work
- [ ] App store submission requirements met
- [ ] Deep linking works on both platforms

## Success Criteria

The mobile app will be considered complete when:
1. All core features are implemented and working
2. The app provides a native, fast, and intuitive user experience
3. Full integration with the existing backend APIs
4. Bilingual support works seamlessly
5. The app is ready for production deployment
6. Code quality meets professional standards
7. Performance meets or exceeds requirements
8. Testing coverage is comprehensive

## Timeline Expectations

- **Phase 1** (Week 1-2): Project setup, basic navigation, API integration foundation
- **Phase 2** (Week 3-4): Core screens implementation, authentication, article viewing
- **Phase 3** (Week 5-6): Interactive features (comments, polls), bilingual support
- **Phase 4** (Week 7-8): Advanced features, performance optimization, testing
- **Phase 5** (Week 9-10): Deployment preparation, bug fixes, final testing

This comprehensive guide should enable an AI agent to build a complete, production-ready React Native mobile app for the News Portal project.