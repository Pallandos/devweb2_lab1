// src/utils_shop.js
module.exports = function getRequestData(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => resolve(body));
    req.on('error', err => reject(err));
  });
};
