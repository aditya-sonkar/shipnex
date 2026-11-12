try { process.loadEnvFile(); } catch { }
const prisma = require("../src/prismaClient");

const seedPartners = [
    // ── India (3) ───────────────────────────────────────────────
    { name: "Change Networks", city: "Navi Mumbai, IN", lat: 19.111677444460938, lng: 73.01596085488812, hubType: "Enterprise ICT Partner" },
    { name: "Delhivery HQ", city: "Gurugram, IN", lat: 28.455247994931085, lng: 77.07078473191905, hubType: "North India Express Hub" },
    { name: "TVS Supply Chain", city: "Chennai, IN", lat: 13.012338425946346, lng: 80.20349298682889, hubType: "South India Logistics Hub" },

    // ── Middle East & Africa (3) ────────────────────────────────
    { name: "Change Networks LLC", city: "Dubai, AE", lat: 25.271335149493822, lng: 55.302661566336596, hubType: "MENA ICT Distribution Hub" },
    { name: "DP World Jebel Ali", city: "Dubai, AE", lat: 24.997105716723294, lng: 55.08178207955978, hubType: "MENA Free Zone Port" },
    { name: "Maersk Cape Town", city: "Cape Town, ZA", lat: -33.88483188390057, lng: 18.53044779399015, hubType: "Southern Africa Gateway" },

    // ── Europe (3) ──────────────────────────────────────────────
    { name: "Port of Rotterdam", city: "Rotterdam, NL", lat: 51.96481046283217, lng: 4.036951519373967, hubType: "European Sea Gateway" },
    { name: "DHL Group HQ", city: "Bonn, DE", lat: 50.71559753155243, lng: 7.127027572770088, hubType: "Central Europe Freight Hub" },
    { name: "Hamburg Cargo GmbH", city: "Hamburg, DE", lat: 53.5511, lng: 9.9937, hubType: "Rail & Road Partner" },

    // ── Asia-Pacific & Oceania (4) ──────────────────────────────
    { name: "Kerry Logistics", city: "Hong Kong, HK", lat: 22.363739114878197, lng: 114.12155363185241, hubType: "East Asia Trade Hub" },
    { name: "PSA Horizons", city: "Singapore, SG", lat: 1.2746470276875816, lng: 103.79065449085896, hubType: "Global Transshipment" },
    { name: "Tokyo Bay Logistics", city: "Tokyo, JP", lat: 35.6762, lng: 139.6503, hubType: "Pacific Air Freight" },
    { name: "Sydney Pacific Terminal", city: "Sydney, AU", lat: -33.8688, lng: 151.2093, hubType: "Oceania Freight Hub" },

    // ── Americas (3) ────────────────────────────────────────────
    { name: "Flexport HQ", city: "San Francisco, US", lat: 37.79401869642545, lng: -122.39799890129491, hubType: "Trans-Pacific Supply Chain" },
    { name: "Newark Atlantic Freight", city: "Newark, US", lat: 40.6895, lng: -74.1745, hubType: "US East Coast Gateway" },
    { name: "Santos Atlantic Cargo", city: "Santos, BR", lat: -23.9608, lng: -46.3336, hubType: "South America Sea Hub" },
];

async function main() {
    await prisma.partner.deleteMany({});
    await prisma.partner.createMany({ data: seedPartners });
    console.log(">>> Seeded", seedPartners.length, "partners successfully!");
}

main()
    .catch((e) => console.error(e))
    .finally(() => prisma.$disconnect());
