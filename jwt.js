const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const jwtAuthMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).json({ error: "token not found" });
  //extract the token from the request header
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ error: "unauthorized" });

  try {
    //verify the jwt token
    const decoded = jwt.verify(token, JWT_SECRET);
    //attach user information to the request object
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "invalid token" });
  }
};

//function to generate jwt token

function generateJwtToken(userData) {
  return jwt.sign(userData, JWT_SECRET, { expiresIn: 30000 });
}

module.exports = { jwtAuthMiddleware, generateJwtToken };
