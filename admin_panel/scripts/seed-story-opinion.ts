import { PrismaClient, ArticleStatus, MediaType } from "@prisma/client";

const prisma = new PrismaClient();

const images = {
  story1: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80",
  story2: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80",
  story3: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
  story4: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80",
  story5: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=80",
  opinion1: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80",
  opinion2: "https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=1200&q=80",
  opinion3: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&q=80",
  opinion4: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80",
  opinion5: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&q=80",
};

const storyArticles = [
  {
    titleNe: "हिमालको छायाँमा एक मनोरम यात्रा",
    titleEn: "A Serene Journey in the Shadow of the Himalayas",
    excerptNe: "नेपालको हिमालयन क्षेत्रमा एक अविस्मरणीय यात्राको कथा, जहाँ प्रकृति र आत्मा एक हुन्छन्।",
    excerptEn: "An unforgettable journey through Nepal's Himalayan region where nature and soul become one.",
    contentNe: `<p>काठमाडौंबाट उत्तरतर्फ लाग्दा, हिमालको शिखरहरू आँखै अगाडि देखिन थाल्छन्। यो यात्रा कुनै साधारण यात्रा होइन — यो आत्माको शुद्धिकरण हो।</p>
    <p>हिउँले ढाकिएका शिखरहरू, नीला आकाश, र ताजा हावाले मनलाई शांत बनाउँछ। यहाँको प्रत्येक क्षण अमूल्य छ।</p>
    <p>स्थानीय मानिसहरूको माया र सत्कारले यात्रालाई अझ रोचक बनाउँछ। उनीहरूको जीवनशैली, संस्कृति, र परम्पराले हामीलाई आफ्नो पूर्वजहरूको याद दिलाउँछ।</p>
    <p>हिमालको यात्रा कहिल्यै समाप्त हुँदैन। यो त एक अनन्त अनुभव हो जो हाम्रो मनमा सधैं रहिरहन्छ।</p>`,
    contentEn: `<p>As we head north from Kathmandu, the Himalayan peaks begin to appear right before our eyes. This journey is not ordinary — it is a purification of the soul.</p>
    <p>Snow-capped peaks, blue skies, and fresh air calm the mind. Every moment here is precious.</p>
    <p>The love and hospitality of local people make the journey even more interesting. Their lifestyle, culture, and traditions remind us of our ancestors.</p>
    <p>The Himalayan journey never ends. It is an eternal experience that stays forever in our hearts.</p>`,
  },
  {
    titleNe: "गाउँको स्मृति: हराएको संसारको खोज",
    titleEn: "Village Memories: Searching for a Lost World",
    excerptNe: "पुरानो गाउँमा बिताएका बाल्यकालका दिनहरू, जब सादा जीवन थियो र खुशी सजिलै पाइन्थ्यो।",
    excerptEn: "Days spent in the old village when life was simple and happiness was easy to find.",
    contentNe: `<p>गाउँको बाटो, खेतका किनारहरू, र नदीको कलरव — सबै कुछ आफ्नै किसिमले मोहक थियो।</p>
    <p>बिहानको घाम, साँझको सिँढी, र रातिको ताराहरू — यी सबै अहिले स्मृतिमा मात्र सजीव छन्।</p>
    <p>गाउँका मानिसहरूको सरलता, उनीहरूको हँसो, र मायाले भरिएको व्यवहार — यो संसार अब हराएको छ।</p>
    <p>तर ती स्मृतिहरू हाम्रो मनमा सदैव जीवित रहनेछन्।</p>`,
    contentEn: `<p>The village paths, river banks, and the sounds of nature — everything had its own charm.</p>
    <p>Morning sun, evening breeze, and stars at night — all these are now alive only in memory.</p>
    <p>The simplicity of village people, their laughter, and loving behavior — this world is now lost.</p>
    <p>But these memories will always remain alive in our hearts.</p>`,
  },
  {
    titleNe: "एक चोटिको कथा: मेरो पहिलो रोजगार",
    titleEn: "A Rickshaw Tale: My First Job",
    excerptNe: "शहरमा आफ्नो पहिलो रोजगारको अनुभव, जहाँ कठोर परिश्रम र साना खुशीहरू मिलेर जीवन बन्यो।",
    excerptEn: "My first job experience in the city where hard work and small joys made life.",
    contentNe: `<p>रिक्सा चलाउनु भनेको सजिलो काम होइन। बिहानैदेखि साँझसम्म, घाम र पानीमा काम गर्नु पर्थ्यो।</p>
    <p>तर यसबाट मैले धेरै कुरा सिकें। मेहनतको मूल्य, धैर्यताको शक्ति, र सानो खुशीको महत्व।</p>
    <p>प्रत्येक यात्रुको कहानी सुन्नु, उनीहरूसँग कुरा गर्नु — यो अनुभव अविस्मरणीय थियो।</p>
    <p>आज म जहाँ छु, त्यो सबै त्यही रिक्साको दिनहरूको उपहार हो।</p>`,
    contentEn: `<p>Driving a rickshaw is not an easy job. From morning to evening, I had to work in sun and rain.</p>
    <p>But I learned a lot from this — the value of hard work, the power of patience, and the importance of small joys.</p>
    <p>Listening to each passenger's story, talking to them — this experience was unforgettable.</p>
    <p>Where I am today is a gift from those rickshaw days.</p>`,
  },
  {
    titleNe: "नदी किनारको बिहानी",
    titleEn: "Morning by the Riverbank",
    excerptNe: "एक सामान्य बिहानी जुन नदी किनारमा बिताइयो, तर जसले जीवनको सार्थकताबारे सिकायो।",
    excerptEn: "A ordinary morning spent by the river that taught about the meaning of life.",
    contentNe: `<p>नदीको किनारमा बिहानको सुरूवात अविश्वसनीय शांत थियो। पानीको आवाज, चराहरूको कलरव, र हल्का हावा — सबै मिलेर एउटा परिपूर्ण सुन्दरता बनाएका थिए।</p>
    <p>म एक्लै बसेर प्रकृतिसँग कुरा गर्न थालें। नदीले कहिल्यै नरोक्ने बहाबारे, चराहरूको स्वतंत्र जीवनबारे, र मानिसहरूको व्यस्त जीवनबारे।</p>
    <p>त्यो बिहानीले मलाई सिकायो कि जीवनमा धीरज राख्नु कति महत्वपूर्ण छ।</p>`,
    contentEn: `<p>The beginning by the riverbank was unbelievably peaceful. The sound of water, birds' chirping, and gentle breeze — all together created a perfect beauty.</p>
    <p>I sat alone and talked with nature. About the never-stopping river, the free lives of birds, and the busy lives of people.</p>
    <p>That morning taught me how important it is to have patience in life.</p>`,
  },
  {
    titleNe: "चाय पसलको कथा",
    titleEn: "The Tea Stall Story",
    excerptNe: "गाउँको चाय पसल जहाँ सबै कुराहरू हुन्थे — कुराकानी, हाँसो, र समाधान।",
    excerptEn: "The village tea stall where everything happened — conversations, laughter, and solutions.",
    contentNe: `<p>गाउँको बिचमा रहेको त्यो चाय पसल कुनै साधारण ठाउँ थिएन। यो गाउँको हृदय थियो।</p>
    <p>बिहानको चाय, साँझको गपशप, र रातिको किस्सा — सबै यहीं हुन्थ्यो।</p>
    <p>मानिसहरू यहाँ आफ्नो दुःख र खुशी बाँड्न आउँथे। समस्या समाधान पनि यहीं हुन्थ्यो।</p>
    <p>आज पनि त्यो चाय पसल त्यहाँ छ, र त्यसको महत्व उस्तै छ।</p>`,
    contentEn: `<p>The tea stall in the middle of the village was not an ordinary place. It was the heart of the village.</p>
    <p>Morning tea, evening gossip, and night stories — all happened here.</p>
    <p>People came here to share their sorrows and happiness. Problems were also solved here.</p>
    <p>Today that tea stall is still there, and its importance remains the same.</p>`,
  },
];

