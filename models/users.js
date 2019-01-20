const bcrypt = require("bcrypt");

module.exports = function(sequelize, DataTypes) {
    const User = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING,
            field: 'firstName',
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            field: 'lastName',
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                len: {
                    args: [6, 128],
                    msg: "Email address must be between 6 and 128 characters in length"
                },
                isEmail: {
                    msg: "Email address must be valid"
                }
            }
        },
        companyName: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: DataTypes.STRING,
        licenseStartDate: {
            type: DataTypes.DATE,
            field: 'licenseStartDate',

        },
        licenseEndDate: {
            type: DataTypes.DATE,
            field: 'licenseEndDate'
        },
        company_license: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        role: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['1', '2']
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        is_activated: {
            type: DataTypes.INTEGER,
            defaultValue: 1
        }
    }, {
        freezeTableName: true,
        instanceMethods: {
            validPassword(password) {
                console.log(this.password);
                return bcrypt.compareSync(password, this.password);
            }
        }
    });
    User.prototype.generateHash = (password) => {
        console.log(password);
        return bcrypt.hash(password, bcrypt.genSaltSync(8));
    }
    User.prototype.validPassword = function(password) {
        console.log(this.password);
        return bcrypt.compareSync(password, this.password);
    }

    return User;
}