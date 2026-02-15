import express from 'express'
import authRouter from './auth.js'
import createUser from './user.js'
import spacesRouter from './spaces.js'
import favoritesRouter from './favorites.js'  

const router = express.Router()

router.use('/', authRouter)
router.use('/user', createUser)
router.use('/api/spaces', spacesRouter)
router.use('/api/favorites', favoritesRouter)  

router.get('/test', (req, res) => {
  try {
    console.log('API is working')
    res.status(200).json({ message: 'API is working' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router