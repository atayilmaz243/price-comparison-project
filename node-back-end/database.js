import { calcMin, formatDecimal,formatPrice,turnToWildcard,calcMin2,checkInclude} from './dbfunctions.js'
import { Sequelize,Model,DataTypes,Op } from 'sequelize'
const sequelize = new Sequelize('project1', process.env.USERNAME, process.env.PASSWORD, {
  host: process.env.IP,
  dialect: 'mysql',
  dialectOptions: {
    socketPath: process.env.SOCKETPATH
  },
});

async function connectDB() {
    try {
      await sequelize.authenticate();
      console.log('Database connected.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }
  

// Product Model
class Product extends Model {}
Product.init({
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  image_link: DataTypes.STRING(500),
  product_name: DataTypes.STRING(200),
  company_name: DataTypes.STRING(200),
  category: DataTypes.STRING(64),
  option1: DataTypes.STRING(16),
  option2: DataTypes.STRING(16),
}, { sequelize, modelName: 'Product',tableName: 'Product',timestamps: false });

// updatedPrices Model
class updatedPrices extends Model {}
updatedPrices.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: { model: Product, key: 'product_id' },
    onDelete: 'CASCADE'
  },
  price: DataTypes.DECIMAL(10, 2),
  seller: DataTypes.STRING(255),
  seller_link: DataTypes.STRING(255),
}, { sequelize, modelName: 'updatedPrices',tableName: 'updatedPrices', timestamps: false });

// names Model
class names extends Model {}
names.init({
  name: {
    type: DataTypes.STRING(128),
    primaryKey: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: { model: Product, key: 'product_id' },
    onDelete: 'CASCADE'
  },
}, { sequelize, modelName: 'names',tableName: 'names', timestamps: false });

class searchNames extends Model {}
searchNames.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: { model: Product, key: 'product_id' },
    onDelete: 'CASCADE'
  },
  name: {
    type: DataTypes.STRING(128),
  },
}, { sequelize, modelName: 'searchNames',tableName: 'searchNames', timestamps: false });

// priceHistory Model
class priceHistory extends Model {}
priceHistory.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    references: { model: Product, key: 'product_id' },
    onDelete: 'CASCADE'
  },
  price: DataTypes.DECIMAL(10, 2),
  date: DataTypes.DATE,
}, { sequelize, modelName: 'priceHistory',tableName: 'priceHistory',timestamps: false });

// Sellers Model
class Sellers extends Model {}
Sellers.init({
  seller_name: {
    type: DataTypes.STRING(255),
    primaryKey: true
  },
  seller_image: DataTypes.STRING(255),
}, { sequelize, modelName: 'Sellers',tableName: 'Sellers', timestamps: false });

// Relations
Product.hasMany(updatedPrices, { foreignKey: 'product_id' });
updatedPrices.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasMany(priceHistory, { foreignKey: 'product_id' });
priceHistory.belongsTo(Product, { foreignKey: 'product_id' });

Product.belongsTo(searchNames, { foreignKey: 'product_id' });
searchNames.belongsTo(Product, { foreignKey: 'product_id' });


export async function getProductRow(name,limit){
    try {
        const filteredProducts = await Product.findAll({where : {product_name: name}, limit : limit , include : updatedPrices});
        return filteredProducts.map(product => {

            let minprice = calcMin(product.updatedPrices);
            console.log(`id : ${product.product_id} name: ${product.product_name} price: ${minprice} imglink: ${product.image_link}`);
            return {
                id: product.product_id,
                name: product.company_name + ' ' + product.product_name + ' ' + product.option1 + ' ' + product.option2,
                img_link: product.image_link,
                price: formatPrice(minprice),
                priceD : formatDecimal(minprice)
            };
        });
    } catch (error) {
        console.error('Error:', error);
    }
}
export async function getOptionInfo(id) {

  try {
    const product = await Product.findOne({where : {product_id : id}});
    const result = [];
    if (product.option1)
    { 
      const items = await Product.findAll({where : {product_name : product.product_name}});
      const list = [];
      items.forEach(item => {
        if (!(list.includes(item.option1)))
        {
          list.push(item.option1);
        }
      });

      const color_boxes = await Promise.all(list.map(async item => {


        let q = null;
        if (product.option2)
        {
          q = await Product.findOne({where : {product_name : product.product_name, option1: item, option2: product.option2}});
        } // hata olabilir

        if (!q)
        {
          q = await Product.findOne({where : {product_name : product.product_name, option1: item}});
        }

        const check = (q.product_id == id);
        return {
          check: check,
          name: item,
          img_link: q.image_link,
          id: q.product_id
        };
      }));
      console.log(color_boxes);
      result.push({name : 'Renk seçenekleri',boxes: color_boxes,type: "1"});
    }
    if (product.option2)
    { 
      let items = null;
      if (product.option1)
      {
        items = await Product.findAll({where : {product_name : product.product_name, option1: product.option1}});
      }
      else {
        items = await Product.findAll({where : {product_name : product.product_name}});
      }
      const storage_boxes = await Promise.all(items.map(async item => {
        const check = (item.product_id == id);
        return {
          check: check,
          name: item.option2,
          id: item.product_id
        };
      }));
      result.push({name : 'Depolama seçenekleri',boxes: storage_boxes,type: "2"});
    }

    return result;
  } catch (e) {
    throw new Error('error getOptionInfo ' + e);
  }



}


