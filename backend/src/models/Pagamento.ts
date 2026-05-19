import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Divida } from './Divida'

@Entity('pagamentos')
export class Pagamento {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'int' })
  debtId!: number

  @ManyToOne(() => Divida, (divida) => divida.pagamentos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'debtId' })
  divida!: Divida

  @Column({ type: 'numeric', precision: 14, scale: 2 })
  amount!: string

  @Column({ type: 'timestamptz' })
  paymentDate!: Date

  @Column({ type: 'varchar', length: 255, nullable: true })
  notes!: string | null

  @CreateDateColumn()
  createdAt!: Date
}
