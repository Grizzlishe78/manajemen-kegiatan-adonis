import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'kegiatans'

  async up() {
    this.schema.alterTable(this.tableName, (_table) => { // Perhatikan _table di sini
      _table.dateTime('tgl_pelaksanaan').notNullable().alter()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (_table) => { // Dan di sini
      // _table.string('tgl_pelaksanaan').notNullable().alter()
    })
  }
}