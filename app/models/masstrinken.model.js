module.exports = (sequelize, Sequelize) => {
    const Mass = sequelize.define("masstrinken", {
        points: {
            type: Sequelize.INTEGER
        },
    });
    return Mass;
};