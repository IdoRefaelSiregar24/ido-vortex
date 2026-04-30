export const obatData = [
  {
    id: "OBT-001",
    nama: "Paracetamol 500mg",
    kategori: "Obat Bebas",
    harga: 15000,
    stok: 250,
    kadaluarsa: "2027-06-15",
    deskripsi: "Pereda nyeri dan penurun demam"
  },
  {
    id: "OBT-002",
    nama: "Amoxicillin 500mg",
    kategori: "Obat Keras",
    harga: 35000,
    stok: 120,
    kadaluarsa: "2027-03-20",
    deskripsi: "Antibiotik untuk infeksi bakteri"
  },
  {
    id: "OBT-003",
    nama: "Vitamin C 1000mg",
    kategori: "Suplemen",
    harga: 25000,
    stok: 300,
    kadaluarsa: "2027-12-01",
    deskripsi: "Suplemen daya tahan tubuh"
  },
  {
    id: "OBT-004",
    nama: "Omeprazole 20mg",
    kategori: "Obat Keras",
    harga: 45000,
    stok: 80,
    kadaluarsa: "2027-01-10",
    deskripsi: "Obat maag dan asam lambung"
  },
  {
    id: "OBT-005",
    nama: "Cetirizine 10mg",
    kategori: "Obat Bebas Terbatas",
    harga: 20000,
    stok: 150,
    kadaluarsa: "2027-09-25",
    deskripsi: "Antihistamin untuk alergi"
  },
  {
    id: "OBT-006",
    nama: "Ibuprofen 400mg",
    kategori: "Obat Bebas Terbatas",
    harga: 18000,
    stok: 200,
    kadaluarsa: "2027-07-30",
    deskripsi: "Anti inflamasi dan pereda nyeri"
  },
  {
    id: "OBT-007",
    nama: "Metformin 500mg",
    kategori: "Obat Keras",
    harga: 30000,
    stok: 90,
    kadaluarsa: "2027-04-12",
    deskripsi: "Obat diabetes tipe 2"
  },
  {
    id: "OBT-008",
    nama: "Antangin Cair",
    kategori: "Obat Bebas",
    harga: 8000,
    stok: 400,
    kadaluarsa: "2027-11-05",
    deskripsi: "Obat masuk angin herbal"
  },
  {
    id: "OBT-009",
    nama: "Promag Tablet",
    kategori: "Obat Bebas",
    harga: 12000,
    stok: 350,
    kadaluarsa: "2027-08-18",
    deskripsi: "Obat sakit maag"
  },
  {
    id: "OBT-010",
    nama: "Dexamethasone 0.5mg",
    kategori: "Obat Keras",
    harga: 22000,
    stok: 60,
    kadaluarsa: "2027-02-28",
    deskripsi: "Kortikosteroid anti inflamasi"
  }
];

