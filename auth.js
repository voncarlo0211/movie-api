const jwt = require("jsonwebtoken");
const secret = "movieCatalogAPI";

module.exports.createAccessToken = (user) => {
  // When the user logs in, a token will be created with the user's information
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  // the sign() method is used to generate a JSON web token/access token
  // it will generate the token with the data/user's information as the payload, secret code and no additional options
  return jwt.sign(data, secret, {});
};

module.exports.verify = (req, res, next) => {
  console.log(req.headers.authorization);

  // let token = Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2M2NiNzg0ZTgzNThiNWZjZWJlOTZjNCIsImVtYWlsIjoianNtaXRoQG1haWwuY29tIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTcxNTMzNTkzMn0.ZIipYLL90I18cAMdUWWFl6IJIujdSAuUfna6_mjjtwc
  let token = req.headers.authorization;

  // if there is no value in the request headers authorization token, then it will equal to undefined
  if (typeof token === "undefined") {
    return res.send({ auth: "Failed. No Token" });
  } else {
    console.log(token);
    // token = Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2M2NiNzg0ZTgzNThiNWZjZWJlOTZjNCIsImVtYWlsIjoianNtaXRoQG1haWwuY29tIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTcxNTMzNTkzMn0.ZIipYLL90I18cAMdUWWFl6IJIujdSAuUfna6_mjjtwc
    token = token.slice(7, token.length);
    // token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2M2NiNzg0ZTgzNThiNWZjZWJlOTZjNCIsImVtYWlsIjoianNtaXRoQG1haWwuY29tIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTcxNTMzNTkzMn0.ZIipYLL90I18cAMdUWWFl6IJIujdSAuUfna6_mjjtwc
    console.log(token);

    // verify() method to decrypt the token
    jwt.verify(token, secret, function (err, decodedToken) {
      if (err) {
        return res.send({
          auth: "Failed",
          message: err.message,
        });
      } else {
        /*
					{
						id: '663cb784e8358b5fcebe96c4',
						email: 'jsmith@mail.com',
						isAdmin: false,
						iat: 1715335932
					}
				*/
        console.log("Result from verify method:");
        console.log(decodedToken);

        /*
					req.user = {
						id: '663cb784e8358b5fcebe96c4',
						email: 'jsmith@mail.com',
						isAdmin: false,
						iat: 1715335932
					}
				*/
        req.user = decodedToken;

        // next() method allows us to move to the next function
        next();
      }
    });
  }
};

module.exports.verifyAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    return res.send({
      auth: false,
      message: "Action Forbidden",
    });
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};
