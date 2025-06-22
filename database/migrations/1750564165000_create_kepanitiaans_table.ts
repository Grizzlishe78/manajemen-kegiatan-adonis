import { BaseSchema } from '@adonisjs/lucid/schema'
import type { Knex } from 'knex'

export default class Kepanitiaan extends BaseSchema {
  protected tableName = 'kepanitiaans'

  public async up() {
    this.schema.createTable(this.tableName, (table: Knex.TableBuilder) => {
      table.increments('id')
      table
        .integer('kegiatan_id')
        .unsigned()
        .references('id')
        .inTable('kegiatans') 
        .onDelete('CASCADE')
      table
        .integer('anggota_id')
        .unsigned()
        .references('id')
        .inTable('anggotas')
        .onDelete('CASCADE')
      table.string('jabatan').notNullable()
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
