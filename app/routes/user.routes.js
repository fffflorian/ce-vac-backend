const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });
    app.get("/api/users/list-all", [authJwt.verifyToken, authJwt.isGMOrAdmin], controller.listAll);
    app.get("/api/users/list-all-teamless", [authJwt.verifyToken, authJwt.isGMOrAdmin], controller.listAllTeamless);
    app.get("/api/users/get-info", [authJwt.verifyToken], controller.getInformation);
    app.delete("/api/users/delete/:name", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteUser);
};