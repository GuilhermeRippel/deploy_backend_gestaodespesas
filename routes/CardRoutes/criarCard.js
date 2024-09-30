import express from 'express'
import { PrismaClient } from '@prisma/client'

const Router = express.Router()
const prisma = new PrismaClient()

Router.post('/criarCard', async (req, res) => {
    const { amount, installments, date, description } = req.body
    const userId = req.userId


    if (!amount || !date || installments === undefined || description === undefined) {
        return res.status(400).json({ message: "Dados inválidos" })
    }

    try {
        const installmentsNumber = Number(installments)
        const amountFloat = parseFloat(amount)
        const dateObj = new Date(date)

        // Valida se a data é válida
        if (isNaN(dateObj.getTime())) {
            return res.status(400).json({ message: "Data inválida" })
        }

        const card = await prisma.card.create({
            data: {
                amount: amountFloat,
                date: dateObj,
                installments: installmentsNumber,
                description: description,
                userId: userId
            }
        })

        for (let i = 0; i < installmentsNumber; i++) {
            // Cria uma nova data para cada parcela
            const installmentDate = new Date(dateObj)
            installmentDate.setMonth(installmentDate.getMonth() + i)

            const localInstallmentDate = new Date(
                installmentDate.getUTCFullYear(),
                installmentDate.getUTCMonth(),
                installmentDate.getUTCDate()
            );

            await prisma.installments.create({
                data: {
                    card: {
                        connect: { id: card.id }
                    },
                    date: localInstallmentDate
                }
            })
        }

        res.status(201).json({ message: "Card criado com sucesso", card })
    } catch (err) {
        console.error('Erro interno no servidor:', err)
        res.status(500).json({ message: "Erro interno no servidor", error: err.message })
    }
})

export default Router