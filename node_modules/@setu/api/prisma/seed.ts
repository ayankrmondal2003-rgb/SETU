import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SETU database with Bihar tourism content and demo accounts...');

  // 1. Password Hashing
  const passwordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const vendorPasswordHash = await bcrypt.hash('vendor123', 10);
  const touristPasswordHash = await bcrypt.hash('tourist123', 10);

  // 2. Clear Existing Data
  await prisma.favorite.deleteMany();
  await prisma.order.deleteMany();
  await prisma.offering.deleteMany();
  await prisma.cuisineItem.deleteMany();
  await prisma.event.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.circuit.deleteMany();
  await prisma.district.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.user.deleteMany();

  // 3. Create Users
  const adminUserData = {
    name: 'Setu Administrator',
    email: 'admin@setu.local',
    passwordHash: adminPasswordHash,
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    phone: '+919876543210',
    emailVerified: true
  };
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@setu.local' },
    update: adminUserData,
    create: adminUserData
  });

  const vendorUserData = {
    name: 'Vikramaditya Heritage Tours',
    email: 'vendor@setu.local',
    passwordHash: vendorPasswordHash,
    role: 'VENDOR',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    phone: '+919123456789',
    emailVerified: true
  };
  const vendorUser = await prisma.user.upsert({
    where: { email: 'vendor@setu.local' },
    update: vendorUserData,
    create: vendorUserData
  });

  const touristUserData = {
    name: 'Ananya Sharma',
    email: 'tourist@setu.local',
    passwordHash: touristPasswordHash,
    role: 'TOURIST',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    phone: '+919988776655',
    emailVerified: true
  };
  const touristUser = await prisma.user.upsert({
    where: { email: 'tourist@setu.local' },
    update: touristUserData,
    create: touristUserData
  });

  // 4. Create Demo Vendor Profile
  const demoVendor = await prisma.vendor.create({
    data: {
      userId: vendorUser.id,
      businessName: 'Setu Heritage & Cultural Experiences',
      description: 'Premier curator of authentic Bihar spiritual heritage walks, craft workshops, and private circuit tours.',
      businessType: 'Guided Tours & Experiences',
      phone: '+919123456789',
      email: 'contact@setuheritage.in',
      address: 'Main Temple Road, Bodh Gaya',
      city: 'Bodh Gaya',
      district: 'Gaya',
      latitude: 24.6961,
      longitude: 84.9914,
      logo: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=300&q=80',
      coverImage: '/images/nalanda (3).jpeg',
      status: 'APPROVED'
    }
  });

  // 5. Create Circuits
  const buddhistCircuit = await prisma.circuit.create({
    data: {
      name: 'Buddhist Circuit',
      slug: 'buddhist-circuit',
      description: 'Trace the sacred steps of Lord Buddha from enlightenment under the Bodhi Tree in Bodh Gaya to Mahaparinirvana.',
      heroImage: '/images/Buddhist Circuit(2).jpg',
      gallery: JSON.stringify([
        '/images/Buddhist Circuit(2).jpg',
        '/images/Buddhist Circuit(3).jpg'
      ]),
      overview: 'The Buddhist Circuit in Bihar is one of the world\'s most profound pilgrimage trails. Spanning Bodh Gaya, Nalanda, Rajgir, and Vaishali, this circuit highlights ancient stupas, monastic universities, and peaceful meditation centers where Siddhartha Gautama attained Enlightenment and spent decades teaching Dhamma.',
      locations: JSON.stringify(['Bodh Gaya', 'Nalanda', 'Rajgir', 'Vaishali', 'Kesariya'])
    }
  });

  const ecoCircuit = await prisma.circuit.create({
    data: {
      name: 'Eco & Wilderness Circuit',
      slug: 'eco-circuit',
      description: 'Discover pristine tiger reserves, lush Himalayan foothills, serene lakes, and natural hot springs across Bihar.',
      heroImage: '/images/Eco & Wilderness Circuit(2).jpg',
      gallery: JSON.stringify([
        '/images/Eco & Wilderness Circuit(2).jpg',
        '/images/Eco & Wilderness Circuit(3).jpg'
      ]),
      overview: 'Experience Bihar’s untamed biodiversity from the dense sal forests of Valmiki Tiger Reserve in Champaran to the tranquil waters of Kanwar Lake bird sanctuary and the picturesque waterfalls of Rohtas district.',
      locations: JSON.stringify(['Valmiki Nagar', 'Kanwar Lake', 'Karkat Waterfall', 'Bhimbandh Wildlife Sanctuary'])
    }
  });

  const ramayanCircuit = await prisma.circuit.create({
    data: {
      name: 'Ramayan Circuit',
      slug: 'ramayan-circuit',
      description: 'Explore ancient sites associated with Goddess Sita, Sage Valmiki, and the legendary epic of Ramayana.',
      heroImage: '/images/Ramayan Circuit(2).jpg',
      gallery: JSON.stringify([
        '/images/Ramayan Circuit(2).jpg',
        '/images/Ramayan Circuit(3).jpg'
      ]),
      overview: 'Journey through Janakpur borderlands, Sitamarhi (the birth place of Ma Sita), Ahilya Asthan in Darbhanga, and Buxar where Maharshi Vishwamitra guided Lord Rama.',
      locations: JSON.stringify(['Sitamarhi', 'Darbhanga', 'Buxar', 'Valmiki Nagar'])
    }
  });

  const sikhCircuit = await prisma.circuit.create({
    data: {
      name: 'Sikh Heritage Circuit',
      slug: 'sikh-circuit',
      description: 'Pay homage at Takht Sri Harmandir Sahib, the birthplace of the tenth Sikh Guru, Guru Gobind Singh Ji.',
      heroImage: '/images/Sikh Heritage Circuit(2).jpg',
      gallery: JSON.stringify([
        '/images/Sikh Heritage Circuit(2).jpg',
        '/images/Sikh Heritage Circuit(3).jpg',
        '/images/Sikh Heritage Circuit(4).jpg'
      ]),
      overview: 'The Sikh Circuit centers on Patna Sahib, one of the five Takhts of Sikhism, alongside sacred Gurdwaras visited by Guru Nanak Dev Ji and Guru Tegh Bahadur Ji across Bihar.',
      locations: JSON.stringify(['Takht Sri Patna Sahib', 'Gurdwara Guru ka Bagh', 'Gurdwara Handi Sahib', 'Rajgir Sheetal Kund'])
    }
  });

  // 6. Create Districts
  const gayaDistrict = await prisma.district.create({
    data: {
      name: 'Gaya',
      slug: 'gaya',
      region: 'South Bihar',
      description: 'Spiritual epicenter famous worldwide for Bodh Gaya and sacred Pind Daan rituals along the Phalgu River.',
      heroImage: '/images/gaya district (2).jpeg',
      gallery: JSON.stringify([
        '/images/gaya district (1).jpeg',
        '/images/gaya district (2).jpeg',
        '/images/gaya district (3).jpeg',
        '/images/gaya district (4).jpeg',
        '/images/gaya district (5).jpeg'
      ]),
      latitude: 24.7914,
      longitude: 85.0002
    }
  });

  const nalandaDistrict = await prisma.district.create({
    data: {
      name: 'Nalanda',
      slug: 'nalanda',
      region: 'Central Bihar',
      description: 'Cradle of ancient higher learning housing UNESCO World Heritage Nalanda University ruins and scenic Rajgir hills.',
      heroImage: '/images/nalanda (2).jpeg',
      gallery: JSON.stringify([
        '/images/nalanda (1).jpeg',
        '/images/nalanda (2).jpeg',
        '/images/nalanda (3).jpeg'
      ]),
      latitude: 25.1357,
      longitude: 85.4439
    }
  });

  const patnaDistrict = await prisma.district.create({
    data: {
      name: 'Patna',
      slug: 'patna',
      region: 'Capital Region',
      description: 'Historic Pataliputra on the banks of the sacred Ganges, blending ancient imperial history with vibrant capital life.',
      heroImage: '/images/patna (2).jpg',
      gallery: JSON.stringify([
        '/images/patna (1).jpg',
        '/images/patna (2).jpg',
        '/images/patna (3).jpg',
        '/images/patna (4).jpg'
      ]),
      latitude: 25.5941,
      longitude: 85.1376
    }
  });

  const vaishaliDistrict = await prisma.district.create({
    data: {
      name: 'Vaishali',
      slug: 'vaishali',
      region: 'North Bihar',
      description: 'World\'s oldest republic, birth place of Lord Mahavira, and site of Buddha\'s last sermon.',
      heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
        '/images/nalanda (1).jpeg',
        'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80'
      ]),
      latitude: 25.9923,
      longitude: 85.1264
    }
  });

  const madhubaniDistrict = await prisma.district.create({
    data: {
      name: 'Madhubani',
      slug: 'madhubani',
      region: 'Mithila Region',
      description: 'Heartland of Mithila culture renowned worldwide for exquisite Madhubani folk art and rich heritage.',
      heroImage: '/images/madhubani (2).jpg',
      gallery: JSON.stringify([
        '/images/madhubani (1).jpg',
        '/images/madhubani (2).jpg',
        '/images/madhubani (3).jpg'
      ]),
      latitude: 26.3533,
      longitude: 86.0719
    }
  });

  const rohtasDistrict = await prisma.district.create({
    data: {
      name: 'Rohtas',
      slug: 'rohtas',
      region: 'South West Bihar',
      description: 'Famous for majestic Sher Shah Suri Tomb in Sasaram and breathtaking Kaimur hill waterfalls.',
      heroImage: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1511497584788-8767611136f6?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80'
      ]),
      latitude: 24.9500,
      longitude: 84.0167
    }
  });

  const westChamparanDistrict = await prisma.district.create({
    data: {
      name: 'West Champaran',
      slug: 'west-champaran',
      region: 'North West Bihar',
      description: 'Home to Valmiki Tiger Reserve, dense forests, and Mahatma Gandhi’s historic Champaran Satyagraha.',
      heroImage: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1511497584788-8767611136f6?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'
      ]),
      latitude: 27.1500,
      longitude: 84.5000
    }
  });

  const bhagalpurDistrict = await prisma.district.create({
    data: {
      name: 'Bhagalpur',
      slug: 'bhagalpur',
      region: 'East Bihar',
      description: 'The Silk City of India, home to ancient Vikramshila University and Ganges river dolphin sanctuary.',
      heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'
      ]),
      latitude: 25.2425,
      longitude: 87.0124
    }
  });

  // 7. Create Destinations
  const mahabodhiDest = await prisma.destination.create({
    data: {
      name: 'Mahabodhi Temple Complex',
      slug: 'mahabodhi-temple',
      description: 'UNESCO World Heritage site marking the exact spot under the sacred Bodhi Tree where Lord Buddha attained Enlightenment.',
      districtId: gayaDistrict.id,
      circuitId: buddhistCircuit.id,
      category: 'Spiritual & World Heritage',
      heroImage: '/images/Mahabodhi Temple Complex(2).jpg',
      gallery: JSON.stringify([
        '/images/Mahabodhi Temple Complex(2).jpg',
        '/images/Mahabodhi Temple Complex(3).jpg',
        '/images/Mahabodhi Temple Complex(4).jpg'
      ]),
      latitude: 24.6961,
      longitude: 84.9914,
      overview: 'The Mahabodhi Temple Complex is one of the four holy sites related to the life of the Lord Buddha, and particularly to the attainment of Enlightenment. The first temple was built by Emperor Ashoka in the 3rd century B.C. The present temple dates from the 5th or 6th centuries.',
      travelInformation: JSON.stringify({
        bestTime: 'October to March',
        howToReach: 'Gaya International Airport (12 km) or Gaya Junction Railway Station (16 km). Pre-paid cabs and e-rickshaws available round the clock.',
        suggestedDuration: '1 to 2 Days',
        entryFee: 'Free Admission (Camera charge ₹100, Video Camera ₹500)',
        timings: '5:00 AM – 9:00 PM (Daily)',
        contentStatus: 'VERIFIED',
        didYouKnow: 'Emperor Ashoka’s daughter Sanghamitta took a cutting of the original Bodhi Tree to Sri Lanka in 288 BCE. When the original tree in Bodh Gaya was destroyed by later rulers, a sapling from Sri Lanka was replanted here!',
        funFacts: [
          'Vajrasana (Diamond Throne) marks the exact spot of Enlightenment.',
          'Designated a UNESCO World Heritage Site in 2002.',
          'Monasteries from Thailand, Japan, Tibet, Bhutan, and Sri Lanka surround the complex.'
        ]
      }),
      stays: JSON.stringify([
        { name: 'Hotel Maha Maya', rating: 4.8, price: '₹4,500/night' },
        { name: 'Root Institute Residency', rating: 4.9, price: '₹3,200/night' }
      ]),
      recommendations: JSON.stringify([
        'Attend evening chants at 6:00 PM near the Vajrasana.',
        'Visit nearby Thai Monastery and 80ft Great Buddha statue.',
        'Taste authentic Sujata Kheer from local village vendors.'
      ])
    }
  });

  const nalandaDest = await prisma.destination.create({
    data: {
      name: 'Nalanda Mahavihara Ruins',
      slug: 'nalanda-university-ruins',
      description: 'UNESCO World Heritage ruins of the ancient monastic university that enlightened scholars from across Asia from the 5th to 12th century.',
      districtId: nalandaDistrict.id,
      circuitId: buddhistCircuit.id,
      category: 'Archaeological Heritage',
      heroImage: '/images/nalanda (2).jpeg',
      gallery: JSON.stringify([
        '/images/nalanda (1).jpeg',
        '/images/nalanda (3).jpeg'
      ]),
      latitude: 25.1357,
      longitude: 85.4439,
      overview: 'Nalanda was a renowned Mahavihara (monastic university) in the ancient kingdom of Magadha. At its peak, it accommodated over 10,000 students and 2,000 teachers including famous scholars like Hiuen Tsang and Aryabhata.',
      travelInformation: JSON.stringify({
        bestTime: 'October to March',
        howToReach: '85 km from Patna Airport; connected by Rajgir-Nalanda highway & Bakhtiyarpur rail line.',
        suggestedDuration: '3 to 4 Hours',
        entryFee: '₹25 for Indians, ₹300 for Foreigners',
        timings: '9:00 AM – 5:00 PM (Closed on Fridays)',
        contentStatus: 'VERIFIED',
        didYouKnow: 'Nalanda’s legendary library, Dharma Gunj (Mountain of Truth), housed over 9 million manuscripts. When destroyed in 1193 CE, the library burned continuously for over three months!',
        funFacts: [
          'Accommodated 10,000 scholars and 2,000 revered teachers at its peak.',
          'Great minds like Hiuen Tsang, Aryabhata, and Nagarjuna studied and taught here.',
          'Features 11 monasteries and 6 brick temples arranged along a central avenue.'
        ]
      }),
      stays: JSON.stringify([
        { name: 'Indo Hokke Hotel Rajgir', rating: 4.7, price: '₹5,800/night' }
      ]),
      recommendations: JSON.stringify([
        'Explore the Nalanda Archaeological Museum opposite the gate.',
        'Walk through Stupa No. 3 for breathtaking panoramic photos.'
      ])
    }
  });

  const rajgirDest = await prisma.destination.create({
    data: {
      name: 'Rajgir Griddhakuta & Vishwa Shanti Stupa',
      slug: 'rajgir-vishwa-shanti-stupa',
      description: 'Perched atop Ratnagiri hill in Rajgir, reached by ropeway, overlooking the ancient Vulture\'s Peak where Buddha delivered key discourses.',
      districtId: nalandaDistrict.id,
      circuitId: buddhistCircuit.id,
      category: 'Hill Station & Pilgrimage',
      heroImage: '/images/Rajgir Griddhakuta & Vishwa Shanti Stupa (2).jpeg',
      gallery: JSON.stringify([
        '/images/Rajgir Griddhakuta & Vishwa Shanti Stupa (1).jpeg',
        '/images/Rajgir Griddhakuta & Vishwa Shanti Stupa (2).jpeg',
        '/images/Rajgir Griddhakuta & Vishwa Shanti Stupa(3).jpg',
        '/images/Rajgir Griddhakuta & Vishwa Shanti Stupa(4).jpg'
      ]),
      latitude: 25.0300,
      longitude: 85.4200,
      overview: 'Rajgir was the first capital of Magadha. The Vishwa Shanti Stupa (Peace Pagoda) built by Japanese Buddhist monk Fujii Guruji stands atop Gridhakuta hill. Visitors enjoy the scenic aerial ropeway, hot sulfur springs, and glass skywalk.',
      travelInformation: JSON.stringify({
        bestTime: 'September to March',
        howToReach: 'Nearest railhead: Rajgir Railway Station (5 km); 100 km from Patna Airport.',
        suggestedDuration: 'Full Day',
        entryFee: 'Pagoda Free (Ropeway ₹120 round-trip)',
        timings: '8:00 AM – 5:00 PM',
        contentStatus: 'VERIFIED',
        didYouKnow: 'Rajgir is surrounded by five majestic hills (Ratnagiri, Vipulachal, Vaibhagiri, Songiri, and Udaygiri) that formed natural fort walls for the ancient capital of King Bimbisara!',
        funFacts: [
          'Vulture’s Peak (Griddhakuta) was Buddha’s favorite retreat during rainy seasons.',
          'Features India’s first single-cable aerial chairlift and modern cabin ropeway.',
          'Home to the famous Glass Skywalk at Rajgir Nature Safari.'
        ]
      }),
      stays: JSON.stringify([
        { name: 'Gargi Gautam Resort Rajgir', rating: 4.5, price: '₹4,000/night' }
      ]),
      recommendations: JSON.stringify([
        'Take the new cabin ropeway to the top of Ratnagiri Hill.',
        'Experience the glass skywalk bridge at Nature Safari Park.'
      ])
    }
  });

  const patnaSahibDest = await prisma.destination.create({
    data: {
      name: 'Takht Sri Patna Sahib',
      slug: 'takht-sri-patna-sahib',
      description: 'One of the five Takhts of Sikhism, built at the birthplace of the tenth Sikh Guru, Guru Gobind Singh Ji.',
      districtId: patnaDistrict.id,
      circuitId: sikhCircuit.id,
      category: 'Religious & Cultural',
      heroImage: '/images/Takht Sri Patna Sahib(2).jpg',
      gallery: JSON.stringify([
        '/images/Takht Sri Patna Sahib(2).jpg',
        '/images/Takht Sri Patna Sahib(3).jpg',
        '/images/Takht Sri Patna Sahib(4).jpg'
      ]),
      latitude: 25.6022,
      longitude: 85.2281,
      overview: 'Constructed by Maharaja Ranjit Singh, Takht Sri Patna Sahib preserves holy relics of Guru Gobind Singh Ji, including his childhood wooden cradle, arrows, and sacred swords. Tens of thousands gather during Prakash Parv.',
      travelInformation: JSON.stringify({
        bestTime: 'Round the year (Prakash Parv in Dec/Jan)',
        howToReach: 'Patna Sahib Railway Station (2 km); Patna Airport (18 km)',
        suggestedDuration: '2 to 3 Hours',
        entryFee: 'Free (Langar open to all visitors)',
        timings: '4:00 AM – 10:00 PM (Daily)',
        contentStatus: 'VERIFIED',
        didYouKnow: 'Guru Gobind Singh Ji was born here in 1666 CE. The Gurdwara also houses sacred relics including his small gold-plated shoes and childhood wooden cradle (Pangura)!',
        funFacts: [
          'One of the 5 Takhts (Seats of Temporal Authority) in Sikhism.',
          'Guru Nanak Dev Ji and Guru Tegh Bahadur Ji also visited Patna Sahib.',
          'Serves free hot meals to thousands of visitors daily in Guru Ka Langar.'
        ]
      }),
      stays: JSON.stringify([
        { name: 'Hotel Maurya Patna', rating: 4.8, price: '₹7,500/night' }
      ]),
      recommendations: JSON.stringify([
        'Participate in the 24/7 Guru ka Langar.',
        'View the sacred historic relics inside the inner sanctum museum.'
      ])
    }
  });

  const vaishaliDest = await prisma.destination.create({
    data: {
      name: 'Vaishali Ashoka Pillar & Relic Stupa',
      slug: 'vaishali-ashoka-pillar',
      description: 'Site of the famous polished single-piece red sandstone Ashokan Lion Pillar and Buddha\'s last sermon.',
      districtId: vaishaliDistrict.id,
      circuitId: buddhistCircuit.id,
      category: 'Archaeological Heritage',
      heroImage: '/images/Vaishali Ashoka Pillar & Relic Stupa(2).jpg',
      gallery: JSON.stringify([
        '/images/Vaishali Ashoka Pillar & Relic Stupa(2).jpg',
        '/images/Vaishali Ashoka Pillar & Relic Stupa(3).jpg',
        '/images/Vaishali Ashoka Pillar & Relic Stupa(4).jpg'
      ]),
      latitude: 25.9923,
      longitude: 85.1264,
      overview: 'Vaishali is revered as the birthplace of Lord Mahavira and the city where Lord Buddha delivered his final sermon. The site features the remarkably intact Ashokan Pillar topped by a single seated lion facing north.',
      travelInformation: JSON.stringify({
        bestTime: 'October to March',
        howToReach: '55 km from Patna via Mahatma Gandhi Setu bridge',
        suggestedDuration: 'Half Day',
        entryFee: '₹25 for Indians'
      }),
      stays: JSON.stringify([
        { name: 'Vaishali Residency', rating: 4.2, price: '₹2,500/night' }
      ]),
      recommendations: JSON.stringify([
        'Visit the Relic Stupa containing Buddha ashes in a casket.',
        'Explore the World Peace Pagoda near Abhishek Pushkarini tank.'
      ])
    }
  });

  const valmikiDest = await prisma.destination.create({
    data: {
      name: 'Valmiki National Park & Tiger Reserve',
      slug: 'valmiki-tiger-reserve',
      description: 'Lush biodiversity hotspot on the Indo-Nepal border featuring royal Bengal tigers, elephants, and Gandak river rafting.',
      districtId: westChamparanDistrict.id,
      circuitId: ecoCircuit.id,
      category: 'Eco & Wildlife',
      heroImage: '/images/Valmiki National Park(3).jpg',
      gallery: JSON.stringify([
        '/images/Valmiki National Park(3).jpg',
        '/images/Valmiki National Park(4).jpg',
        '/images/Valmiki National Park(5).jpg'
      ]),
      latitude: 27.1500,
      longitude: 84.5000,
      overview: 'Valmiki Tiger Reserve covers 899 sq km of dense sal forests in the Himalayan Terai arc. It is Bihar\'s primary tiger conservation sanctuary, offering jeep safaris, nature trails, and eco-resort stays.',
      travelInformation: JSON.stringify({
        bestTime: 'November to April',
        howToReach: 'Bagaha Railway Station (45 km); Patna (290 km)',
        suggestedDuration: '2 to 3 Days',
        entryFee: 'Safari ₹1,500/vehicle'
      }),
      stays: JSON.stringify([
        { name: 'Valmiki Eco Huts & Treehouses', rating: 4.7, price: '₹3,500/night' }
      ]),
      recommendations: JSON.stringify([
        'Book early morning open-top jeep safari in Manguraha range.',
        'Enjoy scenic sunset boating along the Gandak River.'
      ])
    }
  });

  const sherShahDest = await prisma.destination.create({
    data: {
      name: 'Tomb of Sher Shah Suri, Sasaram',
      slug: 'sher-shah-suri-tomb',
      description: 'Architectural masterpiece of Indo-Islamic design built in red sandstone in the middle of an artificial lake.',
      districtId: rohtasDistrict.id,
      category: 'Monuments & Architecture',
      heroImage: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1600&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80'
      ]),
      latitude: 24.9500,
      longitude: 84.0167,
      overview: 'Built between 1540 and 1545 by architect Aliwal Khan, this grand 122 ft high octagonal mausoleum stands serenely in a lake and is referred to as the Second Taj Mahal of India.',
      travelInformation: JSON.stringify({
        bestTime: 'October to March',
        howToReach: 'Sasaram Junction Railway Station (2 km); Grand Trunk Road',
        suggestedDuration: '2 Hours',
        entryFee: '₹25 for Indians'
      }),
      stays: JSON.stringify([
        { name: 'Hotel Grand Sasaram', rating: 4.3, price: '₹2,800/night' }
      ]),
      recommendations: JSON.stringify([
        'Capture reflection photography during golden hour.',
        'Walk across the stone causeway bridge.'
      ])
    }
  });

  const madhubaniDest = await prisma.destination.create({
    data: {
      name: 'Mithila Cultural Village, Madhubani',
      slug: 'madhubani-cultural-village',
      description: 'Living heritage village showcasing legendary Madhubani / Mithila painting traditions and handloom weavers.',
      districtId: madhubaniDistrict.id,
      category: 'Art & Heritage',
      heroImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1600&q=80',
      gallery: JSON.stringify([
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80'
      ]),
      latitude: 26.3533,
      longitude: 86.0719,
      overview: 'Ranti and Jitwarpur villages in Madhubani are home to National Award winning artists. Visitors can observe natural dye preparation, custom canvas creation, and purchase authentic handmade art directly from master artisans.',
      travelInformation: JSON.stringify({
        bestTime: 'October to March',
        howToReach: 'Madhubani Railway Station (4 km); Darbhanga Airport (35 km)',
        suggestedDuration: 'Full Day',
        entryFee: 'Free entry to art center workshops'
      }),
      stays: JSON.stringify([
        { name: 'Mithila Eco Homestay', rating: 4.9, price: '₹2,200/night' }
      ]),
      recommendations: JSON.stringify([
        'Take a 2-hour Madhubani painting masterclass with Padma Shri awardee family.',
        'Taste traditional Mithila Makhana kheer.'
      ])
    }
  });

  // 8. Create Events (Complete 2026 Verified Calendar from bihar-events-2026.md)
  console.log('🌱 Seeding 40+ verified 2026 Bihar Tourism events and festivals...');

  const events2026Data = [
    // --- JANUARY 2026 ---
    { title: 'Tapovan Festival', slug: 'tapovan-festival-2026', category: 'Religious', description: 'Sacred hot water springs gathering and spiritual rituals at Tapovan near Gaya.', startDate: new Date('2026-01-14T00:00:00.000Z'), endDate: new Date('2026-01-14T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Tapovan, Gaya', district: 'Gaya', latitude: 24.7914, longitude: 85.0002, heroImage: '/images/tapovan (2).jpeg' },
    { title: 'Vishnudham Mahotsav', slug: 'vishnudham-mahotsav-2026', category: 'Religious', description: 'Annual temple festival celebrating Lord Vishnu heritage at Vishnudham.', startDate: new Date('2026-01-14T00:00:00.000Z'), endDate: new Date('2026-01-15T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Bhawanipur, Aurangabad', district: 'Aurangabad', latitude: 24.7500, longitude: 84.3700, heroImage: '/images/vishnudham mahotsav (2).jpeg' },
    { title: 'Mandar Mahotsav', slug: 'mandar-mahotsav-2026', category: 'Heritage', description: 'Cultural festival around historic Mandar Hill associated with Samudra Manthan.', startDate: new Date('2026-01-14T00:00:00.000Z'), endDate: new Date('2026-01-18T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Mandar Hill, Banka', district: 'Banka', latitude: 24.8800, longitude: 86.9200, heroImage: '/images/mandar mahostsav (2).jpg' },
    { title: 'Makar Mela Rajgir', slug: 'makar-mela-rajgir-2026', category: 'Fair/Mela', description: 'Famous winter fair at Rajgir hot sulfur springs with devotional baths and local crafts.', startDate: new Date('2026-01-14T00:00:00.000Z'), endDate: new Date('2026-01-21T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Hot Springs, Rajgir', district: 'Nalanda', latitude: 25.0300, longitude: 85.4200, heroImage: '/images/makar mela rajgir (2).jpeg', nearestPolice: 'Rajgir Police Station, Kund Area (08112-255220)', nearestHospital: 'Sub-Divisional Hospital, Bus Stand Road, Rajgir', nearbyRestaurants: JSON.stringify([{ name: 'Green Hotel & Dhaba', address: 'Kund Market, Rajgir', type: 'Vegetarian Dhaba' }, { name: 'Lotus Restaurant', address: 'Near Japanese Temple', type: 'North Indian' }]) },
    { title: 'Buddha Mahotsav', slug: 'buddha-mahotsav-2026', category: 'Music/Arts', description: 'Grand International Buddhist cultural festival featuring chanting and international troupes.', startDate: new Date('2026-01-31T00:00:00.000Z'), endDate: new Date('2026-02-02T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Kalachakra Ground, Bodh Gaya', district: 'Gaya', latitude: 24.6961, longitude: 84.9914, heroImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Makar Sankranti', slug: 'makar-sankranti-2026', category: 'Religious', description: 'Traditional kite festival and holy river baths with Til-Gur and Dahi-Chura feasts across Bihar.', startDate: new Date('2026-01-14T00:00:00.000Z'), endDate: new Date('2026-01-14T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: true, location: 'State-wide (Patna Ghats, Rajgir, Gaya)', district: 'Patna', latitude: 25.6100, longitude: 85.1410, heroImage: '/images/makar shakranti (2).jpg' },
    { title: 'Prakash Parv (Guru Gobind Singh Jayanti)', slug: 'prakash-parv-jan-2026', category: 'Religious', description: 'Sacred birth anniversary of tenth Sikh Guru at Takht Sri Patna Sahib with Nagar Kirtan and Langar.', startDate: new Date('2026-01-15T00:00:00.000Z'), endDate: new Date('2026-01-15T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: true, location: 'Takht Sri Patna Sahib, Patna', district: 'Patna', latitude: 25.6022, longitude: 85.2281, heroImage: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&w=1200&q=80' },

    // --- FEBRUARY 2026 ---
    { title: 'Martand Mahotsav', slug: 'martand-mahotsav-2026', category: 'Cultural', description: 'Cultural celebration honoring ancient Sun Temple heritage in Madhubani district.', startDate: new Date('2026-02-11T00:00:00.000Z'), endDate: new Date('2026-02-11T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Martand Temple, Madhubani', district: 'Madhubani', latitude: 26.3533, longitude: 86.0719, heroImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Rohtas Garh Kila Mahotsav', slug: 'rohtas-garh-kila-mahotsav-2026', category: 'Heritage', description: 'Historic festival held inside the majestic hill fort of Rohtasgarh celebrating tribal and regional heritage.', startDate: new Date('2026-02-11T00:00:00.000Z'), endDate: new Date('2026-02-11T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Rohtasgarh Fort, Rohtas', district: 'Rohtas', latitude: 24.6300, longitude: 83.9000, heroImage: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Umgeshwari Mahotsav', slug: 'umgeshwari-mahotsav-2026', category: 'Religious', description: 'Traditional temple fair and cultural programmes at Umga Sun and Shiva temple complex.', startDate: new Date('2026-02-15T00:00:00.000Z'), endDate: new Date('2026-02-16T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Madanpur, Aurangabad', district: 'Aurangabad', latitude: 24.6500, longitude: 84.5000, heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Baba Koteshwar Mahadev Mahotsav', slug: 'baba-koteshwar-mahadev-mahotsav-2026', category: 'Religious', description: 'Devotional gathering and cultural performances at ancient Shiva shrine in Gaya district.', startDate: new Date('2026-02-15T00:00:00.000Z'), endDate: new Date('2026-02-16T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Moratalab, Gaya', district: 'Gaya', latitude: 24.8000, longitude: 85.0200, heroImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Mehendar Mahotsav', slug: 'mehendar-mahotsav-2026', category: 'Cultural', description: 'Folk music, dance, and fair celebrating historic Mahendranath Temple in Siwan.', startDate: new Date('2026-02-15T00:00:00.000Z'), endDate: new Date('2026-02-16T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Mehndar, Siwan', district: 'Siwan', latitude: 26.2200, longitude: 84.3600, heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Singheshwar Mahotsav', slug: 'singheshwar-mahotsav-2026', category: 'Religious', description: 'Major Shivaratri temple mela and cultural extravaganza at Singheshwar Dham in Madhepura.', startDate: new Date('2026-02-15T00:00:00.000Z'), endDate: new Date('2026-02-16T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Singheshwar, Madhepura', district: 'Madhepura', latitude: 25.9800, longitude: 86.8200, heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Vikramshila Mahotsav', slug: 'vikramshila-mahotsav-2026', category: 'Heritage', description: 'Grand heritage celebration highlighting the ruins of ancient Vikramshila Monastic University.', startDate: new Date('2026-02-17T00:00:00.000Z'), endDate: new Date('2026-02-18T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Kahalgaon, Bhagalpur', district: 'Bhagalpur', latitude: 25.2600, longitude: 87.2100, heroImage: '/images/nalanda (1).jpeg' },
    { title: 'Maa Vishahara Mahotsav', slug: 'maa-vishahara-mahotsav-2026', category: 'Local/Regional', description: 'Regional folk festival dedicated to Goddess Vishahara in Kosi region.', startDate: new Date('2026-02-25T00:00:00.000Z'), endDate: new Date('2026-02-26T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Saharsa town', district: 'Saharsa', latitude: 25.8800, longitude: 86.6000, heroImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Basant Panchami / Saraswati Puja', slug: 'basant-panchami-2026', category: 'Religious', description: 'Spring arrival and worship of Goddess Saraswati across schools, colleges, and art hubs.', startDate: new Date('2026-02-23T00:00:00.000Z'), endDate: new Date('2026-02-23T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: true, location: 'State-wide', district: 'Patna', latitude: 25.5941, longitude: 85.1376, heroImage: '/images/nalanda (3).jpeg' },
    { title: 'Maha Shivaratri', slug: 'maha-shivaratri-2026', category: 'Religious', description: 'Night-long vigil, jalabhishekam, and Shiv Baraat processions across Shiva temples in Bihar.', startDate: new Date('2026-02-15T00:00:00.000Z'), endDate: new Date('2026-02-15T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: true, location: 'State-wide (Singheshwar, Ajgaibinath, Gupteshwar)', district: 'Bhojpur', latitude: 25.5500, longitude: 84.6700, heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80' },

    // --- MARCH 2026 ---
    { title: 'Guptadham Mahotsav', slug: 'guptadham-mahotsav-2026', category: 'Heritage', description: 'Pilgrimage and cultural mela at the natural cave temple of Gupteshwar Mahadev in Kaimur hills.', startDate: new Date('2026-03-10T00:00:00.000Z'), endDate: new Date('2026-03-11T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Guptadham Caves, Rohtas', district: 'Rohtas', latitude: 24.9000, longitude: 83.8500, heroImage: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Mithila Mahotsav', slug: 'mithila-mahotsav-2026', category: 'Cultural', description: 'Vibrant celebration of Mithila culture, Maithili music recitals, Madhubani painting exhibitions, and culinary arts.', startDate: new Date('2026-03-19T00:00:00.000Z'), endDate: new Date('2026-03-20T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Madhubani Town', district: 'Madhubani', latitude: 26.3533, longitude: 86.0719, heroImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Koshi Mahotsav', slug: 'koshi-mahotsav-2026', category: 'Local/Regional', description: 'Regional festival celebrating the spirit, folklore, and heritage of Kosi river belt.', startDate: new Date('2026-03-19T00:00:00.000Z'), endDate: new Date('2026-03-20T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Saharsa', district: 'Saharsa', latitude: 25.8800, longitude: 86.6000, heroImage: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Bihar Diwas', slug: 'bihar-diwas-2026', category: 'Cultural', description: 'Statehood day celebrations at Gandhi Maidan Patna with 3-day drone shows, concerts, and Bihar cuisine pavilion.', startDate: new Date('2026-03-22T00:00:00.000Z'), endDate: new Date('2026-03-24T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Gandhi Maidan, Patna', district: 'Patna', latitude: 25.6150, longitude: 85.1420, heroImage: '/images/nalanda (3).jpeg' },
    { title: 'Sitakund Mahotsav', slug: 'sitakund-mahotsav-2026', category: 'Heritage', description: 'Cultural mela at Sitakund spring complex associated with Ramayana tradition.', startDate: new Date('2026-03-27T00:00:00.000Z'), endDate: new Date('2026-03-27T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Sitakund, East Champaran', district: 'East Champaran', latitude: 26.6500, longitude: 84.9000, heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Vaishali Mahotsav', slug: 'vaishali-mahotsav-2026', category: 'Cultural', description: 'Commemorating birthplace of Lord Mahavira and Republic of Vaishali on Mahavir Jayanti.', startDate: new Date('2026-03-31T00:00:00.000Z'), endDate: new Date('2026-03-31T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Abhishek Pushkarini, Vaishali', district: 'Vaishali', latitude: 25.9923, longitude: 85.1264, heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Lachuar & Kundalpur Mahotsav', slug: 'lachuar-kundalpur-mahotsav-2026', category: 'Religious', description: 'Sacred Jain pilgrimage gathering at birthplaces of Lord Mahavira in Jamui and Nalanda.', startDate: new Date('2026-03-31T00:00:00.000Z'), endDate: new Date('2026-03-31T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Lachuar (Jamui) & Kundalpur (Nalanda)', district: 'Jamui', latitude: 24.9200, longitude: 86.2200, heroImage: '/images/nalanda (1).jpeg' },
    { title: 'Holi Festival of Colors', slug: 'holi-bihar-2026', category: 'Cultural', description: 'Joyous spring festival of colors, traditional Jogira songs, and Malpua delicacies across Bihar.', startDate: new Date('2026-03-03T00:00:00.000Z'), endDate: new Date('2026-03-04T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: true, location: 'State-wide', district: 'Patna', latitude: 25.5941, longitude: 85.1376, heroImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80' },

    // --- APRIL 2026 ---
    { title: 'Thave Mahotsav', slug: 'thave-mahotsav-2026', category: 'Religious', description: 'Grand music festival and pilgrimage at Thave Durga Temple in Gopalganj.', startDate: new Date('2026-04-07T00:00:00.000Z'), endDate: new Date('2026-04-08T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Thave Temple, Gopalganj', district: 'Gopalganj', latitude: 26.4600, longitude: 84.4400, heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Patna Sahib Mahotsav', slug: 'patna-sahib-mahotsav-2026', category: 'Religious', description: 'Heritage and devotional festival around Takht Sri Harmandir Sahib.', startDate: new Date('2026-04-14T00:00:00.000Z'), endDate: new Date('2026-04-15T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Patna Sahib', district: 'Patna', latitude: 25.6022, longitude: 85.2281, heroImage: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Parshuram Utsav Mela', slug: 'parshuram-utsav-mela-2026', category: 'Fair/Mela', description: 'Annual religious mela and cultural assembly in Patna.', startDate: new Date('2026-04-20T00:00:00.000Z'), endDate: new Date('2026-04-20T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Patna City', district: 'Patna', latitude: 25.6000, longitude: 85.1500, heroImage: '/images/porshuram utsav mela(2).jpeg', nearestPolice: 'Patna City Police Station', nearestHospital: 'PMCH Emergency Hospital, Patna', nearbyRestaurants: JSON.stringify([{ name: 'Patna City Bhojanalaya', address: 'Patna Sahib Main Road', type: 'Authentic Bihari' }]) },
    { title: 'Sitamarhi Mahotsav', slug: 'sitamarhi-mahotsav-2026', category: 'Heritage', description: 'Celebration of Janaki (Ma Sita) birthplace at Punaura Dham in Sitamarhi.', startDate: new Date('2026-04-25T00:00:00.000Z'), endDate: new Date('2026-04-27T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Punaura Dham, Sitamarhi', district: 'Sitamarhi', latitude: 26.6000, longitude: 85.4800, heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Mundeshwari Mahotsav', slug: 'mundeshwari-mahotsav-2026', category: 'Heritage', description: 'Music and heritage festival at India’s oldest functional octagonal stone temple in Kaimur hills.', startDate: new Date('2026-04-26T00:00:00.000Z'), endDate: new Date('2026-04-27T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Mundeshwari Hill, Kaimur', district: 'Kaimur', latitude: 25.0200, longitude: 83.6000, heroImage: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80' },

    // --- MAY 2026 ---
    { title: 'Malmas Mela Rajgir', slug: 'malmas-mela-rajgir-2026', category: 'Fair/Mela', description: 'Month-long sacred leap-year pilgrimage mela where millions bathe in Rajgir sulfur springs.', startDate: new Date('2026-05-17T00:00:00.000Z'), endDate: new Date('2026-06-15T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Kund Area, Rajgir', district: 'Nalanda', latitude: 25.0300, longitude: 85.4200, heroImage: '/images/malmas mela rajgir (2).jpeg', nearestPolice: 'Mela Central Police Camp Rajgir', nearestHospital: 'Rajgir Government General Hospital', nearbyRestaurants: JSON.stringify([{ name: 'Swagat Restaurant', address: 'Vishwa Shanti Stupa Road', type: 'Pure Veg Thali' }]) },
    { title: 'Sher Shah Suri Mahotsav', slug: 'sher-shah-mahotsav-2026', category: 'Heritage', description: 'Heritage celebration honoring Emperor Sher Shah Suri architecture and Grand Trunk Road legacy in Sasaram.', startDate: new Date('2026-05-21T00:00:00.000Z'), endDate: new Date('2026-05-22T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Tomb of Sher Shah Suri, Sasaram', district: 'Rohtas', latitude: 24.9500, longitude: 84.0167, heroImage: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Buddha Purnima Mahotsav', slug: 'buddha-purnima-2026', category: 'Religious', description: 'World-renowned commemoration of Buddha’s Birth, Enlightenment, and Parinirvana under the Bodhi Tree.', startDate: new Date('2026-05-31T00:00:00.000Z'), endDate: new Date('2026-05-31T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: true, location: 'Mahabodhi Temple, Bodh Gaya', district: 'Gaya', latitude: 24.6961, longitude: 84.9914, heroImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80' },

    // --- JUNE 2026 ---
    { title: 'Sufi Mahotsav Maner Sharif', slug: 'sufi-mahotsav-maner-2026', category: 'Music/Arts', description: 'Soulful Sufi Qawwali, devotional music, and Urs festival at historic Maner Sharif Dargah.', startDate: new Date('2026-06-28T00:00:00.000Z'), endDate: new Date('2026-06-28T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Maner Sharif, Patna', district: 'Patna', latitude: 25.6500, longitude: 84.8800, heroImage: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&w=1200&q=80' },

    // --- JULY 2026 ---
    { title: 'Shravani Mela (Sultanganj to Banka)', slug: 'shravani-mela-2026', category: 'Fair/Mela', description: 'Bihar’s iconic month-long Kanwar Yatra pilgrimage where millions carry holy Ganga water from Sultanganj.', startDate: new Date('2026-07-30T00:00:00.000Z'), endDate: new Date('2026-08-28T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Ajgaibinath Ghat Sultanganj → Munger → Banka', district: 'Bhagalpur', latitude: 25.2425, longitude: 87.0124, heroImage: '/images/shrabani mela(2).jpeg', nearestPolice: 'Sultanganj Police Station & Kanwar Path Outposts', nearestHospital: 'Referral Hospital Sultanganj & Mobile Medical Units', nearbyRestaurants: JSON.stringify([{ name: 'Shiv Ganga Bhojanalaya', address: 'Ajgaibinath Ghat Road', type: 'Pilgrims Pure Veg Dhaba' }]) },

    // --- AUGUST 2026 ---
    { title: 'Kucheshwar Mahadev Mahotsav', slug: 'kucheshwar-mahadev-mahotsav-2026', category: 'Religious', description: 'Shravan month devotional festival and cultural recitals in Gaya district.', startDate: new Date('2026-08-04T00:00:00.000Z'), endDate: new Date('2026-08-04T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Kucheshwar, Gaya', district: 'Gaya', latitude: 24.7800, longitude: 84.9800, heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Independence Day Celebrations', slug: 'independence-day-2026', category: 'Cultural', description: 'State parade, flag hoisting by Chief Minister at Gandhi Maidan, and illumination of public monuments.', startDate: new Date('2026-08-15T00:00:00.000Z'), endDate: new Date('2026-08-15T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Gandhi Maidan, Patna', district: 'Patna', latitude: 25.6150, longitude: 85.1420, heroImage: '/images/nalanda (3).jpeg' },
    { title: 'Singh Rameshwar Hanuman Mahotsav', slug: 'singh-rameshwar-hanuman-mahotsav-2026', category: 'Religious', description: 'Week-long religious discourse, Ramcharitmanas recitation, and devotional fair in Muzaffarpur.', startDate: new Date('2026-08-27T00:00:00.000Z'), endDate: new Date('2026-09-04T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Muzaffarpur town', district: 'Muzaffarpur', latitude: 26.1209, longitude: 85.3647, heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Raksha Bandhan', slug: 'raksha-bandhan-2026', category: 'Cultural', description: 'Traditional festival of sibling bonds celebrated with Rakhi tying and sweet distributions.', startDate: new Date('2026-08-28T00:00:00.000Z'), endDate: new Date('2026-08-28T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: true, location: 'State-wide', district: 'Patna', latitude: 25.5941, longitude: 85.1376, heroImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80' },

    // --- SEPTEMBER 2026 ---
    { title: 'Sufi Mahotsav Kako', slug: 'sufi-mahotsav-kako-2026', category: 'Music/Arts', description: 'Sufi music performance and cultural congregation at Hazrat Bibi Kamal Dargah in Kako.', startDate: new Date('2026-09-04T00:00:00.000Z'), endDate: new Date('2026-09-05T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Kako, Jehanabad', district: 'Jehanabad', latitude: 25.2100, longitude: 84.9800, heroImage: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Someshwarnath Mahotsav', slug: 'someshwarnath-mahotsav-2026', category: 'Religious', description: 'Devotional gathering and cultural night at Areraj Someshwarnath Shiva Temple.', startDate: new Date('2026-09-26T00:00:00.000Z'), endDate: new Date('2026-09-27T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Areraj, East Champaran', district: 'East Champaran', latitude: 26.5500, longitude: 84.6800, heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Pitrapaksha Mela Gaya', slug: 'pitru-paksha-mela', category: 'Fair/Mela', description: 'World-famous fortnight pilgrimage along holy Phalgu river in Gaya for Pind Daan rituals.', startDate: new Date('2026-09-26T00:00:00.000Z'), endDate: new Date('2026-10-10T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Vishnupad Temple & Phalgu Ghats, Gaya', district: 'Gaya', latitude: 24.7914, longitude: 85.0002, heroImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80', nearestPolice: 'Vishnupad Police Outpost & Mela Control Room', nearestHospital: 'ANMMCH Hospital, Gaya (0631-2220020)', nearbyRestaurants: JSON.stringify([{ name: 'Pramod Laddu Bhandar & Restaurant', address: 'Tower Chowk, Gaya', type: 'Traditional Thali & Sweets' }, { name: 'Suvidha Pure Veg', address: 'Near Vishnupad Ghat', type: 'North Indian' }]) },
    { title: 'Bapu Dham Mahotsav', slug: 'bapu-dham-mahotsav-2026', category: 'Heritage', description: 'Commemorating Mahatma Gandhi’s historic Champaran Satyagraha with heritage walks and seminars.', startDate: new Date('2026-09-29T00:00:00.000Z'), endDate: new Date('2026-10-02T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Motihari, East Champaran', district: 'East Champaran', latitude: 26.6500, longitude: 84.9100, heroImage: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?auto=format&fit=crop&w=1200&q=80' },

    // --- OCTOBER 2026 ---
    { title: 'Maa Tara Devi Siddhi Peeth Mahotsav', slug: 'maa-tara-devi-mahotsav-2026', category: 'Religious', description: '10-day Navratri festival and spiritual mela at Tara Devi Peeth.', startDate: new Date('2026-10-11T00:00:00.000Z'), endDate: new Date('2026-10-20T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Tara Devi, Gaya', district: 'Gaya', latitude: 24.7914, longitude: 85.0002, heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Sri Ugratara Sanskritik Mahotsav', slug: 'sri-ugratara-mahotsav-2026', category: 'Cultural', description: 'Mithila devotional music and cultural programmes at Ugratara Temple Mahishi.', startDate: new Date('2026-10-12T00:00:00.000Z'), endDate: new Date('2026-10-14T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Mahishi, Saharsa', district: 'Saharsa', latitude: 25.8500, longitude: 86.4800, heroImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Maa Mansa Devi Mahotsav', slug: 'maa-mansa-devi-mahotsav-2026', category: 'Religious', description: 'Folk mela and religious festival dedicated to Goddess Mansa in Muzaffarpur.', startDate: new Date('2026-10-17T00:00:00.000Z'), endDate: new Date('2026-10-19T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Muzaffarpur', district: 'Muzaffarpur', latitude: 26.1209, longitude: 85.3647, heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Durga Puja & Dussehra', slug: 'durga-puja-dussehra-2026', category: 'Religious', description: 'Elaborate Pandal decorations, Ravana Dahan effigies at Gandhi Maidan, and grand festivities.', startDate: new Date('2026-10-18T00:00:00.000Z'), endDate: new Date('2026-10-20T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: true, location: 'State-wide (Patna, Gaya, Bhagalpur)', district: 'Patna', latitude: 25.6100, longitude: 85.1410, heroImage: '/images/nalanda (3).jpeg' },

    // --- NOVEMBER 2026 ---
    { title: 'Fetki Kutti Kalpwas', slug: 'fetki-kutti-kalpwas-2026', category: 'Religious', description: 'Month-long ascetic Kalpwas spiritual retreat along sacred rivers in Madhubani.', startDate: new Date('2026-11-19T00:00:00.000Z'), endDate: new Date('2026-11-24T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Fetki Kutti, Madhubani', district: 'Madhubani', latitude: 26.3533, longitude: 86.0719, heroImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Ahilya Gautam Mahotsav', slug: 'ahilya-gautam-mahotsav-2026', category: 'Heritage', description: 'Heritage festival celebrating Ahilya Asthan associated with Sage Gautama and Lord Rama in Darbhanga.', startDate: new Date('2026-11-19T00:00:00.000Z'), endDate: new Date('2026-11-21T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Ahilya Asthan, Darbhanga', district: 'Darbhanga', latitude: 26.1542, longitude: 85.8918, heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Chhath Puja Mahaparv', slug: 'chhath-puja', category: 'Religious', description: 'The premier 4-day spiritual eco-festival of Bihar dedicated to Sun God Surya and Chhathi Maiya at Ganges ghats.', startDate: new Date('2026-11-14T00:00:00.000Z'), endDate: new Date('2026-11-17T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: true, location: 'Patna Ganga Ghats & State-wide', district: 'Patna', latitude: 25.6100, longitude: 85.1410, heroImage: '/images/nalanda (3).jpeg' },
    { title: 'Harihar Kshetra Sonpur Mela', slug: 'sonepur-mela', category: 'Fair/Mela', description: 'Asia’s largest traditional fair at Ganges-Gandak confluence featuring handicrafts, theaters, and cattle trading.', startDate: new Date('2026-11-24T00:00:00.000Z'), endDate: new Date('2026-12-23T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Sonepur Mela Ground, Saran', district: 'Saran', latitude: 25.7000, longitude: 85.1800, heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', nearestPolice: 'Sonepur Mela Control Central Police Station, Saran', nearestHospital: 'Sub-Divisional Hospital Sonepur & Emergency Disaster Care Camp', nearbyRestaurants: JSON.stringify([{ name: 'Grand Sonpur Highway Dhaba', address: 'Sonepur Main Market', type: 'Family Dhaba' }, { name: 'Royal Ganga View Restaurant', address: 'Gandak Bridge Road', type: 'Multi-Cuisine' }]) },
    { title: 'Rajgir Mahotsav', slug: 'rajgir-mahotsav', category: 'Cultural', description: 'Annual 3-day extravaganza of classical music, dance recitals, theater, and food festival set against Rajgir hills.', startDate: new Date('2026-11-30T00:00:00.000Z'), endDate: new Date('2026-12-02T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Kala Gram, Rajgir', district: 'Nalanda', latitude: 25.0300, longitude: 85.4200, heroImage: '/images/nalanda (1).jpeg' },

    // --- DECEMBER 2026 ---
    { title: 'Munger Mahotsav', slug: 'munger-mahotsav-2026', category: 'Local/Regional', description: 'Regional festival celebrating Munger Fort heritage, Yoga school traditions, and Ganges river ghats.', startDate: new Date('2026-12-04T00:00:00.000Z'), endDate: new Date('2026-12-06T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Munger Fort Ground', district: 'Munger', latitude: 25.3748, longitude: 86.4735, heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Uchchait Mahotsav', slug: 'uchchait-mahotsav-2026', category: 'Religious', description: 'Festival at Uchchait Bhagwati temple associated with great poet Kalidasa in Madhubani.', startDate: new Date('2026-12-07T00:00:00.000Z'), endDate: new Date('2026-12-08T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Uchchait, Madhubani', district: 'Madhubani', latitude: 26.3533, longitude: 86.0719, heroImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Garhi Mahotsav', slug: 'garhi-mahotsav-2026', category: 'Heritage', description: 'Heritage and folk festival celebrating historic Garhi fort in Jamui.', startDate: new Date('2026-12-21T00:00:00.000Z'), endDate: new Date('2026-12-23T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Garhi, Jamui', district: 'Jamui', latitude: 24.9200, longitude: 86.2200, heroImage: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Mithila Lok Mahotsav', slug: 'mithila-lok-mahotsav-2026', category: 'Cultural', description: 'Folk music, folk theatre, and traditional handicrafts assembly in Darbhanga.', startDate: new Date('2026-12-23T00:00:00.000Z'), endDate: new Date('2026-12-24T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Raj Maidan, Darbhanga', district: 'Darbhanga', latitude: 26.1542, longitude: 85.8918, heroImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Vanavar Mahotsav', slug: 'vanavar-mahotsav-2026', category: 'Heritage', description: 'Cultural festival at ancient Barabar / Vanavar hill caves in Jehanabad.', startDate: new Date('2026-12-24T00:00:00.000Z'), endDate: new Date('2026-12-24T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Barabar Caves, Jehanabad', district: 'Jehanabad', latitude: 25.0000, longitude: 85.0600, heroImage: '/images/nalanda (1).jpeg' },
    { title: 'Christmas Celebrations', slug: 'christmas-2026', category: 'Religious', description: 'Festive midnight mass and illumination at historic churches including Padri Ki Haveli in Patna.', startDate: new Date('2026-12-25T00:00:00.000Z'), endDate: new Date('2026-12-25T23:59:59.000Z'), year: 2026, lastVerified: '2026-08-20', isLunar: false, location: 'Padri Ki Haveli & State-wide', district: 'Patna', latitude: 25.6050, longitude: 85.2000, heroImage: '/images/nalanda (3).jpeg' }
  ];

  for (const evData of events2026Data) {
    await prisma.event.create({ data: evData });
  }

  // 8.5 Seed Cuisine Items (Taste of Bihar)
  const cuisineItemsData = [
    {
      name: 'Litti Chokha & Sattu Delicacies',
      slug: 'litti-chokha',
      description: 'The quintessential culinary pride of Bihar. Whole wheat dough balls stuffed with spiced roasted gram flour (sattu), baked over cow-dung coal embers, dipped generously in melted desi ghee, and served alongside smoky brinjal and mashed potato chokha with spicy garlic-chilli chutney.',
      heroImage: '/images/litthi chokha (2).jpeg',
      location: 'Patna & Statewide',
      district: 'Patna',
      restaurants: JSON.stringify([
        { name: 'DK Litti Corner', address: 'Near Maurya Lok Complex, Patna', type: 'Street Stall / Authentic Dhaba' },
        { name: 'Bhojpur Litti Hut', address: 'Boring Road Crossing, Patna', type: 'Traditional Eatery' },
        { name: 'Moti Mahal Delux Sattu Hub', address: 'Exhibition Road, Patna', type: 'Family Restaurant' }
      ])
    },
    {
      name: 'Thekua & Traditional Chhath Prasad',
      slug: 'thekua-festive-sweets',
      description: 'A revered traditional Bihari sweet prepared during Chhath Puja. Crafted from whole wheat flour, jaggery, cardamom, melted ghee, and dry fruits, molded with wooden hand-carved blocks (saancha) and deep-fried to crisp perfection.',
      heroImage: '/images/thekua(2).jpeg',
      location: 'Patna & Mithila Belt',
      district: 'Patna',
      restaurants: JSON.stringify([
        { name: 'Harilal Sweets & Snacks', address: 'Dak Bungalow Chouraha, Patna', type: 'Sweet & Confectionery' },
        { name: 'Promod Laddu Bhandar', address: 'Main Road, Gaya', type: 'Heritage Sweet Shop' },
        { name: 'Anand Sweets & Caterers', address: 'Bari Path, Patna Sahib', type: 'Traditional Bakery' }
      ])
    },
    {
      name: 'Mithila Makhana Heritage',
      slug: 'makhana-culinary-traditions',
      description: 'GI-tagged Foxnuts harvested from ancient wetland ponds in Mithila region. Renowned for supreme nutritional value, crispy roasted spices, creamy makhana kheer, and traditional royal court preparations.',
      heroImage: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
      location: 'Darbhanga & Madhubani',
      district: 'Darbhanga',
      restaurants: JSON.stringify([
        { name: 'Mithila Rasoi', address: 'Tower Chowk, Darbhanga', type: 'Authentic Maithil Dining' },
        { name: 'Makhana King Cafe', address: 'Station Road, Madhubani', type: 'Specialty Makhana Lounge' },
        { name: 'Hotel Royal Palace Dining', address: 'VIP Road, Darbhanga', type: 'Heritage Restaurant' }
      ])
    },
    {
      name: 'Silao Khaja — GI Tag Sweet',
      slug: 'silao-khaja',
      description: 'Centuries-old crisp layered delicacy crafted in Silao near Nalanda & Rajgir. Comprising 52 translucent paper-thin pastry layers fried in ghee and soaked in light sugar syrup, carrying an official Geographical Indication (GI) tag.',
      heroImage: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1200&q=80',
      location: 'Silao, Rajgir, Nalanda',
      district: 'Nalanda',
      restaurants: JSON.stringify([
        { name: 'Kali Sah Silao Khaja Bhandar', address: 'Main Market, Silao (Nalanda)', type: 'Original GI Heritage Shop' },
        { name: 'Babu Lal Khaja Mahal', address: 'Kund Area Road, Rajgir', type: 'Traditional Sweet House' },
        { name: 'Silao Famous Sweet Corner', address: 'Patna-Ranchi Highway, Silao', type: 'Highway Confectionery' }
      ])
    }
  ];

  for (const cData of cuisineItemsData) {
    await prisma.cuisineItem.create({ data: cData });
  }

  // 9. Create Vendor Offerings
  const offering1 = await prisma.offering.create({
    data: {
      vendorId: demoVendor.id,
      title: 'Bodh Gaya Heritage Spiritual Walk',
      slug: 'bodh-gaya-spiritual-walk',
      description: 'Immersive guided walking tour of Mahabodhi Temple complex, international monasteries (Thai, Tibetan, Japanese), and local tea ceremony with a historian.',
      category: 'Guided Tour',
      price: 1850,
      duration: '4 Hours',
      maxGuests: 8,
      location: 'Bodh Gaya, Bihar',
      latitude: 24.6961,
      longitude: 84.9914,
      coverImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80']),
      isActive: true
    }
  });

  const offering2 = await prisma.offering.create({
    data: {
      vendorId: demoVendor.id,
      title: 'Nalanda & Rajgir Full-Day Excursion',
      slug: 'nalanda-rajgir-full-day-excursion',
      description: 'Private AC transport, expert guide, entrance tickets to Nalanda ruins, cable car tickets to Vishwa Shanti Stupa, and authentic Bihari Litti Chokha lunch.',
      category: 'Heritage Tour',
      price: 3499,
      duration: '8 Hours',
      maxGuests: 6,
      location: 'Nalanda & Rajgir',
      latitude: 25.1357,
      longitude: 85.4439,
      coverImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80']),
      isActive: true
    }
  });

  const offering3 = await prisma.offering.create({
    data: {
      vendorId: demoVendor.id,
      title: 'Masterclass Madhubani Painting Experience',
      slug: 'madhubani-painting-masterclass',
      description: 'Private workshop with a Master Artisan in Ranti Village. Learn natural color extraction from turmeric and flowers, and create your own canvas to take home.',
      category: 'Cultural Experience',
      price: 2200,
      duration: '3 Hours',
      maxGuests: 4,
      location: 'Madhubani, Bihar',
      latitude: 26.3533,
      longitude: 86.0719,
      coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
      gallery: JSON.stringify(['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80']),
      isActive: true
    }
  });

  // 10. Create Demo Booking Order
  await prisma.order.create({
    data: {
      orderNumber: 'SETU-2026-8849',
      userId: touristUser.id,
      vendorId: demoVendor.id,
      offeringId: offering1.id,
      quantity: 2,
      bookingDate: new Date('2026-10-15T09:00:00.000Z'),
      amount: 3700,
      currency: 'INR',
      paymentStatus: 'PAID',
      orderStatus: 'CONFIRMED',
      razorpayOrderId: 'order_test_9988776655',
      razorpayPaymentId: 'pay_test_1122334455',
      razorpaySignature: 'sig_valid_test_demo',
      notes: 'Please arrange an English-speaking guide.'
    }
  });

  // 11. Additional Vendors & Offerings across Bihar Districts
  console.log('🌱 Seeding 18 additional realistic vendors across Bihar districts...');

  // Vendor 1: Patna Junction Grand Stays & Suites (Patna)
  const vUser1 = await prisma.user.create({
    data: { name: 'Patna Junction Grand Stays', email: 'patnagrand@setu.local', passwordHash: vendorPasswordHash, role: 'VENDOR', phone: '+919835012345', emailVerified: true }
  });
  const v1 = await prisma.vendor.create({
    data: { userId: vUser1.id, businessName: 'Patna Junction Grand Stays & Suites', description: 'Modern luxury hotel with authentic Bihari hospitality located near Patna Junction.', businessType: 'Hotels & Homestays', phone: '+919835012345', email: 'contact@patnagrandstays.in', address: 'Station Road, Fraser Road Corner', city: 'Patna', district: 'Patna', latitude: 25.6085, longitude: 85.1325, status: 'APPROVED' }
  });
  const v1Offering = await prisma.offering.create({
    data: { vendorId: v1.id, title: 'Luxury Executive Suite Package', slug: 'patna-grand-luxury-suite', description: 'Includes complimentary Bihari buffet breakfast, airport pick-up, and heritage city tour guide.', category: 'Accommodation', price: 4200, duration: '1 Night', maxGuests: 2, location: 'Patna, Bihar', latitude: 25.6085, longitude: 85.1325, coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', gallery: JSON.stringify(['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80']), isActive: true }
  });

  // Vendor 2: Maurya Rasoi & Traditional Litti Hub (Patna)
  const vUser2 = await prisma.user.create({
    data: { name: 'Maurya Rasoi Patna', email: 'mauryarasoi@setu.local', passwordHash: vendorPasswordHash, role: 'VENDOR', phone: '+919431023456', emailVerified: true }
  });
  const v2 = await prisma.vendor.create({
    data: { userId: vUser2.id, businessName: 'Maurya Rasoi & Traditional Litti Hub', description: 'Famous wood-charcoal Litti Chokha, Champaran Mutton, and authentic Magahi thalis.', businessType: 'Restaurants & Culinary', phone: '+919431023456', email: 'info@mauryarasoi.in', address: 'Boring Road Crossing', city: 'Patna', district: 'Patna', latitude: 25.6120, longitude: 85.1210, status: 'APPROVED' }
  });
  const v2Offering = await prisma.offering.create({
    data: { vendorId: v2.id, title: 'Authentic Royal Bihari Litti Chokha & Sattu Thali', slug: 'maurya-rasoi-litti-thali', description: 'Traditional Ghee Litti served with Baingan-Tamatar Chokha, Sattu Sharbat, and Gulab Jamun.', category: 'Culinary Experience', price: 450, duration: '2 Hours', maxGuests: 6, location: 'Boring Road, Patna', latitude: 25.6120, longitude: 85.1210, coverImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80', gallery: JSON.stringify(['https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80']), isActive: true }
  });

  // Vendor 3: Mithila Chhap Silk & Crafts Emporium (Bhagalpur)
  const vUser3 = await prisma.user.create({
    data: { name: 'Mithila Chhap Silk Emporium', email: 'mithilachhap@setu.local', passwordHash: vendorPasswordHash, role: 'VENDOR', phone: '+919771034567', emailVerified: true }
  });
  const v3 = await prisma.vendor.create({
    data: { userId: vUser3.id, businessName: 'Mithila Chhap Silk & Crafts Emporium', description: 'Heritage weavers offering pure Bhagalpuri Tussar Silk sarees, dupattas, and handloom crafts.', businessType: 'Local Crafts & Products', phone: '+919771034567', email: 'crafts@mithilachhap.in', address: 'Champanagar Silk Market', city: 'Bhagalpur', district: 'Bhagalpur', latitude: 25.2425, longitude: 87.0124, status: 'APPROVED' }
  });
  const v3Offering = await prisma.offering.create({
    data: { vendorId: v3.id, title: 'Handwoven Tussar Silk Saree & Scarf Set', slug: 'bhagalpuri-tussar-silk-set', description: '100% natural organic Tussar silk woven by master weavers of Champanagar.', category: 'Handicrafts', price: 3800, duration: 'N/A', maxGuests: 1, location: 'Bhagalpur, Bihar', latitude: 25.2425, longitude: 87.0124, coverImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', gallery: JSON.stringify(['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80']), isActive: true }
  });

  // Vendor 4: Bhagalpur Silk Handloom Traders (Bhagalpur)
  const vUser4 = await prisma.user.create({
    data: { name: 'Bhagalpur Handloom Traders', email: 'bhagalpursilk@setu.local', passwordHash: vendorPasswordHash, role: 'VENDOR', phone: '+919102045678', emailVerified: true }
  });
  const v4 = await prisma.vendor.create({
    data: { userId: vUser4.id, businessName: 'Bhagalpur Silk Handloom Traders', description: 'Wholesale & retail pure Katia and Eri silk apparel direct from weaver cooperatives.', businessType: 'Local Crafts & Products', phone: '+919102045678', email: 'sales@bhagalpursilk.co.in', address: 'Station Road Silk Bazaar', city: 'Bhagalpur', district: 'Bhagalpur', latitude: 25.2480, longitude: 87.0190, status: 'APPROVED' }
  });
  const v4Offering = await prisma.offering.create({
    data: { vendorId: v4.id, title: 'Pure Bhagalpuri Katia Silk Dupatta & Shawl', slug: 'bhagalpur-katia-silk-shawl', description: 'Soft textured handcrafted Katia silk wrap suitable for all festive occasions.', category: 'Handicrafts', price: 2100, duration: 'N/A', maxGuests: 1, location: 'Bhagalpur, Bihar', latitude: 25.2480, longitude: 87.0190, coverImage: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80', gallery: JSON.stringify(['https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80']), isActive: true }
  });

  // Vendor 5: Gaya Heritage Cab & Safari Services (Gaya)
  const vUser5 = await prisma.user.create({
    data: { name: 'Gaya Heritage Cabs', email: 'gayacabs@setu.local', passwordHash: vendorPasswordHash, role: 'VENDOR', phone: '+919934056789', emailVerified: true }
  });
  const v5 = await prisma.vendor.create({
    data: { userId: vUser5.id, businessName: 'Gaya Heritage Cab & Safari Services', description: 'Reliable AC taxi service for Bodh Gaya, Vishnupad Temple, Dungeshwari Caves, and Nalanda tours.', businessType: 'Transport & Eco Tours', phone: '+919934056789', email: 'booking@gayacabs.in', address: 'Railway Station Taxi Stand', city: 'Gaya', district: 'Gaya', latitude: 24.7914, longitude: 85.0002, status: 'APPROVED' }
  });
  const v5Offering = await prisma.offering.create({
    data: { vendorId: v5.id, title: 'Bodh Gaya & Pind Daan Full-Day Cab Rental', slug: 'gaya-full-day-cab', description: 'Chauffeur-driven sedan for full day sightseeing across Gaya and Bodh Gaya pilgrimage sites.', category: 'Transportation', price: 2500, duration: '10 Hours', maxGuests: 4, location: 'Gaya & Bodh Gaya', latitude: 24.7914, longitude: 85.0002, coverImage: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80', gallery: JSON.stringify(['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80']), isActive: true }
  });

  // Vendor 6: Bodhgaya Serenity Eco-Resort (Gaya)
  const vUser6 = await prisma.user.create({
    data: { name: 'Bodhgaya Serenity Eco Resort', email: 'bodhgayaresort@setu.local', passwordHash: vendorPasswordHash, role: 'VENDOR', phone: '+919572067890', emailVerified: true }
  });
  const v6 = await prisma.vendor.create({
    data: { userId: vUser6.id, businessName: 'Bodhgaya Serenity Eco-Resort', description: 'Peaceful luxury eco-resort surrounded by lush greenery, minutes away from Mahabodhi Temple.', businessType: 'Hotels & Homestays', phone: '+919572067890', email: 'stay@bodhgayaserenity.com', address: 'Node 1, Sujata Bypass Road', city: 'Bodh Gaya', district: 'Gaya', latitude: 24.6920, longitude: 84.9980, status: 'APPROVED' }
  });
  const v6Offering = await prisma.offering.create({
    data: { vendorId: v6.id, title: 'Meditation Cottage Stay & Organic Meal Package', slug: 'bodhgaya-resort-cottage-stay', description: 'Includes serene garden cottage, morning meditation session, and organic vegetarian meals.', category: 'Accommodation', price: 3900, duration: '1 Night', maxGuests: 2, location: 'Bodh Gaya, Bihar', latitude: 24.6920, longitude: 84.9980, coverImage: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80', gallery: JSON.stringify(['https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80']), isActive: true }
  });

  // Vendor 7: Rajgir Nature Safari Eco Transport (Nalanda)
  const vUser7 = await prisma.user.create({
    data: { name: 'Rajgir Eco Transport', email: 'rajgirecotransport@setu.local', passwordHash: vendorPasswordHash, role: 'VENDOR', phone: '+919304078901', emailVerified: true }
  });
  const v7 = await prisma.vendor.create({
    data: { userId: vUser7.id, businessName: 'Rajgir Nature Safari Eco Transport', description: 'Electric vehicle shuttle and guided safari tours for Rajgir Glass Skywalk, Ghora Katora Lake, and Vishwa Shanti Stupa.', businessType: 'Transport & Eco Tours', phone: '+919304078901', email: 'tours@rajgirecotransport.in', address: 'Near Ropeway Complex', city: 'Rajgir', district: 'Nalanda', latitude: 25.0300, longitude: 85.4200, status: 'APPROVED' }
  });
  const v7Offering = await prisma.offering.create({
    data: { vendorId: v7.id, title: 'Rajgir Glass Skywalk & Zoo Safari Shuttle', slug: 'rajgir-skywalk-safari-shuttle', description: 'Priority EV shuttle transfer with ticket assistance for Nature Safari and Glass Skywalk.', category: 'Guided Tour', price: 1200, duration: '5 Hours', maxGuests: 6, location: 'Rajgir, Bihar', latitude: 25.0300, longitude: 85.4200, coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80', gallery: JSON.stringify(['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80']), isActive: true }
  });

  // Vendor 8: Nalanda Heritage Craft Workshop (Nalanda)
  const vUser8 = await prisma.user.create({
    data: { name: 'Nalanda Heritage Crafts', email: 'nalandacrafts@setu.local', passwordHash: vendorPasswordHash, role: 'VENDOR', phone: '+919835189012', emailVerified: true }
  });
  const v8 = await prisma.vendor.create({
    data: { userId: vUser8.id, businessName: 'Nalanda Heritage Craft Workshop', description: 'Artisanal stone, terracotta, and bronze miniature sculpture souvenirs inspired by ancient Nalanda seals and stupas.', businessType: 'Local Crafts & Products', phone: '+919835189012', email: 'heritage@nalandacrafts.org', address: 'Nalanda Ruins Main Gate Plaza', city: 'Nalanda', district: 'Nalanda', latitude: 25.1357, longitude: 85.4439, status: 'APPROVED' }
  });
  const v8Offering = await prisma.offering.create({
    data: { vendorId: v8.id, title: 'Terracotta & Stone Carving Replica Souvenir', slug: 'nalanda-terracotta-replica', description: 'Handcrafted replica of 5th century Nalanda University monastic seals and Buddha motifs.', category: 'Handicrafts', price: 850, duration: 'N/A', maxGuests: 1, location: 'Nalanda, Bihar', latitude: 25.1357, longitude: 85.4439, coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80', gallery: JSON.stringify(['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80']), isActive: true }
  });

  // Vendor 9: Madhubani Folk Artists Collective (Madhubani)
  const vUser9 = await prisma.user.create({
    data: { name: 'Madhubani Artists Collective', email: 'madhubanifiolkart@setu.local', passwordHash: vendorPasswordHash, role: 'VENDOR', phone: '+919431290123', emailVerified: true }
  });
  const v9 = await prisma.vendor.create({
    data: { userId: vUser9.id, businessName: 'Madhubani Folk Artists Collective', description: 'State and National award-winning Madhubani artisans selling authentic handmade canvas, silk wall hangings, and paper art.', businessType: 'Local Crafts & Products', phone: '+919431290123', email: 'contact@madhubaniartisans.org', address: 'Jitwarpur Craft Village', city: 'Madhubani', district: 'Madhubani', latitude: 26.3533, longitude: 86.0719, status: 'APPROVED' }
  });
  const v9Offering = await prisma.offering.create({
    data: { vendorId: v9.id, title: 'Authentic Handmade Madhubani Painting Canvas', slug: 'original-madhubani-canvas-art', description: 'Handmade canvas painted with natural mineral pigments depicting Mithila folklore and Kohbar art.', category: 'Art & Collectibles', price: 2900, duration: 'N/A', maxGuests: 1, location: 'Madhubani, Bihar', latitude: 26.3533, longitude: 86.0719, coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80', gallery: JSON.stringify(['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80']), isActive: true }
  });

  // Vendor 10: Mithila Makhana & Gourmet Hub (Madhubani)
  const vUser10 = await prisma.user.create({
    data: { name: 'Mithila Makhana Hub', email: 'mithilamakhana@setu.local', passwordHash: vendorPasswordHash, role: 'VENDOR', phone: '+919771301234', emailVerified: true }
  });
  const v10 = await prisma.vendor.create({
    data: { userId: vUser10.id, businessName: 'Mithila Makhana & Gourmet Hub', description: 'GI-tagged Mithila Makhana processor selling organic pop makhana, flavored snacks, and raw lotus seeds.', businessType: 'Local Crafts & Products', phone: '+919771301234', email: 'orders@mithilamakhana.in', address: 'Station Road Market', city: 'Madhubani', district: 'Madhubani', latitude: 26.3600, longitude: 86.0800, status: 'APPROVED' }
  });
  const v10Offering = await prisma.offering.create({
    data: { vendorId: v10.id, title: 'Premium Roasted Mithila Makhana Variety Gift Box', slug: 'mithila-makhana-gift-box', description: 'Assorted flavors (Peri Peri, Himalayan Pink Salt, Pudina) of GI-tagged Mithila Makhana.', category: 'Gourmet Food', price: 750, duration: 'N/A', maxGuests: 1, location: 'Madhubani, Bihar', latitude: 26.3600, longitude: 86.0800, coverImage: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80', gallery: JSON.stringify(['https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=800&q=80']), isActive: true }
  });

  // Vendor 11: Muzaffarpur Shahi Litchi Express & Agro Tours (Muzaffarpur)
  const vUser11 = await prisma.user.create({
    data: { name: 'Muzaffarpur Shahi Litchi Tours', email: 'muzaffarpurlitchi@setu.local', passwordHash: vendorPasswordHash, role: 'VENDOR', phone: '+919102412345', emailVerified: true }
  });
  const v11 = await prisma.vendor.create({
    data: { userId: vUser11.id, businessName: 'Muzaffarpur Shahi Litchi Express & Agro Tours', description: 'Agro-tourism farm tours during litchi harvest season, fresh litchi fruit boxes, and litchi honey.', businessType: 'Transport & Eco Tours', phone: '+919102412345', email: 'agro@muzaffarpurlitchi.com', address: 'Orchard Road, Mushahari', city: 'Muzaffarpur', district: 'Muzaffarpur', latitude: 26.1209, longitude: 85.3647, status: 'APPROVED' }
  });
  const v11Offering = await prisma.offering.create({
    data: { vendorId: v11.id, title: 'Seasonal Shahi Litchi Orchard Tour & Tasting', slug: 'shahi-litchi-orchard-tour', description: 'Guided orchard walk, fresh litchi plucking experience, and complimentary 2kg Shahi Litchi basket.', category: 'Agro Tourism', price: 990, duration: '3 Hours', maxGuests: 6, location: 'Muzaffarpur, Bihar', latitude: 26.1209, longitude: 85.3647, coverImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80', gallery: JSON.stringify(['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80']), isActive: true }
  });

  // Vendor 12: Litchi City Travelers & Taxi Rental (Muzaffarpur)
  const vUser12 = await prisma.user.create({
    data: { name: 'Litchi City Travelers', email: 'litchicitycabs@setu.local', passwordHash: vendorPasswordHash, role: 'VENDOR', phone: '+919934523456', emailVerified: true }
  });
  const v12 = await prisma.vendor.create({
    data: { userId: vUser12.id, businessName: 'Litchi City Travelers & Taxi Rental', description: 'Intercity and regional cab booking serving Muzaffarpur, Sitamarhi, Vaishali, and Darbhanga.', businessType: 'Transport & Eco Tours', phone: '+919934523456', email: 'ride@litchicitycabs.in', address: 'Junction Roundabout', city: 'Muzaffarpur', district: 'Muzaffarpur', latitude: 26.1220, longitude: 85.3700, status: 'APPROVED' }
  });
  const v12Offering = await prisma.offering.create({
    data: { vendorId: v12.id, title: 'Muzaffarpur to Vaishali Historical Taxi Circuit', slug: 'muzaffarpur-vaishali-taxi-circuit', description: 'Comfortable AC Sedan service covering Ashokan Pillar, Relic Stupa, and World Peace Pagoda.', category: 'Transportation', price: 2200, duration: '6 Hours', maxGuests: 4, location: 'Muzaffarpur & Vaishali', latitude: 26.1220, longitude: 85.3700, coverImage: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80', gallery: JSON.stringify(['https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80']), isActive: true }
  });

  // Vendor 13: Munger Fort View Retreat (Munger)
  const vUser13 = await prisma.user.create({
    data: { name: 'Munger Fort View Retreat', email: 'mungerfortview@setu.local', passwordHash: vendorPasswordHash, role: 'VENDOR', phone: '+919572634567', emailVerified: true }
  });
  const v13 = await prisma.vendor.create({
    data: { userId: vUser13.id, businessName: 'Munger Fort View Retreat', description: 'Heritage hotel inside historic Munger Fort overlooking the Ganges and Bihar School of Yoga.', businessType: 'Hotels & Homestays', phone: '+919572634567', email: 'booking@mungerfortview.com', address: 'Fort Campus, Near Ganga Ghat', city: 'Munger', district: 'Munger', latitude: 25.3748, longitude: 86.4735, status: 'APPROVED' }
  });
  const v13Offering = await prisma.offering.create({
    data: { vendorId: v13.id, title: 'Ganges Riverview Suite & Heritage Walk', slug: 'munger-fort-ganges-suite', description: 'Includes river-facing room, heritage fort walk, and evening sunset Ganges boat ride.', category: 'Accommodation', price: 3200, duration: '1 Night', maxGuests: 2, location: 'Munger, Bihar', latitude: 25.3748, longitude: 86.4735, coverImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', gallery: JSON.stringify(['https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80']), isActive: true }
  });

  // Vendor 14: Yoga Nagari Wellness & Dining (Munger)
  const vUser14 = await prisma.user.create({
    data: { name: 'Yoga Nagari Wellness', email: 'yoganagari@setu.local', passwordHash: vendorPasswordHash, role: 'VENDOR', phone: '+919304745678', emailVerified: true }
  });
  const v14 = await prisma.vendor.create({
    data: { userId: vUser14.id, businessName: 'Yoga Nagari Wellness & Dining', description: 'Ayurvedic wellness center and pure vegetarian organic restaurant near Munger Yoga Ashram.', businessType: 'Restaurants & Culinary', phone: '+919304745678', email: 'wellness@yoganagari.in', address: 'Bihar School of Yoga Road', city: 'Munger', district: 'Munger', latitude: 25.3800, longitude: 86.4700, status: 'APPROVED' }
  });
  const v14Offering = await prisma.offering.create({
    data: { vendorId: v14.id, title: 'Sattvic Ayurvedic Meal & Yoga Session Package', slug: 'munger-ayurvedic-yoga-package', description: '1-hour yoga session followed by freshly prepared Sattvic organic lunch.', category: 'Wellness & Food', price: 1100, duration: '3 Hours', maxGuests: 10, location: 'Munger, Bihar', latitude: 25.3800, longitude: 86.4700, coverImage: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80', gallery: JSON.stringify(['https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80']), isActive: true }
  });

  // Vendor 15: Saran River Cruise & Boating Services (Saran)
  const vUser15 = await prisma.user.create({
    data: { name: 'Saran River Cruise', email: 'saranrivercruise@setu.local', passwordHash: vendorPasswordHash, role: 'VENDOR', phone: '+919835856789', emailVerified: true }
  });
  const v15 = await prisma.vendor.create({
    data: { userId: vUser15.id, businessName: 'Saran River Cruise & Boating Services', description: 'Scenic river cruises along Ganges-Gandak confluence at Sonepur and Chhapra ghats.', businessType: 'Transport & Eco Tours', phone: '+919835856789', email: 'info@sarancruise.in', address: 'Sonepur Sangam Ghat', city: 'Chhapra / Sonepur', district: 'Saran', latitude: 25.7848, longitude: 84.7274, status: 'APPROVED' }
  });
  const v15Offering = await prisma.offering.create({
    data: { vendorId: v15.id, title: 'Sonepur Sangam Ganges River Boat Cruise', slug: 'sonepur-sangam-river-cruise', description: '2-hour motorboat cruise with tea, snacks, and sunset views over the river confluence.', category: 'River Tourism', price: 1500, duration: '2 Hours', maxGuests: 8, location: 'Sonepur / Chhapra, Saran', latitude: 25.7848, longitude: 84.7274, coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80', gallery: JSON.stringify(['https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80']), isActive: true }
  });

  // Vendor 16: Chhapra Heritage Pottery & Crafts (Saran)
  const vUser16 = await prisma.user.create({
    data: { name: 'Chhapra Heritage Crafts', email: 'chhapracrafts@setu.local', passwordHash: vendorPasswordHash, role: 'VENDOR', phone: '+919431967890', emailVerified: true }
  });
  const v16 = await prisma.vendor.create({
    data: { userId: vUser16.id, businessName: 'Chhapra Heritage Pottery & Crafts', description: 'Traditional clay potters crafting eco-friendly terracotta lamps, earthen cookware, and decorative artifacts.', businessType: 'Local Crafts & Products', phone: '+919431967890', email: 'pottery@chhapracrafts.org', address: 'Municipal Bazaar', city: 'Chhapra', district: 'Saran', latitude: 25.7800, longitude: 84.7300, status: 'APPROVED' }
  });
  const v16Offering = await prisma.offering.create({
    data: { vendorId: v16.id, title: 'Traditional Clay Terracotta Diyas & Sculptures', slug: 'chhapra-terracotta-handicrafts', description: 'Eco-friendly handmade terracotta lamps and traditional clay artifacts.', category: 'Handicrafts', price: 550, duration: 'N/A', maxGuests: 1, location: 'Chhapra, Saran', latitude: 25.7800, longitude: 84.7300, coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80', gallery: JSON.stringify(['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80']), isActive: true }
  });

  // Vendor 17: Kaimur Eco Wildlife Safaris (Rohtas)
  const vUser17 = await prisma.user.create({
    data: { name: 'Kaimur Eco Safaris', email: 'kaimursafari@setu.local', passwordHash: vendorPasswordHash, role: 'VENDOR', phone: '+919771078901', emailVerified: true }
  });
  const v17 = await prisma.vendor.create({
    data: { userId: vUser17.id, businessName: 'Kaimur Eco Wildlife Safaris', description: 'Guided trekking and jeep safaris to Tutla Bhawani Waterfall, Rohtasgarh Fort, and Kaimur Wildlife Sanctuary.', businessType: 'Transport & Eco Tours', phone: '+919771078901', email: 'safari@kaimureco.in', address: 'Kaimur Hills Base Camp', city: 'Sasaram', district: 'Rohtas', latitude: 24.9500, longitude: 84.0167, status: 'APPROVED' }
  });
  const v17Offering = await prisma.offering.create({
    data: { vendorId: v17.id, title: 'Tutla Bhawani Waterfalls & Kaimur Trekking Safari', slug: 'tutla-bhawani-kaimur-safari', description: 'Full-day eco excursion with jungle trekking, waterfall dip, and Sher Shah Tomb visit.', category: 'Eco & Adventure', price: 1750, duration: '8 Hours', maxGuests: 6, location: 'Rohtas, Bihar', latitude: 24.9500, longitude: 84.0167, coverImage: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?auto=format&fit=crop&w=800&q=80', gallery: JSON.stringify(['https://images.unsplash.com/photo-1511497584788-8767611136f6?auto=format&fit=crop&w=800&q=80']), isActive: true }
  });

  // Vendor 18: Darbhanga Raj Culinary & Mithila Thali (Darbhanga)
  const vUser18 = await prisma.user.create({
    data: { name: 'Darbhanga Raj Culinary', email: 'darbhangarajrasoi@setu.local', passwordHash: vendorPasswordHash, role: 'VENDOR', phone: '+919102189012', emailVerified: true }
  });
  const v18 = await prisma.vendor.create({
    data: { userId: vUser18.id, businessName: 'Darbhanga Raj Culinary & Mithila Thali', description: 'Authentic Maithil royal recipes featuring Rohu fish curry, Makhana Kheer, and traditional sweets.', businessType: 'Restaurants & Culinary', phone: '+919102189012', email: 'thali@darbhangaraj.in', address: 'Tower Chowk', city: 'Darbhanga', district: 'Darbhanga', latitude: 26.1542, longitude: 85.8918, status: 'APPROVED' }
  });
  const v18Offering = await prisma.offering.create({
    data: {
      vendorId: v18.id,
      title: 'Grand Mithila Fish Curry & Makhana Kheer Thali',
      slug: 'darbhanga-mithila-royal-thali',
      description: 'Royal thali platter with traditional spices, mustard fish, lotus seed kheer, and sattu drink.',
      category: 'Culinary Experience',
      price: 650,
      duration: '2 Hours',
      maxGuests: 4,
      location: 'Darbhanga, Bihar',
      latitude: 26.1542,
      longitude: 85.8918,
      coverImage: '/images/Grand Mithila Fish Curry & Makhana Kheer Thali (2).jpeg',
      gallery: JSON.stringify([
        '/images/Grand Mithila Fish Curry & Makhana Kheer Thali (1).jpeg',
        '/images/Grand Mithila Fish Curry & Makhana Kheer Thali (2).jpeg',
        '/images/Grand Mithila Fish Curry & Makhana Kheer Thali (3).jpeg',
        '/images/Grand Mithila Fish Curry & Makhana Kheer Thali (4).jpeg'
      ]),
      isActive: true
    }
  });

  // 12. Additional Customer/Tourist Entries with Favorites & Booking History
  console.log('🌱 Seeding 18 additional tourist/customer entries with interest & booking history...');

  const tData = [
    { name: 'Rahul Verma', email: 'rahul.verma@setu.local', phone: '+919811223344', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', offering: offering1, vendor: demoVendor, fav: mahabodhiDest, amt: 3700, status: 'CONFIRMED' },
    { name: 'Priya Mukherjee', email: 'priya.m@setu.local', phone: '+919830112233', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', offering: v3Offering, vendor: v3, fav: madhubaniDest, amt: 3800, status: 'CONFIRMED' },
    { name: 'Aarav Patel', email: 'aarav.patel@setu.local', phone: '+919825099887', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', offering: v17Offering, vendor: v17, fav: valmikiDest, amt: 1750, status: 'COMPLETED' },
    { name: 'Siddharth Rao', email: 'siddharth.rao@setu.local', phone: '+919845011223', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', offering: offering2, vendor: demoVendor, fav: nalandaDest, amt: 3499, status: 'CONFIRMED' },
    { name: 'Kavya Nair', email: 'kavya.nair@setu.local', phone: '+919847022334', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', offering: offering3, vendor: demoVendor, fav: madhubaniDest, amt: 2200, status: 'CONFIRMED' },
    { name: 'Rohan Deshmukh', email: 'rohan.d@setu.local', phone: '+919820033445', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80', offering: v7Offering, vendor: v7, fav: rajgirDest, amt: 1200, status: 'CONFIRMED' },
    { name: 'Meera Iyer', email: 'meera.iyer@setu.local', phone: '+919840044556', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', offering: offering1, vendor: demoVendor, fav: mahabodhiDest, amt: 1850, status: 'COMPLETED' },
    { name: 'Sneha Gupta', email: 'sneha.gupta@setu.local', phone: '+919415055667', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', offering: v2Offering, vendor: v2, fav: patnaSahibDest, amt: 900, status: 'COMPLETED' },
    { name: 'Vikram Singh', email: 'vikram.singh@setu.local', phone: '+919414066778', avatar: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', offering: v13Offering, vendor: v13, fav: sherShahDest, amt: 3200, status: 'CONFIRMED' },
    { name: 'Tenzin Norbu', email: 'tenzin.norbu@setu.local', phone: '+919816077889', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', offering: offering1, vendor: demoVendor, fav: mahabodhiDest, amt: 1850, status: 'CONFIRMED' },
    { name: 'John Doe Miller', email: 'john.miller@setu.local', phone: '+14155550123', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', offering: offering2, vendor: demoVendor, fav: nalandaDest, amt: 6998, status: 'CONFIRMED' },
    { name: 'Elena Rostova', email: 'elena.rostova@setu.local', phone: '+79165550144', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', offering: v9Offering, vendor: v9, fav: madhubaniDest, amt: 2900, status: 'CONFIRMED' },
    { name: 'Kenji Sato', email: 'kenji.sato@setu.local', phone: '+81905550155', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', offering: offering1, vendor: demoVendor, fav: mahabodhiDest, amt: 1850, status: 'COMPLETED' },
    { name: 'Amrita Roy', email: 'amrita.roy@setu.local', phone: '+919435088990', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80', offering: v17Offering, vendor: v17, fav: valmikiDest, amt: 1750, status: 'CONFIRMED' },
    { name: 'Sunil Kumar Thakur', email: 'sunil.thakur@setu.local', phone: '+919431099001', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80', offering: v5Offering, vendor: v5, fav: mahabodhiDest, amt: 2500, status: 'COMPLETED' },
    { name: 'Pooja Saxena', email: 'pooja.saxena@setu.local', phone: '+919814010112', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80', offering: v9Offering, vendor: v9, fav: madhubaniDest, amt: 2900, status: 'CONFIRMED' },
    { name: 'Rajesh Kumar Sinha', email: 'rajesh.sinha@setu.local', phone: '+919431011223', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', offering: v18Offering, vendor: v18, fav: patnaSahibDest, amt: 1300, status: 'COMPLETED' },
    { name: 'Sophie Dubois', email: 'sophie.dubois@setu.local', phone: '+33612345678', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', offering: v4Offering, vendor: v4, fav: madhubaniDest, amt: 2100, status: 'CONFIRMED' }
  ];

  for (let idx = 0; idx < tData.length; idx++) {
    const item = tData[idx];
    const tUserData = {
      name: item.name,
      email: item.email,
      passwordHash: touristPasswordHash,
      role: 'TOURIST',
      avatar: item.avatar,
      phone: item.phone,
      emailVerified: true
    };
    const tUser = await prisma.user.upsert({
      where: { email: item.email },
      update: tUserData,
      create: tUserData
    });

    if (item.fav) {
      await prisma.favorite.create({
        data: {
          userId: tUser.id,
          destinationId: item.fav.id
        }
      });
    }

    if (item.offering && item.vendor) {
      await prisma.order.create({
        data: {
          orderNumber: `SETU-2026-${9000 + idx}`,
          userId: tUser.id,
          vendorId: item.vendor.id,
          offeringId: item.offering.id,
          quantity: 1,
          bookingDate: new Date(`2026-10-${10 + (idx % 15)}T10:00:00.000Z`),
          amount: item.amt,
          currency: 'INR',
          paymentStatus: 'PAID',
          orderStatus: item.status,
          razorpayOrderId: `order_test_${idx + 100}`,
          razorpayPaymentId: `pay_test_${idx + 100}`,
          razorpaySignature: `sig_valid_test_${idx + 100}`,
          notes: 'Seeded sample tourist booking.'
        }
      });
    }
  }

  // 13. Seed City Hubs (8 Locations)
  console.log('🌱 Seeding 8 City Hub locations...');
  await prisma.cityHub.deleteMany();

  const cityHubsData = [
    {
      name: 'PATNA',
      slug: 'patna',
      region: 'Capital',
      latitude: 25.5941,
      longitude: 85.1376,
      heroImage: '/images/patna (2).jpg',
      summary: 'Tourism + hospitals + hotels + education + business + transport',
      verdict: 'Best overall location of the eight',
      overallScore: 9.5,
      tourismRating: 4.0,
      hospitalRating: 5.0,
      hotelRating: 5.0,
      businessRating: 5.0,
      educationRating: 5.0,
      infrastructureRating: 5.0,
      touristPlaces: JSON.stringify([
        { name: 'Takhat Shri Harimandir Ji Patna Sahib', type: 'Temple', latitude: 25.6022, longitude: 85.2281 },
        { name: 'Golghar', type: 'Tourist Place', latitude: 25.6174, longitude: 85.1437 },
        { name: 'Buddha Smriti Park', type: 'Tourist Place', latitude: 25.6083, longitude: 85.1368 },
        { name: 'Sanjay Gandhi Biological Park', type: 'Tourist Place', latitude: 25.6000, longitude: 85.0933 },
        { name: 'Patna Museum', type: 'Tourist Place', latitude: 25.6094, longitude: 85.1322 },
        { name: 'Bihar Museum', type: 'Tourist Place', latitude: 25.6074, longitude: 85.1147 },
        { name: 'Shrikrishna Science Centre', type: 'Tourist Place', latitude: 25.6155, longitude: 85.1420 },
        { name: 'Gandhi Maidan', type: 'Tourist Place', latitude: 25.6150, longitude: 85.1440 },
        { name: 'Gandhi Ghat', type: 'Tourist Place', latitude: 25.6208, longitude: 85.1726 },
        { name: 'ISKCON Temple Patna', type: 'Temple', latitude: 25.6075, longitude: 85.1325 },
        { name: 'Kumhrar', type: 'Tourist Place', latitude: 25.5945, longitude: 85.1795 },
        { name: 'Agam Kuan', type: 'Tourist Place', latitude: 25.5958, longitude: 85.1956 },
        { name: 'Mahavir Mandir', type: 'Temple', latitude: 25.6050, longitude: 85.1370 },
        { name: 'Patna Planetarium', type: 'Tourist Place', latitude: 25.6080, longitude: 85.1350 },
        { name: 'Padri Ki Haveli', type: 'Tourist Place', latitude: 25.6044, longitude: 85.2133 },
        { name: 'Khuda Bakhsh Oriental Library', type: 'Tourist Place', latitude: 25.6186, longitude: 85.1472 },
        { name: 'Sabhyata Dwar', type: 'Tourist Place', latitude: 25.6190, longitude: 85.1415 },
        { name: 'JP Ganga Path', type: 'Tourist Place', latitude: 25.6220, longitude: 85.1550 },
        { name: 'Maner Sharif', type: 'Temple', latitude: 25.6480, longitude: 84.8860 },
        { name: 'AIIMS Patna', type: 'Hospital', latitude: 25.5606, longitude: 85.0487 },
        { name: 'IGIMS', type: 'Hospital', latitude: 25.6120, longitude: 85.0880 },
        { name: 'Jay Prabha Medanta Super Specialty Hospital', type: 'Hospital', latitude: 25.5860, longitude: 85.1580 },
        { name: 'PMCH', type: 'Hospital', latitude: 25.6200, longitude: 85.1520 },
        { name: 'NMCH', type: 'Hospital', latitude: 25.5980, longitude: 85.1920 },
        { name: 'Paras HMRI Hospital', type: 'Hospital', latitude: 25.6140, longitude: 85.0820 },
        { name: 'Ruban Memorial Hospital', type: 'Hospital', latitude: 25.6030, longitude: 85.1180 },
        { name: 'Lemon Tree Premier Patna', type: 'Hotel', latitude: 25.6160, longitude: 85.1410 },
        { name: 'Hotel The Panache', type: 'Hotel', latitude: 25.6145, longitude: 85.1430 },
        { name: 'Hotel Chanakya', type: 'Hotel', latitude: 25.6060, longitude: 85.1360 },
        { name: 'Hotel Maurya', type: 'Hotel', latitude: 25.6140, longitude: 85.1440 },
        { name: 'Taj City Centre Patna', type: 'Hotel', latitude: 25.6070, longitude: 85.1200 },
        { name: 'Hotel Patliputra Continental', type: 'Hotel', latitude: 25.6010, longitude: 85.0920 },
        { name: 'Hotel Gargee Grand', type: 'Hotel', latitude: 25.6120, longitude: 85.1390 },
        { name: 'Ginger Patna', type: 'Hotel', latitude: 25.6150, longitude: 85.1400 },
        { name: 'Patliputra Exotica', type: 'Hotel', latitude: 25.6140, longitude: 85.1420 },
        { name: 'VijayaTej Clarks Inn', type: 'Hotel', latitude: 25.6080, longitude: 85.0980 }
      ])
    },
    {
      name: 'BHAGALPUR',
      slug: 'bhagalpur',
      region: 'Eastern Bihar',
      latitude: 25.2425,
      longitude: 87.0124,
      heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      summary: 'Heritage + silk industry + Ganga + education + relatively less congested living',
      verdict: 'Excellent if you want heritage + a developing city without Patna-level congestion',
      overallScore: 8.0,
      tourismRating: 4.0,
      hospitalRating: 4.0,
      hotelRating: 3.0,
      businessRating: 4.0,
      educationRating: 4.0,
      infrastructureRating: 4.0,
      touristPlaces: JSON.stringify([
        { name: 'Vikramshila Ruins', type: 'Tourist Place', latitude: 25.3250, longitude: 87.2750 },
        { name: 'Mandar Hill', type: 'Tourist Place', latitude: 24.8450, longitude: 87.0320 },
        { name: 'Vikramshila Dolphin Sanctuary', type: 'Tourist Place', latitude: 25.2600, longitude: 87.0200 },
        { name: 'Vikramshila University', type: 'Tourist Place', latitude: 25.3260, longitude: 87.2760 },
        { name: 'Ajgaibinath Temple', type: 'Temple', latitude: 25.2910, longitude: 86.7380 },
        { name: 'Sultanganj', type: 'Tourist Place', latitude: 25.2890, longitude: 86.7350 },
        { name: 'Colganj Rock Cut Temples', type: 'Temple', latitude: 25.2600, longitude: 87.2200 },
        { name: 'Kuppa Ghat', type: 'Tourist Place', latitude: 25.2530, longitude: 86.9950 },
        { name: 'JLNMCH (Jawaharlal Nehru Medical College)', type: 'Hospital', latitude: 25.2480, longitude: 87.0080 },
        { name: 'Mayaganj Hospital', type: 'Hospital', latitude: 25.2490, longitude: 87.0090 },
        { name: 'District/Sadar Hospital Bhagalpur', type: 'Hospital', latitude: 25.2410, longitude: 86.9850 },
        { name: 'Hotel Rajhans International', type: 'Hotel', latitude: 25.2450, longitude: 86.9810 },
        { name: 'Hotel Nihar', type: 'Hotel', latitude: 25.2430, longitude: 86.9790 },
        { name: 'Hotel Sriyash Regency', type: 'Hotel', latitude: 25.2440, longitude: 86.9820 },
        { name: 'Hotel Atithi', type: 'Hotel', latitude: 25.2420, longitude: 86.9800 }
      ])
    },
    {
      name: 'MUZAFFARPUR',
      slug: 'muzaffarpur',
      region: 'North Bihar',
      latitude: 26.1209,
      longitude: 85.3647,
      heroImage: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
      summary: 'Business + trade + food/agriculture + education + North Bihar connectivity',
      verdict: 'One of the better choices if your priority is business and North Bihar connectivity',
      overallScore: 8.0,
      tourismRating: 3.0,
      hospitalRating: 4.0,
      hotelRating: 4.0,
      businessRating: 5.0,
      educationRating: 4.0,
      infrastructureRating: 4.0,
      touristPlaces: JSON.stringify([
        { name: 'Garib Sthan Mandir', type: 'Temple', latitude: 26.1220, longitude: 85.3850 },
        { name: 'Jubba Sahni Park', type: 'Tourist Place', latitude: 26.1180, longitude: 85.3720 },
        { name: 'Ramna Devi Temple', type: 'Temple', latitude: 26.1230, longitude: 85.3680 },
        { name: 'Baba Garib Nath Temple', type: 'Temple', latitude: 26.1215, longitude: 85.3855 },
        { name: 'Company Bagh', type: 'Tourist Place', latitude: 26.1250, longitude: 85.3620 },
        { name: 'Litchi gardens', type: 'Tourist Place', latitude: 26.1400, longitude: 85.3900 },
        { name: 'Chandwara', type: 'Tourist Place', latitude: 26.1300, longitude: 85.3550 },
        { name: 'Kali Bari', type: 'Temple', latitude: 26.1190, longitude: 85.3660 },
        { name: 'Sikandarpur sports/recreation area', type: 'Tourist Place', latitude: 26.1320, longitude: 85.3780 },
        { name: 'SKMCH (Sri Krishna Medical College & Hospital)', type: 'Hospital', latitude: 26.1650, longitude: 85.3850 },
        { name: 'District/Sadar Hospital', type: 'Hospital', latitude: 26.1190, longitude: 85.3610 },
        { name: 'Prabhat Tara Hospital', type: 'Hospital', latitude: 26.1240, longitude: 85.3700 },
        { name: 'The Royal Phular', type: 'Hotel', latitude: 26.1170, longitude: 85.3750 },
        { name: 'Hotel RK Residency', type: 'Hotel', latitude: 26.1200, longitude: 85.3660 },
        { name: 'Hotel Embassy International', type: 'Hotel', latitude: 26.1210, longitude: 85.3640 },
        { name: 'JJK Rukmini Vilas Hotel & Banquet', type: 'Hotel', latitude: 26.1160, longitude: 85.3720 },
        { name: 'The Mantis', type: 'Hotel', latitude: 26.1180, longitude: 85.3740 },
        { name: 'Hotel Shivam Inn', type: 'Hotel', latitude: 26.1200, longitude: 85.3670 },
        { name: 'Hotel Five Star Inn', type: 'Hotel', latitude: 26.1220, longitude: 85.3630 },
        { name: 'Hotel Atithi', type: 'Hotel', latitude: 26.1210, longitude: 85.3650 },
        { name: 'The Jamun Tree', type: 'Hotel', latitude: 26.1230, longitude: 85.3700 },
        { name: 'Green Mapple', type: 'Hotel', latitude: 26.1250, longitude: 85.3680 }
      ])
    },
    {
      name: 'DARBHANGA',
      slug: 'darbhanga',
      region: 'Mithila',
      latitude: 26.1542,
      longitude: 85.8918,
      heroImage: '/images/madhubani (2).jpg',
      summary: 'Education + healthcare + Mithila culture + North Bihar',
      verdict: 'Very good for education + healthcare + cultural importance',
      overallScore: 8.0,
      tourismRating: 4.0,
      hospitalRating: 4.0,
      hotelRating: 3.0,
      businessRating: 4.0,
      educationRating: 5.0,
      infrastructureRating: 4.0,
      touristPlaces: JSON.stringify([
        { name: 'Darbhanga Fort', type: 'Tourist Place', latitude: 26.1480, longitude: 85.8950 },
        { name: 'Shyama Mai Temple', type: 'Temple', latitude: 26.1420, longitude: 85.8960 },
        { name: 'Maharaja Lakshmishwar Singh Museum', type: 'Tourist Place', latitude: 26.1510, longitude: 85.8930 },
        { name: 'Chandradhari Museum', type: 'Tourist Place', latitude: 26.1520, longitude: 85.8920 },
        { name: 'Bela Palace', type: 'Tourist Place', latitude: 26.1650, longitude: 85.8980 },
        { name: 'Kankali Temple', type: 'Temple', latitude: 26.1460, longitude: 85.8940 },
        { name: 'Ahilya Asthan', type: 'Temple', latitude: 26.2450, longitude: 85.8620 },
        { name: 'Lalit Narayan Mithila University', type: 'Tourist Place', latitude: 26.1430, longitude: 85.8970 },
        { name: 'DMCH (Darbhanga Medical College & Hospital)', type: 'Hospital', latitude: 26.1580, longitude: 85.9020 },
        { name: 'District/Sadar Hospital', type: 'Hospital', latitude: 26.1520, longitude: 85.8900 },
        { name: 'Hotel Naveen Residency', type: 'Hotel', latitude: 26.1560, longitude: 85.8910 },
        { name: 'Hotel Ganga Regency', type: 'Hotel', latitude: 26.1550, longitude: 85.8920 },
        { name: 'Hotel Grand SM Regency', type: 'Hotel', latitude: 26.1540, longitude: 85.8930 },
        { name: 'Hotel Shivam International', type: 'Hotel', latitude: 26.1530, longitude: 85.8940 }
      ])
    },
    {
      name: 'GAYA / BODH GAYA',
      slug: 'gaya-bodhgaya',
      region: 'Buddhist Circuit',
      latitude: 24.7914,
      longitude: 85.0002,
      heroImage: '/images/gaya district (2).jpeg',
      summary: 'Religious tourism + international tourism + hotels + pilgrimage + healthcare',
      verdict: 'Best tourism location in the eight',
      overallScore: 9.0,
      tourismRating: 5.0,
      hospitalRating: 4.0,
      hotelRating: 5.0,
      businessRating: 4.0,
      educationRating: 4.0,
      infrastructureRating: 4.0,
      touristPlaces: JSON.stringify([
        { name: 'Mahabodhi Temple', type: 'Temple', latitude: 24.6961, longitude: 84.9914 },
        { name: 'Shri Vishnupad Temple', type: 'Temple', latitude: 24.7780, longitude: 85.0080 },
        { name: 'Bodhi Tree', type: 'Temple', latitude: 24.6960, longitude: 84.9915 },
        { name: 'Great Buddha Statue', type: 'Tourist Place', latitude: 24.6980, longitude: 84.9880 },
        { name: 'Thai Monastery', type: 'Temple', latitude: 24.6970, longitude: 84.9930 },
        { name: 'Japanese Temple', type: 'Temple', latitude: 24.6990, longitude: 84.9900 },
        { name: 'Chinese Temple', type: 'Temple', latitude: 24.6950, longitude: 84.9940 },
        { name: 'Tibetan Monastery', type: 'Temple', latitude: 24.6965, longitude: 84.9925 },
        { name: 'Royal Bhutan Monastery', type: 'Temple', latitude: 24.6945, longitude: 84.9935 },
        { name: 'Mangala Gauri Temple', type: 'Temple', latitude: 24.7810, longitude: 85.0040 },
        { name: 'Pretshila Hill', type: 'Tourist Place', latitude: 24.8450, longitude: 84.9850 },
        { name: 'Barabar Caves', type: 'Tourist Place', latitude: 25.0050, longitude: 85.0620 },
        { name: 'Muchalinda Lake', type: 'Tourist Place', latitude: 24.6940, longitude: 84.9900 },
        { name: 'Dungeshwari Caves', type: 'Tourist Place', latitude: 24.6990, longitude: 85.0850 },
        { name: 'Anugrah Narayan Magadh Medical College & Hospital', type: 'Hospital', latitude: 24.7750, longitude: 84.9750 },
        { name: 'Infectious Disease Hospital', type: 'Hospital', latitude: 24.7880, longitude: 84.9980 },
        { name: 'Jai Prakash Narayan Hospital', type: 'Hospital', latitude: 24.7920, longitude: 85.0020 },
        { name: 'Prabhavati Hospital', type: 'Hospital', latitude: 24.7940, longitude: 85.0050 },
        { name: 'Apollo Hospital', type: 'Hospital', latitude: 24.7900, longitude: 85.0010 },
        { name: 'The Royal Residency', type: 'Hotel', latitude: 24.7010, longitude: 84.9870 },
        { name: 'Bodh Gaya Regency', type: 'Hotel', latitude: 24.6975, longitude: 84.9890 },
        { name: 'Hotel Sujata', type: 'Hotel', latitude: 24.6955, longitude: 84.9885 },
        { name: 'Hotel Maya Heritage', type: 'Hotel', latitude: 24.6968, longitude: 84.9898 },
        { name: 'Hotel Sakura House', type: 'Hotel', latitude: 24.6995, longitude: 84.9865 }
      ])
    },
    {
      name: 'HAJIPUR / VAISHALI',
      slug: 'hajipur-vaishali',
      region: 'Vaishali',
      latitude: 25.6858,
      longitude: 85.2154,
      heroImage: '/images/Vaishali Ashoka Pillar & Relic Stupa(2).jpg',
      summary: 'Heritage + pilgrimage + proximity to Patna',
      verdict: 'Very good if you want to combine tourism with access to Patna',
      overallScore: 7.5,
      tourismRating: 4.0,
      hospitalRating: 3.0,
      hotelRating: 3.0,
      businessRating: 4.0,
      educationRating: 3.0,
      infrastructureRating: 4.0,
      touristPlaces: JSON.stringify([
        { name: 'Ashokan Pillar', type: 'Tourist Place', latitude: 25.9923, longitude: 85.1264 },
        { name: 'Vishwa Shanti Stupa', type: 'Temple', latitude: 25.9890, longitude: 85.1220 },
        { name: "Buddha's Relic Stupa", type: 'Temple', latitude: 25.9860, longitude: 85.1250 },
        { name: 'Kundalpur', type: 'Tourist Place', latitude: 25.9950, longitude: 85.1300 },
        { name: 'Bawan Pokhar Temple', type: 'Temple', latitude: 25.9910, longitude: 85.1280 },
        { name: 'Abhishek Pushkarini', type: 'Tourist Place', latitude: 25.9880, longitude: 85.1230 },
        { name: 'Chaumukhi Mahadev Temple', type: 'Temple', latitude: 25.9930, longitude: 85.1240 },
        { name: 'Vaishali Archaeological Museum', type: 'Tourist Place', latitude: 25.9900, longitude: 85.1260 },
        { name: 'Raja Vishal ka Garh', type: 'Tourist Place', latitude: 25.9850, longitude: 85.1280 },
        { name: 'Baraila Lake', type: 'Tourist Place', latitude: 25.7500, longitude: 85.3200 },
        { name: 'Konhara Ghat', type: 'Tourist Place', latitude: 25.6880, longitude: 85.2110 },
        { name: 'Sadar Hospital Hajipur', type: 'Hospital', latitude: 25.6860, longitude: 85.2170 },
        { name: 'Sub-Divisional Hospital Mahua', type: 'Hospital', latitude: 25.8200, longitude: 85.3900 },
        { name: 'Raj Palace', type: 'Hotel', latitude: 25.6840, longitude: 85.2160 },
        { name: 'Hotel Vaishali Residency', type: 'Hotel', latitude: 25.6850, longitude: 85.2180 }
      ])
    },
    {
      name: 'RAJGIR',
      slug: 'rajgir',
      region: 'Nalanda',
      latitude: 25.0300,
      longitude: 85.4200,
      heroImage: '/images/Rajgir Griddhakuta & Vishwa Shanti Stupa (2).jpeg',
      summary: 'Buddhist, Jain, Hindu, archaeological and adventure tourism',
      verdict: 'One of the strongest tourism-growth locations',
      overallScore: 8.0,
      tourismRating: 5.0,
      hospitalRating: 3.0,
      hotelRating: 4.0,
      businessRating: 3.0,
      educationRating: 3.0,
      infrastructureRating: 4.0,
      touristPlaces: JSON.stringify([
        { name: 'Vishwa Shanti Stupa', type: 'Temple', latitude: 25.0020, longitude: 85.4420 },
        { name: 'Glass Bridge', type: 'Tourist Place', latitude: 25.0050, longitude: 85.4520 },
        { name: 'Nature Safari', type: 'Tourist Place', latitude: 25.0070, longitude: 85.4500 },
        { name: 'Gridhakut Hill', type: 'Temple', latitude: 25.0010, longitude: 85.4430 },
        { name: 'Son Bhandar Caves', type: 'Temple', latitude: 25.0120, longitude: 85.4180 },
        { name: 'Bimbisar Jail', type: 'Tourist Place', latitude: 25.0090, longitude: 85.4250 },
        { name: 'Hot Springs/Kund', type: 'Tourist Place', latitude: 25.0180, longitude: 85.4190 },
        { name: 'Rajgir Ropeway', type: 'Tourist Place', latitude: 25.0030, longitude: 85.4410 },
        { name: 'Ashok Stupa', type: 'Temple', latitude: 25.0220, longitude: 85.4210 },
        { name: 'Japanese Stupa', type: 'Temple', latitude: 25.0025, longitude: 85.4415 },
        { name: 'Venu Vana', type: 'Tourist Place', latitude: 25.0250, longitude: 85.4230 },
        { name: 'Ajatshatru Fort', type: 'Tourist Place', latitude: 25.0320, longitude: 85.4280 },
        { name: 'Nalanda ruins', type: 'Tourist Place', latitude: 25.1357, longitude: 85.4439 },
        { name: 'Pawapuri', type: 'Temple', latitude: 25.0920, longitude: 85.5250 },
        { name: 'Government Hospital Rajgir', type: 'Hospital', latitude: 25.0280, longitude: 85.4180 },
        { name: 'The Rajgir Residency Hotel', type: 'Hotel', latitude: 25.0290, longitude: 85.4150 },
        { name: 'Hotel Indo Hokke', type: 'Hotel', latitude: 25.0260, longitude: 85.4160 },
        { name: 'Hotel Saket Palace', type: 'Hotel', latitude: 25.0310, longitude: 85.4190 },
        { name: 'Hotel Abhilasha', type: 'Hotel', latitude: 25.0300, longitude: 85.4170 }
      ])
    },
    {
      name: 'JAMUI',
      slug: 'jamui',
      region: 'South Bihar',
      latitude: 24.9250,
      longitude: 86.2230,
      heroImage: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?auto=format&fit=crop&w=1200&q=80',
      summary: 'Religious tourism + nature + lower-cost development potential',
      verdict: 'Good for low-cost development, but currently weaker for tourism infrastructure',
      overallScore: 6.5,
      tourismRating: 3.0,
      hospitalRating: 2.5,
      hotelRating: 2.0,
      businessRating: 3.0,
      educationRating: 2.5,
      infrastructureRating: 3.0,
      touristPlaces: JSON.stringify([
        { name: 'Giddheshwar Temple', type: 'Temple', latitude: 24.8620, longitude: 86.2450 },
        { name: 'Maa Netula Temple', type: 'Temple', latitude: 24.9850, longitude: 86.3120 },
        { name: 'Simultalla', type: 'Tourist Place', latitude: 24.7150, longitude: 86.5420 },
        { name: 'Jhajha hills/forest areas', type: 'Tourist Place', latitude: 24.7700, longitude: 86.3800 },
        { name: 'Patneswar Temple', type: 'Temple', latitude: 24.9350, longitude: 86.2150 },
        { name: 'Kshatriya Kund', type: 'Tourist Place', latitude: 24.9500, longitude: 86.1800 },
        { name: 'Sadar Hospital Jamui', type: 'Hospital', latitude: 24.9220, longitude: 86.2250 },
        { name: 'local hotels around Jamui town', type: 'Hotel', latitude: 24.9260, longitude: 86.2210 },
        { name: 'guesthouses near Simultalla/Jhajha', type: 'Hotel', latitude: 24.7180, longitude: 86.5400 }
      ])
    }
  ];

  for (const hub of cityHubsData) {
    await prisma.cityHub.create({ data: hub });
  }

  console.log('✅ SETU Database Seeding Complete!');
}

main()
  .catch((e) => {
    console.error('❌ Database Seeding Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

