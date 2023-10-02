const sequelize = require('sequelize')
const mysql = require('mysql2')
const fs = require('fs')
const path = require('path')

const conn = new sequelize.Sequelize("mysql://avnadmin:AVNS_6la3iy4isnJcUZ7K_K_@mysql-3b2a0c3a-student-d87c.aivencloud.com:23838/defaultdb?ssl-mode=REQUIRED", {
    ssl: fs.readFileSync(path.join(__dirname, 'ca.pem')),
    dialect: 'mysql',
    logging: false
});

const user = conn.define("user", {
    id: {type: sequelize.DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    username: {type: sequelize.DataTypes.STRING, allowNull: false},
    password: {type: sequelize.DataTypes.STRING, allowNull: false},
    age: {type: sequelize.DataTypes.INTEGER, allowNull: false},
    balance: {type: sequelize.DataTypes.DECIMAL, defaultValue: 0}
}, 
{
    freezeTableName: true,
    timestamps: false
})

const spin = conn.define("spin", {
    id: {type: sequelize.DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    user_id: {type: sequelize.DataTypes.INTEGER, allowNull:false},
    win: {type: sequelize.DataTypes.INTEGER, defaultValue: 0}
}, 
{
    freezeTableName: true,
    timestamps: false
})

const maxwin = conn.define("maxwin", {
    id: {type: sequelize.DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    min_depo: {type: sequelize.DataTypes.DECIMAL},
    max_win: {type: sequelize.DataTypes.DECIMAL}
}, 
{
    freezeTableName: true,
    timestamps: false
})

module.exports = {
    conn,
    user,
    spin,
    maxwin
}