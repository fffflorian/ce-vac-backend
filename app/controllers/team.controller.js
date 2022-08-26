const db = require("../models");
const config = require("../config/auth.config");
const {json} = require("express");
const User = db.user;
const Role = db.role;
const Team = db.team;
const Op = db.Sequelize.Op;

exports.createTeam = async (req, res) => {
    // Save Team to Database
    try {
        //CREATE TEAM
        const team = await Team.create({
            teamname: req.body.teamname,
            points: 0
        });
        // FIND MEMBERS OF TEAM
        mess = "";
        users = [];
        for (const member of req.body.members) {
            const mem = await User.findOne({
                where: {
                    username: member,
                },
            });
            if (!mem) {
                mess += `No user with name ${member} was found; `;
            }
            users.push(mem);
        }
        const result = await team.setUsers(users);
        if (result) res.status(200).send({ message: "Team created successfully. " + mess });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

exports.listAll = async (req, res) => {
    const teams = await Team.findAll({
        include: [
            { model: User, attributes: ['username', 'firstname', 'lastname'] }
        ],
        order: [['points', 'DESC'], ['teamname', 'ASC']],
        attributes: ['teamid', 'teamname', 'points']
    });
    return res.status(200).json(teams);
}

exports.getInformation = async (req, res) => {
    let team = await Team.findByPk(req.params.id, {
        include: [
            { model: User, attributes: ['username', 'firstname', 'lastname'] }
        ],
        attributes: ['teamid', 'teamname', 'points']
    });
    const numb = await Team.count({
        where: {
            points: { [Op.gt]: team.points }
        }
    });
    const numbGes = await Team.count();
    team.dataValues.place = numb;
    team.dataValues.placeOf = numbGes;
    return res.status(200).json(team);
}

exports.updateOwnName = async (req, res) => {
    const user = await User.findByPk(req.userId);
    const result = await Team.upsert({
        teamid: user.teamId,
        teamname: req.body.teamname
    });
    return res.status(200).send({ message: result });
}

exports.updateName = async (req, res) => {
    const result = await Team.upsert({
        teamid: req.params.id,
        teamname: req.body.teamname
    });
    return res.status(200).send({ message: result });
}

exports.updatePts = async (req, res) => {
    const team = await Team.findByPk(req.params.id);
    const result = await Team.upsert({
        teamid: req.params.id,
        points: team.points + req.body.pointchange
    });
    return res.status(200).send({ message: result });
}

exports.changeMembers = async (req, res) => {
    const team = await Team.findByPk(req.params.id);
    await team.setUsers([]);
    // FIND MEMBERS OF TEAM
    console.log(req.body.members);
    mess = "";
    for (const member of req.body.members) {
        const mem = await User.findOne({
            where: {
                username: member,
            },
        });
        if (!mem) {
            mess += `No user with name ${member} was found; `;
        }
        await team.addUser(mem);
    }
    res.status(200).send({ message: "Team created successfully. " + mess });
}


exports.deleteTeam = async (req, res) => {
    const dr = await Team.destroy({
        where: {
            teamid: req.params.id,
        },
    });
    return res.status(200).json({how_many: dr});
}