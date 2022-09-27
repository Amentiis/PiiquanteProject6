const Sauce = require('../models/sauce')
const fs = require('fs')


//Creation Sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      likes : 0,
      dislikes : 0,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
};

//Modification Sauce
exports.ModifySauce =  (req, res, next) => {
  Sauce.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };


//Suppression Sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
 };



// Permet de récupérer toutes les sauces
exports.GetAllSauce = (req, res) => {
    Sauce.find()
      .then(products => res.status(200).json(products))
      .catch(error => res.status(400).json({ error }));
};


// Permet de récupérer une sauce en particulier
exports.GetSpecifySauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
      .then(product => res.status(200).json(product))
      .catch(error => res.status(404).json({ error }));
  };



// Permet de mettre un j'aime, d'enlever un j'aime , de mettre un je n'aime pas en fonction de ce qui est envoyé à l'API
exports.LikeSauce = (req, res, next) => {
  switch (req.body.like){
      case 1 :
        Sauce.updateOne({ _id: req.params.id }, {
          $inc: { likes: 1 },
            $push: { usersLiked: req.body.userId },
            _id: req.params.id
        })
      .then(() => res.status(200).json({ message: 'sauce like !'}))
      .catch(error => res.status(400).json({ error }));
      break;
      case -1 :
        Sauce.updateOne({ _id: req.params.id }, {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: req.body.userId },
          _id: req.params.id
        })
      .then(() => res.status(200).json({ message: 'sauce dislike  !'}))
      .catch(error => res.status(400).json({ error }));
      break;
      case 0:
        Sauce.findOne({ _id: req.params.id })
          .then((sauce) => {
            if (sauce.usersLiked.find(user => user === req.body.userId)) {
              Sauce.updateOne({ _id: req.params.id }, {
                $inc: { likes: -1 },
                $pull: { usersLiked: req.body.userId },
                _id: req.params.id
              })
                .then(() => { res.status(201).json({ message: 'Ton avis a été pris en compte!' }); })
                .catch((error) => { res.status(400).json({ error}); });
            } else if (sauce.usersDisliked.find(user => user === req.body.userId)) {
              Sauce.updateOne({ _id: req.params.id }, {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: req.body.userId },
                _id: req.params.id
              })
                .then(() => { res.status(201).json({ message: 'Ton avis a été pris en compte!' }); })
                .catch((error) => { res.status(400).json({ error}); });
            }
          })
          .catch((error) => { res.status(404).json({error}); });
        break;
    }
  }



