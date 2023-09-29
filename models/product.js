const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    // primeiro item do array diz respeito a ser requerido; segundo, mensagem de erro que será oferecida
    required: [true, 'product name must be provided'],
  },
  price: {
    type: Number,
    required: [true, 'product price must be provided'],
  },
  featured: {
    type: Boolean,
    default: false, // Por default, todos os produtos não são featured (pode não passar essa info no json)
  },
  rating: {
    type: Number,
    default: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  company: {
    type: String,
    // Limita opções
    // enum: ['ikea', 'liddy', 'caressa', 'marcos'],
    enum: {
      values: ['ikea', 'liddy', 'caressa', 'marcos'],
      // mensagem de erro, caso seja passado outro valor ({VALUE})
      message: '{VALUE} is not supported',
    },
  },
});
// Primeiro atributo é o nome do Schema; segundo é o schema em si
// nome da coleção vai ser o nome do schema em caixa baixa, acrescido de um "s"
module.exports = mongoose.model('Product', productSchema);

/*
Mongoose uses the model name, as passed when it was created: mongoose. model("User", UserSchema) , converted to lower case and with an 's' appended. 
For the model User it uses the collection users by default. You can change this by explicitly specifying the collection name in the schema.
*/
