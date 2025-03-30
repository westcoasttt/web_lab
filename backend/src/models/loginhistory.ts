import { DataTypes, Model, ForeignKey } from 'sequelize';
import { sequelize } from '../config/db';
import User from './user';

// Определяем типы для атрибутов
type LoginHistoryAttributes = {
  id: number;
  userId: ForeignKey<User['id']>;
  ip: string;
  userAgent: string;
  createdAt: Date;
};

// Используем Omit для исключения 'id' и 'createdAt' из типа создания записи
type LoginHistoryCreationAttributes = Omit<
  LoginHistoryAttributes,
  'id' | 'createdAt'
>;

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
