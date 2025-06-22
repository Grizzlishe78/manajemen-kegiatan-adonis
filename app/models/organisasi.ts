import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Anggota from './anggota.js'
import Kegiatan from './kegiatan.js'

export default class Organisasi extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public nama_organisasi!: string

  @column()
  public jenis!: string

  @hasMany(() => Anggota)
  public anggota!: HasMany<typeof Anggota>

  @hasMany(() => Kegiatan)
  public kegiatan!: HasMany<typeof Kegiatan>
}