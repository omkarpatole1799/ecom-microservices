import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  customerId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ default: 'pending' })
  status: string = 'pending';

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
