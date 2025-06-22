import type { HttpContext } from '@adonisjs/core/http'
import Kegiatan from '#models/kegiatan'
import Organisasi from '#models/organisasi'
import Lokasi from '#models/lokasi'
import Kepanitiaan from '#models/kepanitiaan'
import Anggota from '#models/anggota'
import { DateTime } from 'luxon'

export default class KegiatanController {
  async index({ view }: HttpContext) {
    const kegiatan = await Kegiatan.query()
      .preload('organisasi')
      .preload('lokasi')
      .orderBy('id', 'asc')

    return view.render('kegiatan/index', { kegiatan })
  }

  async create({ view }: HttpContext) {
    const organisasi = await Organisasi.all()
    const lokasi = await Lokasi.all()
    return view.render('kegiatan/create', { organisasi, lokasi })
  }

  async store({ request, response }: HttpContext) {
    try {
      const { nama, tgl_pelaksanaan, organisasi_id, lokasi_id } = request.only([
        'nama',
        'tgl_pelaksanaan',
        'organisasi_id',
        'lokasi_id',
      ])

      const newKegiatan = await Kegiatan.create({
        nama,
        tglPelaksanaan: tgl_pelaksanaan ? DateTime.fromISO(tgl_pelaksanaan) : null,
        organisasiId: Number(organisasi_id),
        lokasiId: Number(lokasi_id),
      })

      await newKegiatan.load('organisasi')
      await newKegiatan.load('lokasi')

      if (request.accepts(['html', 'json']) === 'json') {
        return response.status(201).json({
          success: true,
          message: 'Kegiatan berhasil ditambahkan',
          kegiatan: {
            id: newKegiatan.id,
            nama: newKegiatan.nama,
            tgl_pelaksanaan: newKegiatan.tglPelaksanaan?.toISODate() || null,
            organisasi_nama: newKegiatan.organisasi?.nama_organisasi || '-',
            lokasi_nama: newKegiatan.lokasi?.nama_lokasi || '-',
          },
        })
      }

      return response.redirect('/kegiatan')
    } catch (error) {
      console.error('[ERROR STORE KEGIATAN]:', error)
      if (request.accepts(['html', 'json']) === 'json') {
        return response.status(500).json({ success: false, message: 'Gagal menambahkan kegiatan', error: error.message })
      }
      return response.status(500).send('Gagal menambahkan kegiatan')
    }
  }

  async edit({ params, view }: HttpContext) {
    try {
      const kegiatan = await Kegiatan.findOrFail(params.id)
      const organisasi = await Organisasi.all()
      const lokasi = await Lokasi.all()

      return view.render('kegiatan/edit', { kegiatan, organisasi, lokasi })
    } catch (error) {
      console.error('[ERROR EDIT KEGIATAN]:', error)
      return view.render('errors/not-found')
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const kegiatan = await Kegiatan.findOrFail(params.id)
      const { nama, tgl_pelaksanaan, organisasi_id, lokasi_id } = request.only([
        'nama',
        'tgl_pelaksanaan',
        'organisasi_id',
        'lokasi_id',
      ])

      kegiatan.merge({
        nama,
        tglPelaksanaan: tgl_pelaksanaan ? DateTime.fromISO(tgl_pelaksanaan) : null,
        organisasiId: Number(organisasi_id),
        lokasiId: Number(lokasi_id),
      })

      await kegiatan.save()
      await kegiatan.load('organisasi')
      await kegiatan.load('lokasi')

      if (request.accepts(['html', 'json']) === 'json') {
        return response.json({
          success: true,
          message: 'Kegiatan berhasil diperbarui',
          kegiatan: {
            id: kegiatan.id,
            nama: kegiatan.nama,
            tgl_pelaksanaan: kegiatan.tglPelaksanaan?.toISODate() || null,
            organisasi_nama: kegiatan.organisasi?.nama_organisasi || '-',
            lokasi_nama: kegiatan.lokasi?.nama_lokasi || '-',
          },
        })
      }

      return response.redirect('/kegiatan')
    } catch (error) {
      console.error('[ERROR UPDATE KEGIATAN]:', error)
      if (request.accepts(['html', 'json']) === 'json') {
        return response.status(500).json({ success: false, message: 'Gagal memperbarui kegiatan', error: error.message })
      }
      return response.status(500).send('Gagal memperbarui kegiatan')
    }
  }

