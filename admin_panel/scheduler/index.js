const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const TIMEZONE = 'Asia/Kathmandu';

function getCurrentNepaliTime() {
  const now = new Date();
  const nepalOffset = 5.75 * 60 * 60 * 1000;
  return new Date(now.getTime() + nepalOffset);
}

function formatTime(date) {
  return new Date(date).toLocaleString('en-US', { timeZone: TIMEZONE });
}

async function generateSummary(content, language) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.log('OPENROUTER_API_KEY not set, skipping AI summary generation');
    return null;
  }

  const model = 'nvidia/nemotron-3-super-120b-a12b:free';
  const prompt = language === 'ne'
    ? `तपाईं एक नेपाली समाचार सारांश विशेषज्ञ हुनुहुन्छ। दिइएको समाचार लेखको सारांश 2-3 वाक्यमा लेख्नुहोस्। परिणाम नेपालीमा हुनुपर्छ।\n\nसमाचार लेख:\n${content.slice(0, 2000)}`
    : `You are a news summary expert. Write a 2-3 sentence summary of the given news article in English.\n\nNews article:\n${content.slice(0, 2000)}`;

  const maxRetries = 3;
  const baseDelay = 10000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
          'X-Title': 'News Portal Scheduler',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 300,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log(`[${formatTime(getCurrentNepaliTime())}] OpenRouter error response:`, errorText);
        if (response.status === 429 && attempt < maxRetries) {
          const delay = baseDelay * attempt;
          console.log(`[${formatTime(getCurrentNepaliTime())}] Rate limited (429), retrying in ${delay/1000}s (attempt ${attempt}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      console.log(`[${formatTime(getCurrentNepaliTime())}] OpenRouter API call successful for ${language} summary`);
      return data.choices?.[0]?.message?.content?.trim() || null;
    } catch (error) {
      if (attempt === maxRetries) {
        console.error(`[${formatTime(getCurrentNepaliTime())}] Error generating summary after ${maxRetries} attempts:`, error.message);
        return null;
      }
      console.log(`[${formatTime(getCurrentNepaliTime())}] Error generating summary, retrying (attempt ${attempt}/${maxRetries}):`, error.message);
    }
  }
  return null;
}

async function publishScheduledArticles() {
  const nowUTC = new Date();
  console.log(`[${formatTime(getCurrentNepaliTime())}] Checking for scheduled articles (NPT)`);

  const scheduledArticles = await prisma.article.findMany({
    where: {
      status: 'SCHEDULED',
      scheduledAt: { lte: nowUTC },
      deletedAt: null,
    },
    select: {
      id: true,
      titleNe: true,
      titleEn: true,
      scheduledAt: true,
    },
  });

  if (scheduledArticles.length > 0) {
    console.log(`[${formatTime(getCurrentNepaliTime())}] Found ${scheduledArticles.length} scheduled article(s) to publish:`);
    for (const article of scheduledArticles) {
      console.log(`  - ${article.titleEn} (ID: ${article.id}, scheduledAt: ${article.scheduledAt})`);
    }
  } else {
    console.log(`[${formatTime(getCurrentNepaliTime())}] No scheduled articles found to publish`);
  }

  const result = await prisma.article.updateMany({
    where: {
      status: 'SCHEDULED',
      scheduledAt: { lte: nowUTC },
      deletedAt: null,
    },
    data: {
      status: 'PUBLISHED',
      publishedAt: nowUTC,
    },
  });

  if (result.count > 0) {
    console.log(`[${formatTime(getCurrentNepaliTime())}] Published ${result.count} scheduled article(s)`);
  }
}

async function generateAISummaries() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return;

  const articles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      OR: [
        { summaryNe: null },
        { summaryEn: null },
      ],
      deletedAt: null,
    },
    take: 1,
    orderBy: { publishedAt: 'desc' },
  });

  if (articles.length === 0) return;

  console.log(`[${formatTime(getCurrentNepaliTime())}] Processing 1 article for AI summary`);

  for (const article of articles) {
    const updates = {};

    if (!article.summaryNe && article.contentNe) {
      const summaryNe = await generateSummary(article.contentNe, 'ne');
      if (summaryNe) updates.summaryNe = summaryNe;
    }

    if (!article.summaryEn && article.contentEn) {
      const summaryEn = await generateSummary(article.contentEn, 'en');
      if (summaryEn) updates.summaryEn = summaryEn;
    }

    if (Object.keys(updates).length > 0) {
      await prisma.article.update({
        where: { id: article.id },
        data: updates,
      });
      console.log(`[${formatTime(getCurrentNepaliTime())}] Generated AI summary for article: ${article.id}`);
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
  }
}

async function main() {
  console.log('Scheduler started - checking every minute (NPT timezone)');

  publishScheduledArticles();
  generateAISummaries();

  setInterval(async () => {
    console.log(`[${formatTime(getCurrentNepaliTime())}] Running scheduled interval...`);
    try {
      await publishScheduledArticles();
    } catch (error) {
      console.error('Scheduler publish error:', error);
    }
  }, 60000);

  setInterval(async () => {
    try {
      await generateAISummaries();
    } catch (error) {
      console.error('Scheduler AI summary error:', error);
    }
  }, 3600000); // Run every 1 hour
}

main()
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });