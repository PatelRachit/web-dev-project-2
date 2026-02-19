import express from 'express'
import authRouter from './auth.js'
import userRouter from './user.js'
import spacesRouter from './spaces.js'
import favoritesRouter from './favorites.js'
import checkinsRouter from './checkins.js'
import adminRouter from './admin.js'

const router = express.Router()

router.use('/api/auth', authRouter)
router.use('/api/admin', adminRouter)
router.use('/api/user', userRouter)
router.use('/api/spaces', spacesRouter)
router.use('/api/favorites', favoritesRouter)
router.use('/api/checkins', checkinsRouter)

router.get('/test', (req, res) => {
  try {
    console.log('API is working')
    res.status(200).json({ message: 'API is working' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
