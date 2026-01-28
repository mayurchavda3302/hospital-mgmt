
import { db } from "../backend/src/db";
import { sql } from "drizzle-orm";

async function clearPharmacyData() {
    try {
        console.log("Clearing existing pharmacy data...");
        // Order matters due to foreign keys: requests -> medicines -> pharmacies
        await db.execute(sql`DELETE FROM medicine_requests`);
        await db.execute(sql`DELETE FROM medicines`);
        await db.execute(sql`DELETE FROM pharmacies`);
        console.log("Pharmacy data cleared successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Error clearing data:", error);
        process.exit(1);
    }
}

clearPharmacyData();
