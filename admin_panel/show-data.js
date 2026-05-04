const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function showSample() {
  console.log('\n=== USERS ===');
  const users = await prisma.user.findMany({ select: { email: true, role: true, name: true } });
  users.forEach(u => console.log(`- ${u.email} (${u.role}) ${u.name || ''}`));
  
  console.log('\n=== CATEGORIES (first 10) ===');
  const cats = await prisma.category.findMany({ take: 10, select: { slug: true, name: true } });
  cats.forEach(c => console.log(`- ${c.slug}: ${c.name}`));
  
  console.log('\n=== ARTICLES (first 5) ===');
  const arts = await prisma.article.findMany({ take: 5, select: { slug: true, title: true } });
  arts.forEach(a => console.log(`- ${a.slug}: ${a.title.substring(0, 50)}...`));
  
  console.log('\n=== SITE SETTINGS ===');
  const settings = await prisma.siteSetting.findMany({ select: { key: true, value: true } });
  settings.forEach(s => console.log(`- ${s.key}: ${s.value}`));
  
  await prisma.$disconnect();
}

showSample();