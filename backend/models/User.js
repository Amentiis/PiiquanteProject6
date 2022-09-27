const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email : {type : String , require : true , unique : true},
    password : {type : String , require : true},
})

//UniqueValidator permet de renvoyer une erreur si une personne essai de créer un compte avec une email déjà présente dans la base de donnée
userSchema.plugin(uniquevalidator);

module.exports = mongoose.model('User',userSchema);