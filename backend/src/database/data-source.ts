import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from '../models/User'
import { Devedor } from '../models/Devedor'
import { Divida } from '../models/Divida'
import { Pagamento } from '../models/Pagamento'

const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/quitdividas'

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  entities: [User, Devedor, Divida, Pagamento],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  migrationsRun: true,
})