  async destroy({ params, response, request }: HttpContext) {
    try {
      const kegiatan = await Kegiatan.findOrFail(params.id)
      await kegiatan.delete()

      if (request.accepts(['html', 'json']) === 'json') {
        return response.json({
          success: true,
          message: 'Kegiatan berhasil dihapus',
          id: params.id,
        })
      }

      return response.redirect('/kegiatan')
    } catch (error) {
      console.error('[ERROR DELETE KEGIATAN]:', error)
      if (request.accepts(['html', 'json']) === 'json') {
        return response.status(500).json({ success: false, message: 'Gagal menghapus kegiatan', error: error.message })
      }
      return response.status(500).send('Gagal menghapus kegiatan')
    }
  }

  async panitia({ params, view }: HttpContext) {
    const kegiatan = await Kegiatan.findOrFail(params.id)
    await kegiatan.load('kepanitiaan', (query) => query.preload('anggota').orderBy('jabatan', 'asc'))

    const existingPanitiaAnggotaIds = kegiatan.kepanitiaan.map(kp => kp.anggotaId);
    const anggota = await Anggota.query()
      .where('organisasi_id', kegiatan.organisasiId)
      .whereNotIn('id', existingPanitiaAnggotaIds)
      .orderBy('nama', 'asc');

    return view.render('kegiatan/panitia', { kegiatan, anggota })
  }

  async storePanitia({ request, response, session }: HttpContext) {
    try {
      const data = request.only(['kegiatan_id', 'anggota_id', 'jabatan'])
      
      const existingKepanitiaan = await Kepanitiaan
        .query()
        .where('kegiatan_id', data.kegiatan_id)
        .where('anggota_id', data.anggota_id)
        .first()

      if (existingKepanitiaan) {
        if (request.accepts(['html', 'json']) === 'json') {
          return response.status(409).json({
            success: false,
            message: 'Anggota ini sudah terdaftar sebagai panitia untuk kegiatan ini.',
          })
        }
        session.flash('errors', { anggota_id: 'Anggota ini sudah terdaftar sebagai panitia.' });
        return response.redirect().back();
      }

      const newKepanitiaan = await Kepanitiaan.create(data)
      await newKepanitiaan.load('anggota')

      if (request.accepts(['html', 'json']) === 'json') {
        return response.status(201).json({
          success: true,
          message: 'Anggota panitia berhasil ditambahkan',
          kepanitiaan: {
            id: newKepanitiaan.id,
            kegiatan_id: newKepanitiaan.kegiatanId,
            anggota_id: newKepanitiaan.anggotaId,
            jabatan: newKepanitiaan.jabatan,
            anggota_nama: newKepanitiaan.anggota?.nama || '-',
            anggota_nim: newKepanitiaan.anggota?.nim || '-',
          }
        })
      }

      return response.redirect().back()
    } catch (error) {
      console.error('[ERROR STORE PANITIA]:', error)
      if (request.accepts(['html', 'json']) === 'json') {
        return response.status(500).json({ success: false, message: 'Gagal menambahkan panitia', error: error.message })
      }
      return response.status(500).send('Gagal menambahkan panitia')
    }
  }

  async destroyPanitia({ params, response, request }: HttpContext) {
    try {
      const panitia = await Kepanitiaan.findOrFail(params.id)
      await panitia.delete()

      if (request.accepts(['html', 'json']) === 'json') {
        return response.json({
          success: true,
          message: 'Anggota panitia berhasil dihapus',
          id: params.id,
        })
      }

      return response.redirect().back()
    } catch (error) {
      console.error('[ERROR DELETE PANITIA]:', error)
      if (request.accepts(['html', 'json']) === 'json') {
        return response.status(500).json({ success: false, message: 'Gagal menghapus panitia', error: error.message })
      }
      return response.status(500).send('Gagal menghapus panitia')
    }
  }

  async laporan({ view, request }: HttpContext) {
    const organisasiId = request.input('organisasi')
    const lokasiId = request.input('lokasi')
    const search = request.input('search')

    const query = Kegiatan.query()
      .preload('organisasi')
      .preload('lokasi')
      .preload('kepanitiaan')

    if (organisasiId) {
      query.where('organisasi_id', organisasiId)
    }

    if (lokasiId) {
      query.where('lokasi_id', lokasiId)
    }

    if (search) {
      query.where((q) => {
        q.whereILike('nama', `%${search}%`)
          .orWhereHas('lokasi', (lokasiQuery) => {
            lokasiQuery.whereILike('nama_lokasi', `%${search}%`)
          })
      })
    }

    const kegiatan = await query
    const organisasi = await Organisasi.all()
    const lokasi = await Lokasi.all()

    return view.render('kegiatan/laporan', {
      kegiatan,
      organisasi,
      lokasi,
      search,
      organisasiId,
      lokasiId,
      currentUrl: request.url(),
    })
  }
}