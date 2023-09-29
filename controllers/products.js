const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  // Busca todos os itens da coleção: (<modelo>.find({}))
  // Busca filtrada: (<modelo>.find({<filtros>}))
  const products = await Product.find({ featured: true, rating: 5 });

  //nbHits (number of hits) mostra quantos itens foram encontrados
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  // Utilizar uma query (ex: /api/v1/products?name=chair&featured=true)
  // que devolve um JSON/objeto {name: 'chair', featured: 'true'}, que
  // pode ser utilizado no .find()
  const products = await Product.find(req.query);
  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
