const API_BASE = "http://182.93.78.30:3000";

const CATEGORIES = {
  economy: "d514de62-e2ba-4beb-8617-bc89129dcf81",
  entertainment: "e45ddd7d-ddea-4876-ab19-c1be39689887",
  politics: "74e9dc3b-0487-4b55-810f-eaa5aeb80704",
  society: "085319be-ade1-4e1e-9d72-d153c7fafcb0",
  sports: "39920768-c1fd-4096-beed-ff0256cb3733",
  technology: "3c89573b-523e-4538-bae4-bb0b105ee16e",
  world: "3f18fd0a-5893-43c6-8cc6-c634a1396b56",
};

const TAGS = {
  breaking: "249ca31e-df82-4734-aa47-6852f6a0a308",
  budget: "5947ec59-0857-436d-b04c-cd56353c46fd",
  climate: "2cca3a7e-e551-48ba-b1ee-23437656e644",
  cricket: "a3a7b3dd-09c2-499a-912b-cb2648d832b7",
  education: "b3a4ec1c-c6fd-4466-9a47-fbea6e6e5cbd",
  fintech: "7114abeb-cef9-4aad-9d5c-d04bf80059d4",
  football: "42390302-0eed-4386-b567-53914159d567",
  government: "71a08aa0-324f-41f9-9aec-8f3843354423",
  health: "48407f98-53c5-4cc1-80e5-0b79b674a5ea",
  kathmandu: "5bcc6f21-c95f-43a5-b5b4-470136c3df74",
  music: "56aabaf6-5b1b-45dd-b37e-b170fc9f1a61",
  nepal: "8593b5e4-9780-49e3-bb78-b2f051cbe672",
  nepaliFilm: "d4ebcf2d-3098-4472-ac8f-a25f369f1d7d",
  startup: "5c3fba1e-79e0-430d-b3b6-ed6520ee4609",
  tourism: "e07666fc-7f5f-4b91-bbd8-b6293009dbe7",
};

