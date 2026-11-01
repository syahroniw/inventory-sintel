'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// 1. Ambil Semua Data Barang dari Supabase
export async function getInventory() {
  try {
    const items = await prisma.barang.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        mutasi: {
          take: 1,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    return { success: true, data: items };
  } catch (error) {
    console.error('Error fetch inventory:', error);
    return { success: false, error: 'Gagal narik data dari Supabase' };
  }
}

// 2. Tambah Barang Baru ke Supabase
export async function addBarang(formData: {
  nama: string;
  idBarang: string;
  kategori: string;
  lokasi: string;
  jumlahAwal: number;
  satuan: string;
}) {
  try {
    const newItem = await prisma.barang.create({
      data: {
        nama: formData.nama,
        idBarang: formData.idBarang,
        kategori: formData.kategori,
        lokasi: formData.lokasi,
        jumlahAwal: Number(formData.jumlahAwal),
        satuan: formData.satuan,
        jumlahAkhir: Number(formData.jumlahAwal),
      },
    });

    revalidatePath('/admin/inventory');
    revalidatePath('/admin');
    return { success: true, data: newItem };
  } catch (error: any) {
    console.error('Error add barang:', error);
    // Kalau error unik (P2002)
    if (error?.code === 'P2002') {
      return { success: false, error: 'No. ID Barang sudah terdaftar! Gunakan ID lain.' };
    }
    return { success: false, error: error?.message || 'Gagal nambah barang ke Supabase!' };
  }
}

// 3. Catat Penggunaan Barang (Ngurangin Stok + Log Mutasi)
// 5. Catat Penggunaan (Pakai) Barang + Keterangan
export async function recordUsage(data: {
  id: string;
  jumlahPakai: number;
  tanggal: string;
  keterangan?: string; // <-- Ini obat dari error merah lu
  userId?: string;
}) {
  try {
    const barang = await prisma.barang.findUnique({ where: { id: data.id } });
    if (!barang) return { success: false, error: 'Barang tidak ditemukan' };
    if (barang.jumlahAkhir < data.jumlahPakai) return { success: false, error: 'Stok tidak cukup!' };

    let user = await prisma.user.findFirst();
    const activeUserId = data.userId || user?.id;

    if (!activeUserId) {
      return { success: false, error: 'User tidak terdaftar!' };
    }

    const newAkhir = barang.jumlahAkhir - Number(data.jumlahPakai);

    await prisma.$transaction([
      prisma.barang.update({
        where: { id: data.id },
        data: { jumlahAkhir: newAkhir },
      }),
      prisma.mutasi.create({
        data: {
          barangId: barang.id,
          userId: activeUserId,
          tipe: 'KELUAR',
          jumlah: Number(data.jumlahPakai),
          tanggal: data.tanggal,
          // Sekarang dia bakal nyatet keterangan, kalau kosong defaultnya "Dipakai"
          keterangan: data.keterangan || 'Barang dipakai / diambil', 
        },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error('Error record usage:', error);
    return { success: false, error: 'Gagal mencatat penggunaan!' };
  }
}

// 4. Hapus Barang dari Supabase
export async function deleteBarang(id: string) {
  try {
    await prisma.barang.delete({ where: { id } });
    revalidatePath('/admin/inventory');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Error delete barang:', error);
    return { success: false, error: 'Gagal menghapus barang!' };
  }
}

// 5. Ambil Statistik Dashboard secara Real-time
export async function getDashboardStats() {
  try {
    const totalItems = await prisma.barang.count();
    
    // Barang dianggap kritis kalau stok akhir <= 3
    const criticalItems = await prisma.barang.findMany({
      where: { jumlahAkhir: { lte: 3 } },
      orderBy: { jumlahAkhir: 'asc' },
    });
    
    const safeItemsCount = totalItems - criticalItems.length;

    // Hitung per kategori
    const categoryHP = await prisma.barang.count({ where: { kategori: 'Barang Habis Pakai' } });
    const categorySP = await prisma.barang.count({ where: { kategori: 'Spare Part / Suku Cadang' } });
    const categoryAK = await prisma.barang.count({ where: { kategori: 'Alat Kerja' } });

    // Total pegawai aktif
    const userCount = await prisma.user.count();

    // 5 Mutasi terakhir
    const recentActivities = await prisma.mutasi.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        barang: true,
        user: true,
      },
    });

    return {
      success: true,
      stats: {
        totalItems,
        safeItemsCount,
        criticalCount: criticalItems.length,
        criticalItems,
        categories: {
          hp: categoryHP,
          sp: categorySP,
          ak: categoryAK,
        },
        userCount,
        recentActivities,
      },
    };
  } catch (error) {
    console.error('Error fetch dashboard stats:', error);
    return { success: false, error: 'Gagal memuat data statistik dashboard!' };
  }
}

// 6. Restock / Tambah Stok Barang Lama (Nambah Stok + Log Mutasi MASUK)
export async function restockBarang(data: {
  id: string; // ID unik database
  jumlahTambah: number;
  tanggal: string;
  userId?: string;
}) {
  try {
    const barang = await prisma.barang.findUnique({ where: { id: data.id } });
    if (!barang) return { success: false, error: 'Barang tidak ditemukan' };

    let user = await prisma.user.findFirst();
    const activeUserId = data.userId || user?.id;

    if (!activeUserId) {
      return { success: false, error: 'User tidak terdaftar!' };
    }

    const newAkhir = barang.jumlahAkhir + Number(data.jumlahTambah);

    await prisma.$transaction([
      prisma.barang.update({
        where: { id: data.id },
        data: { jumlahAkhir: newAkhir },
      }),
      prisma.mutasi.create({
        data: {
          barangId: barang.id,
          userId: activeUserId,
          tipe: 'MASUK',
          jumlah: Number(data.jumlahTambah),
          tanggal: data.tanggal,
          keterangan: 'Restock / Penambahan stok rutin',
        },
      }),
    ]);

    revalidatePath('/admin/inventory');
    revalidatePath('/admin');
    revalidatePath('/admin/laporan');
    return { success: true };
  } catch (error) {
    console.error('Error restock:', error);
    return { success: false, error: 'Gagal mencatat penambahan stok!' };
  }
}

// 7. Ambil Data Laporan Mutasi Full (Masuk & Keluar)
export async function getLaporanMutasi() {
  try {
    const mutasi = await prisma.mutasi.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        barang: true,
        user: true,
      },
    });
    return { success: true, data: mutasi };
  } catch (error) {
    console.error('Error fetch laporan:', error);
    return { success: false, error: 'Gagal menarik data laporan!' };
  }
}

