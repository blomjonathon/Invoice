const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Invoice = sequelize.define('Invoice', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    dueDate: {
        type: DataTypes.STRING,
        allowNull: false
    },
    vehicle: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    calibrations: {
        type: DataTypes.JSONB,
        allowNull: false
    },
    subTotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    balanceDue: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    paid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = Invoice; 