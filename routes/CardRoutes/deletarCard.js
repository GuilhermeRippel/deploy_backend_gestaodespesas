import express from 'express'
import { PrismaClient } from '@prisma/client'

const Router = express.Router()
const prisma = new PrismaClient()

Router.delete('/deletarCard/:id', async (req, res) => {
    const cardId = parseInt(req.params.id)
    const userId = req.userId

    try{
        const deleteCheck = await prisma.card.findUnique({
            where: {id: cardId}
        })

        if(!deleteCheck){
            return res.status(404).json({message: "Card não encontrado para deletar"})
        }

        if(deleteCheck.userId !== userId){
            return res.status(403).json({message: "Você não tem permissão para deletar este card"})
        }

        if(deleteCheck.installments > 1){
            const deleteIntallment = await prisma.installments.findMany({
                where: {
                    cardId: cardId
                }
            })

            if(!deleteIntallment){
                return res.status(404).json({message: "Parcelas não encontradas"})
            }
            await prisma.installments.deleteMany({
                where: {cardId: cardId}
            })

            await prisma.card.delete({
                where: {id: cardId}
            })

        } else {
            await prisma.installments.deleteMany({
                where: {cardId: cardId}
            })

            await prisma.card.delete({
                where: {id: cardId}
            })
        }


        return res.status(200).json({message: `Card ${cardId} deletado!`})
    }
    catch (err) {
        console.error("Erro durante a exclusão do card:", err);
        return res.status(500).json({ message: "Erro interno do servidor", error: err.message || err })
    }
})

export default Router