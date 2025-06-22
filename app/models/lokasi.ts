import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Kegiatan from './kegiatan.js'

export default class Lokasi extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public nama_lokasi!: string

  @column()
  public alamat!: string

  @hasMany(() => Kegiatan)
  public kegiatan!: HasMany<typeof Kegiatan>
}
