import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Project } from './Project';

@Table({
  tableName: 'research_data',
  timestamps: true,
  underscored: true,
})
export class ResearchData extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  projectId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  researchType!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  query!: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  results!: object;

  @Column({
    type: DataType.JSONB,
  })
  sources?: object;

  @Column({
    type: DataType.DECIMAL(3, 2),
  })
  confidenceScore?: number;

  @BelongsTo(() => Project)
  project?: Project;
}
