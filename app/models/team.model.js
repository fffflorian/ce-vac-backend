module.exports = (sequelize, Sequelize) => {
    const Team = sequelize.define("teams", {
        teamid: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        teamname: {
            type: Sequelize.STRING
        },
        points: {
            type: Sequelize.INTEGER
        }
    });
    return Team;
};