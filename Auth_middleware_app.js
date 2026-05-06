const express = require("express");
const cookie_parser = require("cookie-parser");
const app = express();
app.use(cookie_parser());
function authMiddleware(req, res, next) {
  const authHeader = req.header("Authorization");
  if (authHeader === "admin123") return next();
  return res.status(403).send("403 Access Denied");
}
app.get("/public", (req, res) => {
  res.send("Welcome to public route");
});
app.get("/private", authMiddleware, (req, res) => {
  res.send("Welcome to private route");
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