// 8. Fitur PINJAM Alat Kerja
export async function pinjamAlat(data: { id: string; jumlah: number; tanggal: string; keterangan: string; userId?: string }) {
  try {
    const barang = await prisma.barang.findUnique({ where: { id: data.id } });
    if (!barang) return { success: false, error: 'Barang tidak ditemukan' };
    if (barang.jumlahAkhir < data.jumlah) return { success: false, error: 'Stok alat tidak cukup untuk dipinjam!' };

    let user = await prisma.user.findFirst();
    const activeUserId = data.userId || user?.id;

    if (!activeUserId) return { success: false, error: 'User tidak terdaftar!' };

    const newAkhir = barang.jumlahAkhir - Number(data.jumlah); // Stok berkurang sementara

    await prisma.$transaction([
      prisma.barang.update({ where: { id: data.id }, data: { jumlahAkhir: newAkhir } }),
      prisma.mutasi.create({
        data: {
          barangId: barang.id, userId: activeUserId, tipe: 'PINJAM', // Tipe khusus pinjam
          jumlah: Number(data.jumlah), tanggal: data.tanggal, keterangan: data.keterangan,
        },
      }),
    ]);

    revalidatePath('/admin/inventory'); revalidatePath('/admin'); revalidatePath('/admin/laporan');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal mencatat peminjaman!' };
  }
}

// 9. Fitur KEMBALIKAN Alat Kerja
export async function kembalikanAlat(data: { id: string; jumlah: number; tanggal: string; keterangan: string; userId?: string }) {
  try {
    const barang = await prisma.barang.findUnique({ where: { id: data.id } });
    if (!barang) return { success: false, error: 'Barang tidak ditemukan' };

    let user = await prisma.user.findFirst();
    const activeUserId = data.userId || user?.id;

    if (!activeUserId) return { success: false, error: 'User tidak terdaftar!' };

    const newAkhir = barang.jumlahAkhir + Number(data.jumlah); // Stok balik lagi

    await prisma.$transaction([
      prisma.barang.update({ where: { id: data.id }, data: { jumlahAkhir: newAkhir } }),
      prisma.mutasi.create({
        data: {
          barangId: barang.id, userId: activeUserId, tipe: 'KEMBALI', // Tipe khusus kembali
          jumlah: Number(data.jumlah), tanggal: data.tanggal, keterangan: data.keterangan,
        },
      }),
    ]);

    revalidatePath('/admin/inventory'); revalidatePath('/admin'); revalidatePath('/admin/laporan');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Gagal mencatat pengembalian!' };
  }
}