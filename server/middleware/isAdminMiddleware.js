const jwt = require("jsonwebtoken");
const User = require("../models/User");
const isAdmin = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const jwtToken = token.split(" ")[1];

  try {
    const decoded = jwt.verify(jwtToken, process.env.SECRET_KEY);
    const userId = decoded?.userId;
    const user = await User.findOne({ _id: userId });
    if (user?.role === "admin") {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Access denied: Admin role required" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = isAdmin;
