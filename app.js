require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { customAlphabet } = require("nanoid");
const Url = require("./models/Url");

const app = express();
app.use(express.json());
app.use(cors({ origin: true }));

const PORT = 5000;
const BASE_URL =
  process.env.BASE_URL || "https://url-shortner-1-73j8.onrender.com";
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "changeme";
const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  7
);

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // options intentionally left default for mongoose v7+
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}
connectDB();

app.post("/api/shorten", async (req, res) => {
  try {
    const { longUrl, shortCode: requestedCode } = req.body;

    if (!longUrl || typeof longUrl !== "string") {
      return res.status(400).json({ error: "longUrl is required" });
    }

    try {
      new URL(longUrl);
    } catch (e) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    let shortCode = requestedCode && String(requestedCode).trim();

    if (shortCode) {
      if (!/^[A-Za-z0-9-_]+$/.test(shortCode)) {
        return res.status(400).json({
          error: "shortCode can only contain letters, numbers, - and _",
        });
      }
      const exists = await Url.findOne({ shortCode });
      if (exists) {
        return res.status(409).json({ error: "shortCode already in use" });
      }
    } else {
      let tries = 0;
      do {
        shortCode = nanoid();
        const exists = await Url.findOne({ shortCode });
        if (!exists) break;
        tries++;
      } while (tries < 5);

      if (tries >= 5) shortCode = nanoid(10);
    }

    const doc = await Url.create({ shortCode, longUrl });
    const shortUrl = `${BASE_URL}/${shortCode}`;

    res.status(201).json({ shortCode, shortUrl, longUrl });
  } catch (err) {
    console.error("POST /api/shorten error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/:shortCode", async (req, res) => {
  try {
    const shortCode = req.params.shortCode;
    const doc = await Url.findOneAndUpdate(
      { shortCode },
      { $inc: { visits: 1 } },
      { new: true }
    );

    if (!doc) return res.status(404).send("Short URL not found");

    return res.redirect(doc.longUrl);
  } catch (err) {
    console.error("GET /:shortCode error:", err);
    res.status(500).send("Server error");
  }
});

app.get("/api/admin/urls", async (req, res) => {
  const token = req.header("x-admin-token");
  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const all = await Url.find({}).sort({ createdAt: -1 }).lean();
    const data = all.map((u) => ({
      shortCode: u.shortCode,
      shortUrl: `${BASE_URL}/${u.shortCode}`,
      longUrl: u.longUrl,
      visits: u.visits,
      createdAt: u.createdAt,
    }));
    res.json({ urls: data });
  } catch (err) {
    console.error("GET /api/admin/urls error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on ${PORT}`);
  console.log(`Base URL: ${BASE_URL}`);
});
