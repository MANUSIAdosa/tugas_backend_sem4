import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.js';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Helper to fetch buffer from URL with a local fallback
async function getBufferFromUrl(url, fallbackPath) {
  try {
    console.log(`Mengunduh asset dari: ${url}`);
    const res = await fetch(url, { 
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
      } 
    });
    if (!res.ok) throw new Error(`HTTP status ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (err) {
    console.warn(`Peringatan: Gagal mengunduh ${url}, menggunakan file lokal fallback. (${err.message})`);
    try {
      return fs.readFileSync(path.resolve(fallbackPath));
    } catch (fallbackErr) {
      console.error(`Gagal membaca file lokal fallback ${fallbackPath}:`, fallbackErr.message);
      return null;
    }
  }
}

async function getCategory(name, slug) {
  let cat = await prisma.categories.findUnique({ where: { slug } });
  if (!cat) {
    console.log(`Kategori ${name} tidak ditemukan. Membuat kategori baru...`);
    cat = await prisma.categories.create({
      data: { name, slug }
    });
  }
  return cat;
}

const newGamesData = [
  {
    name: 'Genshin Impact',
    slug: 'genshin-impact',
    badge: 'Hot',
    hasZone: true,
    userIdLabel: 'UID',
    userIdPlaceholder: 'Masukkan UID Genshin Impact',
    zoneIdLabel: 'Server',
    zoneIdPlaceholder: 'Pilih Server',
    zoneIdHint: 'Pilih server tempat kamu bermain',
    zoneIdMaxLength: 30,
    zoneOptions: ['Asia', 'America', 'Europe', 'SAR'],
    bgPosition: 'center',
    categoryName: 'RPG',
    categorySlug: 'rpg',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Genshin-Impact-Logo.png/512px-Genshin-Impact-Logo.png',
    bgUrl: 'https://images2.alphacoders.com/110/1109249.jpg',
    itemIconUrl: 'https://static.wikia.nocookie.net/gensin-impact/images/d/d4/Item_Primogem.png/revision/latest/scale-to-width-down/120',
    itemName: 'Genesis Crystals',
    items: [
      { qty: 60, originalPrice: 16000, discountPercent: 10, finalPrice: 14400 },
      { qty: 300, originalPrice: 79000, discountPercent: 5, finalPrice: 75050 },
      { qty: 980, originalPrice: 249000, discountPercent: 8, finalPrice: 229080 },
      { qty: 1980, originalPrice: 479000, discountPercent: 6, finalPrice: 450260 },
      { qty: 3280, originalPrice: 799000, discountPercent: 6, finalPrice: 751060 },
      { qty: 6480, originalPrice: 1599000, discountPercent: 8, finalPrice: 1471080 },
    ]
  },
  {
    name: 'Minecraft',
    slug: 'minecraft',
    badge: 'New',
    hasZone: false,
    userIdLabel: 'Username',
    userIdPlaceholder: 'Masukkan Username Minecraft',
    zoneIdLabel: 'ZONE ID',
    zoneIdPlaceholder: 'Zone ID',
    zoneIdHint: '4 DIGIT',
    zoneIdMaxLength: 4,
    bgPosition: 'center',
    categoryName: 'Sandbox',
    categorySlug: 'sandbox',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Minecraft_logo.svg/512px-Minecraft_logo.svg.png',
    bgUrl: 'https://images.alphacoders.com/131/1317589.png',
    itemIconUrl: 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/4/44/Minecoin_JE2.png/revision/latest/scale-to-width-down/120',
    itemName: 'Minecoins',
    items: [
      { qty: 320, originalPrice: 35000, discountPercent: 5, finalPrice: 33250 },
      { qty: 1020, originalPrice: 105000, discountPercent: 10, finalPrice: 94500 },
      { qty: 1720, originalPrice: 169000, discountPercent: 8, finalPrice: 155480 },
      { qty: 3500, originalPrice: 349000, discountPercent: 6, finalPrice: 328060 },
    ]
  },
  {
    name: 'EA SPORTS FC Mobile',
    slug: 'fc-mobile',
    badge: 'Promo',
    hasZone: false,
    userIdLabel: 'UID',
    userIdPlaceholder: 'Masukkan UID FC Mobile',
    zoneIdLabel: 'ZONE ID',
    zoneIdPlaceholder: 'Zone ID',
    zoneIdHint: '4 DIGIT',
    zoneIdMaxLength: 4,
    bgPosition: 'center',
    categoryName: 'Sports',
    categorySlug: 'sports',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/EA_Sports_FC_logo.svg/512px-EA_Sports_FC_logo.svg.png',
    bgUrl: 'https://images7.alphacoders.com/134/1345638.png',
    itemIconUrl: 'https://static.wikia.nocookie.net/fifa_gamepedia/images/5/52/Fifa_Points.png/revision/latest/scale-to-width-down/120',
    itemName: 'FC Points',
    items: [
      { qty: 100, originalPrice: 16000, discountPercent: 5, finalPrice: 15200 },
      { qty: 520, originalPrice: 79000, discountPercent: 5, finalPrice: 75050 },
      { qty: 1050, originalPrice: 159000, discountPercent: 10, finalPrice: 143100 },
      { qty: 2200, originalPrice: 329000, discountPercent: 8, finalPrice: 302680 },
      { qty: 5750, originalPrice: 799000, discountPercent: 6, finalPrice: 751060 },
    ]
  }
];

async function main() {
  console.log('Memulai penambahan game ke database...');

  for (const gameData of newGamesData) {
    console.log(`\nMemproses game: ${gameData.name}`);

    // 1. Ambil/buat kategori
    const category = await getCategory(gameData.categoryName, gameData.categorySlug);

    // 2. Download media assets dengan fallback
    const logoBuffer = await getBufferFromUrl(gameData.logoUrl, 'public/asset/logo.png');
    const bgBuffer = await getBufferFromUrl(gameData.bgUrl, 'public/asset/banner-default.png');
    const iconBuffer = await getBufferFromUrl(gameData.itemIconUrl, 'public/asset/tab-icon.png');

    // Map items list and insert itemName
    const mappedItems = gameData.items.map(item => ({
      qty: item.qty,
      itemName: gameData.itemName,
      originalPrice: item.originalPrice,
      discountPercent: item.discountPercent,
      finalPrice: item.finalPrice
    }));

    // 3. Upsert game
    const upsertedGame = await prisma.games.upsert({
      where: { slug: gameData.slug },
      update: {
        name: gameData.name,
        badge: gameData.badge,
        hasZone: gameData.hasZone,
        userIdLabel: gameData.userIdLabel,
        userIdPlaceholder: gameData.userIdPlaceholder,
        zoneIdLabel: gameData.zoneIdLabel,
        zoneIdPlaceholder: gameData.zoneIdPlaceholder,
        zoneIdHint: gameData.zoneIdHint,
        zoneIdMaxLength: gameData.zoneIdMaxLength,
        zoneOptions: { set: gameData.zoneOptions || [] },
        bgPosition: gameData.bgPosition,
        categoryId: category.id,
        items: mappedItems,
        // Update images only if they were successfully fetched/loaded
        ...(logoBuffer && { logo: logoBuffer }),
        ...(bgBuffer && { bg: bgBuffer }),
        ...(iconBuffer && { itemIcon: iconBuffer }),
      },
      create: {
        name: gameData.name,
        slug: gameData.slug,
        badge: gameData.badge,
        hasZone: gameData.hasZone,
        userIdLabel: gameData.userIdLabel,
        userIdPlaceholder: gameData.userIdPlaceholder,
        zoneIdLabel: gameData.zoneIdLabel,
        zoneIdPlaceholder: gameData.zoneIdPlaceholder,
        zoneIdHint: gameData.zoneIdHint,
        zoneIdMaxLength: gameData.zoneIdMaxLength,
        zoneOptions: { set: gameData.zoneOptions || [] },
        bgPosition: gameData.bgPosition,
        categoryId: category.id,
        items: mappedItems,
        logo: logoBuffer,
        bg: bgBuffer,
        itemIcon: iconBuffer,
      }
    });

    console.log(`Sukses menambahkan/mengupdate game: ${upsertedGame.name} (Slug: ${upsertedGame.slug})`);
  }

  console.log('\nSemua game baru berhasil ditambahkan!');
}

main()
  .catch(err => {
    console.error('Terjadi kesalahan saat seeding:', err);
  })
  .finally(() => {
    prisma.$disconnect();
  });
