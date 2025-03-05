const User = require("../models/user");
const jwt = require("jsonwebtoken");
const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
    // console.log(request.token);
  }
  next();
};

// I am assuming I need to extract the whole user object not just id.
const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);
  if (!user) {
    return response.status(401).json({ error: "token invalid" });
  }
  request.user = user;

  next();
};

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response.status(400).send({
      error: "The username is already taken, please pick another one",
    });
  } else if (error.message === "bad password") {
    return response.status(400).json({
      error: "please write a password that is at least 3 letters long",
    });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token invalid" });
  } else if (error.name === "TokenExpiredError") {
    return response
      .status(401)
      .json({ error: "The token expired please relogin" });
  }
  next(error);
};

module.exports = {
  tokenExtractor,
  errorHandler,
  userExtractor,
};
