import "dotenv/config"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import coursesRoutes from './routes/curso.routes'
import estudianteCursoRoutes from './routes/estudianteCurso.route'
import asistenciaRoutes from './routes/asistencia.routes'
import bautismoRoutes from './routes/bautismo.routes'
import matrimonioRoutes from './routes/matrimonio.routes'
import confirmacionRoutes from './routes/confirmacion.routes'
import comunionRoutes from './routes/comunion.routes'
import defuncionRoutes from './routes/defuncion.route'
import finanzasRoutes from './routes/finanzas.routes'
import movimientosRoutes from './routes/movimientos.routes'
import comunicacionRoutes from './routes/comunicacion.route'
import notificacionesRoutes from './routes/notificaciones.routes'
import certificacionesRoutes from './routes/certificaciones.routes'
import pushRoutes from './routes/subscribe.route'

const PORT = process.env.PORT || 3001
const allowedOrigins = [
  'http://localhost:3000',
  'http://192.168.1.3:3000',
  'https://pwa-catequesis-frontend.vercel.app'
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
app.use('/api/estudiantesCurso', estudianteCursoRoutes)
app.use('/api/asistencia', asistenciaRoutes)
app.use('/api/bautismo', bautismoRoutes)
app.use('/api/matrimonio', matrimonioRoutes)
app.use('/api/confirmacion', confirmacionRoutes)
app.use('/api/comunion', comunionRoutes)
app.use('/api/defuncion', defuncionRoutes)
app.use('/api/finanzas', finanzasRoutes)
app.use('/api/movimientos', movimientosRoutes)
app.use('/api/comunicacion', comunicacionRoutes)
app.use('/api/notificaciones', notificacionesRoutes)
app.use('/api/certificaciones', certificacionesRoutes)
app.use('/api/push', pushRoutes)

app.listen(PORT, () => console.log(`Listo por el puerto ${PORT}`))