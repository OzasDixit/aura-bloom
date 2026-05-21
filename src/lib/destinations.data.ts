export interface Destination {
  name: string;
  tagline: string;
  url: string;
  badge: string;
  description: string;
  whyFeatured: string;
  budget: string;
  bestTime: string;
  highlights: string[];
}

export const DESTINATIONS: Destination[] = [
  {
    name: "Jaipur",
    tagline: "The Royal Pink City",
    url: "https://plus.unsplash.com/premium_photo-1661963054563-ce928e477ff3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8SmFpcHVyfGVufDB8fHx8MTc3ODUyMzI1M3ww&ixlib=rb-4.1.0&q=80&w=600",
    badge: "Culture & Heritage",
    description: "Jaipur, the capital of Rajasthan, is world-famous for its magnificent palaces, historic forts, and colorful traditional bazaars. The city reflects the grand heritage of Rajput royalty.",
    whyFeatured: "Jaipur offers incredible low-cost or free sightseeing options (such as taking in the gorgeous exteriors of Hawa Mahal and exploring the ancient city gates). Street food is cheap and delicious at Masala Chowk, and the city has extensive budget-friendly homestays and local bus transit.",
    budget: "₹1,200 - ₹2,000 / day",
    bestTime: "October - March",
    highlights: ["Hawa Mahal facade views", "Street food at Masala Chowk", "Free heritage walk in the Old City"]
  },
  {
    name: "Goa",
    tagline: "Sun, Sand & Coastal Charm",
    url: "https://plus.unsplash.com/premium_photo-1697729701846-e34563b06d47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8R29hfGVufDB8fHx8MTc3ODUyMzI1NHww&ixlib=rb-4.1.0&q=80&w=600",
    badge: "Beaches & Relaxation",
    description: "A coastal paradise on the Arabian Sea, Goa is known for its beautiful sandy beaches, ancient Portuguese-style churches, relaxed villages, and fantastic seafood cuisine.",
    whyFeatured: "Extremely affordable scooter rentals (around ₹300/day) keep transport costs minimal. Beach entry is entirely free, and local beach shacks offer excellent budget seafood meals, allowing for a highly cost-effective tropical getaway.",
    budget: "₹1,500 - ₹2,500 / day",
    bestTime: "November - February",
    highlights: ["Rent a scooter to explore beaches", "Watch the sunset at Arambol Beach", "Enjoy budget fish thali at local joints"]
  },
  {
    name: "Kerala",
    tagline: "God's Own Country",
    url: "https://plus.unsplash.com/premium_photo-1697729438401-fcb4ff66d9a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8S2VyYWxhfGVufDB8fHx8MTc3ODUyMzI1M3ww&ixlib=rb-4.1.0&q=80&w=600",
    badge: "Nature & Serenity",
    description: "Famed for its palm-lined beaches, peaceful canal backwaters, and lush Western Ghats hills, Kerala offers a serene escape centered around tropical nature and culture.",
    whyFeatured: "Instead of renting expensive private houseboats, you can take local government passenger ferries across the backwaters (Alleppey / Alappuzha) for just ₹10–₹20. Fort Kochi also offers very cheap historic guesthouses and affordable local cafe eats.",
    budget: "₹1,400 - ₹2,200 / day",
    bestTime: "September - March",
    highlights: ["Scenic public ferry ride in Alleppey", "See Chinese Fishing Nets in Kochi", "Eat traditional Kerala Sadhya on a banana leaf"]
  },
  {
    name: "Udaipur",
    tagline: "City of Lakes & Palaces",
    url: "https://plus.unsplash.com/premium_photo-1661964079694-ccfaf7dc8028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8VWRhaXB1cnxlbnwwfHx8fDE3Nzg1MjMyNTN8MA&ixlib=rb-4.1.0&q=80&w=600",
    badge: "Romance & Scenic Views",
    description: "Commonly referred to as the Venice of the East, Udaipur is built around a network of stunning lakes and crowned by the giant, majestic City Palace complex.",
    whyFeatured: "Old town Udaipur is filled with affordable rooftop cafes overlooking Lake Pichola. Scenic sunset viewing at Ambrai Ghat is free, and budget boat rides are available at the municipal jetty, keeping the romantic experience budget-friendly.",
    budget: "₹1,300 - ₹2,100 / day",
    bestTime: "September - March",
    highlights: ["Sunset viewing at Ambrai Ghat", "Self-guided street art walk in Old Town", "Affordable lakeview dining"]
  },
  {
    name: "Manali",
    tagline: "Adventure Haven in the Himalayas",
    url: "https://plus.unsplash.com/premium_photo-1661878942694-6adaa2ce8175?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8TWFuYWxpfGVufDB8fHx8MTc3ODUyMzI1M3ww&ixlib=rb-4.1.0&q=80&w=600",
    badge: "Mountain Adventure",
    description: "Nestled in the Beas River Valley, Manali is a popular high-altitude Himalayan resort town. It is a major destination for trekking and adventure sports.",
    whyFeatured: "It is a hub for backpackers with incredibly low-cost hostel dorm beds (starting at ₹400/night). You can do beautiful, self-guided treks to places like Jogini Waterfalls for free, and travel cheaply using shared local auto-rickshaws and buses.",
    budget: "₹1,100 - ₹1,800 / day",
    bestTime: "October - June",
    highlights: ["Trek to Jogini Waterfalls", "Chilled vibes in Old Manali cafes", "Walk through the giant deodar pines of Van Vihar"]
  },
  {
    name: "Rishikesh",
    tagline: "Yoga Capital & Spiritual Hub",
    url: "https://plus.unsplash.com/premium_photo-1661902094482-8844637b400e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8UmlzaGlrZXNofGVufDB8fHx8MTc3ODUyMzI1M3ww&ixlib=rb-4.1.0&q=80&w=600",
    badge: "Spirituality & Wellness",
    description: "Set on the banks of the holy Ganges River, Rishikesh is an internationally renowned center for yoga, meditation, and spiritual ashrams.",
    whyFeatured: "You can find highly affordable lodging and nutritious, inexpensive vegetarian food in local ashrams. Daily spiritual ceremonies (Ganga Aarti) and suspension bridge walks are free, making it a very low-cost spiritual haven.",
    budget: "₹900 - ₹1,500 / day",
    bestTime: "September - April",
    highlights: ["Attend Ganga Aarti at Triveni Ghat", "Walk across Lakshman Jhula bridge", "Join budget yoga classes"]
  },
  {
    name: "Varanasi",
    tagline: "The Soul of Ancient India",
    url: "https://plus.unsplash.com/premium_photo-1723485664001-122971f79f6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8VmFyYW5hc2l8ZW58MHx8fHwxNzc4NTIzMjUzfDA&ixlib=rb-4.1.0&q=80&w=600",
    badge: "Spiritual & Ancient",
    description: "One of the oldest continuously inhabited cities in the world, Varanasi is the spiritual core of Hinduism, centered on the holy riverfront ghats of the Ganges.",
    whyFeatured: "The street food here is incredibly cheap (you can get a full breakfast of Kachori Sabzi for ₹20). Wandering the historic ghats and watching evening prayer ceremonies is free, and shared boat rides are very cheap when split with other travelers.",
    budget: "₹800 - ₹1,300 / day",
    bestTime: "October - March",
    highlights: ["Sunrise walk along the ghats", "Watch Ganga Aarti at Dashashwamedh Ghat", "Try the famous Blue Lassi"]
  },
  {
    name: "Munnar",
    tagline: "Endless Green Tea Estates",
    url: "https://plus.unsplash.com/premium_photo-1697730334419-fba83fe143b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8TXVubmFyfGVufDB8fHx8MTc3ODUyMzI1M3ww&ixlib=rb-4.1.0&q=80&w=600",
    badge: "Scenic Hill Station",
    description: "Munnar is a gorgeous hill station located in Kerala's Western Ghats. It is characterized by vast tea plantations, misty mountains, and waterfalls.",
    whyFeatured: "Walking through the breathtaking, rolling tea gardens is completely free. Local government buses (KSRTC) provide cheap transit through the winding hills, and local spice garden tours and home dining offer affordable experiences.",
    budget: "₹1,200 - ₹1,900 / day",
    bestTime: "September - May",
    highlights: ["Walk through Lockhart Tea Gardens", "Visit the Mattupetty Dam viewpoint", "Feast on local Kerala parotta and curry"]
  },
  {
    name: "Ladakh",
    tagline: "The Land of High Passes",
    url: "https://plus.unsplash.com/premium_photo-1661962344178-19930ba15492?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8TGFkYWtofGVufDB8fHx8MTc3ODUyMzI1M3ww&ixlib=rb-4.1.0&q=80&w=600",
    badge: "Desert Mountain Wilderness",
    description: "A high-altitude cold desert region, Ladakh is famous for its dramatic rocky peaks, crystal-blue lakes, and remote Buddhist monasteries.",
    whyFeatured: "While travel here can be remote, staying in local homestays offers authentic cultural immersion and support for local families at low cost. Shared taxis arranged at local tourist hubs divide transport costs significantly, and historic monasteries have minimal entry fees.",
    budget: "₹1,800 - ₹3,000 / day",
    bestTime: "June - September",
    highlights: ["Explore the majestic Thiksey Monastery", "Walk along the scenic Indus River bank", "Enjoy local Ladakhi bread and butter tea"]
  },
  {
    name: "Agra",
    tagline: "Home of the Taj Mahal",
    url: "https://plus.unsplash.com/premium_photo-1694475148897-221fb315dc0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8QWdyYSUyMFRhaiUyME1haGFsfGVufDB8fHx8MTc3ODUyMzI1M3ww&ixlib=rb-4.1.0&q=80&w=600",
    badge: "Wonders of the World",
    description: "Situated on the Yamuna River bank, Agra is home to the world-famous Taj Mahal monument, along with the grand Agra Fort and other Mughal architectural structures.",
    whyFeatured: "Domestic entry tickets to monuments are very inexpensive. You can get spectacular, crowd-free views of the Taj Mahal across the river from Mehtab Bagh for a fraction of the cost, and cheap electric rickshaws are available for quick transit.",
    budget: "₹1,100 - ₹1,800 / day",
    bestTime: "October - March",
    highlights: ["View the Taj Mahal from Mehtab Bagh at sunset", "Explore Agra Fort", "Sample Agra's traditional sweet Petha"]
  },
  {
    name: "Hampi",
    tagline: "Ruins of the Vijayanagara Empire",
    url: "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=600&q=80",
    badge: "Archaeological Wonder",
    description: "Hampi is a UNESCO World Heritage Site in Karnataka, scattered with the ruins of ancient palaces, temples, and bouldered hills along the Tungabhadra River.",
    whyFeatured: "Bicycle and moped rentals in Hampi are incredibly cheap (₹100-₹200/day), letting you explore the vast ruins at your own pace. Local guesthouses on the 'Hippie Island' side or nearby villages are highly budget-friendly.",
    budget: "₹800 - ₹1,500 / day",
    bestTime: "October - February",
    highlights: ["Rent a bicycle to explore Virupaksha Temple", "Sunset view from Matanga Hill", "Cross the river via local coracle boats"]
  },
  {
    name: "Ooty",
    tagline: "Queen of Hill Stations",
    url: "https://images.unsplash.com/photo-1601999109332-542b18dbec57?auto=format&fit=crop&w=600&q=80",
    badge: "Scenic Hill Station",
    description: "Set in the Nilgiri Hills, Ooty is famous for its tea gardens, colonial heritage, cool climate, and the historic toy train.",
    whyFeatured: "The UNESCO toy train ride is extremely inexpensive if booked in advance. Walking through local botanical gardens and tea estates has minimal or no cost, and local homemade chocolates are cheap and delicious.",
    budget: "₹1,200 - ₹1,800 / day",
    bestTime: "October - June",
    highlights: ["Ride the Nilgiri Mountain Toy Train", "Visit the Needle Rock Viewpoint", "Sample local Nilgiri tea and chocolates"]
  },
  {
    name: "Darjeeling",
    tagline: "Land of the Cosmic Tea Garden",
    url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
    badge: "Himalayan Vibe",
    description: "Darjeeling is nestled in the Lesser Himalayas, overlooked by Mount Kanchenjunga. It is famous for its world-class black tea plantations and Himalayan Railway.",
    whyFeatured: "You can visit scenic vantage points like Tiger Hill and Batasia Loop for very low entry fees. Budget homestays run by local families offer delicious home-cooked Tibetan/Nepali meals that save massive dining costs.",
    budget: "₹1,100 - ₹1,800 / day",
    bestTime: "October - May",
    highlights: ["Watch sunrise over Kanchenjunga at Tiger Hill", "Explore Batasia Loop and Toy Train track", "Enjoy fresh local momos and thukpa"]
  },
  {
    name: "Pondicherry",
    tagline: "French Riviera of the East",
    url: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80",
    badge: "Coastal & Heritage",
    description: "A former French colony on the Bay of Bengal, Pondicherry features a unique blend of French architecture, quiet beaches, spiritual ashrams, and boutique cafes.",
    whyFeatured: "Exploring the French Quarter on a rented bicycle is exceptionally cheap (₹80/day). Auroville offers free entry and budget volunteer stays, and local street crepes/croissants are high-quality yet very affordable.",
    budget: "₹1,000 - ₹1,700 / day",
    bestTime: "October - March",
    highlights: ["Cycle through the French Quarter", "Relax at Promenade Beach at sunset", "Visit the Matrimandir viewing point in Auroville"]
  },
  {
    name: "Jaisalmer",
    tagline: "The Golden Sandstone City",
    url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80",
    badge: "Desert & Heritage",
    description: "Rising from the heart of the Thar Desert, Jaisalmer is constructed entirely from yellow sandstone, dominated by the massive Jaisalmer Fort that still houses a vibrant local population.",
    whyFeatured: "Jaisalmer Fort has free entry as a living fort where you can wander the historic alleys. Budget desert camps offer package deals including camel safaris, traditional dinners, and stays for highly reasonable group rates.",
    budget: "₹1,000 - ₹1,600 / day",
    bestTime: "October - March",
    highlights: ["Wander inside the living Jaisalmer Fort", "Camel safari in Sam Sand Dunes", "Watch sunset at Gadisar Lake"]
  },
  {
    name: "Alleppey",
    tagline: "Venice of the East Backwaters",
    url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80",
    badge: "Waterways & Serenity",
    description: "Alleppey (Alappuzha) is the hub of Kerala's backwaters, famed for its massive network of canals, lagoons, and peaceful houseboat cruises.",
    whyFeatured: "Rather than booking an expensive private houseboat, you can navigate the exact same scenic channels using the government SWTD passenger boats for a few rupees, or split a budget kayak tour with friends.",
    budget: "₹900 - ₹1,500 / day",
    bestTime: "September - March",
    highlights: ["Ride the public ferry through backwater canals", "Relax at Alleppey Beach and lighthouse", "Enjoy local toddy shop snacks"]
  },
  {
    name: "Gokarna",
    tagline: "Tranquil Beaches & Sacred Trails",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    badge: "Beaches & Trekking",
    description: "A temple town on the coast of Karnataka, Gokarna has transformed into a favorite destination for travelers seeking pristine, uncrowded beaches and scenic cliff hikes.",
    whyFeatured: "Beach trekking from Kudle Beach to Half Moon and Paradise Beach is free and breathtaking. Staying in simple beach shacks or eco-hostels directly on the sand keeps lodging costs extremely low.",
    budget: "₹800 - ₹1,400 / day",
    bestTime: "October - March",
    highlights: ["Trek across Gokarna's five main beaches", "Watch bioluminescent waves at Nirvana Beach", "Stay in a beachside bamboo shack"]
  },
  {
    name: "Dharamshala",
    tagline: "Home of the Dalai Lama",
    url: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=600&q=80",
    badge: "Tibetan Culture",
    description: "Located in the Dhauladhar range of the Himalayas, Dharamshala and its upper town, McLeodganj, are the seat of the Tibetan government-in-exile and spiritual hub.",
    whyFeatured: "Bhagsunag waterfall hikes, visiting the Dalai Lama Temple, and walking through dense deodar forests are completely free. Authentic momos, thukpa, and butter tea in local monasteries are highly inexpensive.",
    budget: "₹900 - ₹1,500 / day",
    bestTime: "September - June",
    highlights: ["Visit the Tsuglagkhang Complex (Dalai Lama Temple)", "Trek to Triund Hill for overnight camping", "Eat hot momos at McLeodganj Main Square"]
  },
  {
    name: "Shimla",
    tagline: "Summer Capital of British India",
    url: "https://images.unsplash.com/photo-1562670256-124b8f6358c9?auto=format&fit=crop&w=600&q=80",
    badge: "Heritage Hill Station",
    description: "Shimla is a historic hill station in Himachal Pradesh, known for its colonial-era architecture, pedestrian Mall Road, and surrounding snow-capped forests.",
    whyFeatured: "Walking the pedestrian-only Ridge and Mall Road is a free and classic experience. You can ride the Kalka-Shimla toy train for minimal cost and take local government local buses to reach nearby viewpoints cheaply.",
    budget: "₹1,300 - ₹2,000 / day",
    bestTime: "October - June",
    highlights: ["Walk along Mall Road and The Ridge", "Visit the colonial Viceregal Lodge", "Ride the historic toy train"]
  },
  {
    name: "Kodaikanal",
    tagline: "Princess of Hill Stations",
    url: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80",
    badge: "Scenic Hill Station",
    description: "Kodaikanal is a misty hill town in Tamil Nadu's Palani Hills, centered around a star-shaped lake and surrounded by granite cliffs and forested valleys.",
    whyFeatured: "Renting a bicycle to ride around the central Kodaikanal Lake costs under ₹100. Wandering through the misty Coaker's Walk and pine forests is extremely cheap, and budget cottages are abundant.",
    budget: "₹1,100 - ₹1,700 / day",
    bestTime: "September - May",
    highlights: ["Cycle around the scenic Kodai Lake", "Walk through the giant Pine Forest", "See the view from Pillar Rocks"]
  },
  {
    name: "Puri",
    tagline: "Holy Beach & Heritage Town",
    url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80",
    badge: "Pilgrimage & Coastal",
    description: "Situated on the Bay of Bengal in Odisha, Puri is a sacred Hindu pilgrimage city home to the historic Jagannath Temple, featuring a vast golden beach.",
    whyFeatured: "Visiting the beaches and historic temples is entirely free. Puri's local Odia cuisine, especially the vegetarian Mahaprasad from the temple's massive kitchen, is incredibly cheap and highly nourishing.",
    budget: "₹800 - ₹1,300 / day",
    bestTime: "October - February",
    highlights: ["Relax at the clean Golden Beach", "Visit the Jagannath Temple", "Take a budget day trip to Konark Sun Temple"]
  },
  {
    name: "Pushkar",
    tagline: "Sacred Lake & Camel Fair",
    url: "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=600&q=80",
    badge: "Culture & Pilgrimage",
    description: "Set on the edge of the Thar Desert around a holy lake, Pushkar is a sacred town in Rajasthan featuring one of the world's few temples dedicated to Lord Brahma.",
    whyFeatured: "Pushkar is famous for extremely cheap accommodations and delicious, budget-friendly vegetarian food (including wood-fired pizzas and local falafels). Exploring the ghats and temples is completely free.",
    budget: "₹700 - ₹1,200 / day",
    bestTime: "October - March",
    highlights: ["Watch sunset at Varaha Ghat", "Visit the unique Brahma Temple", "Sample local Rabri Malpua sweets"]
  },
  {
    name: "Jodhpur",
    tagline: "The Sun City under Mehrangarh",
    url: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?auto=format&fit=crop&w=600&q=80",
    badge: "Heritage & Forts",
    description: "Jodhpur is Rajasthan's 'Blue City', dominated by the massive Mehrangarh Fort that towers over thousands of blue-painted houses in the old town.",
    whyFeatured: "Walking through the blue streets of the old city and visiting Jaswant Thada has minimal cost. Local markets around the Clock Tower offer cheap street shopping and highly affordable Rajasthani food stalls.",
    budget: "₹1,100 - ₹1,700 / day",
    bestTime: "October - March",
    highlights: ["Explore the blue alleys of Old Jodhpur", "Visit Mehrangarh Fort and museum", "Try the famous Makhaniya Lassi"]
  },
  {
    name: "Amritsar",
    tagline: "Home of the Golden Temple",
    url: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=600&q=80",
    badge: "Spiritual & Heritage",
    description: "The spiritual center of Sikhism, Amritsar is home to the stunning Golden Temple complex, as well as a historic walled city renowned for its rich culinary heritage.",
    whyFeatured: "The Golden Temple offers free entry, and its community kitchen (Langar) serves free, delicious hot meals to over 100,000 visitors daily. The temple also offers clean, budget accommodation options (Sarai) for pilgrims.",
    budget: "₹900 - ₹1,400 / day",
    bestTime: "October - March",
    highlights: ["Visit the Golden Temple at night", "Watch the Wagah Border ceremony", "Savor Amritsari Kulcha at local street dhabas"]
  },
  {
    name: "Shillong",
    tagline: "Scotland of the East",
    url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
    badge: "Nature & Waterfalls",
    description: "The capital of Meghalaya, Shillong is a scenic hill town surrounded by pine trees, rolling green hills, and spectacular plunging waterfalls.",
    whyFeatured: "Shared local taxis are highly affordable for exploring nearby viewpoints and falls like Elephant Falls. Local Khasi food stalls serve inexpensive and hearty traditional meals.",
    budget: "₹1,300 - ₹2,000 / day",
    bestTime: "September - May",
    highlights: ["View Elephant Falls and Ward's Lake", "Take a budget day trip to cleanest village Mawlynnong", "Shop at local Police Bazar"]
  },
  {
    name: "Mahabaleshwar",
    tagline: "Land of Strawberries & Valleys",
    url: "https://images.unsplash.com/photo-1601999109332-542b18dbec57?auto=format&fit=crop&w=600&q=80",
    badge: "Scenic Hill Station",
    description: "A forested hill station in Maharashtra's Western Ghats, Mahabaleshwar is known for its numerous scenic valley lookouts, ancient temples, and vast strawberry farms.",
    whyFeatured: "Viewing points (like Arthur's Seat and Wilson Point) are free to access. Sharing local taxis or driving a rented scooter is highly economical, and fresh strawberry cream from local farms is a budget highlight.",
    budget: "₹1,200 - ₹1,900 / day",
    bestTime: "October - June",
    highlights: ["Watch sunrise from Wilson Point", "Taste fresh strawberries at Mapro Garden", "Visit the historic Mahabaleshwar Temple"]
  },
  {
    name: "Lonavala",
    tagline: "Mist-covered Western Ghats Gateway",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    badge: "Weekend Getaway",
    description: "Lonavala is a lush hill town near Mumbai and Pune, featuring ancient Buddhist rock-cut caves, historic forts, and countless waterfalls during the monsoon.",
    whyFeatured: "Trekking to Lohagad Fort or Rajmachi is a free and spectacular adventure. Visiting Karla and Bhaja caves has minimal entry fees, and local sweet 'Chikki' is cheap and energy-rich.",
    budget: "₹1,000 - ₹1,600 / day",
    bestTime: "July - March",
    highlights: ["Trek to Lohagad Fort", "Explore the ancient Karla Caves", "Buy fresh local peanut chikki"]
  },
  {
    name: "Mount Abu",
    tagline: "Oasis in the Rajasthan Desert",
    url: "https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=600&q=80",
    badge: "Hill Station & Temples",
    description: "Mount Abu is the sole hill station in Rajasthan, set on a rocky plateau in the Aravali range and surrounded by dense forests, lakes, and Dilwara Jain Temples.",
    whyFeatured: "The Dilwara Jain Temples are free to visit and feature some of the world's most intricate marble carvings. Boat rides on Nakki Lake and watching the sunset from Sunset Point are very low-cost.",
    budget: "₹1,100 - ₹1,800 / day",
    bestTime: "November - June",
    highlights: ["Marvel at Dilwara Jain Temple carvings", "Watch the sunset from Sunset Point", "Walk around Nakki Lake"]
  },
  {
    name: "Spiti Valley",
    tagline: "Middle Land between India & Tibet",
    url: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=600&q=80",
    badge: "Himalayan Adventure",
    description: "Spiti is a high-altitude cold desert valley in the Himalayas, dotted with ancient white-washed monasteries, remote villages, and towering peaks.",
    whyFeatured: "Traveling via local HRTC government buses is incredibly cheap for navigating these high-altitude routes. Homestays in villages like Key and Kibber provide very cheap accommodation that includes authentic home-cooked meals.",
    budget: "₹1,400 - ₹2,200 / day",
    bestTime: "June - September",
    highlights: ["Visit the spectacular Key Monastery", "Drive across Chicham Bridge (highest in Asia)", "Stay in a traditional Spitian homestay"]
  },
  {
    name: "Khajuraho",
    tagline: "Sculpted Heritage & Ancient Temples",
    url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80",
    badge: "Art & Archaeology",
    description: "A town in Madhya Pradesh, Khajuraho is renowned worldwide for its UNESCO-listed group of medieval Hindu and Jain temples, famous for their detailed rock carvings.",
    whyFeatured: "The ASI entry ticket to the main Western Group of temples is very cheap for domestic tourists. You can rent a bicycle for under ₹100/day to easily explore all the scattered temple complexes.",
    budget: "₹900 - ₹1,500 / day",
    bestTime: "October - March",
    highlights: ["Explore the Western Group of temples", "Watch the evening light and sound show", "Cycle to the quieter Eastern Group"]
  },
  {
    name: "Nainital",
    tagline: "City of Emerald Lakes",
    url: "https://images.unsplash.com/photo-1562670256-124b8f6358c9?auto=format&fit=crop&w=600&q=80",
    badge: "Lake District",
    description: "Set in a steep valley around the pear-shaped Naini Lake, Nainital is a beautiful Himalayan resort town in Uttarakhand with surrounding forested peaks.",
    whyFeatured: "Walking along the pedestrian-only Mall Road next to the lake is free. Shared local rowboats on Naini Lake are highly affordable when split with others, and budget guesthouses are widely available.",
    budget: "₹1,200 - ₹1,800 / day",
    bestTime: "October - June",
    highlights: ["Take a boat ride on Naini Lake", "Trek to Tiffin Top for panoramic views", "Shop at the Tibetan Market"]
  },
  {
    name: "Mussoorie",
    tagline: "Queen of the Hills",
    url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
    badge: "Scenic Hill Station",
    description: "Mussoorie is a popular hill station in Uttarakhand, offering scenic views of the Doon Valley and the distant snow-capped Himalayan ranges.",
    whyFeatured: "Walking through local pine forests, visiting Kempty Falls, and exploring Landour old town are very low-cost. Sharing local utility vehicles is highly budget-friendly for moving between tourist spots.",
    budget: "₹1,200 - ₹1,900 / day",
    bestTime: "October - June",
    highlights: ["Walk the historic roads of Landour", "Visit Kempty Falls", "See the sunset from Gun Hill"]
  },
  {
    name: "Coorg",
    tagline: "Scotland of India Coffee Hills",
    url: "https://images.unsplash.com/photo-1601999109332-542b18dbec57?auto=format&fit=crop&w=600&q=80",
    badge: "Hills & Coffee",
    description: "Coorg (Kodagu) is a mountainous district in Karnataka, covered with dense coffee plantations, misty valleys, and cascading jungle waterfalls.",
    whyFeatured: "Homestays on local coffee estates are highly affordable and include traditional Kodava meals. Visiting Abbey Falls and the Golden Temple Buddhist monastery has minimal or no entry fee.",
    budget: "₹1,300 - ₹2,000 / day",
    bestTime: "October - May",
    highlights: ["Visit the Namdroling Monastery (Golden Temple)", "Stand under Abbey Falls", "Taste fresh estate-brewed coffee"]
  },
  {
    name: "Wayanad",
    tagline: "Mist, Caves & Wild Trails",
    url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80",
    badge: "Nature & Wildlife",
    description: "Wayanad is a green plateau in Kerala's Western Ghats, featuring ancient caves, spice plantations, mist-covered peaks, and wild elephant reserves.",
    whyFeatured: "Hiking to Edakkal Caves to see prehistoric rock carvings has a very cheap entry ticket. Budget homestays and forest resorts offer affordable nature immersions away from city crowds.",
    budget: "₹1,100 - ₹1,800 / day",
    bestTime: "October - May",
    highlights: ["Climb up to the ancient Edakkal Caves", "See views from Banasura Sagar Dam", "Trek to heart-shaped Chembra Lake"]
  },
  {
    name: "Rameshwaram",
    tagline: "Sacred Island Corridor",
    url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80",
    badge: "Pilgrimage & Coast",
    description: "Situated on Pamban Island in Tamil Nadu, Rameshwaram is a holy temple town connected to the mainland by the historic Pamban Bridge, surrounded by sandy beaches.",
    whyFeatured: "Visiting the Ramanathaswamy Temple (famous for the longest temple corridor in India) and bathing in the 22 sacred wells costs very little. Strolling through the ghost town of Dhanushkodi is a free, surreal experience.",
    budget: "₹800 - ₹1,300 / day",
    bestTime: "October - March",
    highlights: ["Walk through Dhanushkodi ghost town", "Cross the historic Pamban Bridge", "Visit the Ramanathaswamy Temple"]
  },
  {
    name: "Kanyakumari",
    tagline: "The Southernmost Tip of India",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    badge: "Coastal & Scenic",
    description: "The southernmost point of mainland India, Kanyakumari is where the Arabian Sea, the Indian Ocean, and the Bay of Bengal meet, famous for its sunrise and sunset views.",
    whyFeatured: "Ferry tickets to the Vivekananda Rock Memorial are highly budget-friendly (around ₹50). Watching the spectacular sunset and moonrise simultaneously at the beach is entirely free.",
    budget: "₹900 - ₹1,400 / day",
    bestTime: "October - March",
    highlights: ["Take a ferry to Vivekananda Rock Memorial", "Watch the sunset from Kanyakumari Beach", "Explore the Gandhi Memorial Mandapam"]
  },
  {
    name: "Madurai",
    tagline: "The Athens of the East",
    url: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=600&q=80",
    badge: "Heritage & Temples",
    description: "One of India's oldest continuously inhabited cities, Madurai is constructed around the towering Meenakshi Amman Temple, a masterpiece of Dravidian architecture.",
    whyFeatured: "Visiting the Meenakshi Temple is free of charge. Madurai is India's ultimate budget street food capital, famous for highly inexpensive local meals (like soft idlis and Kari Dosa) and Jigarthanda milkshakes.",
    budget: "₹800 - ₹1,300 / day",
    bestTime: "October - March",
    highlights: ["Marvel at Meenakshi Amman Temple Gopurams", "Try the famous local drink Jigarthanda", "Explore the Tirumalai Nayakkar Palace"]
  },
  {
    name: "Mahabalipuram",
    tagline: "Rock-Cut Shore Temples",
    url: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80",
    badge: "Heritage & Beach",
    description: "Located on the coast of Tamil Nadu, Mahabalipuram is famous for its 7th-century rock-cut carvings, monolithic temples (Rathas), and Shore Temple.",
    whyFeatured: "All the major rock carvings (including Krishna's Butterball and Arjuna's Penance) are located in an open park with free access. Budget beachside guesthouses are abundant and serve fresh seafood cheaply.",
    budget: "₹900 - ₹1,500 / day",
    bestTime: "October - March",
    highlights: ["See the coastal Shore Temple", "Take photos at Krishna's Butterball", "Explore the Five Rathas complex"]
  },
  {
    name: "Chikmagalur",
    tagline: "Birthplace of Indian Coffee",
    url: "https://images.unsplash.com/photo-1601999109332-542b18dbec57?auto=format&fit=crop&w=600&q=80",
    badge: "Nature & Coffee",
    description: "Set in the Baba Budan Hills of Karnataka, Chikmagalur is a serene coffee-growing region with lush green mountains, waterfalls, and steep hiking trails.",
    whyFeatured: "Hiking up Mullayanagiri (the highest peak in Karnataka) is a free adventure. Staying in local homestays offers cheap access to home-cooked Malnad meals and fresh coffee.",
    budget: "₹1,200 - ₹1,900 / day",
    bestTime: "September - May",
    highlights: ["Trek to Mullayanagiri Peak", "Stand under Jhari Waterfalls", "Tour a local budget coffee estate"]
  },
  {
    name: "Kovalam",
    tagline: "Crescent Beach Paradise",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    badge: "Beaches & Wellness",
    description: "Kovalam is a popular coastal town in Kerala, famous for its three adjacent crescent-shaped beaches and its iconic red-and-white striped lighthouse.",
    whyFeatured: "Relaxing on the beaches and visiting the lighthouse has negligible cost. Budget hostels and ayurvedic homestays set back from the shoreline offer excellent rooms at highly affordable rates.",
    budget: "₹1,300 - ₹2,000 / day",
    bestTime: "September - March",
    highlights: ["Climb the Lighthouse Beach tower", "Relax on Hawa Beach", "Savor fresh seafood at local beach shacks"]
  },
  {
    name: "Varkala",
    tagline: "Cliffs by the Arabian Sea",
    url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80",
    badge: "Coastal & Wellness",
    description: "Varkala is a coastal town in Kerala, unique for its red cliffs that rise directly from the Arabian Sea beach, featuring mineral springs and yoga retreats.",
    whyFeatured: "Staying in cliff-side hostels or guesthouses is highly affordable for backpackers. Watching spectacular sunsets from the cliff walking path is free, and fresh local cafes serve cheap organic juices and food.",
    budget: "₹900 - ₹1,600 / day",
    bestTime: "October - March",
    highlights: ["Walk along the scenic Varkala Cliff path", "Swim at Papanasam Beach (mineral springs)", "Join a budget beachside yoga session"]
  },
  {
    name: "Kasol",
    tagline: "Mini Israel of Himachal",
    url: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=600&q=80",
    badge: "Backpacker Haven",
    description: " Kasol is a village in Himachal Pradesh's Parvati Valley, famous for its pine forests, riverside cafes, and backpacker culture.",
    whyFeatured: "Trekking to nearby villages like Chalal or Manikaran (famous for hot springs and free temple food) is completely free. Backpacker hostels start as low as ₹350/night.",
    budget: "₹800 - ₹1,400 / day",
    bestTime: "October - June",
    highlights: ["Walk along the rushing Parvati River", "Visit the Manikaran Sahib Hot Springs", "Trek to the quiet village of Chalal"]
  },
  {
    name: "Dalhousie",
    tagline: "Little Switzerland of India",
    url: "https://images.unsplash.com/photo-1562670256-124b8f6358c9?auto=format&fit=crop&w=600&q=80",
    badge: "Pine Forests & Hills",
    description: "Dalhousie is a colonial-era hill town in Himachal Pradesh, built on five hills with views of the snow-capped Dhauladhar range.",
    whyFeatured: "Hiking through the lush meadows of Khajjiar (the mini Switzerland) is a free and scenic experience. Government buses and shared taxis connect Dalhousie and Khajjiar cheaply.",
    budget: "₹1,200 - ₹1,900 / day",
    bestTime: "October - June",
    highlights: ["Explore the vast green meadows of Khajjiar", "Hike through Kalatop Wildlife Sanctuary", "Walk around Panchpula waterfalls"]
  },
  {
    name: "Gulmarg",
    tagline: "Meadow of Flowers & Snow",
    url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
    badge: "Meadows & Snow",
    description: "Gulmarg is a famous hill station and ski resort in Jammu & Kashmir, situated in a high-altitude cup-shaped valley in the Pir Panjal range.",
    whyFeatured: "Wandering through the spectacular wildflower meadows in summer or walking on snow trails in winter has no cost. Local shared cabs from Tanmarg make transit highly affordable.",
    budget: "₹1,500 - ₹2,500 / day",
    bestTime: "October - May",
    highlights: ["Ride the Gulmarg Gondola (book early)", "Wander through the Gulmarg Biosphere Reserve", "Visit the historic St. Mary's Church"]
  },
  {
    name: "Pahalgam",
    tagline: "Valley of Shepherds",
    url: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=600&q=80",
    badge: "Meadows & Rivers",
    description: "Pahalgam is a scenic town in Kashmir, set along the rushing Lidder River and serving as the starting point for high-altitude treks.",
    whyFeatured: "Wandering the pine forests around the Lidder River and exploring local Kashmiri villages is a free and peaceful experience. Local shared taxis from Anantnag cost very little.",
    budget: "₹1,400 - ₹2,200 / day",
    bestTime: "March - November",
    highlights: ["Walk along the rushing Lidder River", "Visit the scenic Betaab Valley viewpoint", "Explore the meadows of Baisaran"]
  },
  {
    name: "Gangtok",
    tagline: "Gateway to the Eastern Himalayas",
    url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
    badge: "Himalayan Culture",
    description: "The capital of Sikkim, Gangtok is a clean, modern hill city offering views of Mount Kanchenjunga and serving as a hub for Buddhist monasteries.",
    whyFeatured: "Walking the pristine MG Marg pedestrian street is a free highlight. Local shared cabs offer flat rates to reach major monasteries like Rumtek and Enchey, which have minimal entry fees.",
    budget: "₹1,200 - ₹1,900 / day",
    bestTime: "October - June",
    highlights: ["Stroll along MG Marg pedestrian mall", "Visit the beautiful Rumtek Monastery", "See views from Tashi View Point"]
  },
  {
    name: "Pachmarhi",
    tagline: "Queen of Satpura Range",
    url: "https://images.unsplash.com/photo-1601999109332-542b18dbec57?auto=format&fit=crop&w=600&q=80",
    badge: "Caves & Waterfalls",
    description: "Pachmarhi is a lush hill station in Madhya Pradesh, rich in ancient rock-cut caves, tumbling waterfalls, and archeological ruins.",
    whyFeatured: "Most natural spots (like Bee Falls and the Pandav Caves) have free or very low entry fees. Renting a moped or sharing a local open-top gypsy is an economical way to explore the forest paths.",
    budget: "₹1,000 - ₹1,600 / day",
    bestTime: "September - May",
    highlights: ["Stand under the cooling Bee Falls", "Explore the ancient Pandav Caves", "Watch the sunset from Dhoopgarh (highest point)"]
  },
  {
    name: "Tawang",
    tagline: "Mystic Monasteries & Lakes",
    url: "https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&w=600&q=80",
    badge: "Himalayan Wilderness",
    description: "Located in the remote northwest corner of Arunachal Pradesh, Tawang is a high-altitude valley famous for its massive Buddhist monastery and holy alpine lakes.",
    whyFeatured: "Visiting the giant Tawang Monastery (the second-largest in the world) is free. While remote, sharing sumo taxis from Tezpur or Bomdila keeps transportation costs highly manageable.",
    budget: "₹1,300 - ₹2,200 / day",
    bestTime: "March - October",
    highlights: ["Explore the giant Tawang Monastery", "Drive through the snow-capped Sela Pass", "See the high-altitude Madhuri Lake"]
  },
  {
    name: "Ziro Valley",
    tagline: "Pristine Rice Fields & Music",
    url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80",
    badge: "Tribal Culture",
    description: "A flat pine-ringed valley in Arunachal Pradesh, Ziro is home to the Apatani tribe, famous for its unique terrace rice farming and indigenous music festival.",
    whyFeatured: "Walking through the traditional Apatani bamboo villages and terrace fields is a free cultural experience. Local homestays offer cheap lodging and authentic ethnic meals.",
    budget: "₹1,100 - ₹1,800 / day",
    bestTime: "March - October",
    highlights: ["Walk through traditional Apatani villages (Hong)", "See terraced rice-fish cultivation fields", "Hike up Talley Valley Wildlife Sanctuary"]
  },
  {
    name: "Araku Valley",
    tagline: "Coffee Plantations & Tribal Caves",
    url: "https://images.unsplash.com/photo-1601999109332-542b18dbec57?auto=format&fit=crop&w=600&q=80",
    badge: "Scenic Valley",
    description: "Araku is a scenic hill valley in Andhra Pradesh's Eastern Ghats, covered with dense coffee plantations, waterfalls, and ancient caves.",
    whyFeatured: "The passenger train ride from Visakhapatnam to Araku (passing through 58 tunnels and over bridges) is extremely scenic and very cheap. Exploring local coffee plantations and waterfalls has no cost.",
    budget: "₹900 - ₹1,500 / day",
    bestTime: "September - March",
    highlights: ["Ride the Vistadome train through Eastern Ghats tunnels", "Explore the deep Borra Caves", "Taste fresh local organic Araku coffee"]
  }
];
