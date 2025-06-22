// app/models/kegiatan.ts
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Organisasi from './organisasi.js'
import Lokasi from './lokasi.js'
import Kepanitiaan from './kepanitiaan.js'

export default class Kegiatan extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public nama!: string

  @column.dateTime()
  public tglPelaksanaan!: DateTime | null 

  @column()
  public organisasiId!: number

  @column()
  public lokasiId!: number

  @belongsTo(() => Organisasi)
  public organisasi!: BelongsTo<typeof Organisasi>

  @belongsTo(() => Lokasi)
  public lokasi!: BelongsTo<typeof Lokasi>

  @hasMany(() => Kepanitiaan)
  public kepanitiaan!: HasMany<typeof Kepanitiaan>

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime
}