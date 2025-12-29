import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Project } from './Project';

@Table({
  tableName: 'brand_info',
  timestamps: true,
  underscored: true,
})
export class BrandInfo extends Model {
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
  brandName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  productName!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  productDescription!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  targetAudience!: string;

  @Column({
    type: DataType.JSONB,
  })
  keyBenefits?: object;

  @Column({
    type: DataType.STRING,
  })
  brandVoice?: string;

  @Column({
    type: DataType.STRING,
  })
  tone?: string;

  @Column({
    type: DataType.TEXT,
  })
  additionalContext?: string;

  @BelongsTo(() => Project)
  project?: Project;
}
