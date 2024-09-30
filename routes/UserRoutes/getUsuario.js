import express from 'express'
import { PrismaClient } from '@prisma/client'

const Router = express.Router()
const prisma = new PrismaClient()

Router.get('/getUsuario', async (req, res) => {
    const userId = req.userId
    try{
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json({message: "Usuário encontrado:", user})
    }
    catch(err){
        res.status(500).json({message: "Erro interno no servidor", err})
    }

})

export default Router