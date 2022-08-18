const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(403).send({
            message: "No Token Provided!"
        });
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({message: "Unauthorized!"});
        }
        req.userId = decoded.name;
        return next();
    });
};

isAdmin = async (req, res, next) => {
    try {
        console.log(req.userId);
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "ADMIN") {
                return next();
            }
        }
        return res.status(403).send({
            message: "Require Admin Role!",
        });
    } catch (error) {
        return res.status(500).send({
            message: "Unable to validate User role!",
        });
    }
};

isGM = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "GAME_MASTER") {
                return next();
            }
        }
        return res.status(403).send({
            message: "Require Moderator Role!",
        });
    } catch (error) {
        return res.status(500).send({
            message: "Unable to validate Moderator role!",
        });
    }
};

isGMOrAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "GAME_MASTER") {
                return next();
            }
            if (roles[i].name === "ADMIN") {
                return next();
            }
        }
        return res.status(403).send({
            message: "Require Moderator or Admin Role!",
        });
    } catch (error) {
        return res.status(500).send({
            message: "Unable to validate Moderator or Admin role!",
        });
    }
};
const authJwt = {
    verifyToken,
    isAdmin,
    isGM,
    isGMOrAdmin,
};
module.exports = authJwt;