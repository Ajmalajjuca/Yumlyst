import express from 'express'
import cors from 'cors'
import { ENV } from './config/env.js'
import { db } from './config/db.js'
import { favorites } from './db/schema.js'
import { and, eq } from 'drizzle-orm'
import job from './config/corn.js'



const PORT = ENV.PORT
const app = express()


if (process.env.NODE_ENV === 'production') {
  job.start()
}


app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' })
})

app.post('/api/favorites', async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body
    
    if(!userId || !recipeId || !title ) {
      res.status(400).json({ status: 'Error', message: 'Missing required fields' })
    }

    const newFavorite = await db
    .insert(favorites)
    .values({
      userId,
      recipeId,
      title,
      image,
      cookTime,
      servings
    })
    .returning()

    res.status(201).json({ status: 'OK', message: 'Favorite added successfully', data: newFavorite })
  } catch (error) {
    console.error('Error adding favorite:',error)
    res.status(500).json({ status: 'Error', message: 'Internal server error' })
    
  }
})

app.get('/api/favorites/:userId', async (req, res) => {
  console.log('req.params', req.params);
  
  
  try {
    const { userId } = req.params
    const UserFavorites = await db
    .select()
    .from(favorites)
    .where(
      eq(favorites.userId, userId)
    )


    res.status(200).json({ status: 'OK', message: 'Favorites retrieved successfully', data: UserFavorites })
  } catch (error) {
    console.error('Error retrieving favorites:',error)
    res.status(500).json({ status: 'Error', message: 'Internal server error' })
  }
})

app.delete('/api/favorites/:userId/:recipeId', async (req, res) => {
  try {
    const { userId, recipeId } = req.params
    const deletedFavorite = await db
    .delete(favorites)
    .where(
      and(
        eq(favorites.userId, userId),
        eq(favorites.recipeId, parseInt(recipeId))
      )
    )
    .returning()
    res.status(200).json({ status: 'OK', message: 'Favorite deleted successfully', data: deletedFavorite })
  } catch (error) {
    console.error('Error deleting favorite:',error)
    res.status(500).json({ status: 'Error', message: 'Internal server error' })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})