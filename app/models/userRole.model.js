module.exports = (sequelize, Sequelize) => {
    const UserRole = sequelize.define('userRole', {
        userId:{
            type:Sequelize.INTEGER
        },
        roleId:{
            type:Sequelize.STRING
        }
    });
}