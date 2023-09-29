require('dotenv').config();

const connectDB = require('./db/connect');

const Product = require('./models/product');

const jsonProducts = require('./products.json');

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log('Successeful connection to MongoDB');
    // Deletar todos da coleção
    await Product.deleteMany();
    // Adicionando mais de um item (repare que é passada uma array de objetos no JSON!)
    await Product.create(jsonProducts);
    console.log('Populate - Success');
    // terminar execução do programa (0 significa que tudo deu certo)
    process.exit(0);
  } catch (error) {
    console.log(error);
    // terminar execução do programa (1 significa que houve erro)
    process.exit(1);
  }
};

start();
