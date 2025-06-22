import { BaseSchema } from '@adonisjs/lucid/schema'
import type { Knex } from 'knex'

export default class Kegiatan extends BaseSchema {
  protected tableName = 'kegiatans'

  public async up() {
    this.schema.createTable(this.tableName, (table: Knex.TableBuilder) => {
      table.increments('id')
      table.string('nama').notNullable()
      table.date('tgl_pelaksanaan').notNullable()
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