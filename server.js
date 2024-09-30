import express from 'express'
import cors from 'cors'
import { cadastro, login, deletar, getUsuario } from './routes/UserRoutes/index.js'
import { criarCard, listarCard, deletarCard } from './routes/CardRoutes/index.js'
import { getCards } from './routes/MainRoutes/index.js'
import auth from './middlewares/auth.js'

const app = express()
app.use(express.json())
app.use(cors())
app.use('/user', cadastro)
app.use('/user', login)
app.use('/user', auth, deletar)
app.use('/user', auth, getUsuario)
app.use('/card', auth, listarCard)
app.use('/card', auth, criarCard)
app.use('/card', auth, deletarCard)
app.use('/main', auth, getCards)

const PORT = 3000
app.listen(PORT, () => {console.log(`Rodando o servidor na porta ${PORT}`)})