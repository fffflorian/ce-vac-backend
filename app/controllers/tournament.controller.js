const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Team = db.team;
const Game = db.game;
const GameType = db.gaty;
const GameEntry = db.gaen;
const Food = db.food;
const Masstrinken = db.mass;
const Op = db.Sequelize.Op;

exports.createType = async (req, res) => {
    try {
        const type = await GameType.create({
            typename: req.body.typename
        });
        if (type) res.status(200).send({ message: "Type '" + req.body.typename + "' successfully created."});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

exports.createGame = async (req, res) => {
    try {
        const game = await Game.create({
            name: req.body.gamename,
            finished: req.body.typename === "Essen"
        });
        const gametype = await GameType.findOne({ where: { typename: req.body.typename } });
        game.setGametype(gametype);
        if (req.body.typename === "Essen") {
            const teams = await Team.findAll();
            const users = await User.findAll();
            for (const team of teams) {
                for (const user of users) {
                    await Food.create({
                        userUsername: user.username,
                        gameGameid: game.gameid,
                        teamTeamid: team.teamid,
                        points: 0
                    });
                }
            }
        } else if (req.body.typename === "Trinken nach Maß") {
            const teams = await Team.findAll();
            for (const team of teams) {
                await Masstrinken.create({
                    gameGameid: game.gameid,
                    teamTeamid: team.teamid,
                    points: 0
                });
            }
        } else {
            for (const singlegame of req.body.games) {
                const teamOne = await Team.findByPk(singlegame.teamOneID);
                const teamTwo = await Team.findByPk(singlegame.teamTwoID);
                const single = await GameEntry.create({
                    resultT1: 0,
                    resultT2: 0
                });
                await single.setTeamOne(teamOne);
                await single.setTeamTwo(teamTwo);
                await game.addEntry(single);
            }
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

exports.startFoodBewertung = async (req, res) => {
    const result = await Game.upsert({
        gameid: req.params.id,
        finished: false
    });
    return res.status(200).send({ message: result });
}

exports.enterFoodPoints = async (req, res) => {
    const result = await Food.upsert({
        userUsername: req.userId,
        teamTeamid: req.params.tid,
        gameGameid: req.params.gid,
        points: req.body.pointchange
    });
    return res.status(200).send({ message: result });
}

exports.getFoodPoints = async (req, res) => {
    const result = await Food.findAll({
        attributes: ["gameGameid", "teamTeamid", [db.sequelize.fn("SUM", db.sequelize.col("food.points")), "sum_points"]],
        where: { gameGameid: req.params.id },
        group: ["gameGameid", "teamTeamid"],
        include: [ { model: Team, include: [ { all: true } ] } ],
        order: [
            [db.sequelize.fn("SUM", db.sequelize.col("food.points")), 'desc'],
            [Team, 'teamname', 'asc']
        ]
    });
    console.log("======");
    console.log(result);
    console.log("======");
    return res.status(200).json(result);
}

exports.listAllFoodGames = async (req, res) => {
    const result = await Game.findAll({
        where: { finished: false, gametypeTypename: "Essen" } ,
        attributes: ["gameid"]
    });
    return res.status(200).json(result);
}

exports.getOwnFoodPoints = async (req, res) => {
    let game = await Game.findByPk(req.params.id);
    const result = await Food.findAll({
        where: {
            gameGameid: req.params.id, userUsername: req.userId
        },
        include: [ { model: Team, include: [ { all: true } ] } ]
    });
    return res.status(200).json({
        game: game, bew: result
    });
}

exports.enterMassPoints = async (req, res) => {
    const food = await Masstrinken.findAll({ where: { teamTeamid: req.params.tid, gameGameid: req.params.gid} });
    const result = await Masstrinken.upsert({
        teamTeamid: req.params.tid,
        gameGameid: req.params.gid,
        points: food[0].points + req.body.pointchange
    });
    return res.status(200).send({ message: result });
}

exports.enterGameResults = async (req, res) => {
    try {
        // GET SINGLEGAME
        // ADD RESULTS
        const result = await GameEntry.upsert({
            id: req.params.id,
            resultT1: req.body.teamOneResult,
            resultT2: req.body.teamTwoResult
        });
        return res.status(200).send({ message: result });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

exports.finishGame = async (req, res) => {
    const result = await Game.upsert({
        gameid: req.params.id,
        finished: true
    });
    return res.status(200).send({ message: result });
}

exports.changeGameTeams = async (req, res) => {
    try {
        // GET SINGLEGAME
        const singleton = await GameEntry.findByPk(req.params.id);
        const teamOne = await Team.findByPk(req.body.teamOneID);
        const teamTwo = await Team.findByPk(req.body.teamTwoID);
        await single.setTeamOne(teamOne);
        await single.setTeamTwo(teamTwo);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

exports.deleteGame = async (req, res) => {
    try {
        const dr = await Game.destroy({
            where: {
                gameid: req.params.id
            }
        });
        return res.status(200).json({how_many: dr});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

exports.deleteGameEntry = async (req, res) => {
    try {
        const dr = await GameEntry.destroy({
            where: {
                id: req.params.id
            }
        });
        return res.status(200).json({how_many: dr});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

exports.listAllGames = async (req, res) => {
    try {
        const games = await Game.findAll({
            attributes: ['gameid', 'name', 'finished', 'gametypeTypename']
        });
        return res.status(200).json(games);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

exports.listAllTypes = async (req, res) => {
    try {
        const types = await GameType.findAll({
            attributes: ['typename']
        });
        return res.status(200).json(types);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

exports.getGameInfo = async (req, res) => {
    try {
        let game = await Game.findByPk(req.params.id);
        let singlegames = await GameEntry.findAll({
            where: { gameid: req.params.id },
            include: [
                { model: Team, as: 'teamOne', include: [
                        { model: User, attributes: ['username', 'firstname', 'lastname'] }
                    ] },
                { model: Team, as: 'teamTwo', include: [
                        { model: User, attributes: ['username', 'firstname', 'lastname'] }
                    ] },
            ]
        });
        res.status(200).json({
            game: game,
            entries: singlegames
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

exports.getMassInfo = async (req, res) => {
    const mass = await Masstrinken.findAll({
        where: { gameGameid: req.params.gid },
        include: [ { model: Team, include: [ { model: User } ] } ],
        order: [
            ['points', 'asc'],
            [Team, 'teamname', 'asc']
        ]
    });
    return res.status(200).json(mass);
}

exports.template = async (req, res) => {
    try {
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}
