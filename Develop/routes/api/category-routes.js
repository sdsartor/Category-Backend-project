const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const category = await Category.findAll(({
      include: [{model: Product }],
    }));
    res.status(200).json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  
  }
  });


router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
    include: [{ model: Product }],
    });
    if (!category) {
      res.status(404).json({ message: 'There is no category with that id!'});
      return;
    }
    res.status(200).json(category);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
  // find one category by its `id` value
  // be sure to include its associated Products
});

router.post('/', (req, res) => {
  Category.create({
    category_name: req.body.category_name
  })
  .then(data => {
    return res.json(data);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json(err)
  })
  // create a new category
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    where: {
      id: req.params.id
    }
  })
  .then(data => {
    if (!data){
      res.status(404).json({ message: 'There is no category with that id!' });
      return;
    }
    res.json(data);
  })
  .catch(err => {
    console.error(err);
    res.status(500).json(err);
  });
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const data = await Category.destroy({
      where: { 
        id: req.params.id,
    },
    });
    if (!data) {
      res.status(404).json({ message: 'There is no category with that id!'});
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
