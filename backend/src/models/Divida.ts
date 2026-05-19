import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Devedor } from './Devedor'
import { Pagamento } from './Pagamento'

export type DebtStatus = 'pendente' | 'parcial' | 'quitada'

@Entity('dividas')
export class Divida {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'int' })
  debtorId!: number

  @ManyToOne(() => Devedor, (devedor) => devedor.dividas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'debtorId' })
  devedor!: Devedor

  @Column({ type: 'varchar', length: 200 })
  description!: string

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  principalAmount!: string

  @Column({ type: 'numeric', precision: 8, scale: 4, default: 0 })
  interestRate!: string

  @Column({ type: 'date' })
  issueDate!: string

  @Column({ type: 'date', nullable: true })
  dueDate!: string | null

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  paidAmount!: string

  @Column({ type: 'varchar', length: 15, default: 'pendente' })
  status!: DebtStatus

  @CreateDateColumn()
  createdAt!: Date

  @OneToMany(() => Pagamento, (pagamento) => pagamento.divida)
  pagamentos!: Pagamento[]
}
