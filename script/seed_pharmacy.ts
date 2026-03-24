
import { storage } from '../backend/src/storage';

async function seedPharmacies() {
    console.log("Seeding pharmacies...");

    try {
        const pharmacies = [
            {
                name: "Apollo Pharmacy",
                location: "Shop No 4, Ground Floor, Galaxy Towers, JM Road, Pune",
                contact: "+91 20-25531234",
                description: "India's largest and most trusted pharmacy network. 24/7 service available.",
                image: "/images/image_1.jpg",
                medicines: [
                    { name: "Dolo 650mg", description: "Paracetamol tablet for fever and mild pain.", price: "₹30", stock: 500, requiresPrescription: false, image: "/images/image_2.jpg" },
                    { name: "Azithral 500mg", description: "Antibiotic used for various bacterial infections.", price: "₹120", stock: 100, requiresPrescription: true, image: "/images/image_3.jpg" },
                    { name: "Shelcal 500", description: "Calcium and Vitamin D3 supplement for bone health.", price: "₹110", stock: 200, requiresPrescription: false, image: "/images/image_2.jpg" },
                    { name: "Pantocid 40mg", description: "Used for acidity, heartburn, and GERD.", price: "₹150", stock: 300, requiresPrescription: true, image: "/images/image_4.jpg" },
                    { name: "Volini Gel", description: "Pain relief gel for muscle and joint pain.", price: "₹85", stock: 150, requiresPrescription: false, image: "/images/image_7.jpg" }
                ]
            },
            {
                name: "MedPlus Chemist",
                location: "12, Laxmi Road, Near City Post Office, Pune",
                contact: "+91 20-24456789",
                description: "Genuine medicines at great discounts. Wide range of healthcare products.",
                image: "/images/image_5.jpg",
                medicines: [
                    { name: "Crocin Advance", description: "Fast relief from fever and headache.", price: "₹20", stock: 600, requiresPrescription: false, image: "/images/image_2.jpg" },
                    { name: "Augmentin 625 Duo", description: "Antibiotic for treating bacterial infections.", price: "₹200", stock: 80, requiresPrescription: true, image: "/images/image_3.jpg" },
                    { name: "Becosules Z", description: "Multivitamin capusles with Zinc and Vitamin C.", price: "₹45", stock: 400, requiresPrescription: false, image: "/images/image_2.jpg" },
                    { name: "Montair LC", description: "For allergic rhinitis and asthma symptoms.", price: "₹180", stock: 150, requiresPrescription: true, image: "/images/image_4.jpg" },
                    { name: "Digene Syrup", description: "Antacid gel for acidity and gas relief.", price: "₹130", stock: 200, requiresPrescription: false, image: "/images/image_7.jpg" }
                ]
            },
            {
                name: "Wellness Forever",
                location: "Opposite Ruby Hall Clinic, Sassoon Road, Pune",
                contact: "+91 20-66001122",
                description: "24-hour lifestyle pharmacy. Medicines, wellness, and more.",
                image: "/images/image_6.jpg",
                medicines: [
                    { name: "Revital H", description: "Daily health supplement for energy and immunity.", price: "₹300", stock: 100, requiresPrescription: false, image: "/images/image_2.jpg" },
                    { name: "Thyronorm 50mcg", description: "For treating hypothyroidism.", price: "₹140", stock: 250, requiresPrescription: true, image: "/images/image_2.jpg" },
                    { name: "Telma 40", description: "Used to treat high blood pressure.", price: "₹110", stock: 300, requiresPrescription: true, image: "/images/image_4.jpg" },
                    { name: "Dettol Antiseptic", description: "Liquid antiseptic for first aid and hygiene.", price: "₹80", stock: 500, requiresPrescription: false, image: "/images/image_7.jpg" },
                    { name: "Vicks VapoRub", description: "Relief from cold, cough, and blocked nose.", price: "₹40", stock: 400, requiresPrescription: false, image: "/images/image_2.jpg" }
                ]
            },
            {
                name: "Noble Plus Pharmacy",
                location: "Koregaon Park, Lane 5, Pune",
                contact: "+91 20-26154433",
                description: "Premium pharmacy and skincare store. Delivery across the city.",
                image: "/images/image_8.jpg",
                medicines: [
                    { name: "Cetaphil Cleanser", description: "Gentle skin cleanser for sensitive skin.", price: "₹450", stock: 50, requiresPrescription: false, image: "/images/image_7.jpg" },
                    { name: "Saridon", description: "Effective headache relief tablet.", price: "₹40", stock: 1000, requiresPrescription: false, image: "/images/image_2.jpg" },
                    { name: "Allegra 120mg", description: "Antihistamine for allergy relief.", price: "₹190", stock: 120, requiresPrescription: true, image: "/images/image_4.jpg" },
                    { name: "Electral Powder", description: "Oral rehydration salts (ORS).", price: "₹22", stock: 600, requiresPrescription: false, image: "/images/image_7.jpg" },
                    { name: "Ascoril LS", description: "Cough syrup for wet cough.", price: "₹115", stock: 180, requiresPrescription: true, image: "/images/image_7.jpg" }
                ]
            },
            {
                name: "Frank Ross Pharmacy",
                location: "FC Road, Shivajinagar, Pune",
                contact: "+91 20-25510099",
                description: "Trusted name in pharmacy since 1906. Genuine medicines.",
                image: "/images/image_9.jpg",
                medicines: [
                    { name: "Glucon-D", description: "Instant energy drink powder.", price: "₹60", stock: 300, requiresPrescription: false, image: "/images/image_7.jpg" },
                    { name: "Combiflam", description: "Pain killer and fever reducer.", price: "₹35", stock: 450, requiresPrescription: false, image: "/images/image_2.jpg" },
                    { name: "Sinarest", description: "Relief from cold, headache, and fever.", price: "₹55", stock: 350, requiresPrescription: false, image: "/images/image_2.jpg" },
                    { name: "Glycomet 500", description: "Diabetes medication (Metformin).", price: "₹45", stock: 200, requiresPrescription: true, image: "/images/image_4.jpg" },
                    { name: "Ecosprin 75", description: "Blood thinner used for heart health.", price: "₹15", stock: 500, requiresPrescription: true, image: "/images/image_2.jpg" }
                ]
            },
            {
                name: "Generic Aushadhi Kendra",
                location: "Near Railway Station, Pune",
                contact: "+91 20-26123456",
                description: "Government Pradhan Mantri Bhartiya Janaushadhi Pariyojana store.",
                image: "/images/image_10.jpg",
                medicines: [
                    { name: "Generic Paracetamol", description: "High quality generic paracetamol.", price: "₹10", stock: 1000, requiresPrescription: false, image: "/images/image_2.jpg" },
                    { name: "Generic Amoxicillin", description: "Effectice antibiotic suspension.", price: "₹40", stock: 200, requiresPrescription: true, image: "/images/image_3.jpg" },
                    { name: "Generic Omeprazole", description: "For acidity and gastric trouble.", price: "₹15", stock: 400, requiresPrescription: true, image: "/images/image_4.jpg" },
                    { name: "Generic Atorvastatin", description: "For lowering cholesterol.", price: "₹25", stock: 300, requiresPrescription: true, image: "/images/image_4.jpg" },
                    { name: "ORS Packet", description: "Oral Rehydration solution.", price: "₹5", stock: 800, requiresPrescription: false, image: "/images/image_7.jpg" }
                ]
            }
        ];

        for (const pharmacyData of pharmacies) {
            const { medicines, ...pData } = pharmacyData;
            const p = await storage.createPharmacy({
                ...pData,
                isAvailable: true
            });
            console.log(`Created Pharmacy: ${p.name}`);

            for (const mData of medicines) {
                await storage.createMedicine({
                    pharmacyId: p.id,
                    ...mData
                });
                console.log(`  - Added Medicine: ${mData.name}`);
            }
        }

        console.log("Comprehensive seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding data:", error);
        process.exit(1);
    }
}

seedPharmacies();
