import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Patient from './Patient';

interface MeasurementAttributes {
  id?: number;
  patientId: number;
  width: number;
  length: number;
  diagonalA: number;
  diagonalB: number;
  ci?: number;
  cvai?: number;
  classification?: string;
  date?: Date;
}

class Measurement extends Model<MeasurementAttributes> implements MeasurementAttributes {
  public id!: number;
  public patientId!: number;
  public width!: number;
  public length!: number;
  public diagonalA!: number;
  public diagonalB!: number;
  public ci!: number;
  public cvai!: number;
  public classification!: string;
  public date!: Date;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Validação de medidas
  public static validateMeasurements(width: number, length: number, diagonalA: number, diagonalB: number): string | null {
    if (width <= 0 || length <= 0) {
      return 'Medidas inválidas';
    }

    if (Math.abs(diagonalA - diagonalB) > 20) {
      return 'Diferença diagonal superior a 20mm';
    }

    return null;
  }
}

Measurement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'patients',
        key: 'id',
      },
    },
    width: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    length: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    diagonalA: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    diagonalB: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    ci: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    cvai: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    classification: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'measurements',
    timestamps: true,
    hooks: {
      beforeValidate: (measurement: Measurement) => {
        // Calcular CI e CVAI antes de salvar
        const width = measurement.width;
        const length = measurement.length;
        const diagonalA = measurement.diagonalA;
        const diagonalB = measurement.diagonalB;

        // Calcular CI (Índice Craniano)
        measurement.ci = (width / length) * 100;

        // Calcular CVAI
        const minDiagonal = Math.min(diagonalA, diagonalB);
        measurement.cvai = (Math.abs(diagonalA - diagonalB) / minDiagonal) * 100;

        // Classificar deformação
        if (measurement.cvai >= 7) {
          measurement.classification = 'Plagiocefalia Grave';
        } else if (measurement.ci < 76) {
          measurement.classification = 'Dolicocefalia';
        } else if (measurement.ci > 90) {
          measurement.classification = 'Braquicefalia';
        } else {
          measurement.classification = 'Normal';
        }
      },
    },
  },
);

// Associação com Patient
Measurement.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });
Patient.hasMany(Measurement, { foreignKey: 'patientId', as: 'measurements' });

export default Measurement;
