/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: [
    '/login',
    '/register',
    '/profile',
    '/bookmarks',
    '/api/*',
    '/search',
    '/server-sitemap.xml',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/login', '/register', '/profile', '/bookmarks', '/search'],
      },
      {
        userAgent: 'Googlebot-News',
        allow: '/',
        disallow: ['/login', '/register', '/profile', '/bookmarks', '/search'],
      },
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'}/sitemap-news.xml`,
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'}/sitemap-images.xml`,
    ],
  },
  // Custom transformation for each URL
  transform: async (config, path) => {
    // Set different priorities based on path patterns
    let priority = config.priority;
    let changefreq = config.changefreq;

    if (path === '/') {
      priority = 1.0;
      changefreq = 'hourly';
    } else if (path.startsWith('/article/')) {
      priority = 0.8;
      changefreq = 'weekly';
    } else if (path.startsWith('/category/')) {
      priority = 0.9;
      changefreq = 'daily';
    } else if (path.startsWith('/author/')) {
      priority = 0.6;
      changefreq = 'weekly';
    } else if (path.startsWith('/tag/')) {
      priority = 0.5;
      changefreq = 'weekly';
    } else if (['/about', '/contact', '/privacy', '/terms'].includes(path)) {
      priority = 0.4;
      changefreq = 'monthly';
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
