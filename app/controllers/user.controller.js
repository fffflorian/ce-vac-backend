const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op;

exports.listAll = async (req, res) => {
  const users = await User.findAll({
    attributes: ['username', 'firstname', 'lastname', 'teamId']
  });
  return res.status(200).json(users);
}

exports.listAllTeamless = async (req, res) => {
  const users = await User.findAll({
    attributes: ['username', 'firstname', 'lastname'],
    where: {
      teamId: {
        [Op.eq]: null
      }
    }
  });
  return res.status(200).json(users);
}

exports.getInformation = async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.userId,
    },
  });
  return res.status(200).json(user);
}

exports.deleteUser = async (req, res) => {
  const dr = await User.destroy({
    where: {
      username: req.params.name,
    },
  });
  return res.status(200).json({how_many: dr});
}