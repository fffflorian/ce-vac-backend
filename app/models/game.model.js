module.exports = (sequelize, Sequelize) => {
    const Game = sequelize.define("games", {
        gameid: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING
        },
        finished: {
            type: Sequelize.BOOLEAN
        }
    });
    return Game;
};