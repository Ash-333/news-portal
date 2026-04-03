# AI Agent Integration Prompts

Use these prompts to give your AI agent for integrating the public features into your frontend app.

---

## 1. Horoscope Integration

### API Endpoint

```
GET /api/horoscopes
```

### Query Parameters

| Parameter  | Type   | Required | Description                                                    |
| ---------- | ------ | -------- | -------------------------------------------------------------- |
| limit      | number | No       | Default: 12                                                    |
| page       | number | No       | Default: 1                                                     |
| zodiacSign | string | No       | Filter by specific zodiac sign (e.g., "aries", "taurus", etc.) |

### Default Behavior

When no zodiacSign is provided, the API returns today's horoscopes for all 12 zodiac signs.

### Response Format

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "zodiacSign": "aries",
      "titleNe": "आजको राशिफल",
      "titleEn": "Today's Horoscope",
      "contentNe": "...",
      "contentEn": "...",
      "date": "2026-03-27T00:00:00.000Z",
      "isPublished": true,
      "author": { "name": "Admin" }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 12,
    "totalPages": 1
  }
}
```

### Integration Prompt for AI Agent

```
Integrate horoscope functionality into a public frontend app using the following API:

API Endpoint: GET /api/horoscopes
Base URL: [YOUR_BACKEND_URL]

Features to implement:
1. Display all 12 zodiac signs with their daily horoscope predictions
2. Show both English (titleEn, contentEn) and Nepali (titleNe, contentNe) content
3. Support filtering by zodiac sign using the zodiacSign query parameter
4. Use pagination with limit and page parameters for fetching data
5. Create a visually appealing UI component showing zodiac sign icons/images
6. Handle loading and error states gracefully

Zodiac Signs: aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces

Data structure to use:
- zodiacSign: string (lowercase zodiac name)
- titleEn: string (English title)
- contentEn: string (English content)
- titleNe: string (Nepali title)
- contentNe: string (Nepali content)
- date: string (ISO date)
- author: { name: string }

Please implement the complete frontend integration including API service, types, and UI components.
```

---

## 2. Audio News Integration

### API Endpoint

```
GET /api/audio-news
```

### Query Parameters

| Parameter  | Type   | Required | Description                     |
| ---------- | ------ | -------- | ------------------------------- |
| limit      | number | No       | Default: 10                     |
| page       | number | No       | Default: 1                      |
| categoryId | string | No       | Filter by category              |
| search     | string | No       | Search in title and description |

### Response Format

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "titleNe": "शीर्षक नेपालीमा",
      "titleEn": "Title in English",
      "descriptionNe": "विवरण नेपालीमा",
      "descriptionEn": "Description in English",
      "audioUrl": "/uploads/audio/file.mp3",
      "thumbnailUrl": "/uploads/images/thumb.jpg",
      "viewCount": 42,
      "isPublished": true,
      "publishedAt": "2026-03-27T10:00:00.000Z",
      "author": { "name": "Author Name" },
      "category": { "nameEn": "Category Name", "nameNe": "श्रेणी नाम" }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1
  }
}
```

### Integration Prompt for AI Agent

```
Integrate audio news functionality into a public frontend app using the following API:

API Endpoint: GET /api/audio-news
Base URL: [YOUR_BACKEND_URL]

Features to implement:
1. Display a list of audio news items with title, description, and thumbnail
2. Include audio player functionality using the audioUrl field
3. Support pagination with limit and page parameters
4. Filter by category using categoryId query parameter
5. Support search functionality using the search query parameter
6. Show view count for each audio news item
7. Display author and category information
8. Handle both English (titleEn, descriptionEn) and Nepali (titleNe, descriptionNe) content

Data structure to use:
- id: string (UUID)
- titleEn: string
- titleNe: string
- descriptionEn: string (optional)
- descriptionNe: string (optional)
- audioUrl: string (file path)
- thumbnailUrl: string (optional, file path)
- viewCount: number
- publishedAt: string (ISO date)
- author: { name: string }
- category: { nameEn: string, nameNe: string }

Please implement:
- API service to fetch audio news
- TypeScript interfaces for the data
- Audio player component with play/pause functionality
- List view component with thumbnails
- Pagination component
- Search bar for filtering
- Loading and error states

Use a proper audio player library or HTML5 audio element.
```

---

## 3. Article View Count Integration

### API Endpoints

#### Get Article with View Count

```
GET /api/articles/[slug]
```

The article response includes a viewCount field.

#### Increment View Count

```
POST /api/articles/[slug]/view
```

### Response Format (View Increment)

```json
{
  "success": true,
  "data": {
    "viewCount": 1234
  },
  "message": "View count incremented"
}
```

### Integration Prompt for AI Agent

```
Integrate view count functionality into a public frontend app for articles:

1. Display View Count:
   - Fetch article data from GET /api/articles/[slug]
   - The response includes a viewCount field
   - Display the view count in a visually appealing way (e.g., with an eye icon)

2. Track Views (Increment):
   - When a user views an article detail page, call POST /api/articles/[slug]/view
   - This increments the view count by 1
   - Do this on the client side when the article component mounts (useEffect)
   - Consider using a flag to prevent duplicate increments in the same session

API Details:
- Base URL: [YOUR_BACKEND_URL]
- GET /api/articles/{slug} - returns article with viewCount
- POST /api/articles/{slug}/view - increments view count, returns { viewCount: number }

Data fields:
- viewCount: number (total views)

Implementation requirements:
- Create a hook or service to handle view tracking
- Show view count with appropriate icon (eye or view symbol)
- Format large numbers (e.g., 1.2k, 3.5k) if needed
- Handle API errors gracefully (don't break UI if view tracking fails)
- Only track views once per session (use localStorage or sessionStorage)

Please implement the complete integration including API service, types, and UI component.
```

---

## Summary

| Feature    | API Endpoint                   | Key Fields                                                                      |
| ---------- | ------------------------------ | ------------------------------------------------------------------------------- |
| Horoscope  | GET /api/horoscopes            | zodiacSign, titleEn/titleNe, contentEn/contentNe, date                          |
| Audio News | GET /api/audio-news            | titleEn/titleNe, descriptionEn/descriptionNe, audioUrl, thumbnailUrl, viewCount |
| View Count | POST /api/articles/[slug]/view | viewCount (increment)                                                           |

For all endpoints, replace [YOUR_BACKEND_URL] with your actual backend URL (e.g., http://localhost:3000 or your production URL).
