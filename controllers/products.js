const Product = require('../models/product');

const getAllProductsStatic = async (req, res) => {
  // Busca todos os itens da coleção: (<modelo>.find({}))
  // const products = await Product.find({});

  // Busca filtrada: (<modelo>.find({<filtros>}))
  // const products = await Product.find({ featured: true, rating: 5 });

  // Ordenar itens por campo: encadear o método .sort(<campo que baseará ordenação>)
  // const products = await Product.find({}).sort('name');

  // Ordenar itens por mais de um campo, sendo o primeiro do maior para menor valor (separar campos por espaço)
  // const products = await Product.find({}).sort('-name price');

  // Selecionar campos que serão exibidos (separar campos por espaço)
  // const products = await Product.find({}).select('name price');

  // Limitar número de dados retornados (utilizar método .limit(<num dados retornados>))
  // const products = await Product.find({}).select('name price').limit(4);

  // Pular número de dados (útil para fazer paginação, quando combinado com .limit())
  // const products = await Product.find({})
  //   .sort('name')
  //   .select('name company')
  //   .limit(10)
  //   .skip(10); // Mostrará a partir do Décimo-primeiro item

  // Filtros numéricos (passar dentro do filtro um (ou mais) objeto contendo o campo como chave e outro objeto, com o sinal da operação e o numero, como valor)
  // Nesse caso, $gt equivale a "greater than"
  // Documentção com operadores: https://www.mongodb.com/docs/manual/reference/operator/query-comparison/
  const products = await Product.find({ price: { $gt: 30 } })
    .sort('price')
    .select('name price');

  //nbHits (number of hits) mostra quantos itens foram encontrados
  res.status(200).json({ products, nbHits: products.length });
};

const getAllProducts = async (req, res) => {
  // Utilizar uma Query (ex: /api/v1/products?name=chair&featured=true)
  // que devolve um JSON/objeto {name: 'chair', featured: 'true'}, que
  // pode ser utilizado no .find()
  // OBS: essa prática não é recomendada, pois não há validação dos dados que chegam
  // const products = await Product.find(req.query);
  // res.status(200).json({ products, nbHits: products.length });

  // Filtragem dos dados (utilizando queries)
  const { featured, company, name, sort, fields, numericFilters } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.featured = featured === 'true' ? true : false;
  }
  if (company) {
    queryObject.company = company;
  }
  if (name) {
    // Será passado na busca um objeto que será interpretado pelo mongoDB
    // $ indica propriedades de busca
    // $regex indica que resultados deverão possuir em seu campo nome pelo menos um trecho do que foi buscado (ex: name = 'a' busca todos documentos cujo nome apresente pelo menos uma letra a)
    // $options: 'i' torna a busca case-insensitive
    queryObject.name = { $regex: name, $options: 'i' };
  }

  // Filtros para campos numéricos
  if (numericFilters) {
    // Como a query enviará sinais de comparação normais, importante convertê-los para códigos do MongoDB
    const operatorMap = {
      '>': '$gt',
      '>=': '$gte',
      '=': '$eq',
      '<': '$lt',
      '<=': '$lte',
    };
    const regEx = /\b(>|>=|=|<|<=)\b/g;
    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );

    // Filtrar sobre quais campos os filtros numéricos podem agir
    const options = ['price', 'rating'];

    // Adicionar filtros ao objeto queryObject
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-');
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  // console.log(queryObject);

  let result = Product.find(queryObject);

  // Ordenamento dos dados enviados
  if (sort) {
    // Query terá seus campos de ordenação separados por vírgula (necessário trocar por espaço)
    const sortList = sort.split(',').join(' ');
    result = result.sort(sortList);
  } else {
    // Campo padrão, definido pelo sistema (não é recomendável entregar informações aleatoriamente)
    result = result.sort('createAt');
  }

  // Selecionar campos que serão apresentados
  if (fields) {
    const fieldsList = fields.split(',').join(' ');
    result = result.select(fieldsList);
  }

  // Paginação: Quantidade de itens que deverá ser exibida por página e número da página (filtra resultados retornados)
  const page = Number(req.query.page) || 1; // Se não for passada uma página específica, supõe-se igual a 1 (primeira página)
  const limit = Number(req.query.limit) || 10; // 10 é o limite padrão, definido por nós
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const products = await result;

  res.status(200).json({ products, nbHits: products.length });
};

module.exports = {
  getAllProductsStatic,
  getAllProducts,
};
