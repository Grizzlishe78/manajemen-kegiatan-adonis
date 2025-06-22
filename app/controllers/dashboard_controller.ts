import type { HttpContext } from '@adonisjs/core/http'
import Kegiatan from '#models/kegiatan'
import Anggota from '#models/anggota'
import Organisasi from '#models/organisasi'
import Lokasi from '#models/lokasi' 
// @ts-ignore
import type Kepanitiaan from '#models/kepanitiaan' 

export default class DashboardController {
  async index({ view, request }: HttpContext) {
    const totalKegiatan = await Kegiatan.query().count('* as total')
    const totalAnggota = await Anggota.query().count('* as total')
    const totalOrganisasi = await Organisasi.query().count('* as total')

    const kegiatanLaporan = await Kegiatan.query()
      .preload('organisasi')
      .preload('lokasi')
      .preload('kepanitiaan') 
      .orderBy('tgl_pelaksanaan', 'desc') 
      .limit(5) 

    const organisasis = await Organisasi.all()
    const lokasis = await Lokasi.all()

    return view.render('dashboard/index', {
      totalKegiatan: totalKegiatan[0].$extras.total,
      totalAnggota: totalAnggota[0].$extras.total,
      totalOrganisasi: totalOrganisasi[0].$extras.total,
      kegiatanLaporan, 
      organisasis,     
      lokasis,         
      currentUrl: request.url() 
    })
  }
}