const express = require('express')
const router = express.Router()
const usuarioMid = require('../middleware/validarUsuario')
const { Usuario } = require('../db/models')
const bcrypt = require('bcrypt')
router.post('/', usuarioMid)
router.put('/', usuarioMid)
const jwt = require('jsonwebtoken')

router.get('/', async (req, res) => {
    const usuarios = await Usuario.findAll();
    const resultado = usuarios.map(user => prepararResultado(user.dataValues));
    res.json({ usuarios: resultado })
})

router.get('/:id', async (req, res) => {
    const usuario = await Usuario.findByPk(req.params.id);
    if(usuario){
        res.json({usuario : prepararResultado(usuario.dataValues)})
    }else{
        res.status(400).json({msg: 'Usuário não encontrado'})
    }
})

router.post('/', async (req, res) => {
    const senha = req.body.senha
    const salt = await bcrypt.genSalt(10)
    const senhaCriptografada = await bcrypt.hash(senha, salt)
    const usuarioEncriptado = { email: req.body.email, senha: senhaCriptografada }
    console.log(`Salt: ${salt}`)
    console.log(`Senha: ${senhaCriptografada}`)

    const usuario = await Usuario.create(usuarioEncriptado);
    res.json({ msg: "Usuário adicionado com sucesso!", userId: usuario.id })
})

router.delete('/', async (req, res) => {
    const id = req.query.id
    const usuario = await Usuario.findByPk(id);

    if (usuario) {
        //deletar
        await usuario.destroy();
        res.json({ msg: "Usuário deletado com sucesso!" })
    } else {
        res.status(400).json({ msg: "Usuário não encontrado!" })
    }
})
router.put('/', async (req, res) => {
    const id = req.query.id
    const usuario = await Usuario.findByPk(id);

    if (usuario) {
        usuario.email = req.body.email;
        usuario.senha = req.body.senha;
        await usuario.save();
        res.json({ msg: "Usuário atualizado com sucesso!" })
    } else {
        res.status(400).json({ msg: "Usuário não encontrado!" })
    }
})
router.post('/login', async (req, res) => {
    const usuarioEmail = req.body.email
    const senhaUsuario = req.body.senha

    const usuarioBusca = await Usuario.findOne({
        where: {
            email: usuarioEmail
        }
    })

    if (usuarioBusca && await bcrypt.compare(senhaUsuario, usuarioBusca.senha)) {
        //gerar token
        const payload = {
            sub: usuarioBusca.id,
            iss: 'imd-backend', aud: 'imd-frontend', email: usuarioBusca.email
        }

        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'})
        res.json({ accessToken: token })
    } else {
        res.status(403).json({ msg: 'Usuário ou senha inválidos.' })
    }
})

function prepararResultado(usuario){
    const result = Object.assign({}, usuario);
    if(result.createdAt) delete result.createdAt;
    if(result.updatedAt) delete result.updatedAt;
    if(result.senha) delete result.senha;

    return result;
}

module.exports = router