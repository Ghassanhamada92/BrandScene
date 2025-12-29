import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasOne, HasMany } from 'sequelize-typescript';
import { User } from './User';
import { BrandInfo } from './BrandInfo';
import { Script } from './Script';
import { ResearchData } from './ResearchData';

@Table({
  tableName: 'projects',
  timestamps: true,
  underscored: true,
})
export class Project extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
  })
  description?: string;

  @Column({
    type: DataType.STRING,
    defaultValue: 'draft',
  })
  status!: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
  })
  currentStage!: number;

  @BelongsTo(() => User)
  user?: User;

  @HasOne(() => BrandInfo)
  brandInfo?: BrandInfo;

  @HasMany(() => Script)
  scripts?: Script[];

  @HasMany(() => ResearchData)
  researchData?: ResearchData[];
}
