import { verifyToken } from "../utils/jwtHelpers.js";

export function authorizationCheck(req, res, next) {
    // let token = req.headers["authorization"];
    // token = token?.split(" ")[1];

    const token = req.headers["authorization"]?.replace("bearer ", "");
    

    if (!token) {
        return res.status(401).json({
            message: "Authorization token is missing. Please include 'Authorization: Bearer <token>' in the request header."
        });
    }

    try {

        const payload = verifyToken(token);

        if (!payload) {
            console.error("Invalid token detected.");
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        req.userId = payload.userId;

        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return res.status(401).json({
            message: "Unauthorized",
            error: error.message || "Token verification failed"
        });
    }
}


export function isSocketAuth(socket, next) {
    let token = socket.handshake.query.token;    
    if (!token) {
        return next(new Error("Authorization token is missing. Please include 'Authorization: Bearer <token>' in the request header."));
    }

    try {
        const payload = verifyToken(token);
        if (!payload) {
            console.error("Invalid token detected.");
            return next(new Error("Unauthorized: Invalid token"));
        }

        socket.userId = payload.userId;

        next();
    } catch (error) {
        console.error("Socket token verification failed:", error.message);
        return next(new Error("Unauthorized"));
    }
}
