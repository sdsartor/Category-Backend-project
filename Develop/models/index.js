// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category, {
  foreignKey: 'category_id',
});

Category.hasMany(Product, {
  foreignKey: 'category_id',
  onDelete: 'SET NULL',
});
// Categories have many Products
Product.belongsToMany(Tag, {
  through: ProductTag,
  foreignKey: 'product_id',
  // product tag model uses a foreign key from product
});
// Products belongToMany Tags (through ProductTag)
Tag.belongsToMany(Product, {
  through: ProductTag,
  foreignKey: 'tag_id',
});
// Tags belongToMany Products (through ProductTag)

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
