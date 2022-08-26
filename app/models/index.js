const config = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect,
        operatorsAliases: false,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.team = require("../models/team.model.js")(sequelize, Sequelize);
db.game = require("../models/game.model.js")(sequelize, Sequelize);
db.gaen = require("../models/gameentry.model.js")(sequelize, Sequelize);
db.gaty = require("../models/gametype.model.js")(sequelize, Sequelize);
db.mass = require("../models/masstrinken.model.js")(sequelize, Sequelize);
db.food = require("../models/food.model.js")(sequelize, Sequelize);

// n:m Beziehung USER <-> ROLLE
db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "roleId",
    otherKey: "userId"
});
db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "userId",
    otherKey: "roleId"
});
// Beziehung TEAM <-> USER
db.team.hasMany(db.user, {
    foreignKey: "teamId",
    onDelete: "SET NULL",
    onUpdate: "CASCADE"
});
db.user.belongsTo(db.team);

db.gaen.belongsTo(db.team, {as: 'teamOne'});
db.gaen.belongsTo(db.team, {as: 'teamTwo'});

db.game.hasMany(db.gaen, {
    as: 'entry',
    foreignKey: "gameID",
    onDelete: "CASCADE",
    onUpdate: "CASCADE"
})
//db.game.belongsTo(db.gaen);
db.game.belongsTo(db.gaty, {as: 'gametype'});


db.game.belongsToMany(db.team, { through: db.mass });
db.team.belongsToMany(db.game, { through: db.mass });
db.mass.belongsTo(db.game, { foreignKey: "gameGameid" });
db.mass.belongsTo(db.team, { foreignKey: "teamTeamid" });

db.game.belongsToMany(db.team, { through: db.food });
db.team.belongsToMany(db.game, { through: db.food });
db.food.belongsTo(db.user, { as: 'user' });
db.food.belongsTo(db.game, { foreignKey: "gameGameid" });
db.food.belongsTo(db.team, { foreignKey: "teamTeamid" });

db.ROLES = ["MEMBER", "ADMIN", "GAME_MASTER"];
module.exports = db;