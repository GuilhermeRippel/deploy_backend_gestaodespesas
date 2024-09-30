import express from 'express'
import { PrismaClient } from '@prisma/client'

const Router = express.Router()
const prisma = new PrismaClient()

Router.delete('/deletar/:id', async (req, res) => {
    const userId = parseInt(req.params.id)

    try{
        const user = await prisma.user.findUnique({
            where: {id: userId}
        })

        if(!user){
            return res.status(404).json({message: "Não encontrado"})
        }

        await prisma.user.delete({
            where: {id: userId}
        })
        res.status(200).json({message: "Usuário deletado com sucesso!"})
    }
    catch(err){
        res.status(404).json({message: "Usuário não encontrado.", err})
    }
})

export default Router