export const transaksiData = [
  {
    transaksiId: "TRX-001",
    pelanggan: "Andi Pratama",
    tanggal: "2026-04-25",
    status: "Selesai",
    totalHarga: 85000,
    items: [
      { nama: "Paracetamol 500mg", qty: 2, harga: 15000 },
      { nama: "Vitamin C 1000mg", qty: 1, harga: 25000 },
      { nama: "Antangin Cair", qty: 2, harga: 8000 }
    ],
    pelangganDetail: {
      id: "PLG-001",
      nama: "Andi Pratama",
      email: "andi.pratama@gmail.com",
      telepon: "081234567001"
    }
  },
  {
    transaksiId: "TRX-002",
    pelanggan: "Siti Rahmawati",
    tanggal: "2026-04-25",
    status: "Selesai",
    totalHarga: 120000,
    items: [
      { nama: "Amoxicillin 500mg", qty: 2, harga: 35000 },
      { nama: "Paracetamol 500mg", qty: 1, harga: 15000 },
      { nama: "Omeprazole 20mg", qty: 1, harga: 45000 }
    ],
    pelangganDetail: {
      id: "PLG-002",
      nama: "Siti Rahmawati",
      email: "siti.rahmawati@gmail.com",
      telepon: "081234567002"
    }
  },
  {
    transaksiId: "TRX-003",
    pelanggan: "Budi Santoso",
    tanggal: "2026-04-24",
    status: "Pending",
    totalHarga: 56000,
    items: [
      { nama: "Cetirizine 10mg", qty: 1, harga: 20000 },
      { nama: "Ibuprofen 400mg", qty: 2, harga: 18000 }
    ],
    pelangganDetail: {
      id: "PLG-003",
      nama: "Budi Santoso",
      email: "budi.santoso@gmail.com",
      telepon: "081234567003"
    }
  },
  {
    transaksiId: "TRX-004",
    pelanggan: "Dewi Anggraini",
    tanggal: "2026-04-24",
    status: "Dibatalkan",
    totalHarga: 30000,
    items: [
      { nama: "Metformin 500mg", qty: 1, harga: 30000 }
    ],
    pelangganDetail: {
      id: "PLG-004",
      nama: "Dewi Anggraini",
      email: "dewi.anggraini@gmail.com",
      telepon: "081234567004"
    }
  },
  {
    transaksiId: "TRX-005",
    pelanggan: "Eko Purnomo",
    tanggal: "2026-04-23",
    status: "Selesai",
    totalHarga: 75000,
    items: [
      { nama: "Vitamin C 1000mg", qty: 3, harga: 25000 }
    ],
    pelangganDetail: {
      id: "PLG-005",
      nama: "Eko Purnomo",
      email: "eko.purnomo@gmail.com",
      telepon: "081234567005"
    }
  },
  {
    transaksiId: "TRX-006",
    pelanggan: "Rina Fitri",
    tanggal: "2026-04-23",
    status: "Selesai",
    totalHarga: 147000,
    items: [
      { nama: "Amoxicillin 500mg", qty: 1, harga: 35000 },
      { nama: "Omeprazole 20mg", qty: 2, harga: 45000 },
      { nama: "Dexamethasone 0.5mg", qty: 1, harga: 22000 }
    ],
    pelangganDetail: {
      id: "PLG-006",
      nama: "Rina Fitri",
      email: "rina.fitri@gmail.com",
      telepon: "081234567006"
    }
  },
  {
    transaksiId: "TRX-007",
    pelanggan: "Hadi Saputra",
    tanggal: "2026-04-22",
    status: "Pending",
    totalHarga: 46000,
    items: [
      { nama: "Promag Tablet", qty: 2, harga: 12000 },
      { nama: "Cetirizine 10mg", qty: 1, harga: 20000 }
    ],
    pelangganDetail: {
      id: "PLG-007",
      nama: "Hadi Saputra",
      email: "hadi.saputra@gmail.com",
      telepon: "081234567007"
    }
  },
  {
    transaksiId: "TRX-008",
    pelanggan: "Maya Indahsari",
    tanggal: "2026-04-22",
    status: "Selesai",
    totalHarga: 93000,
    items: [
      { nama: "Paracetamol 500mg", qty: 3, harga: 15000 },
      { nama: "Ibuprofen 400mg", qty: 1, harga: 18000 },
      { nama: "Antangin Cair", qty: 3, harga: 8000 }
    ],
    pelangganDetail: {
      id: "PLG-008",
      nama: "Maya Indahsari",
      email: "maya.indahsari@gmail.com",
      telepon: "081234567008"
    }
  }
];

export const pelangganData = [
  { id: "PLG-001", nama: "Andi Pratama", email: "andi.pratama@gmail.com", telepon: "081234567001", alamat: "Jl. Sudirman No. 12, Pekanbaru" },
  { id: "PLG-002", nama: "Siti Rahmawati", email: "siti.rahmawati@gmail.com", telepon: "081234567002", alamat: "Jl. Riau No. 45, Pekanbaru" },
  { id: "PLG-003", nama: "Budi Santoso", email: "budi.santoso@gmail.com", telepon: "081234567003", alamat: "Jl. Harapan Raya No. 8, Pekanbaru" },
  { id: "PLG-004", nama: "Dewi Anggraini", email: "dewi.anggraini@gmail.com", telepon: "081234567004", alamat: "Jl. Soekarno-Hatta No. 78, Pekanbaru" },
  { id: "PLG-005", nama: "Eko Purnomo", email: "eko.purnomo@gmail.com", telepon: "081234567005", alamat: "Jl. Arifin Ahmad No. 33, Pekanbaru" },
  { id: "PLG-006", nama: "Rina Fitri", email: "rina.fitri@gmail.com", telepon: "081234567006", alamat: "Jl. HR. Soebrantas KM 12, Pekanbaru" },
  { id: "PLG-007", nama: "Hadi Saputra", email: "hadi.saputra@gmail.com", telepon: "081234567007", alamat: "Jl. Hang Tuah No. 56, Pekanbaru" },
  { id: "PLG-008", nama: "Maya Indahsari", email: "maya.indahsari@gmail.com", telepon: "081234567008", alamat: "Jl. Nangka No. 21, Pekanbaru" }
];
