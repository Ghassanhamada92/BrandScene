import { Table, Column, Model, DataType, HasMany, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';
import bcrypt from 'bcrypt';
import { Project } from './Project';

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'password_hash',
  })
  passwordHash!: string;

  @HasMany(() => Project)
  projects?: Project[];

  // Hash password before creating or updating
  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(instance: User) {
    if (instance.changed('passwordHash')) {
      const salt = await bcrypt.genSalt(10);
      instance.passwordHash = await bcrypt.hash(instance.passwordHash, salt);
    }
  }

  // Method to check password
  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }

  // Hide password in JSON responses
  toJSON() {
    const values = { ...this.get() };
    delete values.passwordHash;
    return values;
  }
}
