const { PrismaClient } = require('@prisma/client');
const { Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

async function hardReset() {
  console.log('Disconnecting clients...');
  await prisma.$disconnect();
  
  const prisma2 = new PrismaClient();
  
  console.log('Dropping all tables...');
  
  // Disable foreign keys
  await prisma2.$executeRaw`SET FOREIGN_KEY_CHECKS = 0`.catch(() => {});
  
  // Get all table names and truncate
  const tables = [
    'photo_gallery_photos', 'photo_galleries', 'authors', 'team_members', 
    'page_views', 'audio_news', 'horoscopes', 'poll_votes', 
    'poll_options', 'polls', 'advertisements', 'videos', 
    'site_settings', 'notifications', 'audit_logs', 'bookmarks', 
    'comments', 'media', 'article_tags', 'articles', 'tags', 
    'categories', 'users'
  ];
  
  for (const table of tables) {
    try {
      await prisma2.$executeRawUnsafe(`TRUNCATE TABLE "${table}" CASCADE`);
      console.log(`Truncated ${table}`);
    } catch (e) {
      console.log(`Skip ${table}: ${e.message}`);
    }
  }
  
  await prisma2.$executeRaw`SET FOREIGN_KEY_CHECKS = 1`.catch(() => {});
  
  console.log('Done!');
  await prisma2.$disconnect();
}

hardReset().catch(console.error);