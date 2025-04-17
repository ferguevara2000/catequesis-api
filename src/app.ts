import "dotenv/config"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from './routes/auth.routes'

const PORT = process.env.PORT || 3001

const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRoutes)

app.listen(PORT, () => console.log(`Listo por el puerto ${PORT}`))