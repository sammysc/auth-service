"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Student.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "O nome do aluno é obrigatório",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Email inválido",
          },
          notEmpty: {
            msg: "O email é obrigatório",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "A senha é obrigatória",
          },
          len: {
            args: [6, 100],
            msg: "A senha precisa ter pelo menos 6 caracteres",
          },
        },
      },
      userType: {
        type: DataTypes.VIRTUAL,
        get() {
          return "student";
        },
      },
    },
    {
      sequelize,
      modelName: "Student",
    }
  );
  return Student;
};
