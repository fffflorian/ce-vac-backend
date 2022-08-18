const { authJwt } = require("../middleware");
const controller = require("../controllers/team.controller");
module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });
    app.post("/api/teams/create", [authJwt.verifyToken, authJwt.isGMOrAdmin], controller.createTeam);

    app.get("/api/teams/list-all",[authJwt.verifyToken], controller.listAll);
    app.get("/api/teams/:id/get-info",[authJwt.verifyToken], controller.getInformation);

    app.put("/api/teams/update-own-name",[authJwt.verifyToken], controller.updateOwnName);
    app.put("/api/teams/:id/update-name",[authJwt.verifyToken, authJwt.isAdmin], controller.updateName);
    app.put("/api/teams/:id/update-pts",[authJwt.verifyToken, authJwt.isGMOrAdmin], controller.updatePts);
    app.put("/api/teams/:id/change-members",[authJwt.verifyToken, authJwt.isAdmin], controller.changeMembers);

    app.delete("/api/teams/:id/delete",[authJwt.verifyToken, authJwt.isAdmin], controller.deleteTeam);
};