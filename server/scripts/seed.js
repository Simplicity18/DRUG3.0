require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Drug = require('../models/Drug');

const seedUsers = [
  { name: 'Admin User', email: 'admin@drugs.com', password: 'admin123', role: 'Admin' },
  { name: 'Pharmacist John', email: 'pharmacist@drugs.com', password: 'pharma123', role: 'Pharmacist' }
];

const seedDrugs = [
  { name: 'Paracetamol 500mg', batchNumber: 'BATCH-2024-001', manufacturer: 'Sun Pharma', expiryDate: new Date('2025-06-15'), quantity: 500, costPrice: 2.5, sellingPrice: 5, reorderLevel: 100, barcodeQR: 'PARA001' },
  { name: 'Amoxicillin 250mg', batchNumber: 'BATCH-2024-002', manufacturer: 'Cipla', expiryDate: new Date('2025-08-20'), quantity: 200, costPrice: 15, sellingPrice: 25, reorderLevel: 50, barcodeQR: 'AMOX002' },
  { name: 'Ibuprofen 400mg', batchNumber: 'BATCH-2024-003', manufacturer: 'Dr. Reddy\'s', expiryDate: new Date('2025-12-01'), quantity: 350, costPrice: 4, sellingPrice: 8, reorderLevel: 75, barcodeQR: 'IBUP003' },
  { name: 'Omeprazole 20mg', batchNumber: 'BATCH-2024-004', manufacturer: 'Lupin', expiryDate: new Date('2025-03-10'), quantity: 25, costPrice: 3, sellingPrice: 6, reorderLevel: 30, barcodeQR: 'OMEP004' },
  { name: 'Cetirizine 10mg', batchNumber: 'BATCH-2024-005', manufacturer: 'Glenmark', expiryDate: new Date('2025-09-25'), quantity: 150, costPrice: 1.5, sellingPrice: 3, reorderLevel: 50, barcodeQR: 'CETI005' },
  { name: 'Metformin 500mg', batchNumber: 'BATCH-2024-006', manufacturer: 'Zydus', expiryDate: new Date('2026-01-15'), quantity: 400, costPrice: 2, sellingPrice: 4, reorderLevel: 100, barcodeQR: 'METF006' },
  { name: 'Losartan 50mg', batchNumber: 'BATCH-2024-007', manufacturer: 'Torrent', expiryDate: new Date('2025-05-30'), quantity: 80, costPrice: 5, sellingPrice: 10, reorderLevel: 25, barcodeQR: 'LOST007' },
  { name: 'Azithromycin 500mg', batchNumber: 'BATCH-2024-008', manufacturer: 'Pfizer', expiryDate: new Date('2025-11-12'), quantity: 120, costPrice: 20, sellingPrice: 35, reorderLevel: 30, barcodeQR: 'AZIT008' },
  { name: 'Aspirin 75mg', batchNumber: 'BATCH-2024-009', manufacturer: 'Bayer', expiryDate: new Date('2025-07-08'), quantity: 250, costPrice: 1, sellingPrice: 2.5, reorderLevel: 75, barcodeQR: 'ASPR009' },
  { name: 'Pantoprazole 40mg', batchNumber: 'BATCH-2024-010', manufacturer: 'Mankind', expiryDate: new Date('2025-10-22'), quantity: 60, costPrice: 6, sellingPrice: 12, reorderLevel: 20, barcodeQR: 'PANT010' }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Drug.deleteMany({});

    for (const u of seedUsers) {
      await User.create(u);
    }
    console.log('Users seeded');

    for (const d of seedDrugs) {
      await Drug.create(d);
    }
    console.log('Drugs seeded');

    console.log('Seed completed successfully!');
    console.log('Login: admin@drugs.com / admin123 or pharmacist@drugs.com / pharma123');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();
