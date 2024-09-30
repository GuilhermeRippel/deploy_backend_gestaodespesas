import express from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const Router = express.Router()
const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET

Router.post('/login', async (req, res) => {
    const user = req.body

    try{
        const userCheck = await prisma.user.findUnique({
            where: {email: user.email}
        })

        if(!userCheck){
            return res.status(401).json({message: "Email incorreto"})
        }

        const userPasswordCheck = await bcrypt.compare(user.password, userCheck.password)

        if(!userPasswordCheck){
            return res.status(400).json({message: "Senha incorreta"})
        }

        const token = jwt.sign({id: userCheck.id}, JWT_SECRET, {expiresIn: "5h"})

        res.status(200).json({token})
    }
    catch(err){
        res.status(401).json({message: "Acesso negado, credenciais incorretas", err})
    }
})

export default Router