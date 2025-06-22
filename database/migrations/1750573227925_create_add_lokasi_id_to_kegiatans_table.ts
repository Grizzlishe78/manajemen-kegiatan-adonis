import { BaseSchema } from '@adonisjs/lucid/schema'
import type { Knex } from 'knex'

export default class AddLokasiIdToKegiatans extends BaseSchema {
  protected tableName = 'kegiatans'

  public async up() {
    this.schema.alterTable(this.tableName, (table: Knex.TableBuilder) => {
      table
        .integer('lokasi_id')
        .unsigned()
        .references('id')
        .inTable('lokasis')
        .onDelete('CASCADE')
        .after('organisasi_id')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table: Knex.TableBuilder) => {
      table.dropColumn('lokasi_id')
    })
  }
}
