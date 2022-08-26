module.exports = (sequelize, Sequelize) => {
    const Food = sequelize.define("food", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        points: {
            type: Sequelize.INTEGER
        }
    });
    return Food;
};