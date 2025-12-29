import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Project } from './Project';
import { Scene } from './Scene';

@Table({
  tableName: 'scripts',
  timestamps: true,
  underscored: true,
})
export class Script extends Model {
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
    type: DataType.INTEGER,
    allowNull: false,
  })
  variantNumber!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content!: string;

  @Column({
    type: DataType.INTEGER,
  })
  durationSeconds?: number;

  @Column({
    type: DataType.STRING,
  })
  tone?: string;

  @Column({
    type: DataType.STRING,
  })
  style?: string;

  @Column({
    type: DataType.JSONB,
  })
  metadata?: object;

  @Column({
    type: DataType.STRING,
    defaultValue: 'pending',
  })
  status!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  approved!: boolean;

  @Column({
    type: DataType.DATE,
  })
  approvedAt?: Date;

  @BelongsTo(() => Project)
  project?: Project;

  @HasMany(() => Scene)
  scenes?: Scene[];
}
