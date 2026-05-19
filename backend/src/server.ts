import app from './app'
import { AppDataSource } from './database/data-source'
import { User } from './models/User'
import bcrypt from 'bcryptjs'

const port = Number(process.env.PORT || 3001)

async function seedAdmin() {
  const userRepo = AppDataSource.getRepository(User)
  const existing = await userRepo.findOne({ where: { email: 'admin@quitdividas.com' } })
  if (existing) return

  const passwordHash = await bcrypt.hash('123456', 10)
  const admin = userRepo.create({
    name: 'Administrador',
    email: 'admin@quitdividas.com',
    passwordHash,
  })
  await userRepo.save(admin)
}

AppDataSource.initialize()
  .then(async () => {
    await seedAdmin()
    app.listen(port, () => {
      console.log(`Servidor executando na porta ${port}`)
    })
  })
  .catch((error) => {
    console.error('Falha ao iniciar aplicação', error)
    process.exit(1)
  })
