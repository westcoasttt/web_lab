import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
} from 'sequelize';
import { sequelize } from '../config/db';
import User from './user';

// Интерфейс атрибутов модели
interface LoginHistoryAttributes extends InferAttributes<LoginHistory> {
  id: number;
  userId: ForeignKey<User['id']>;
  ip: string;
  userAgent: string;
  createdAt: Date;
}

// Интерфейс атрибутов для создания нового входа
interface LoginHistoryCreationAttributes
  extends Omit<LoginHistoryAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

class LoginHistory extends Model<
  LoginHistoryAttributes,
  LoginHistoryCreationAttributes
> {
  public id!: number;
  public userId!: ForeignKey<User['id']>;
  public ip!: string;
  public userAgent!: string;
  public readonly createdAt!: Date;
}

// Определение модели
LoginHistory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'LoginHistory',
    timestamps: true,
  },
);

// Устанавливаем связи
User.hasMany(LoginHistory, { foreignKey: 'userId', onDelete: 'CASCADE' });
LoginHistory.belongsTo(User, { foreignKey: 'userId' });

export default LoginHistory;
