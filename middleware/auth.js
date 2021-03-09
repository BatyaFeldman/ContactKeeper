//What is middleware?
//a function that has access to the request and response
//cycle and object. everytime we hit an endpoint, we can fire
//off middleware. in this case, middleware is checking to see if there
//is a token in the header

const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  //step 1: get token from header
  const token = req.header("x-auth-token");

  //step 2: check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  //step 3: if there is a token, we need to verify it
  try {
    //jwt.verify takes in the token and secret
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    //get the user payload from decoded and then add it to the request
    console.log("decoded", decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    //this will run if theres a token but its incorrect
    res.status(401).json({ msg: "Token is not valid" });
  }
};
