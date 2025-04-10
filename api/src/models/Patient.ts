import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface PatientAttributes {
  id?: number;
  name: string;
  birthDate: Date;
  gender?: string;
  notes?: string;
}

class Patient extends Model<PatientAttributes> implements PatientAttributes {
  public id!: number;
  public name!: string;
  public birthDate!: Date;
  public gender!: string;
  public notes!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Patient.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'patients',
    timestamps: true,
  },
);

export default Patient;
