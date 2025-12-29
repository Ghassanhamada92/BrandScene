import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Script } from './Script';

@Table({
  tableName: 'scenes',
  timestamps: true,
  underscored: true,
})
export class Scene extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => Script)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  scriptId!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  sceneNumber!: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  narrationText!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  visualDescription!: string;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
  })
  durationSeconds!: number;

  @Column({
    type: DataType.STRING,
  })
  mood?: string;

  @Column({
    type: DataType.STRING,
  })
  cameraAngle?: string;

  @Column({
    type: DataType.STRING,
  })
  transitionType?: string;

  @Column({
    type: DataType.JSONB,
  })
  metadata?: object;

  @BelongsTo(() => Script)
  script?: Script;
}
