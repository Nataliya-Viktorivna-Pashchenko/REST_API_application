const jwt = require('jsonwebtoken');
const User = require('../models/user')

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

if ( typeof authHeader === "undefined") {
    return res.status(401).json({"message": "Not authorized"})
}
const [bearer, token] = authHeader.split(' ', 2);

if (bearer !== "Bearer") {
    return res.status(401).json({"message": "Not authorized"})
}
jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
        return res.status(401).json({"message": "Not authorized"})
    }
    req.user = {
        _id: decode.id,
    }
const user = await User.findById(req.user);
if (user === null || user.token !== token) {
    return res.status(401).json({"message": "Not authorized"})
}
})

next();
}

module.exports = auth;