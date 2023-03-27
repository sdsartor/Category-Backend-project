const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    // this try function pulls all data having to fo with the models below and adds them under the product get function. 
    const product = await Product.findAll(({
      include: [
        {
          model: Category,
          attributes:['id', 'category_name']
          },
        {
      model: Tag,
      attributes: ['id', 'tag_name']
      // attributes make data look for specific sections of code. 
        },
     
    ]
    }));
    res.status(200).json(Product);
    // this json will show all code related to the product constant above. 
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  
  }

  // find all products
  // be sure to include its associated Category and Tag data
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const product = await Product.findByPk(req.params.id, {
      // similar to .destroy .findbyPK is another necessary command that can't be changed to another phrase. 
    include: [
      {
         model: Product 
        },
        {
          model: Tag,
          attributes:['id', 'tag_name']
            },
            {
            model: Category,
            attributes:['id', 'category_name']
            },
      ]
    });
    if (!product) {
      res.status(404).json({ message: 'This product is unable to be found or does not exist!'});
      return;
    }
    res.status(200).json(tag);
    // lower case tag means data is pulled from the seeds. uppercase does nothing. 
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// create new product
router.post('/', (req, res) => {
  Product.create({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    tag_Ids: req.body.tagIds,
    // code must be in this order to have the code in the requested structure. 
    category_id: req.body.category_id
  })
  
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.error(err);
      res.status(400).json(err);
    });
  });

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const data = await Product.destroy({
      where: { id: req.params.id,
    },
    });
    if (!data) {
      res.status(404).json({ message: 'The product id is unable to be found or does not exist!'});
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
