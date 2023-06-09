const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    //This try function allows the code to be used only when the data is read by the router, else it replies with an error. 
    const category = await Category.findAll(({
      include: [{model: Product }],
    }));
    res.status(200).json(category);
  } catch (err) {
    //this creates a error response to the code.
    console.log(err);
    res.status(500).json(err);
  
  }
  });


router.get('/:id', async (req, res) => {
  try {
    // this specifies the place where code is being pulled, specifically from product. 
    const category = await Category.findByPk(req.params.id, {
    include: [{ model: Product }],
    });
    if (!category) {
      // exclamation point is an easier way of establishing noncategory ids than console.error. 
      res.status(404).json({ message: 'There is no category with that id!'});
      return;
    }
    res.status(200).json(category);
  } catch (err) {
    //this will go off if the data isn't pulled. 
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
    // data is the name of the pulled information. 
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
    // this section addresses which data will be updated. 
    where: {
      id: req.params.id
    }
  })
  .then(data => {
    if (!data){
      res.status(404).json({ message: 'There is no category with that id!' });
      return;
      // return will seize any more data from being searched as soon as the erro pops up. 
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
      // destroy is a command that deletes ids in this current section. 
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