const articles = [
  {
    titleEn: "Nepal Announces Two-Day Weekend to Combat Fuel Crisis",
    titleNe: "इन्धन संकट सामना गर्न नेपालले दुई दिने बिदा घोषणा गर्‍यो",
    excerptEn:
      "The government has shortened the workweek to five days as fuel shortages worsen due to the US-Israel conflict with Iran.",
    excerptNe:
      "इरान युद्धको प्रभावले इन्धन अभाव बढेपछि सरकारले कार्यालय र विद्यालयलाई शनिबार-आइतबार बिदा दिएको छ।",
    contentEn: `In an emergency cabinet meeting, Nepal has extended weekends to both Saturday and Sunday for all government offices and educational institutions. Previously, only Saturday was a holiday. Offices will now run from 9 AM to 5 PM, Monday to Friday. Spokesperson Sasmit Pokharel said the move is essential due to the "uncomfortable situation" caused by fuel supply disruptions. Nepal, fully dependent on India for petroleum, has seen aviation fuel prices nearly double and cooking gas sold in half-filled cylinders. The crisis threatens the tourism sector as airfares rise sharply. The government is also exploring legal ways to convert petrol and diesel vehicles to electric.`,
    contentNe: `मन्त्रिपरिषद्को आकस्मिक बैठकले सरकारी कार्यालय र शैक्षिक संस्थाका लागि शनिबार र आइतबार दुवै दिन बिदा दिने निर्णय गरेको छ। यसअघि शनिबार मात्र बिदा थियो। अब सोमबारदेखि शुक्रबारसम्म बिहान ९ देखि बेलुका ५ बजेसम्म कार्यालय खुल्नेछन्। प्रवक्ता सस्मित पोखरेलले इन्धन आपूर्तिमा सिर्जित असहज स्थितिका कारण यो कदम चालिएको बताए। भारतबाट पूर्ण रूपमा इन्धन आयात गर्ने नेपालमा इरान युद्धले हवाई इन्धनको मूल्य दोब्बर बढाएको छ। खाना पकाउने ग्यास आधा भर्ने प्रणाली अपनाइएको छ। पर्यटन क्षेत्र प्रभावित बनेको छ किनकि हवाई भाडा बढेको छ। सरकारले पेट्रोल-डिजेल गाडीलाई विद्युतीय बनाउने कानुनी उपाय खोज्दै छ।`,
    metaTitle: "Nepal Gets Two-Day Weekend Amid Fuel Crisis",
    metaDescription:
      "Nepal introduces Saturday-Sunday weekends for government offices and schools to conserve fuel amid Iran war fallout. Tourism and economy face new challenges.",
    categoryId: CATEGORIES.economy,
    tagIds: [TAGS.government, TAGS.nepal],
    isBreaking: true,
    isFeatured: false,
  },
  {
    titleEn: "PM Balendra Shah Holds First Collective Meeting with Ambassadors",
    titleNe:
      "प्रधानमन्त्री बालेनले काठमाडौँमा कूटनीतिज्ञहरूसँग सामूहिक बैठक गर्नुभयो",
    excerptEn:
      "Nepal's youngest Prime Minister shared the new government's priorities with diplomatic missions stationed in Kathmandu.",
    excerptNe:
      "नेपालका सबैभन्दा कान्छा प्रधानमन्त्री बालendra शाहले काठमाडौँस्थित कूटनीतिक नियोगहरूलाई सरकारको प्राथमिकता बारे जानकारी दिनुभयो।",
    contentEn: `On Wednesday, Prime Minister Balendra Shah (Balen) convened a landmark meeting with ambassadors and heads of diplomatic missions at Singha Durbar. He briefed them on Nepal's current political stability, government priorities, and upcoming policy directions. The meeting, also attended by Foreign Minister Shishir Khanal, aimed to strengthen coordination and inform missions about the new government's plans for shared prosperity. Shah emphasised Nepal's commitment to balanced foreign policy and openness for investment from friendly nations. The Ministry of Foreign Affairs described it as a new diplomatic approach to build stronger international ties.`,
    contentNe: `बुधबार प्रधानमन्त्री बालendra शाह (बालेन) ले सिंहदरबारमा विदेशी राजदूत तथा कूटनीतिक प्रमुखहरूसँग ऐतिहासिक सामूहिक बैठक गर्नुभयो। उहाँले नेपालको वर्तमान राजनीतिक स्थिरता, सरकारका प्राथमिकता र आगामी नीतिगत दिशा बारे ब्रिफिङ गर्नुभयो। परराष्ट्रमन्त्री शिशिर खनाल पनि उपस्थित रहेको बैठकले समन्वय मजबुत बनाउने र नयाँ सरकारको योजनाबारे जानकारी दिने उद्देश्य राखेको थियो। शाहले सन्तुलित विदेश नीति र मित्रराष्ट्रबाट लगानीका लागि नेपाल खुला रहेको बताउनुभयो। परराष्ट्र मन्त्रालयले यसलाई नयाँ कूटनीतिक दृष्टिकोण भनेको छ।`,
    metaTitle: "PM Balen Meets Diplomats in Kathmandu",
    metaDescription:
      "Prime Minister Balendra Shah briefs foreign ambassadors on Nepal's stability, investment opportunities and balanced foreign policy.",
    categoryId: CATEGORIES.politics,
    tagIds: [TAGS.government, TAGS.nepal],
    isBreaking: false,
    isFeatured: false,
  },
  {
    titleEn:
      "Arrest Warrant Issued Against Former PM Sher Bahadur Deuba and Wife",
    titleNe: "पूर्वप्रधानमन्त्री देउवा र पत्नीविरुद्ध पक्राउ पुर्जी जारी",
    excerptEn:
      "The couple faces investigation over illegal assets; they are currently abroad.",
    excerptNe:
      "अवैध सम्पत्ति आर्जन मुद्दामा काठमाडौँ जिल्ला अदालतले पूर्वप्रधानमन्त्री शेरबहादुर देउवा र डा. आरजु राणाविरुद्ध पक्राउ पुर्जी जारी गरेको छ।",
    contentEn: `The Kathmandu District Court has issued an arrest warrant against former Prime Minister Sher Bahadur Deuba and his wife, former Minister Dr Arzu Rana Deuba. The Department of Money Laundering Investigation sought the warrant in connection with alleged acquisition of illegal assets. The probe began after reports during the Gen Z movement of large sums of money found at their Budhanilkantha residence. Since the couple is abroad, they could not be arrested immediately. The Central Investigation Bureau (CIB) is now handling the case. This development comes amid ongoing political accountability efforts following last year's protests.`,
    contentNe: `काठमाडौँ जिल्ला अदालतले पूर्वप्रधानमन्त्री शेरबहादुर देउवा र उनकी पत्नी पूर्वमन्त्री डा. आरजु राणाविरुद्ध पक्राउ पुर्जी जारी गरेको छ। अवैध सम्पत्ति आर्जन सम्बन्धी अनुसन्धानमा मुद्रा अपराध अनुसन्धान विभागले पुर्जी मागेको हो। जेन जेड आन्दोलनका क्रममा बुढानिलकण्ठस्थित निवासमा ठूलो रकम फेला परेको रिपोर्टपछि अनुसन्धान सुरु भएको थियो। दम्पती हाल विदेशमा भएकाले तत्काल पक्राउ गर्न सकिएन। केन्द्रीय अनुसन्धान ब्यूरो (सीआईबी) ले अब मुद्दा अघि बढाउने छ। गत वर्षको आन्दोलनपछिको राजनीतिक जवाफदेहिता अभियानअन्तर्गत यो विकास भएको हो।`,
    metaTitle: "Arrest Warrant Issued Against Ex-PM Deuba",
    metaDescription:
      "Kathmandu District Court issues arrest warrant against former Prime Minister Sher Bahadur Deuba and wife Arzu Rana in money laundering case.",
    categoryId: CATEGORIES.politics,
    tagIds: [TAGS.government, TAGS.nepal],
    isBreaking: true,
    isFeatured: false,
  },
  {
    titleEn: "Youth Activists Protest Rising Petroleum Prices in Kathmandu",
    titleNe: "काठमाडौँमा युवाहरूले पेट्रोलियम मूल्यवृद्धिविरुद्ध प्रदर्शन गरे",
    excerptEn:
      "Demonstrators demand government action as fuel costs soar due to the Iran conflict.",
    excerptNe:
      "इरान द्वन्द्वका कारण इन्धन मूल्य बढेपछि युवा कार्यकर्ताहरूले काठमाडौँमा विरोध प्रदर्शन गरेका छन्।",
    contentEn: `On Saturday, youth activists staged a protest in Kathmandu against the recent sharp increase in petroleum prices. Organised amid the ongoing fuel crisis caused by the Iran war, the protest highlighted the burden on common citizens. Protesters burned effigies and demanded immediate relief measures. With aviation fuel prices nearly doubled and daily commodities affected, the government's two-day weekend decision has not fully eased public anger. Police maintained order as the demonstration remained peaceful. Similar protests are expected across the country in coming days.`,
    contentNe: `शनिबार काठमाडौँमा युवा कार्यकर्ताहरूले हालैको पेट्रोलियम मूल्यवृद्धिविरुद्ध प्रदर्शन गरे। इरान युद्धबाट उत्पन्न इन्धन संकटका कारण आयोजित यो प्रदर्शनले आम नागरिकमाथि परेको बोझ उजागर गरेको छ। प्रदर्शनकारीहरूले पुत्ला जलाएर तत्काल राहत मागे। हवाई इन्धनको मूल्य दोब्बर बढेपछि दैनिक उपभोग्य वस्तु प्रभावित भएका छन्। सरकारको दुई दिने बिदा निर्णयले पनि सार्वजनिक रोष शान्त पार्न सकेको छैन। प्रहरीले शान्तिपूर्ण रूपमा व्यवस्थापन गरेको छ। आगामी दिनमा देशभर यस्ता प्रदर्शन हुन सक्ने छन्।`,
    metaTitle: "Youth Protest Petroleum Price Hike in Nepal",
    metaDescription:
      "Youth activists stage protests in Kathmandu against sharp rise in fuel prices triggered by global crisis.",
    categoryId: CATEGORIES.society,
    tagIds: [TAGS.nepal, TAGS.kathmandu],
    isBreaking: false,
    isFeatured: false,
  },
  {
    titleEn: "Nepal Celebrates 10th National Health Insurance Day",
    titleNe: "नेपालमा १०औँ राष्ट्रिय स्वास्थ्य बीमा दिवस मनाइयो",
    excerptEn:
      "Health Minister inspects facilities and urges citizens to enrol in the scheme.",
    excerptNe:
      "स्वास्थ्य मन्त्रीले सुन्सरी जिल्ला अस्पतालको निरीक्षण गर्दै नागरिकलाई बीमा योजनामा सहभागी हुन आह्वान गर्नुभएको छ।",
    contentEn: `Today marks the 10th National Health Insurance Day in Nepal. The government organised awareness programmes across the country to encourage more citizens to join the scheme. Health Minister inspected the District Hospital in Sunsari and highlighted the need for improved service delivery. Officials reported that 13,504 households were affected by disasters last year, underscoring the importance of health insurance. Stakeholders called for expanding coverage and reducing claim settlement delays to make the scheme more effective for all Nepalis.`,
    contentNe: `आज नेपालमा १०औँ राष्ट्रिय स्वास्थ्य बीमा दिवस मनाइएको छ। सरकारले देशभर जागरण कार्यक्रम आयोजना गरी थप नागरिकलाई योजना मा जोड्न आग्रह गरेको छ। स्वास्थ्य मन्त्रीले सुन्सरी जिल्ला अस्पतालको निरीक्षण गर्नुभयो र सेवा प्रवाह सुधार्नुपर्नेमा जोड दिनुभयो। अधिकारीहरूले गत वर्ष १३,५०४ घरपरिवार विपत्तिबाट प्रभावित भएको बताएका छन् जसले स्वास्थ्य बीमाको महत्व झल्काउँछ। सरोकारवालाहरूले कभरेज विस्तार र दाबी भुक्तानी छिटो बनाउन माग गरेका छन्।`,
    metaTitle: "Nepal Observes 10th Health Insurance Day",
    metaDescription:
      "Government and health stakeholders mark 10th National Health Insurance Day with calls for wider coverage and better services.",
    categoryId: CATEGORIES.society,
    tagIds: [TAGS.health, TAGS.nepal],
    isBreaking: false,
    isFeatured: false,
  },
  {
    titleEn: "Rain and Thunderstorms Forecast Across Nepal",
    titleNe: "आज देशभर वर्षा हुने सम्भावना",
    excerptEn:
      "Western parts may receive heavy rainfall while the rest of the country sees light to moderate showers.",
    excerptNe:
      "पश्चिमी क्षेत्रमा भारी वर्षा र बाँकी भागमा हल्कादेखि मध्यम वर्षाको पूर्वानुमान गरिएको छ।",
    contentEn: `The Department of Hydrology and Meteorology has predicted rain across Nepal today, with heavier falls expected in western regions. Meteorologists have warned of possible landslides and flooding in hilly and mountainous areas. Citizens in Rautahat and other Terai districts are also advised to remain alert as monsoon-like conditions may worsen. This weather pattern comes amid concerns over the 50-year-old Indian dam that could increase flood risks. Officials urge people to stay updated through official channels.`,
    contentNe: `जल तथा मौसम विज्ञान विभागले आज देशभर वर्षा हुने र पश्चिमी क्षेत्रमा भारी वर्षा हुने पूर्वानुमान गरेको छ। हिमाली तथा पहाडी क्षेत्रमा पहिरो र बाढीको जोखिम रहेकोले सतर्कता अपनाउन आग्रह गरिएको छ। रौतहट लगायत तराईका जिल्लामा पनि सतर्कता अपनाउन भनिएको छ किनकि ५० वर्ष पुरानो भारतीय बाँधले बाढी जोखिम बढाउन सक्छ। नागरिकहरूलाई आधिकारिक स्रोतबाट जानकारी लिन आग्रह गरिएको छ।`,
    metaTitle: "Rain Likely Across Nepal Today",
    metaDescription:
      "Meteorological Department forecasts rain and heavy showers in western regions; caution issued for landslides and floods.",
    categoryId: CATEGORIES.world,
    tagIds: [TAGS.climate, TAGS.nepal],
    isBreaking: false,
    isFeatured: false,
  },
  {
    titleEn: "Fuel Crisis Deals Fresh Blow to Nepal's Tourism Sector",
    titleNe: "इन्धन संकटले नेपालको पर्यटन क्षेत्रलाई ठूलो झट्का",
    excerptEn:
      "Airlines have increased domestic and international fares following sharp hike in aviation fuel prices.",
    excerptNe:
      "हवाई इन्धन मूल्य बढेपछि एयरलाइन्सले घरेलु तथा अन्तर्राष्ट्रिय भाडा बढाएका छन्।",
    contentEn: `The ongoing fuel crisis triggered by the Iran war has severely impacted Nepal's tourism industry. Airlines operating from Tribhuvan International Airport have raised fares after aviation fuel prices nearly doubled last week. Hoteliers and tour operators in Pokhara, Chitwan and Kathmandu report declining bookings. The government's two-day weekend measure aims to conserve fuel but tourism stakeholders fear long-term damage to the sector that contributes significantly to foreign exchange earnings. Officials are exploring emergency relief packages.`,
    contentNe: `इरान युद्धबाट उत्पन्न इन्धन संकटले नेपालको पर्यटन उद्योगलाई गम्भीर असर पारेको छ। त्रिभुवन अन्तर्राष्ट्रिय विमानस्थलबाट उडान गर्ने एयरलाइन्सले गत साता हवाई इन्धनको मूल्य दोब्बर बढेपछि भाडा बढाएका छन्। पोखरा, चितवन र काठमाडौँका होटल तथा टुर अपरेटरहरूले बुकिङ घटेको बताएका छन्। सरकारको दुई दिने बिदाले इन्धन बचत गर्ने लक्ष्य राखे पनि पर्यटन व्यवसायीहरूले विदेशी मुद्रा आर्जन गर्ने क्षेत्रमा दीर्घकालीन क्षति हुने चिन्ता व्यक्त गरेका छन्। अधिकारीहरूले आपत्कालीन राहत प्याकेजको तयारी गरिरहेका छन्।`,
    metaTitle: "Fuel Crisis Hits Nepal Tourism Hard",
    metaDescription:
      "Rising aviation fuel prices force airlines to hike fares, threatening Nepal's tourism-dependent economy.",
    categoryId: CATEGORIES.economy,
    tagIds: [TAGS.tourism, TAGS.nepal],
    isBreaking: false,
    isFeatured: false,
  },
  {
    titleEn: "Home Minister Speaks Out on Fewa Lake Encroachment Allegations",
    titleNe: "गृहमन्त्रीले फेवाताल जग्गा विवादमा स्पष्ट पार्नुभयो",
    excerptEn:
      "Sudhan Gurung demands refund of rent paid for leased land near the famous lake.",
    excerptNe:
      "गृहमन्त्री सुधन गुरुङले फेवाताल नजिकको जग्गा भाडामा लिँदा झुक्याइएको दाबी गर्दै भाडा फिर्ता माग्नुभएको छ।",
    contentEn: `Home Minister Sudhan Gurung has for the first time addressed controversy surrounding land he leased near Fewa Lake in Pokhara. He claimed he and others were misled during the agreement process and the deal was not transparent. Gurung has demanded that the rent he paid be returned, arguing the agreement itself was flawed. The statement comes amid public criticism and opposition parties' calls for investigation. The issue has drawn attention as Fewa Lake is a major tourist attraction facing encroachment threats.`,
    contentNe: `गृहमन्त्री सुधन गुरुङले पोखराको फेवाताल नजिक भाडामा लिएको जग्गा विवादमा पहिलो पटक बोलेका छन्। उहाँले सम्झौता प्रक्रियामा आफू र अरूलाई झुक्याइएको र सम्झौता पारदर्शी नभएको दाबी गर्नुभएको छ। गुरुङले तिरेको भाडा फिर्ता गर्न माग गर्नुभएको छ। यो बयान सार्वजनिक आलोचना र विपक्षी दलको अनुसन्धान मागपछि आएको हो। फेवाताल पर्यटकीय आकर्षण हो र जग्गा अतिक्रमणको खतरा बढ्दो छ।`,
    metaTitle: "Home Minister Clarifies Fewa Lake Land Row",
    metaDescription:
      "Home Minister Sudhan Gurung denies wrongdoing in Fewa Lake land lease, says he was misled by landowners.",
    categoryId: CATEGORIES.politics,
    tagIds: [TAGS.government, TAGS.tourism, TAGS.nepal],
    isBreaking: false,
    isFeatured: false,
  },
  {
    titleEn: "Nepal Stock Exchange Gains 45 Points",
    titleNe: "नेप्से सूचक ४५ अंकले बढ्यो",
    excerptEn:
      "Investors cheer the government's new policies and two-day weekend decision.",
    excerptNe:
      "नयाँ सरकारको नीति र दुई दिने बिदा निर्णयले लगानीकर्ताहरू उत्साहित भएका छन्।",
    contentEn: `On the fourth trading day of the week, the Nepal Stock Exchange (NEPSE) index rose by 45.12 points. Market analysts attribute the gain to positive sentiment following the new government's economic reforms and the recent two-day weekend announcement aimed at fuel conservation. Banking and hydropower sectors led the surge. Trading volume also increased as investors showed confidence in the stability promised by Prime Minister Balendra Shah's administration. The market closed at a four-week high.`,
    contentNe: `साताको चौथो कारोबार दिन नेपाल स्टक एक्सचेन्ज (नेप्से) सूचक ४५.१२ अंकले बढेको छ। बजार विश्लेषकहरूले नयाँ सरकारको आर्थिक सुधार र इन्धन बचतका लागि घोषित दुई दिने बिदा निर्णयलाई सकारात्मक मानेका छन्। बैंकिङ र जलविद्युत् क्षेत्रले अग्रता लिए। प्रधानमन्त्री बालendra शाहको प्रशासनले स्थिरता दिने आश्वासनपछि लगानीकर्ताहरूको विश्वास बढ्दा कारोबार रकम पनि बढेको छ। बजार चार साताको उच्च विन्दुमा बन्द भएको छ।`,
    metaTitle: "NEPSE Rises 45 Points on Policy Optimism",
    metaDescription:
      "Nepal Stock Exchange gains amid positive investor sentiment following new government's economic measures.",
    categoryId: CATEGORIES.economy,
    tagIds: [TAGS.budget, TAGS.nepal],
    isBreaking: false,
    isFeatured: false,
  },
  {
    titleEn:
      "Stranded French National in Pashupatinath Handed Over to Immigration",
    titleNe:
      "पशुपतिनाथ क्षेत्रमा अलपत्र फ्रान्सेली नागरिकलाई अध्यागमनमा बुझाइयो",
    excerptEn:
      "Police acted swiftly after locating the foreigner in the UNESCO World Heritage site.",
    excerptNe:
      "प्रहरीले युनेस्को विश्व सम्पदा स्थल पशुपतिनाथमा अलपत्र फ्रान्सेली नागरिक फेला पारेर अध्यागमन विभागमा बुझाएको छ।",
    contentEn: `Nepal Police have handed over a French national found stranded in the Pashupatinath area to the Department of Immigration. The man was located during routine patrolling near the famous temple complex. Officials confirmed he had no valid travel documents and appeared disoriented. He has been placed under immigration custody pending further verification of his identity and travel status. The incident highlights the need for better tourist safety measures at heritage sites.`,
    contentNe: `नेपाल प्रहरीले पशुपतिनाथ क्षेत्रमा अलपत्र अवस्थामा फेला परेका एक फ्रान्सेली नागरिकलाई अध्यागमन विभागमा बुझाएको छ। नियमित गस्तीका क्रममा मन्दिर परिसर नजिक भेटिएका उनीसँग वैध यात्रा कागजात थिएनन् र अलमलिएको अवस्थामा थिए। पहिचान र यात्रा विवरण जाँचका लागि अध्यागमन हिरासतमा राखिएको छ। यो घटनाले सम्पदा स्थलमा पर्यटक सुरक्षा व्यवस्था मजबुत बनाउनुपर्ने देखाएको छ।`,
    metaTitle: "French National Handed Over to Immigration",
    metaDescription:
      "Nepal Police found a stranded French national in Pashupatinath area and handed him to immigration authorities.",
    categoryId: CATEGORIES.society,
    tagIds: [TAGS.nepal, TAGS.kathmandu],
    isBreaking: false,
    isFeatured: false,
  },
];

