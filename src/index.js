const express = require('express')
const rotaUsuario = require('./rotas/usuario.rotas')
const rotaPost = require('./rotas/post.rotas')

const app = express()
app.use(express.json())

app.use('/static', express.static('public'))
app.use('/usuarios', rotaUsuario)
app.use('/posts', rotaPost)

app.get('/', (req, res) => {
    res.json({msg: "Hello from Express!"})
})

app.listen(8080, () => {
    console.log(`Iniciando no ambiente ${process.env.NODE_ENV}`)		
    console.log('Servidor pronto na porta 8080')
})
