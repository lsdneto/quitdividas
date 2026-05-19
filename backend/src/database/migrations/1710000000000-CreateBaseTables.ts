import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateBaseTables1710000000000 implements MigrationInterface {
  name = 'CreateBaseTables1710000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(180) NOT NULL UNIQUE,
        "passwordHash" VARCHAR(200) NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS devedores (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        document VARCHAR(30) NOT NULL UNIQUE,
        phone VARCHAR(30) NOT NULL,
        email VARCHAR(180) NOT NULL,
        address VARCHAR(255) NOT NULL DEFAULT '',
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS dividas (
        id SERIAL PRIMARY KEY,
        "debtorId" INT NOT NULL REFERENCES devedores(id) ON DELETE CASCADE,
        description VARCHAR(200) NOT NULL,
        "principalAmount" NUMERIC(14, 2) NOT NULL,
        "interestRate" NUMERIC(8, 4) NOT NULL DEFAULT 0,
        "issueDate" DATE NOT NULL,
        "dueDate" DATE,
        "paidAmount" NUMERIC(14, 2) NOT NULL DEFAULT 0,
        status VARCHAR(15) NOT NULL DEFAULT 'pendente',
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS pagamentos (
        id SERIAL PRIMARY KEY,
        "debtId" INT NOT NULL REFERENCES dividas(id) ON DELETE CASCADE,
        amount NUMERIC(14, 2) NOT NULL,
        "paymentDate" TIMESTAMPTZ NOT NULL,
        notes VARCHAR(255),
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS pagamentos')
    await queryRunner.query('DROP TABLE IF EXISTS dividas')
    await queryRunner.query('DROP TABLE IF EXISTS devedores')
    await queryRunner.query('DROP TABLE IF EXISTS users')
  }
}
