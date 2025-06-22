import { HttpContext } from '@adonisjs/core/http'
import Organisasi from '#models/organisasi'

export default class OrganisasiController {
 
  async index({ view }: HttpContext) {
    const organisasis = await Organisasi.query().orderBy('id', 'asc')
    return view.render('organisasi/index', { organisasis: organisasis })
  }

  async create({ view }: HttpContext) {
    return view.render('organisasi/create')
  }

  async store({ request, response }: HttpContext) {
    try {
      const data = request.only(['nama_organisasi', 'jenis'])
      console.log('[DATA MASUK]:', data)

      const organisasi = await Organisasi.create(data)
      console.log('[DATA TERSIMPAN]:', organisasi)
      
      return response.redirect('/organisasi')
    } catch (error) {
      console.error('[ERROR STORE]:', error)
      return response.status(500).send('Gagal menyimpan data organisasi')
    }
  }

  async edit({ params, view }: HttpContext) {
    try {
      const organisasi = await Organisasi.findOrFail(params.id)
      return view.render('organisasi/edit', { organisasi })
    } catch (error) {
      console.error('[ERROR EDIT]:', error)
      return view.render('errors/not-found') 
    }
  }

  async update({ params, request, response }: HttpContext) {
    try {
      const organisasi = await Organisasi.findOrFail(params.id)
      const data = request.only(['nama_organisasi', 'jenis'])
      
      console.log('[DATA UPDATE]:', data)
      console.log('[ORGANISASI SEBELUM UPDATE]:', {
        id: organisasi.id,
        nama_organisasi: organisasi.nama_organisasi,
        jenis: organisasi.jenis
      })
      
      organisasi.merge(data)
      
      await organisasi.save()
      
      console.log('[ORGANISASI SETELAH UPDATE]:', {
        id: organisasi.id,
        nama_organisasi: organisasi.nama_organisasi,
        jenis: organisasi.jenis
      })
      
      if (request.accepts(['html', 'json']) === 'json') {
        return response.json({
          success: true,
          message: 'Organisasi berhasil diperbarui',
          organisasi: { 
            id: organisasi.id,
            nama_organisasi: organisasi.nama_organisasi,
            jenis: organisasi.jenis
          }
        })
      }
      
      return response.redirect('/organisasi')
    } catch (error) {
      console.error('[ERROR UPDATE]:', error)
      
      if (request.accepts(['html', 'json']) === 'json') {
        return response.status(500).json({ 
          success: false, 
          message: 'Gagal mengupdate data organisasi',
          error: error.message 
        })
      }
      
      return response.status(500).send('Gagal mengupdate data organisasi')
    }
  }

  async destroy({ params, response, request }: HttpContext) {
    try {
      const organisasi = await Organisasi.findOrFail(params.id)
      
      console.log('[MENGHAPUS ORGANISASI]:', {
        id: organisasi.id,
        nama_organisasi: organisasi.nama_organisasi,
        jenis: organisasi.jenis
      })
      
      await organisasi.delete()
      
      console.log('[ORGANISASI BERHASIL DIHAPUS]')
      
      if (request.accepts(['html', 'json']) === 'json') {
        return response.json({ 
          success: true, 
          message: 'Organisasi berhasil dihapus',
          id: params.id 
        })
      }
      
      return response.redirect('/organisasi')
    } catch (error) {
      console.error('[ERROR DELETE]:', error)
      
      if (request.accepts(['html', 'json']) === 'json') {
        return response.status(500).json({ 
          success: false, 
          message: 'Gagal menghapus data organisasi',
          error: error.message 
        })
      }
      
      return response.status(500).send('Gagal menghapus data organisasi')
    }
  }
}