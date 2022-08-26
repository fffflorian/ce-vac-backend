const { authJwt } = require("../middleware");
const controller = require("../controllers/tournament.controller");

module.exports = function (app) {
    app.use(function(req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    // POSTS
    app.post("/api/tournament/createType", [authJwt.verifyToken, authJwt.isGMOrAdmin], controller.createType);
    app.post("/api/tournament/create-game", [authJwt.verifyToken, authJwt.isGMOrAdmin], controller.createGame);

    // PUTS
    app.put("/api/tournament/:id/change-teams",[authJwt.verifyToken, authJwt.isGMOrAdmin], controller.changeGameTeams);
    app.put("/api/tournament/:id/change-results",[authJwt.verifyToken, authJwt.isGMOrAdmin], controller.enterGameResults);
    app.put("/api/tournament/:id/finish-game",[authJwt.verifyToken, authJwt.isGMOrAdmin], controller.finishGame);
    app.put("/api/tournament/:gid/:tid/enter-mass", [authJwt.verifyToken, authJwt.isGMOrAdmin], controller.enterMassPoints);
    app.put("/api/tournament/:gid/:tid/enter-food", [authJwt.verifyToken], controller.enterFoodPoints);
    app.put("/api/tournament/:id/start-food", [authJwt.verifyToken, authJwt.isGMOrAdmin], controller.startFoodBewertung);

    // DELETES
    app.delete("/api/tournament/:id/delete",[authJwt.verifyToken, authJwt.isGMOrAdmin], controller.deleteGame);
    app.delete("/api/tournament/:id/delete-singleton",[authJwt.verifyToken, authJwt.isGMOrAdmin], controller.deleteGameEntry);

    // GETS
    app.get("/api/tournament/list-all",[authJwt.verifyToken], controller.listAllGames);
    app.get("/api/tournament/list-all-types",[authJwt.verifyToken], controller.listAllTypes);
    app.get("/api/tournament/:id/get-info",[authJwt.verifyToken], controller.getGameInfo);
    app.get("/api/tournament/:gid/get-mass-info",[authJwt.verifyToken], controller.getMassInfo);
    app.get("/api/tournament/:id/get-food-info",[authJwt.verifyToken, authJwt.isGMOrAdmin], controller.getFoodPoints);
    app.get("/api/tournament/list-all-food-active",[authJwt.verifyToken], controller.listAllFoodGames);
    app.get("/api/tournament/:id/get-food-info-bew",[authJwt.verifyToken], controller.getOwnFoodPoints);
}