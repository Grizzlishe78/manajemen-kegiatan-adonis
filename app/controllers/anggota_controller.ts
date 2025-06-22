import type { HttpContext } from '@adonisjs/core/http'
import Anggota from '#models/anggota'
import Organisasi from '#models/organisasi'

export default class AnggotaController {
  async index({ view }: HttpContext) {
    const anggota = await Anggota.query().preload('organisasi').orderBy('id', 'asc') 
    return view.render('anggota/index', { anggota })
  }

  async create({ view }: HttpContext) {
    const organisasi = await Organisasi.all()
    return view.render('anggota/create', { organisasi })
  }

  async store({ request, response }: HttpContext) {
    try {
      const payload = request.only(['nama', 'nim', 'organisasi_id'])
      const newAnggota = await Anggota.create(payload)
      await newAnggota.load('organisasi') 

      if (request.accepts(['html', 'json']) === 'json') {
        return response.status(201).json({ 
          message: 'Anggota berhasil ditambahkan',
          anggota: {
            id: newAnggota.id,
            nama: newAnggota.nama,
            nim: newAnggota.nim,
            organisasi_id: newAnggota.organisasiId,
            organisasi_nama_organisasi: newAnggota.organisasi?.nama_organisasi || '-' 
          }
        })
      }

      return response.redirect('/anggota')
    } catch (error) {
      console.error('[ERROR STORE ANGGOTA]:', error)
      if (request.accepts(['html', 'json']) === 'json') {
        return response.status(500).json({ success: false, message: 'Gagal menambahkan anggota', error: error.message })
      }
      return response.status(500).send('Gagal menambahkan anggota')
    }
  }

  async edit({ params, view }: HttpContext) {
    try {
      const anggota = await Anggota.findOrFail(params.id)
      const organisasi = await Organisasi.all()
      return view.render('anggota/edit', { anggota, organisasi })
    } catch (error) {
      console.error('[ERROR EDIT ANGGOTA]:', error)
      return view.render('errors/not-found')
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const anggota = await Anggota.findOrFail(params.id)
      const payload = request.only(['nama', 'nim', 'organisasi_id'])

      anggota.merge(payload)
      await anggota.save()

      await anggota.load('organisasi') 

      if (request.accepts(['html', 'json']) === 'json') {
        return response.json({
          success: true,
          message: 'Anggota berhasil diperbarui',
          anggota: { 
            id: anggota.id,
            nama: anggota.nama,
            nim: anggota.nim,
            organisasi_id: anggota.organisasiId,
            organisasi_nama_organisasi: anggota.organisasi?.nama_organisasi || '-' 
          }
        })
      }

      return response.redirect('/anggota')
    } catch (error) {
      console.error('[ERROR UPDATE ANGGOTA]:', error)
      if (request.accepts(['html', 'json']) === 'json') {
        return response.status(500).json({ success: false, message: 'Gagal memperbarui anggota', error: error.message })
      }
      return response.status(500).send('Gagal memperbarui anggota')
    }
  }

  async destroy({ params, response, request }: HttpContext) {
    try {
      const anggota = await Anggota.findOrFail(params.id)
      await anggota.delete()

      if (request.accepts(['html', 'json']) === 'json') {
        return response.json({
          success: true,
          message: 'Anggota berhasil dihapus',
          id: params.id
        })
      }

      return response.redirect('/anggota')
    } catch (error) {
      console.error('[ERROR DELETE ANGGOTA]:', error)
      if (request.accepts(['html', 'json']) === 'json') {
        return response.status(500).json({ success: false, message: 'Gagal menghapus anggota', error: error.message })
      }
      return response.status(500).send('Gagal menghapus anggota')
    }
  }
}