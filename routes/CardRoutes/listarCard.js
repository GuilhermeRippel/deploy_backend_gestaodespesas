import express from 'express';
import { PrismaClient } from '@prisma/client';

const Router = express.Router();
const prisma = new PrismaClient();

Router.get('/listarCard', async (req, res) => {
    const month = parseInt(req.query.month, 10);
    const year = parseInt(req.query.year, 10);
    const userId = req.userId;

    if (isNaN(month) || isNaN(year)) {
        return res.status(400).json({ message: 'Mês e ano são necessários' });
    }

    if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    try {
        const startOfMonth = new Date(Date.UTC(year, month - 1, 1));
        const startOfNextMonth = new Date(Date.UTC(year, month, 1))

        
        const expenses = await prisma.installments.findMany({
            where: {
                date: {
                    gte: startOfMonth,
                    lt: startOfNextMonth
                },
                card: {
                    userId: userId
                }
            },
            include: {
                card: true,
            }
        });
        res.status(200).json({ message: 'Aqui estão suas parcelas e cartões', expenses});
    } catch (err) {
        console.error('Erro ao buscar despesas:', err);
res.status(500).json({ message: 'Erro interno do servidor', error: err });
    }
});

export default Router;
