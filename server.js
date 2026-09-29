const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.join(__dirname, "data");
const CONTACTS_FILE = path.join(DATA_DIR, "contacts.json");

fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(CONTACTS_FILE)) fs.writeFileSync(CONTACTS_FILE, "[]", "utf8");

app.disable("x-powered-by");
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: false, limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

const portfolio = {
  name: "QezraTheGreat",
  title: "Minecraft Developer",
  availability: "Open to select projects",
  intro: "I build Minecraft server experiences, practical systems, and community tools. From server setup to custom gameplay features, I turn ideas into reliable, player-friendly experiences.",
  about: "QezraTheGreat is a Minecraft developer focused on server systems, configuration, community experiences, and web tools. This portfolio is a living showcase—project details and metrics can be updated as work is completed.",
  stats: { projects: "—", clients: "—", servers: "—", experience: "Building" },
  skills: ["Paper", "Spigot", "Bukkit", "Java", "Velocity", "Geyser", "LuckPerms", "DeluxeMenus", "MySQL", "Linux", "Discord Integration", "Web Development"],
  services: [
    ["01", "Minecraft Server Setup", "Server configuration, proxy networks, permissions, and gameplay setup."],
    ["02", "Plugin & Gameplay Systems", "Custom features, menus, ranks, economy, and server mechanics."],
    ["03", "Network Configuration", "Velocity, cross-version support, and Java/Bedrock connectivity."],
    ["04", "Optimization & Troubleshooting", "Log review, configuration checks, and performance-focused fixes."],
    ["05", "Discord Integration", "Community utilities and links between server and Discord workflows."],
    ["06", "Web Development", "Portfolio sites, community pages, and lightweight dashboards."]
  ],
  projects: [
    { name: "PeakyMC", category: "Minecraft Network", description: "A Minecraft network project involving server setup, gameplay configuration, and community-facing features.", tags: ["Minecraft", "Velocity", "Server Systems"], url: "" },
    { name: "HappyMC", category: "Minecraft Server", description: "Minecraft server project. Add your role, features delivered, and server link here.", tags: ["Minecraft", "Server Development"], url: "" },
    { name: "WoodMC", category: "Minecraft Server", description: "Minecraft server project. Add your role, features delivered, and server link here.", tags: ["Minecraft", "Server Development"], url: "" },
    { name: "Minecraft Web Projects", category: "Web Development", description: "Modern web experiences for Minecraft communities, designed to be clear, responsive, and easy to maintain.", tags: ["HTML", "CSS", "JavaScript"], url: "" },
    { name: "Custom Server Systems", category: "Server Development", description: "Configuration and integration work for practical gameplay systems and server operations.", tags: ["Paper", "Plugins", "Configuration"], url: "" }
  ],
  contact: { discord: "QezraTheGreat", email: "", github: "" }
};

app.get("/api/portfolio", (_req, res) => res.json(portfolio));

const recentRequests = new Map();
app.post("/api/contact", (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const last = recentRequests.get(ip) || 0;
  if (now - last < 30_000) {
    return res.status(429).json({ error: "Please wait a little before sending another message." });
  }

  const { name, email, message, website } = req.body || {};
  // Honeypot field: real visitors should leave this blank.
  if (website) return res.status(200).json({ ok: true, message: "Message received." });

  const clean = value => typeof value === "string" ? value.trim() : "";
  const safeName = clean(name).slice(0, 80);
  const safeEmail = clean(email).slice(0, 160);
  const safeMessage = clean(message).slice(0, 3000);
  if (safeName.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeEmail) || safeMessage.length < 10) {
    return res.status(400).json({ error: "Enter a name, valid email, and message (at least 10 characters)." });
  }

  const record = {
    id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
    name: safeName,
    email: safeEmail,
    message: safeMessage,
    createdAt: new Date(now).toISOString()
  };

  try {
    const records = JSON.parse(fs.readFileSync(CONTACTS_FILE, "utf8"));
    records.push(record);
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(records, null, 2), "utf8");
    recentRequests.set(ip, now);
    return res.status(201).json({ ok: true, message: "Thanks! Your message was received." });
  } catch (error) {
    console.error("Could not save contact message:", error);
    return res.status(500).json({ error: "Message could not be saved right now. Please try again later." });
  }
});

app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.listen(PORT, () => console.log(`QezraTheGreat portfolio running at http://localhost:${PORT}`));