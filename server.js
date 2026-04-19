const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const app = express();

app.use(express.json());
app.use(express.static("public"));

// 🔐 SUPABASE CONFIG
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// 🖼️ Images (tu peux garder ton dossier images OU liste)
const images = [
  { id: "img1", url: "/images/img1.jpg" },
  { id: "img2", url: "/images/img2.jpg" },
  { id: "img3", url: "/images/img3.jpg" }
];

// 🎲 image aléatoire
app.get("/random-image", (req, res) => {
  const img = images[Math.floor(Math.random() * images.length)];
  res.json(img);
});

// 💾 enregistrement tags
app.post("/tag", async (req, res) => {
  const { image_id, tags } = req.body;

  const { error } = await supabase
    .from("annotations")
    .insert([{ image_id, tags }]);

  if (error) return res.status(500).json({ error });

  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));