export async function getInfo(id){
  try {
      console.log(`${id}`);
      const [product,query3] = await Promise.all([
        Product.findOne({where : {product_id : id}}),
        updatedPrices.findAll({where : {product_id : id},  order: [
        ['price', 'ASC']
      ]}),
      ]);

      const sellersPromise = query3.map(async (seller) => {
        const q = await Sellers.findOne({where : {seller_name : seller.seller}});
        console.log(q.seller_image);
        return ({
            id : seller.id, //
            name: seller.seller,
            price: formatPrice(seller.price),
            priceD: formatDecimal(seller.price),
            link : seller.seller_link,
            logo : q.seller_image
          });
        }
      );

      const [sellers] = await Promise.all([
        Promise.all(sellersPromise)
      ]);

      const minprice = (query3) ? query3[0].price : -1;

      const result = {
        img_link : product.image_link,
        info : {
          name : product.product_name,
          price: formatPrice(minprice),
          priceD: formatDecimal(minprice),
          features: product.option1 + ' ' + product.option2,
        },
        sellers: sellers,
      }
      return result;
  } catch (error) {
      console.error('Error:', error);
  }
}

export async function searchbar(name) {
  const formatedName = turnToWildcard(name);
  const items = await searchNames.findAll({where : {name: {[Op.like] : sequelize.fn('LOWER',`${formatedName.toLowerCase()}`)}}, limit : 5});
  const result = items.map( (item) => {
    return {name : item.name, id: item.product_id};
  });
  if (!result) {
    return [];
  }
  return result;
}

export async function searchpage(name) {
  const formatedName = turnToWildcard(name);
  const items = await searchNames.findAll({where : {name: {[Op.like] : sequelize.fn('LOWER',`${formatedName.toLowerCase()}`)}}, limit : 100}); // ! change this limit later

  let bool = {};
  let companies = [];
  const result = await Promise.all(items.map( async (q) => {
    const item = await Product.findOne({where : {product_id : q.product_id}, include : updatedPrices});
    if (!bool[`${item.company_name}`])
    {
      bool[`${item.company_name}`] = true;
      companies.push(item.company_name);
    }
    const price = calcMin(item.updatedPrices);
    return {name : `${item.product_name} ${item.option1} ${item.option2}`, id: item.product_id, price : formatPrice(price), priceD : formatDecimal(price),img_link : item.image_link,company : item.company_name};
  }));
  return {itemContainers : result,companies : companies};
}

export async function chartdata(id,currency,date) {
  let datefilter = null;
  if (date === "Son 2 Yıl")
  {
    datefilter = new Date(new Date() - 2 * 365 * 24 * 60 * 60 * 1000);
  }
  else if (date === "Son 1 Ay")
  {
    datefilter = new Date(new Date() - 30 * 24 * 60 * 60 * 1000);
  }
  else if (date === "Son 3 Ay")
  {
    datefilter = new Date(new Date() - 90 * 24 * 60 * 60 * 1000);
  }
  else 
  {
    datefilter = new Date(new Date() - 7 * 24 * 60 * 60 * 1000);
  }


  const items = await priceHistory.findAll({where : {product_id:id,currency: currency,date : {[Op.gte]: datefilter}}});



  const data =  { 
    labels : items.map((q) => {return q.date}),
    datasets : [
      {
        data: items.map((q) => {return q.price}),
        fill: true,
      }
    ]
  }

  if (currency === 'TL')
  {
    data.datasets[0]['borderColor'] = 'rgb(0,159,232)';
    data.datasets[0]['backgroundColor'] = 'rgb(0,159,232,0.4)';
  }
  else if (currency === 'Dolar')
  {
    data.datasets[0]['borderColor'] = 'green';
    data.datasets[0]['backgroundColor'] = 'rgb(169,188,129,0.4)';
  }

  const chartMinPrice = calcMin2(items);
  chartMinPrice.priceD = formatDecimal(chartMinPrice.price);
  chartMinPrice.price = formatPrice(chartMinPrice.price);



  console.log(`log: ${chartMinPrice.price} , ${chartMinPrice.priceD}`);
  return ({data : data, minprice: {price: chartMinPrice.price, priceD: chartMinPrice.priceD, date : chartMinPrice.date}});

}

export async function GetProductByList(list)
{
  try {
    return await Promise.all(list.map(async (id) => {
      const query = await Product.findOne({where : {product_id: id},include : updatedPrices});
      const minPrice = calcMin(query.updatedPrices);
      return (
        {
          company : query.company_name,
          id : id,
          img_link : query.image_link,
          price : formatPrice(minPrice),
          priceD : formatDecimal(minPrice),
          name : query.product_name,
          combinedName : query.company_name + ' ' + query.product_name + ' ' + query.option1 + ' ' + query.option2,
          features: (query.option1 ? (query.option1 + ' ' + query.option2 ): '')
        }
      )
    }));
  } catch (e) {

    console.log(e);
  }
}


// module.exports = {
//   getProductRow, 
//   getInfo,
//   searchbar,
//   searchpage,
//   chartdata,
// };


export async function searchCategory(category) {
  const items = await Product.findAll({where : {category: category}, include: updatedPrices,limit : 100}); // ! change this limit later

  let bool = {};
  let companies = [];
  const result = await Promise.all(items.map( async (item) => {
    if (!bool[`${item.company_name}`])
    {
      bool[`${item.company_name}`] = true;
      companies.push(item.company_name);
    }
    const price = calcMin(item.updatedPrices);
    return {name : `${item.product_name} ${item.option1} ${item.option2}`, id: item.product_id, price : formatPrice(price), priceD : formatDecimal(price),img_link : item.image_link,company : item.company_name};
  }));
  return {itemContainers : result,companies : companies};
}



