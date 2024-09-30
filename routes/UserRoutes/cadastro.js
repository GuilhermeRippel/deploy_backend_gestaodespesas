import express from 'express'
import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const Router = express.Router()

//Cadastro
Router.post('/cadastro', async (req, res) => {
    const user = req.body

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(user.password, salt)

    try{

    // Verificação se o usuário já existe
    const checkgUser = await prisma.user.findUnique({
        where: { email: user.email },
    });
    if(checkgUser) {
        return res.status(400).json({ message: "Usuário já existe" });
    }

    const userDB = await prisma.user.create({
        data: {
            name: user.name,
            email: user.email,
            password: hashedPassword,
        }
    })
        res.status(201).json({message: "Usuário criado com sucesso!", userDB})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message: "Não foi possível efetuar o cadastro.", err})
    }
})

export default Router