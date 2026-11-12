const prisma = require("../prismaClient");
const { getCache, setCache, deleteCache } = require("../utils/redisClient");

const CACHE_KEY = "public:partners";

const getPublicPartners = async (req, res) => {
    try {
        const cached = await getCache(CACHE_KEY);
        if (cached) return res.status(200).json(cached);

        const partners = await prisma.partner.findMany({
            where: { isActive: true },
            select: { id: true, name: true, city: true, lat: true, lng: true, hubType: true },
            orderBy: { createdAt: "desc" },
        });

        await setCache(CACHE_KEY, partners, 3600);
        return res.status(200).json(partners);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const geocodeCity = async (city) => {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(city)}`,
        { headers: { "User-Agent": "ShipNex-Backend/1.0" } }
    );
    if (!res.ok) return null;
    const [place] = await res.json();
    return place ? { lat: parseFloat(place.lat), lng: parseFloat(place.lon) } : null;
};

const createPartner = async (req, res) => {
    const { name, city, hubType } = req.body;
    let { lat, lng } = req.body;

    if (!name || !city || !hubType) {
        return res.status(400).json({ error: "name, city, and hubType are required." });
    }

    try {
        if (lat === undefined || lng === undefined) {
            const coords = await geocodeCity(city);
            if (!coords) {
                return res.status(400).json({ error: "Could not geocode city. Please provide lat and lng." });
            }
            lat = coords.lat;
            lng = coords.lng;
        }

        const partner = await prisma.partner.create({
            data: { name, city, lat: Number(lat), lng: Number(lng), hubType },
        });
        await deleteCache(CACHE_KEY);
        return res.status(201).json(partner);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { getPublicPartners, createPartner };