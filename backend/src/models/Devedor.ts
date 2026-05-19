import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Divida } from './Divida'

@Entity('devedores')
export class Devedor {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', length: 150 })
  name!: string

  @Column({ type: 'varchar', length: 30, unique: true })
  document!: string

  @Column({ type: 'varchar', length: 30 })
  phone!: string

  @Column({ type: 'varchar', length: 180 })
  email!: string

  @Column({ type: 'varchar', length: 255, default: '' })
  address!: string

  @CreateDateColumn()
  createdAt!: Date

  @OneToMany(() => Divida, (divida) => divida.devedor)
  dividas!: Divida[]
}
