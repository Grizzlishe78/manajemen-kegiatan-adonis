import { HttpContext } from '@adonisjs/core/http'
import Kepanitiaan from '#models/kepanitiaan'
import Anggota from '#models/anggota'

export default class PanitiaController {
  async index({ params, view }: HttpContext) {
    const anggotaList = await Anggota.all()
    const panitiaList = await Kepanitiaan.query()
      .where('kegiatan_id', params.kegiatan_id)
      .preload('anggota')

    return view.render('kepanitiaan/index', {
      kegiatanId: params.kegiatan_id,
      anggotaList,
      panitiaList,
    })
  }

  async store({ request, response }: HttpContext) {
    const data = request.only(['kegiatan_id', 'anggota_id', 'jabatan'])
    await Kepanitiaan.create(data)
    return response.redirect().back()
  }

  async destroy({ params, response }: HttpContext) {
    const panitia = await Kepanitiaan.findOrFail(params.id)
    await panitia.delete()
    return response.redirect().back()
  }
}
