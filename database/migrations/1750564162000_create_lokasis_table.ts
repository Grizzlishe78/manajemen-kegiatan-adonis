import { BaseSchema } from '@adonisjs/lucid/schema'
import type { Knex } from 'knex'

export default class Lokasis extends BaseSchema {
  protected tableName = 'lokasis'

  public async up() {
    this.schema.createTable(this.tableName, (table: Knex.TableBuilder) => {
      table.increments('id')
      table.string('nama_lokasi').notNullable().unique()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
