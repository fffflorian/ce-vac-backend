module.exports = (sequelize, Sequelize) => {
    const GameEntry = sequelize.define("singlegame", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        resultT1: {
            type: Sequelize.INTEGER
        },
        resultT2: {
            type: Sequelize.INTEGER
        }
    });
    return GameEntry;
};