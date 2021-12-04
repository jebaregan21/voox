const express = require('express');
const router = new express.Router();
const User = require('../models/userAccountModel');
const bcryptjs = require('bcryptjs');

    router.get("/login", (req,res) => { 
        res.render("login");
    });

    router.post("/login", (req, res) => {
      
      User.findOne({username : req.body.username.trim()},(err,user) =>{
          if(err){console.log(err)}
          else{
              if(user == null){
                  res.send({check:false})
                  return
              }
            bcryptjs.compare(req.body.password,user.password, (err,success) =>{
                if(err){res.json({check:false});}
                else{
                  if(success){
                      req.session.userId = user._id
                      req.session.firstName = user.firstname
                      req.session.email = user.email
                      res.send({check : true})
                    }
                    else{
                        res.send({check:false})
                    }          
                }
              });
          }
      }) 
    });
 
    module.exports = router;
  