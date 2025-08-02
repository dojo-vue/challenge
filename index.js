const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

// Configurable delays (ms) for specific queries
const delayConfig = {
  jerry: 8200, // 1.2s delay for ?name=jerry
  dave: 1200,   // 0.2s delay for ?name=dave
  default: 1000 // 0.1s delay for all other searches
};

// Helper to get delay for a query
function getDelay(query) {
  if (!query) return delayConfig.default;
  const q = query.toLowerCase();
  if (delayConfig[q] !== undefined) return delayConfig[q];
  return delayConfig.default;
}

// Load users from JSON
function loadUsers() {
  const filePath = path.join(__dirname, 'mockUsers.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

// Filter users by name (case-insensitive, substring match)
function filterUsersByName(users, nameQuery) {
  if (!nameQuery) return users;
  const q = nameQuery.toLowerCase();
  return users.filter(u => u.name.toLowerCase().includes(q));
}

app.get('/api/v1/users', async (req, res) => {
  const { name } = req.query;
  let users = loadUsers();
  users = filterUsersByName(users, name);
  const delay = getDelay(name);
  setTimeout(() => res.json(users), delay);
});

app.listen(PORT, () => {
  console.log(`Mock user API server running on http://localhost:${PORT}`);
});