const opinionArticles = [
  {
    titleNe: "नेपालको शिक्षा प्रणाली: समस्या र समाधान",
    titleEn: "Nepal's Education System: Problems and Solutions",
    excerptNe: "नेपालको शिक्षा प्रणालीमा रहेका समस्याहरू र ती समाधानका उपायहरूबारे एक विचार।",
    excerptEn: "An analysis of the problems in Nepal's education system and possible solutions.",
    contentNe: `<p>नेपालको शिक्षा प्रणाली एक गम्भीर संकटमा छ। यसको मुख्य समस्या व्यावहारिक शिक्षाको अभाव हो।</p>
    <p>हाम्रो शिक्षा प्रणाली परीक्षामा केन्द्रित छ, ज्ञानमा होइन। विद्यार्थीहरू रटानमा व्यस्त छन्, सीप विकासमा होइन।</p>
    <p>शिक्षकहरूको प्रशिक्षण, पाठ्यक्रमको आधुनिकीकरण, र प्रविधिको प्रयोग आवश्यक छ।</p>
    <p>सरकारले शिक्षामा लगानी बढाउनुपर्छ र निजी क्षेत्रसँग साझेदारी गर्नुपर्छ।</p>`,
    contentEn: `<p>Nepal's education system is in a serious crisis. Its main problem is the lack of practical education.</p>
    <p>Our education system is exam-centered, not knowledge-centered. Students are busy cramming, not in skill development.</p>
    <p>Teacher training, curriculum modernization, and use of technology are necessary.</p>
    <p>The government should increase investment in education and partner with the private sector.</p>`,
  },
  {
    titleNe: "डिजिटल नेपाल: अवसर र चुनौतीहरू",
    titleEn: "Digital Nepal: Opportunities and Challenges",
    excerptNe: "डिजिटल प्रविधिले नेपालमा ल्याएका अवसरहरू र त्यसका चुनौतीहरूबारे विचार।",
    excerptEn: "Thoughts on opportunities and challenges brought by digital technology in Nepal.",
    contentNe: `<p>डिजिटल प्रविधि नेपालमा छिट्टै फैलिरहेको छ। इन्टरनेट पहुँच, स्मार्टफोन, र डिजिटल भुक्तानी — सबै बढिरहेका छन्।</p>
    <p>यसले धेरै अवसरहरू ल्याएका छन् — ई-कमर्स, डिजिटल मार्केटिङ, र स्वास्थ्य सेवामा पहुँच।</p>
    <p>तर चुनौतीहरू पनि छन् — डिजिटल विभाजन, साइबर सुरक्षा, र डिजिटल साक्षरताको अभाव।</p>
    <p>नेपालले डिजिटल शिक्षा र सुरक्षामा लगानी गर्नुपर्छ।</p>`,
    contentEn: `<p>Digital technology is spreading quickly in Nepal. Internet access, smartphones, and digital payments are all increasing.</p>
    <p>It has brought many opportunities — e-commerce, digital marketing, and healthcare access.</p>
    <p>But there are also challenges — digital divide, cybersecurity, and lack of digital literacy.</p>
    <p>Nepal must invest in digital education and security.</p>`,
  },
  {
    titleNe: "युवा र राजनीति: नेपालको भविष्य",
    titleEn: "Youth and Politics: The Future of Nepal",
    excerptNe: "नेपालका युवाहरूको राजनीतिमा भूमिका र देशको भविष्यमा तिनीहरूको प्रभावबारे विचार।",
    excerptEn: "Thoughts on the role of Nepali youth in politics and their impact on the country's future.",
    contentNe: `<p>नेपालको जनसंख्याको ठूलो हिस्सा युवा छन्। तर राजनीतिमा उनीहरूको प्रतिनिधित्व न्यून छ।</p>
    <p>युवाहरू नयाँ विचार, ऊर्जा, र इच्छाशक्ति ल्याउन सक्छन्। उनीहरूले देशको दिशा बदल्न सक्छन्।</p>
    <p>तर यसका लागि राजनीतिक चेतना, नेतृत्व क्षमता, र सक्रिय सहभागिता आवश्यक छ।</p>
    <p>युवाहरूलाई राजनीतिमा संलग्न गराउन शिक्षा र अवसरहरू चाहिन्छन्।</p>`,
    contentEn: `<p>A large portion of Nepal's population is youth. But their representation in politics is low.</p>
    <p>Youth can bring new ideas, energy, and willpower. They can change the direction of the country.</p>
    <p>But for this, political awareness, leadership skills, and active participation are necessary.</p>
    <p>Education and opportunities are needed to involve youth in politics.</p>`,
  },
  {
    titleNe: "पर्यटन र संस्कृति: नेपालको पहिचान",
    titleEn: "Tourism and Culture: Nepal's Identity",
    excerptNe: "पर्यटन र सांस्कृतिक संरक्षणको महत्व र नेपालको पहिचानमा तिनीहरूको भूमिकाबारे विचार।",
    excerptEn: "Thoughts on the importance of tourism and cultural preservation in Nepal's identity.",
    contentNe: `<p>नेपाल आफ्नो समृद्ध सांस्कृतिक विरासतका लागि प्रसिद्ध छ। मन्दिर, स्तूप, र पुरातात्विक स्थलहरू यहाँ छन्।</p>
    <p>पर्यटनले देशको आर्थिक विकासमा महत्वपूर्ण योगदान दिँदै आएको छ। तर यसले संस्कृति संरक्षणमा पनि ध्यान दिनुपर्छ।</p>
    <p>धार्मिक स्थलहरूको दोहन, परम्परागत कलाको ह्रास, र भाषाको विस्तार — यी चुनौतिहरू छन्।</p>
    <p>पर्यटन र संस्कृति दुवैको संतुलन गर्नु नेपालको लागि आवश्यक छ।</p>`,
    contentEn: `<p>Nepal is famous for its rich cultural heritage. Temples, stupas, and archaeological sites are here.</p>
    <p>Tourism has contributed significantly to the country's economic development. But it must also focus on cultural preservation.</p>
    <p>Exploitation of religious sites, decline of traditional arts, and language erosion — these are challenges.</p>
    <p>Balancing tourism and culture is essential for Nepal.</p>`,
  },
  {
    titleNe: "जलवायु परिवर्तन: नेपालको जोखिम",
    titleEn: "Climate Change: Nepal's Risk",
    excerptNe: "जलवायु परिवर्तनको प्रभाव र नेपालमा यसका जोखिमहरूबारे एक विचार।",
    excerptEn: "Thoughts on climate change impact and its risks in Nepal.",
    contentNe: `<p>जलवायु परिवर्तन विश्वव्यापी समस्या हो, र नepल यसबाट अत्याधिक प्रभावित छ।</p>
    <p>हिमालको हिउँ पग्लिनु, अनियमित वर्षा, र बाढी — यी सबै जलवायु परिवर्तनका परिणाम हुन्।</p>
    <p>किसानहरू, वन्यजन्तु, र स्थानीय समुदायहरू सबै प्रभावित छन्।</p>
    <p>नेपालले अनुकूलन र शमन दुवै उपायहरू अपनाउनु पर्छ।</p>`,
    contentEn: `<p>Climate change is a global problem, and Nepal is highly affected by it.</p>
    <p>Melting Himalayan snow, irregular rainfall, and floods — all are results of climate change.</p>
    <p>Farmers, wildlife, and local communities are all affected.</p>
    <p>Nepal must adopt both adaptation and mitigation measures.</p>`,
  },
];

