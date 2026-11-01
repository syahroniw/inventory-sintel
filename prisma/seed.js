const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Mulai nyuntik data awal ke Supabase...');

  // 1. Bersihin data lama (kalau ada)
  await prisma.mutasi.deleteMany();
  await prisma.barang.deleteMany();
  await prisma.user.deleteMany();

  // 2. Insert 8 Akun Pegawai Sintel KAI
  const usersData = [
    { nipp: '87651', nama: 'Budi Santoso', password: 'password123' },
    { nipp: '87652', nama: 'Agus Setiawan', password: 'password123' },
    { nipp: '87653', nama: 'Siti Aminah', password: 'password123' },
    { nipp: '87654', nama: 'Syahroni W', password: 'password123' },
    { nipp: '87655', nama: 'Eko Prasetyo', password: 'password123' },
    { nipp: '87656', nama: 'Dwi Cahyono', password: 'password123' },
    { nipp: '87657', nama: 'Rina Kartika', password: 'password123' },
    { nipp: '87658', nama: 'Heri Gunawan', password: 'password123' },
  ];

  for (const u of usersData) {
    await prisma.user.create({ data: u });
  }
  console.log('✅ 8 Akun Karyawan Sintel berhasil dibuat!');

  // 3. Insert Data Barang Awal (Klaten)
  const barangData = [
    {
      idBarang: 'STLKT/6.5/HP/001',
      nama: 'CAT KUNING',
      kategori: 'Barang Habis Pakai',
      lokasi: 'KABINET 1 / RAK 3',
      jumlahAwal: 15,
      satuan: 'KALENG',
      jumlahAkhir: 14,
    },
    {
      idBarang: 'STLKT/6.5/SP/002',
      nama: 'REL R54',
      kategori: 'Spare Part / Suku Cadang',
      lokasi: 'AREA LUAR / RAK 1',
      jumlahAwal: 20,
      satuan: 'BATANG',
      jumlahAkhir: 15,
    },
    {
      idBarang: 'STLKT/6.5/AK/001',
      nama: 'MULTIMETER DIGITAL',
      kategori: 'Alat Kerja',
      lokasi: 'LEMARI ALAT / RAK 2',
      jumlahAwal: 5,
      satuan: 'UNIT',
      jumlahAkhir: 5,
    },
  ];

  for (const b of barangData) {
    await prisma.barang.create({ data: b });
  }
  console.log('✅ Data Barang Awal berhasil disimpan!');

  console.log('🎉 Seeding selesai! Supabase lu sekarang udah terisi.');
}

main()
  .catch((e) => {
    console.error('❌ Error pas seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });