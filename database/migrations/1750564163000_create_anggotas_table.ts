import { BaseSchema } from '@adonisjs/lucid/schema'
import type { Knex } from 'knex'

export default class Anggota extends BaseSchema {
  protected tableName = 'anggotas'

  public async up() {
    this.schema.createTable(this.tableName, (table: Knex.TableBuilder) => {
      table.increments('id')
      table.string('nama').notNullable()
      table.string('nim').notNullable().unique()
      table
        .integer('organisasi_id')
        .unsigned()
        .references('id')
        .inTable('organisasis')
        .onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
