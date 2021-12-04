const express = require('express');
const router = new express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/userAccountModel');
const { use } = require('./video');

router.get("/create", (req, res) => {
  res.render("create")
});

router.post("/create", (req, res) => {

    console.log(req.body)
  
  const firstName = req.body.firstname;
  const lastName = req.body.lastname;
  const userName = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const description = req.body.description

  let check = false;

User.findOne({email:email},(err,data) =>{
    if(err){console.error(err)}
    else{
      check = (data==null)?true:check
      console.log(data)
      User.findOne({username:userName},(err,data) =>{
        if(err){console.error(err)}
        else{
          check = (data==null)?check:false
          if(check==true){
            let user = new User({
              firstname : firstName,
              lastname : lastName,
              username : userName,
              email : email,
              password : password,
              about : description
            })
            console.log(user)
            bcrypt.genSalt(10, (err,salt) => {
              if(err){console.error(err);}
              else{
                bcrypt.hash(user.password,salt, (err,hash) => {
                  if(err){console.error(err);}
                  else{
                    user.password = hash;
                    user.save(err =>{
                      if(err){console.error(err);}
                      else{
                        console.log("Account created successfully");
                        res.json({verified:true});
                      }
                    });
                  }
                });
              }
            });
          }
          else{
            res.json({verified:false});
          } 
        }
      })
    }
  })  

});

module.exports = router;
