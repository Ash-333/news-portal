import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'News Portal API',
      version: '1.0.0',
      description: 'Public API for News Portal - enabling frontend developers to integrate articles, categories, ads, and more.',
      contact: {
        name: 'API Support',
        email: 'support@newsportal.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Articles',
        description: 'Public article endpoints',
      },
      {
        name: 'Categories',
        description: 'Category management endpoints',
      },
      {
        name: 'Ads',
        description: 'Advertisement endpoints',
      },
      {
        name: 'Polls',
        description: 'Poll voting and results',
      },
      {
        name: 'Horoscopes',
        description: 'Daily horoscope data',
      },
      {
        name: 'Flash Updates',
        description: 'Breaking news and flash updates',
      },
      {
        name: 'Bookmarks',
        description: 'User bookmark management',
      },
      {
        name: 'Comments',
        description: 'Article comment endpoints',
      },
      {
        name: 'Audio News',
        description: 'Audio news clips',
      },
      {
        name: 'Videos',
        description: 'Video news content',
      },
      {
        name: 'Auth',
        description: 'Authentication endpoints',
      },
    ],
    components: {
      schemas: {
        Article: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            titleEn: { type: 'string' },
            titleNe: { type: 'string' },
            excerptEn: { type: 'string' },
            excerptNe: { type: 'string' },
            slug: { type: 'string' },
            contentEn: { type: 'string' },
            contentNe: { type: 'string' },
            isFlashUpdate: { type: 'boolean' },
            isFeatured: { type: 'boolean' },
            publishedAt: { type: 'string', format: 'date-time' },
            viewCount: { type: 'integer' },
            featuredImage: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                url: { type: 'string' },
              },
            },
            category: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                nameEn: { type: 'string' },
                nameNe: { type: 'string' },
                slug: { type: 'string' },
              },
            },
            author: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                profilePhoto: { type: 'string' },
              },
            },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            nameEn: { type: 'string' },
            nameNe: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            parentId: { type: 'string', format: 'uuid', nullable: true },
            children: {
              type: 'array',
              items: { $ref: '#/components/schemas/Category' },
            },
          },
        },
        Advertisement: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            position: { type: 'string' },
            content: { type: 'string' },
            url: { type: 'string' },
            imageUrl: { type: 'string' },
            isActive: { type: 'boolean' },
          },
        },
        Poll: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            question: { type: 'string' },
            options: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', format: 'uuid' },
                  text: { type: 'string' },
                  voteCount: { type: 'integer' },
                },
              },
            },
            isActive: { type: 'boolean' },
            expiresAt: { type: 'string', format: 'date-time' },
          },
        },
        PollVote: {
          type: 'object',
          properties: {
            pollId: { type: 'string', format: 'uuid' },
            optionId: { type: 'string', format: 'uuid' },
          },
        },
        Horoscope: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            sign: { type: 'string' },
            signNe: { type: 'string' },
            date: { type: 'string', format: 'date' },
            prediction: { type: 'string' },
            predictionNe: { type: 'string' },
            luckyNumber: { type: 'integer' },
            luckyColor: { type: 'string' },
          },
        },
        FlashUpdate: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            content: { type: 'string' },
            isFlashUpdate: { type: 'boolean' },
            publishedAt: { type: 'string', format: 'date-time' },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            content: { type: 'string' },
            authorName: { type: 'string' },
            articleSlug: { type: 'string' },
            status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Bookmark: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            articleId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        AudioNews: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            titleEn: { type: 'string' },
            titleNe: { type: 'string' },
            audioUrl: { type: 'string' },
            duration: { type: 'integer' },
            publishedAt: { type: 'string', format: 'date-time' },
          },
        },
        Video: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            titleEn: { type: 'string' },
            titleNe: { type: 'string' },
            videoUrl: { type: 'string' },
            thumbnailUrl: { type: 'string' },
            duration: { type: 'integer' },
            viewCount: { type: 'integer' },
            publishedAt: { type: 'string', format: 'date-time' },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'object' },
            message: { type: 'string' },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { type: 'array', items: { type: 'object' } },
            message: { type: 'string' },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'integer' },
                limit: { type: 'integer' },
                total: { type: 'integer' },
                totalPages: { type: 'integer' },
              },
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
      },
    },
    paths: {
      '/api/articles': {
        get: {
          tags: ['Articles'],
          summary: 'Get published articles',
          description: 'Retrieve a list of published articles with optional filtering and pagination',
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
              description: 'Page number for pagination',
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 20 },
              description: 'Number of items per page',
            },
            {
              name: 'search',
              in: 'query',
              schema: { type: 'string' },
              description: 'Search term for article titles and excerpts',
            },
            {
              name: 'categorySlug',
              in: 'query',
              schema: { type: 'string' },
              description: 'Filter by category slug',
            },
            {
              name: 'isFlashUpdate',
              in: 'query',
              schema: { type: 'string', enum: ['true', 'false'] },
              description: 'Filter breaking news',
            },
            {
              name: 'isFeatured',
              in: 'query',
              schema: { type: 'string', enum: ['true', 'false'] },
              description: 'Filter featured articles',
            },
            {
              name: 'sortBy',
              in: 'query',
              schema: { type: 'string', enum: ['publishedAt', 'viewCount', 'titleEn'] },
              description: 'Field to sort by',
            },
            {
              name: 'order',
              in: 'query',
              schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
              description: 'Sort order',
            },
          ],
          responses: {
            200: {
              description: 'Successfully retrieved articles',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/PaginatedResponse' },
                },
              },
            },
            400: {
              description: 'Invalid query parameters',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/api/articles/{slug}': {
        get: {
          tags: ['Articles'],
          summary: 'Get article by slug',
          description: 'Retrieve a single published article by its slug',
          parameters: [
            {
              name: 'slug',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Article slug (URL-friendly identifier)',
            },
          ],
          responses: {
            200: {
              description: 'Successfully retrieved article',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
            404: {
              description: 'Article not found',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/api/categories': {
        get: {
          tags: ['Categories'],
          summary: 'Get all categories',
          description: 'Retrieve a list of all active categories with their subcategories and article counts',
          responses: {
            200: {
              description: 'Successfully retrieved categories',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
      },
      '/api/ads': {
        get: {
          tags: ['Ads'],
          summary: 'Get active advertisements',
          description: 'Retrieve a list of active ads, optionally filtered by position',
          parameters: [
            {
              name: 'position',
              in: 'query',
              schema: { type: 'string' },
              description: 'Ad position (e.g., header, sidebar, footer)',
            },
          ],
          responses: {
            200: {
              description: 'Successfully retrieved ads',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
      },
      '/api/polls': {
        get: {
          tags: ['Polls'],
          summary: 'Get active polls',
          description: 'Retrieve a list of currently active polls',
          responses: {
            200: {
              description: 'Successfully retrieved polls',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
        post: {
          tags: ['Polls'],
          summary: 'Vote on a poll',
          description: 'Submit a vote for a poll option',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PollVote' },
              },
            },
          },
          responses: {
            200: {
              description: 'Vote recorded successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
            400: {
              description: 'Invalid request',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/api/polls/{id}': {
        get: {
          tags: ['Polls'],
          summary: 'Get poll results',
          description: 'Retrieve poll results by ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' },
              description: 'Poll ID',
            },
          ],
          responses: {
            200: {
              description: 'Successfully retrieved poll',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
      },
      '/api/horoscopes': {
        get: {
          tags: ['Horoscopes'],
          summary: 'Get horoscopes',
          description: 'Retrieve daily horoscope predictions',
          parameters: [
            {
              name: 'date',
              in: 'query',
              schema: { type: 'string', format: 'date' },
              description: 'Date for horoscope (YYYY-MM-DD), defaults to today',
            },
            {
              name: 'sign',
              in: 'query',
              schema: { type: 'string' },
              description: 'Zodiac sign filter (e.g., aries, taurus)',
            },
          ],
          responses: {
            200: {
              description: 'Successfully retrieved horoscopes',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
      },
      '/api/flash-updates': {
        get: {
          tags: ['Flash Updates'],
          summary: 'Get flash updates',
          description: 'Retrieve breaking news and flash updates',
          parameters: [
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 10 },
              description: 'Number of updates to return',
            },
          ],
          responses: {
            200: {
              description: 'Successfully retrieved updates',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
      },
      '/api/comments': {
        get: {
          tags: ['Comments'],
          summary: 'Get comments',
          description: 'Retrieve approved comments for an article',
          parameters: [
            {
              name: 'articleSlug',
              in: 'query',
              required: true,
              schema: { type: 'string' },
              description: 'Article slug to get comments for',
            },
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
              description: 'Page number',
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 20 },
              description: 'Items per page',
            },
          ],
          responses: {
            200: {
              description: 'Successfully retrieved comments',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/PaginatedResponse' },
                },
              },
            },
          },
        },
        post: {
          tags: ['Comments'],
          summary: 'Create a comment',
          description: 'Submit a new comment for an article',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['articleSlug', 'content', 'authorName'],
                  properties: {
                    articleSlug: { type: 'string' },
                    content: { type: 'string' },
                    authorName: { type: 'string' },
                    parentId: { type: 'string', format: 'uuid' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Comment submitted for moderation',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
      },
      '/api/bookmarks': {
        get: {
          tags: ['Bookmarks'],
          summary: 'Get user bookmarks',
          description: 'Retrieve authenticated user bookmarks (requires authentication)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Successfully retrieved bookmarks',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
        post: {
          tags: ['Bookmarks'],
          summary: 'Create bookmark',
          description: 'Add article to bookmarks (requires authentication)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['articleId'],
                  properties: {
                    articleId: { type: 'string', format: 'uuid' },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Bookmark created',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
        delete: {
          tags: ['Bookmarks'],
          summary: 'Remove bookmark',
          description: 'Remove article from bookmarks (requires authentication)',
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: 'articleId',
              in: 'query',
              required: true,
              schema: { type: 'string', format: 'uuid' },
              description: 'Article ID to remove from bookmarks',
            },
          ],
          responses: {
            200: {
              description: 'Bookmark removed',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
      },
      '/api/audio-news': {
        get: {
          tags: ['Audio News'],
          summary: 'Get audio news',
          description: 'Retrieve audio news clips',
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 20 },
            },
          ],
          responses: {
            200: {
              description: 'Successfully retrieved audio news',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/PaginatedResponse' },
                },
              },
            },
          },
        },
      },
      '/api/videos': {
        get: {
          tags: ['Videos'],
          summary: 'Get videos',
          description: 'Retrieve video news content',
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: { type: 'integer', default: 1 },
            },
            {
              name: 'limit',
              in: 'query',
              schema: { type: 'integer', default: 20 },
            },
          ],
          responses: {
            200: {
              description: 'Successfully retrieved videos',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/PaginatedResponse' },
                },
              },
            },
          },
        },
      },
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register new user',
          description: 'Create a new user account',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 8 },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'User registered successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
            400: {
              description: 'Invalid input',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
      '/api/auth/forgot-password': {
        post: {
          tags: ['Auth'],
          summary: 'Request password reset',
          description: 'Request a password reset link via email',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email'],
                  properties: {
                    email: { type: 'string', format: 'email' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Reset link sent if email exists',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
      },
      '/api/auth/reset-password': {
        post: {
          tags: ['Auth'],
          summary: 'Reset password',
          description: 'Reset password using token from email',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['token', 'password'],
                  properties: {
                    token: { type: 'string' },
                    password: { type: 'string', minLength: 8 },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Password reset successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
            400: {
              description: 'Invalid or expired token',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./app/api/**/route.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)