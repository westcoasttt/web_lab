import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import User from './user';

// Интерфейс для атрибутов Event
interface EventAttributes {
  id: string;
  title: string;
  description?: string;
  date: Date;
  createdBy: string;
}

interface EventCreationAttributes extends Optional<EventAttributes, 'id'> {}

class Event
  extends Model<EventAttributes, EventCreationAttributes>
  implements EventAttributes
{
  public id!: string;
  public title!: string;
  public description?: string;
  public date!: Date;
  public createdBy!: string;

  // Встроенные временные метки
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Event.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false, // Обязательное поле
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize, // Экземпляр sequelize
    modelName: 'Event',
    timestamps: false,
  },
);

User.hasMany(Event, { foreignKey: 'createdBy', onDelete: 'CASCADE' });
Event.belongsTo(User, { foreignKey: 'createdBy' });

export default Event;
