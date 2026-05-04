const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  console.log('authors:', await prisma.author.count());
  console.log('comments:', await prisma.comment.count());
  console.log('bookmarks:', await prisma.bookmark.count());
  console.log('page_views:', await prisma.pageView.count());
  console.log('horoscopes:', await prisma.horoscope.count());
  console.log('videos:', await prisma.video.count());
  console.log('polls:', await prisma.poll.count());
  console.log('advertisements:', await prisma.advertisement.count());
  console.log('site_settings:', await prisma.siteSetting.count());
  console.log('team_members:', await prisma.teamMember.count());
  console.log('photo_galleries:', await prisma.photoGallery.count());
  await prisma.$disconnect();
}

check();