async function main() {
  console.log("🌱 Seeding Story and Opinion articles...\n");

  const admin = await prisma.user.findFirst({
    where: { role: "SUPERADMIN" },
  });

  if (!admin) {
    console.error("❌ No admin user found. Please run seed first.");
    process.exit(1);
  }

  console.log(`✅ Using admin user: ${admin.email}\n`);

  // Get categories
  const storyCategory = await prisma.category.findUnique({
    where: { slug: "story" },
  });

  const opinionCategory = await prisma.category.findUnique({
    where: { slug: "opinion" },
  });

  if (!storyCategory || !opinionCategory) {
    console.error("❌ Categories not found. Run main seed first.");
    process.exit(1);
  }

  console.log(`📂 Story Category ID: ${storyCategory.id}`);
  console.log(`📂 Opinion Category ID: ${opinionCategory.id}\n`);

  // Helper to create media
  async function getOrCreateMedia(url: string, filename: string, altText: string) {
    let media = await prisma.media.findFirst({ where: { filename } });
    if (!media) {
      media = await prisma.media.create({
        data: {
          filename,
          url,
          type: MediaType.IMAGE,
          altText,
          size: 350000,
          uploadedBy: admin.id,
        },
      });
    }
    return media;
  }

  // Create Story articles
  console.log("📝 Creating Story articles...");
  const storyImages = [images.story1, images.story2, images.story3, images.story4, images.story5];

  for (let i = 0; i < storyArticles.length; i++) {
    const article = storyArticles[i];
    const slug = article.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const media = await getOrCreateMedia(storyImages[i], `story-${i + 1}.jpg`, article.titleEn);

    await prisma.article.upsert({
      where: { slug },
      update: {
        titleNe: article.titleNe,
        titleEn: article.titleEn,
        excerptNe: article.excerptNe,
        excerptEn: article.excerptEn,
        contentNe: article.contentNe,
        contentEn: article.contentEn,
        status: ArticleStatus.PUBLISHED,
        categoryId: storyCategory.id,
        authorId: admin.id,
        featuredImageId: media.id,
        publishedAt: new Date(),
      },
      create: {
        titleNe: article.titleNe,
        titleEn: article.titleEn,
        excerptNe: article.excerptNe,
        excerptEn: article.excerptEn,
        contentNe: article.contentNe,
        contentEn: article.contentEn,
        slug,
        status: ArticleStatus.PUBLISHED,
        categoryId: storyCategory.id,
        authorId: admin.id,
        featuredImageId: media.id,
        publishedAt: new Date(),
      },
    });

    console.log(`  ✅ Story article ${i + 1}: ${article.titleEn.substring(0, 40)}...`);
  }

  // Create Opinion articles
  console.log("\n📝 Creating Opinion articles...");
  const opinionImages = [images.opinion1, images.opinion2, images.opinion3, images.opinion4, images.opinion5];

  for (let i = 0; i < opinionArticles.length; i++) {
    const article = opinionArticles[i];
    const slug = article.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const media = await getOrCreateMedia(opinionImages[i], `opinion-${i + 1}.jpg`, article.titleEn);

    await prisma.article.upsert({
      where: { slug },
      update: {
        titleNe: article.titleNe,
        titleEn: article.titleEn,
        excerptNe: article.excerptNe,
        excerptEn: article.excerptEn,
        contentNe: article.contentNe,
        contentEn: article.contentEn,
        status: ArticleStatus.PUBLISHED,
        categoryId: opinionCategory.id,
        authorId: admin.id,
        featuredImageId: media.id,
        publishedAt: new Date(),
      },
      create: {
        titleNe: article.titleNe,
        titleEn: article.titleEn,
        excerptNe: article.excerptNe,
        excerptEn: article.excerptEn,
        contentNe: article.contentNe,
        contentEn: article.contentEn,
        slug,
        status: ArticleStatus.PUBLISHED,
        categoryId: opinionCategory.id,
        authorId: admin.id,
        featuredImageId: media.id,
        publishedAt: new Date(),
      },
    });

    console.log(`  ✅ Opinion article ${i + 1}: ${article.titleEn.substring(0, 40)}...`);
  }

  console.log("\n🎉 Successfully seeded 5 Story and 5 Opinion articles!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
