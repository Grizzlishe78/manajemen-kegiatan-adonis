import router from '@adonisjs/core/services/router'
const DashboardController = () => import('#controllers/dashboard_controller') // Impor DashboardController
const KegiatanController = () => import('#controllers/kegiatan_controller')
const AnggotaController = () => import('#controllers/anggota_controller')
const OrganisasiController = () => import('#controllers/organisasi_controller')

router.get('/', [DashboardController, 'index'])

router.get('/laporan', [KegiatanController, 'laporan'])

router.resource('kegiatan', KegiatanController)
router.get('kegiatan/:id/panitia', [KegiatanController, 'panitia'])
router.post('kegiatan/:id/panitia', [KegiatanController, 'storePanitia'])
router.delete('panitia/:id', [KegiatanController, 'destroyPanitia'])

router.resource('anggota', AnggotaController) 

router.get('/organisasi', [OrganisasiController, 'index'])
router.get('/organisasi/create', [OrganisasiController, 'create'])
router.post('/organisasi', [OrganisasiController, 'store'])
router.get('/organisasi/:id/edit', [OrganisasiController, 'edit'])
router.put('/organisasi/:id', [OrganisasiController, 'update']) 
router.delete('/organisasi/:id', [OrganisasiController, 'destroy'])