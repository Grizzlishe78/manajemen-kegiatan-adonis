import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Kegiatan from './kegiatan.js'
import Anggota from './anggota.js'

export default class Kepanitiaan extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public kegiatanId!: number

  @column()
  public anggotaId!: number

  @column()
  public jabatan!: string

  @belongsTo(() => Kegiatan)
  public kegiatan!: BelongsTo<typeof Kegiatan>

  @belongsTo(() => Anggota)
  public anggota!: BelongsTo<typeof Anggota>
}
