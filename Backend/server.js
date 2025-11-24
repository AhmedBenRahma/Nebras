const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); 
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());


const ScannedWordSchema = new mongoose.Schema({
  userId: String, word: String, timestamp: { type: Date, default: Date.now }
});
const ScannedWord = mongoose.model('ScannedWord', ScannedWordSchema);

app.post('/api/scan', async (req, res) => {
  const { userId, word } = req.body;
  if (!userId || !word) return res.status(400).send('Missing userId or word');
  const newScan = new ScannedWord({ userId, word });
  await newScan.save();
  res.status(201).send('Scan saved');
});

app.get('/api/frequent-words/:userId', async (req, res) => {
    const userId = req.params.userId;
    const frequentWords = await ScannedWord.aggregate([
        { $match: { userId: userId } },
        { $group: { _id: "$word", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 } 
    ]);
    res.json(frequentWords);
});

const counts = {};

app.post('/api/words', (req, res) => {
  const words = req.body.words || [];
  words.forEach(w => {
    if (typeof w !== 'string') return;
    const key = w.toLowerCase();
    counts[key] = (counts[key] || 0) + 1;
  });
  res.json({ success: true });
});

app.get('/api/frequencies', (req, res) => {
  const arr = Object.keys(counts).map(k => ({ word: k, count: counts[k] }));
  arr.sort((a,b) => b.count - a.count);
  res.json(arr);
});

app.listen(port, () => {
  console.log(`Serveur Backend EduSense opérationnel sur http://localhost:${port}`);
});
