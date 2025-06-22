import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Organisasi from './organisasi.js'
import Kepanitiaan from './kepanitiaan.js'

export default class Anggota extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public nama!: string

  @column()
  public nim!: string

  @column()
  public organisasiId!: number

  @belongsTo(() => Organisasi)
  public organisasi!: BelongsTo<typeof Organisasi>

  @hasMany(() => Kepanitiaan)
  public kepanitiaan!: HasMany<typeof Kepanitiaan>
}
