// Run once: node resetDoctorPasswords.js
// This sets all seeded doctor passwords to "doctor123"

require("dotenv").config();
const bcrypt = require("bcryptjs");
const db     = require("./config/db");

const doctors = [
  { email: "aisha@clinic.com"  },
  { email: "ravi@clinic.com"   },
  { email: "priya@clinic.com"  },
  { email: "suresh@clinic.com" },
  { email: "fatima@clinic.com" },
  { email: "arjun@clinic.com"  },
];

(async () => {
  try {
    const hash = await bcrypt.hash("doctor123", 10);
    console.log("Generated hash:", hash);

    for (const doc of doctors) {
      const [result] = await db.query(
        "UPDATE doctors SET password = ? WHERE email = ?",
        [hash, doc.email]
      );
      if (result.affectedRows) {
        console.log(`✅ Updated: ${doc.email}`);
      } else {
        console.log(`⚠️  Not found: ${doc.email} — run seed.sql first`);
      }
    }

    console.log("\n✅ Done! All doctors password is now: doctor123");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
})();