async function login(): Promise<string> {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@example.com",
      password: "admin123",
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Login failed: ${error.message}`);
  }

  const data = await response.json();
  return data.data.accessToken;
}

async function createArticle(
  token: string,
  article: (typeof articles)[0],
): Promise<void> {
  const response = await fetch(`${API_BASE}/api/admin/articles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      titleNe: article.titleNe,
      titleEn: article.titleEn,
      excerptNe: article.excerptNe,
      excerptEn: article.excerptEn,
      contentNe: article.contentNe,
      contentEn: article.contentEn,
      metaTitle: article.metaTitle,
      metaDescription: article.metaDescription,
      categoryId: article.categoryId,
      tagIds: article.tagIds,
      isBreaking: article.isBreaking,
      isFeatured: article.isFeatured,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to create article: ${JSON.stringify(error)}`);
  }

  const data = await response.json();
  console.log(`   Created with ID: ${data.data.id}`);
}

async function main() {
  console.log("🚀 Starting article import via API...\n");

  const token = await login();
  console.log("✅ Login successful\n");

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    console.log(
      `📝 Article ${i + 1}/${articles.length}: "${article.titleEn.substring(0, 40)}..."`,
    );

    await createArticle(token, article);
    console.log(`✅ Success\n`);
  }

  console.log(`🎉 Successfully imported ${articles.length} articles via API!`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
