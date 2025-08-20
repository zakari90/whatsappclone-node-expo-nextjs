import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;

const secret = process.env.JWT_SECRET || "secret"
const expiresIn= process.env.JWT_EXPIRES_IN || "1h"

const createToken = (payload) => {
    // return jwt.sign(payload, secret, {expiresIn});
    return sign(payload, secret);
};

const verifyToken = (token) => {

    try {

        const payload = verify(token, secret);
        console.log("verifyToken payload:", payload);
        
        return payload;
    } catch (err) {
        console.error("Token verification error:", err.message);
        return false;
    }
};

export  {
    createToken,
    verifyToken
};
