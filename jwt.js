const jwt = require('jsonwebtoken');

exports.generateToken = function (id) {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
        time: Date(),
        user: id,
    }

    return jwt.sign(data, jwtSecretKey);
}

exports.authenticateToken = function (req, res, next) {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, jwtSecretKey, function(err, decoded) {
        if (err) return res.sendStatus(403);
        next();
    });
}

exports.getUserId = function (authHeader) {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    try {
        return jwt.verify(authHeader && authHeader.split(' ')[1], jwtSecretKey).user;
    } catch(err) {
        console.log("err");
    }
}