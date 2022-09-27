const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

mongoose.connect(`mongodb+srv://amentiis:openclassroom@cluster0.ab4tqtw.mongodb.net/Groupomania`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // accéder à notre API depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With , Content, Accept, Content-Type, Authorization'); // ajouter les headers mentionnés aux requêtes envoyées vers notre API
  res.setHeader('Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'); // envoyer des requêtes avec les méthodes mentionnées
  next();


});

app.use(express.json());
app.use('/api/auth',userRoutes);
app.use('/api/sauces',sauceRoutes);
app.use('/images',express.static(path.join(__dirname,'images')));

module.exports = app;



