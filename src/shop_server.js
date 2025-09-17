// src/shop_server.js
const http = require('http');
const url = require('url');
const shop = require('./data/shop');

function sendJSON(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // Route: /pets or /pets/:id
  if (path === '/pets' && method === 'GET') {
    // Get all pets
    sendJSON(res, 200, shop.getAllPets());
  } else if (path.match(/^\/pets\/(\d+)$/) && method === 'GET') {
    // Get pet by ID
    const id = parseInt(path.split('/')[2]);
    const pet = shop.getPetById(id);
    if (pet) sendJSON(res, 200, pet);
    else sendJSON(res, 404, { error: 'Pet not found' });
  } else if (path === '/pets' && method === 'POST') {
    // Add new pet
    try {
      const body = await parseBody(req);
      if (!body.name || !body.type || typeof body.age !== 'number') {
        sendJSON(res, 400, { error: 'Invalid pet data' });
        return;
      }
      const pet = shop.addPet(body);
      sendJSON(res, 201, pet);
    } catch {
      sendJSON(res, 400, { error: 'Invalid JSON' });
    }
  } else if (path.match(/^\/pets\/(\d+)$/) && method === 'PUT') {
    // Update pet
    const id = parseInt(path.split('/')[2]);
    try {
      const body = await parseBody(req);
      const updated = shop.updatePet(id, body);
      if (updated) sendJSON(res, 200, updated);
      else sendJSON(res, 404, { error: 'Pet not found' });
    } catch {
      sendJSON(res, 400, { error: 'Invalid JSON' });
    }
  } else if (path.match(/^\/pets\/(\d+)$/) && method === 'DELETE') {
    // Delete pet
    const id = parseInt(path.split('/')[2]);
    const deleted = shop.deletePet(id);
    if (deleted) sendJSON(res, 204, {});
    else sendJSON(res, 404, { error: 'Pet not found' });
  } else {
    sendJSON(res, 404, { error: 'Not found' });
  }
});

const PORT = process.env.SHOP_PORT || 4000;
if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Pet shop server running on port ${PORT}`);
  });
}

module.exports = server;
