const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use('/images', express.static('images'));

// Charger les images
const images = fs.readdirSync('./images');

// Charger tags
let tags = {};
if (fs.existsSync('tags.json')) {
  tags = JSON.parse(fs.readFileSync('tags.json'));
}

// Image aléatoire
app.get('/random-image', (req, res) => {
  const taggedImages = Object.keys(tags);

  const untagged = images.filter(img => !taggedImages.includes(img));

  const pool = untagged.length > 0 ? untagged : images;

  const random = pool[Math.floor(Math.random() * pool.length)];

  res.json({ id: random, url: '/images/' + random });
});

// Sauvegarder tag
app.post('/tag', (req, res) => {
  const { image_id, tag } = req.body;

  if (!tags[image_id]) {
    tags[image_id] = [];
  }

  tags[image_id].push(tag);

  // écriture "sécurisée" simple
  fs.writeFile('tags.json', JSON.stringify(tags, null, 2), (err) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    res.sendStatus(200);
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});