const express = require('express')
const { route } = require('./video')
const router = express.Router()

router.get('/logout',(req,res) =>{
    req.session.destroy((err) =>{
        if(err){res.redirect('/')}
        else{
            res.clearCookie('fun')
            res.redirect('/')
        }
    })
})

module.exports = router