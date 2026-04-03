# API Integration Guide: Article View Increment & Comments

## Base API URL

```
Production: https://your-backend-domain.com/api
Development: http://localhost:3000/api
```

---

## 1. Article View Count API

### Endpoints

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| POST   | `/articles/:slug/view` | Increment view count    |
| GET    | `/articles/:slug`      | Get article with views  |

---

### POST /api/articles/:slug/view

Increment the view count for an article.

**Path Parameters**
- `slug` (string, required) - Article slug identifier

**Response**
```json
{
  "success": true,
  "data": {
    "viewCount": 123
  },
  "message": "View count incremented"
}
```

**Error Responses**
- 404: Article not found

---

### GET /api/articles/:slug

Get article details including view count.

**Path Parameters**
- `slug` (string, required) - Article slug identifier

**Response**
```json
{
  "success": true,
  "data": {
    "id": "article-uuid",
    "titleNe": "Article Title (Nepali)",
    "titleEn": "Article Title (English)",
    "contentNe": "<p>Content in Nepali</p>",
    "contentEn": "<p>Content in English</p>",
    "slug": "article-slug",
    "viewCount": 123,
    "publishedAt": "2024-01-15T10:30:00Z",
    "featuredImage": {
      "id": "image-uuid",
      "url": "/uploads/images/image.jpg"
    },
    "author": {
      "id": "user-uuid",
      "name": "Author Name",
      "profilePhoto": "/uploads/avatars/avatar.jpg"
    },
    "category": {
      "id": "category-uuid",
      "nameNe": "Category Name (N)",
      "nameEn": "Category Name (E)",
      "slug": "category-slug"
    },
    "tags": [
      {
        "id": "tag-uuid",
        "nameNe": "Tag Name (N)",
        "nameEn": "Tag Name (E)",
        "slug": "tag-slug"
      }
    ],
    "_count": {
      "comments": 5
    }
  },
  "message": "Article retrieved successfully"
}
```

---

## 2. Comments API

### Endpoints

| Method | Endpoint                                 | Description                        |
| ------ | ---------------------------------------- | ---------------------------------- |
| GET    | `/articles/:slugOrId/comments`          | Get approved comments (public)    |
| POST   | `/comments`                              | Create comment (authenticated)     |

---

### GET /api/articles/:slugOrId/comments

Get approved comments for an article. The parameter can be either article slug or article ID (UUID).

**Path Parameters**
- `slugOrId` (string, required) - Article slug or UUID

**Query Parameters**
- `page` (number, optional, default: 1) - Page number
- `limit` (number, optional, default: 20) - Items per page

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": "comment-uuid",
      "content": "Great article!",
      "status": "APPROVED",
      "articleId": "article-uuid",
      "userId": "user-uuid",
      "parentId": null,
      "likesCount": 0,
      "createdAt": "2024-01-15T10:30:00Z",
      "user": {
        "id": "user-uuid",
        "name": "John Doe",
        "profilePhoto": "/uploads/avatars/avatar.jpg"
      },
      "replies": [
        {
          "id": "reply-uuid",
          "content": "Thank you!",
          "status": "APPROVED",
          "articleId": "article-uuid",
          "userId": "user-uuid-2",
          "parentId": "comment-uuid",
          "likesCount": 0,
          "createdAt": "2024-01-15T11:00:00Z",
          "user": {
            "id": "user-uuid-2",
            "name": "Jane Smith",
            "profilePhoto": null
          }
        }
      ]
    }
  ],
  "message": "Comments retrieved successfully",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

**Error Responses**
- 404: Article not found

---

### POST /api/comments

Create a new comment on an article. Requires authentication.

**Headers**
```
Content-Type: application/json
Authorization: Bearer <jwt-token>
```

**Request Body**
```json
{
  "articleId": "article-uuid",
  "content": "Your comment text here",
  "parentId": "comment-uuid (optional - for replies)"
}
```

**Response (Success)**
```json
{
  "success": true,
  "data": {
    "id": "comment-uuid",
    "content": "Your comment text here",
    "status": "APPROVED",
    "articleId": "article-uuid",
    "userId": "user-uuid",
    "parentId": null,
    "likesCount": 0,
    "createdAt": "2024-01-15T12:00:00Z",
    "user": {
      "id": "user-uuid",
      "name": "John Doe",
      "profilePhoto": "/uploads/avatars/avatar.jpg"
    }
  },
  "message": "Comment posted successfully"
}
```

**Response (Pending Approval)**
```json
{
  "success": true,
  "data": { ...commentObject },
  "message": "Comment pending approval"
}
```

**Error Responses**
- 400: Invalid request body / Invalid parent comment
- 401: Unauthorized (not logged in)
- 403: Email not verified
- 404: Article not found

---

## Authentication Notes

To create comments, users must:
1. Be authenticated (include JWT token in Authorization header)
2. Have a verified email address

Comments may require admin approval depending on site settings.
