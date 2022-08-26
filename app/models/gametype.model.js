module.exports = (sequelize, Sequelize) => {
    const GameType = sequelize.define("gametypes", {
        typename: {
            type: Sequelize.STRING,
            primaryKey: true
        }
    });
    return GameType;
};