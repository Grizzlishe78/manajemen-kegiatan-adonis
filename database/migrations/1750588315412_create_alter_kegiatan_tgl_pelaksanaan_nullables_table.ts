import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'kegiatans'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dateTime('tgl_pelaksanaan').nullable().alter() // Set kolom jadi nullable
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dateTime('tgl_pelaksanaan').notNullable().alter() // Revert ke not nullable jika diperlukan
    })
  }
}