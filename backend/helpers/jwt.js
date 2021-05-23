const expressJwt = require("express-jwt");

function authJwt() {
  const secret = process.env.secret;
  const api = process.env.API_URL;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevokedCallback,
  }).unless({
    path: [
      //   { url: `${api}/products`, method: ["GET", "OPTIONS"] },
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/orders(.*)/, methods: ["GET", "OPTIONS", "POST"] },
      `${api}/users/login`,
      `${api}/users/register`,
    ],
  });
}

async function isRevokedCallback(req, payload, done) {
  if (!payload.isAdmin) {
    //done(null, true);
  }
  done();
}
module.exports = authJwt;
