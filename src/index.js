const express = require('express')
const rotaUsuario = require('./rotas/usuario.rotas')
const rotaPost = require('./rotas/post.rotas')
const indexRoute = require('./rotas/index.rotas')
var expressLayouts = require('express-ejs-layouts')
const logger = require('./utils/logger')
const logMiddleware = require('./middleware/log.mid')
require('dotenv').config()

    const app = express()


    app.use(express.json())
    app.set('view engine', 'ejs')

    app.use(logMiddleware)

    app.set('layout', 'layouts/layout')

    app.use(expressLayouts)

    app.use('/static', express.static('public'))

//     Rotas
    app.use('/api/usuarios', rotaUsuario)
    app.use('/api/posts', rotaPost)
    app.use('/', indexRoute)

    app.use((err, req, res, next) => {
        const {statusCode, msg} = err
        res.status(statusCode).json({msg:msg})
    })    

    app.get('/api', (req, res) => {
            res.json({msg: "Hello from Express!"})
    })
    
    app.listen(8080, () => {
            logger.info(`Iniciando no ambiente ${process.env.NODE_ENV}`)
            logger.info('Servidor pronto na porta 8080')
    })