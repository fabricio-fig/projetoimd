const express = require('express')
const rotaUsuario = require('./rotas/usuario.rotas')
const rotaPost = require('./rotas/post.rotas')
const indexRoute = require('./rotas/index.rotas')
var expressLayouts = require('express-ejs-layouts')


    const app = express()

    app.use(express.json())
    app.set('view engine', 'ejs')

    app.set('layout', 'layouts/layout')

    app.use(expressLayouts)

    app.use('/static', express.static('public'))

//     Rotas
    app.use('/api/usuarios', rotaUsuario)
    app.use('/api/posts', rotaPost)
    app.use('/', indexRoute)

    app.get('/api', (req, res) => {
            res.json({msg: "Hello from Express!"})
    })

    app.listen(8080, () => {
            console.log(`Iniciando no ambiente ${process.env.NODE_ENV}`)
            console.log('Servidor pronto na porta 8080')
    })