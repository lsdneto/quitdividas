import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', length: 150 })
  name!: string

  @Column({ type: 'varchar', length: 180, unique: true })
  email!: string

  @Column({ type: 'varchar', length: 200 })
  passwordHash!: string

  @CreateDateColumn()
  createdAt!: Date
}
