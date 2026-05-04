const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAll() {
  const models = [
    'user', 'category', 'tag', 'article', 'articleTag', 'media', 'comment', 
    'bookmark', 'auditLog', 'notification', 'siteSetting', 'video', 
    'advertisement', 'poll', 'pollOption', 'pollVote', 'horoscope', 
    'audioNews', 'pageView', 'teamMember', 'author', 'photoGallery', 
    'photoGalleryPhoto'
  ];
  
  for (const model of models) {
    try {
      const count = await prisma[model].count();
      console.log(`${model}: ${count}`);
    } catch (e) {
      console.log(`${model}: ERROR - ${e.message}`);
    }
  }
  await prisma.$disconnect();
}

checkAll();