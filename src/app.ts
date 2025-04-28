import "dotenv/config"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import coursesRoutes from './routes/curso.routes'

const PORT = process.env.PORT || 3001
const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.1.3:3000'
];

const app = express()
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));
  
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/usuarios', userRoutes)
app.use('/api/cursos', coursesRoutes)

app.listen(PORT, () => console.log(`Listo por el puerto ${PORT}`))