const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce')
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


//Création de sauce
router.post('/', auth, multer,sauceCtrl.createSauce);

//Modification de sauce
router.put('/:id', auth,sauceCtrl.ModifySauce)

//Suppresion  de sauce
router.delete('/:id',auth,sauceCtrl.deleteSauce);

//Récupére toutes les sauces
router.get('/', auth, sauceCtrl.GetAllSauce);

//Récupere une sauce en particulier
router.get('/:id', auth, sauceCtrl.GetSpecifySauce)

//Ajout et supression de like
router.post('/:id/like', auth, sauceCtrl.LikeSauce)
 
module.exports =  router;

