const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();




// Création d'un compte dans la base de donnée avec un mail et un mot de passe hasher par Bcrypt
exports.signup = (req,res,next)=>{
    bcrypt.hash(req.body.password, 10)
    .then(hash =>{
        const user = new User({
            email : req.body.email,
            password : hash,
        });
        user.save()
        .then(() => res.status(201).json ({message: 'utilisateur créé ! '}))
        .catch(error => res.status(500).json({error : "problème création de compte"}))
    })
    .catch(error => res.status(500).json({error}))
}


// Permet la connexion , en vérifiant que l'email correspond bien à un compte et que le mot de passe soit correcte,
// si connexion réussi création d'un token avec jwt
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                process.env.JWT_TOKEN_KEY,
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };