import express from 'express'
import { PrismaClient } from '@prisma/client'

const Router = express.Router()
const prisma = new PrismaClient()

Router.get('/cards/:year/:month', async (req, res) => {
    const {year, month} = req.params
    const userId = req.userId

    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 1)

    try{
        const cards = await prisma.card.findMany({
            where: {
                userId: userId,
                Installments: {
                    some: {
                        date: {
                            gte: startDate,
                            lt: endDate,
                        },
                    },
                },
            },
            include: {
                Installments: {
                    where: {
                        date: {
                            gte: startDate,
                            lt: endDate,
                        },
                    }
                }
            }
        })


        res.status(200).json({message: 'Cards Listados com sucesso!', cards})
    }
    catch(err){
        res.status(500).json({message: 'Erro interno do servidor', err})
    }
})

export default Router