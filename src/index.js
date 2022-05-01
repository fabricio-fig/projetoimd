const express = require('express')
const rotaUsuario = require('./rotas/usuario.rotas')
const rotaPost = require('./rotas/post.rotas')
const expressLayouts = require('express-ejs-layouts')

const app = express()
app.use(express.json())
app.set('view engine', 'ejs')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)

app.use('/static', express.static('public'))
app.use('/usuarios', rotaUsuario)
app.use('/posts', rotaPost)

app.get('/', (req, res) => {
    res.json({msg: "Hello from Express!"})
})
app.get('/home', (req, res) => {
    const number = Math.random();
    res.render('pages/index', {variavel: number})
})
app.get('/cursos', (req, res) => {
    const cursos = [
        {nome: 'Programação Fron-End', ch: 280}, 
        {nome: 'Programação BeckEnd', ch: 330},
        {nome: 'Programação Concorrente', ch: 300},
        {nome: 'Programação Distribuída', ch: 400}
    ]
    res.render('pages/cursos/index', {cursos: cursos})
})
app.get('/alunos', (req, res) =>{
    const alunos = [
        {nome: 'Pedro'},
        {nome: 'Fernanda'},
        {nome: 'Alex'}
    ]
    res.render('pages/alunos/index', {alunos: alunos})
})
app.listen(8080, () => {
    console.log(`Iniciando no ambiente ${process.env.NODE_ENV}`)		
    console.log('Servidor pronto na porta 8080')
})
