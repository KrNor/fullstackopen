const tokenExtractor = (request, response, next) => {
  // console.log("extracting the tolken");
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
    // console.log(request.token);
  }
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
  }
  next(error);
};

module.exports = {
  tokenExtractor,
  errorHandler,
};
