import { BaseSchema } from '@adonisjs/lucid/schema'
import type { Knex } from 'knex'

export default class AddAlamatToLokasis extends BaseSchema {
  protected tableName = 'lokasis'

  public async up() {
    this.schema.alterTable(this.tableName, (table: Knex.TableBuilder) => {
      table.string('alamat').after('nama_lokasi')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table: Knex.TableBuilder) => {
      table.dropColumn('alamat')
    })
  }
}
