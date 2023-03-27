const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
try {
  const tag = await Tag.findAll(req.params.Product, {
    include: [{ model: Product }]
    // findall is a command necessary to make router search for all data involving tag. 
  });
  res.status(200).json(tag);
} catch (err) {
  console.error(err);
  res.status(500).json(err);

}
});

router.get('/:id', async (req, res) => {
  // must use async when working with try functions
try {
  const tag = await Tag.findByPk(req.params.id, {
  include: [{ model: Product }],
  });
  if (!tag) {
    res.status(404).json({ message: 'This tag is unable to be found or does not exist!'});
    return;
  }
  res.status(200).json(tag);
  // tag is a constant for dat involving tag table that will find data by id. 
} catch (err) {
  console.error(err);
  res.status(500).json(err);
}
  // find a single tag by its `id`
  // be sure to include its associated Product data
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create({
  tag_name: req.body.tag_name
})
.then(data => res.json(data))
// .then statement makes data a constant without using const and makes it equal to response of post function. 
.catch(err => {
  console.error(err);
  res.status(500).json(err)
})
});

router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id
      // params makes it easier to narrow down data being searched for. 
    }
  })
  .then(data => {
    if (!data){
      res.status(404).json({ message: 'The tag id is unable to be found or does not exist!' });
      return;
    }
    res.json(data);
    // this is the same data used for the .then on line 62. 
  })
  .catch(err => {
    console.error(err);
    res.status(500).json(err);
  })
  // update a tag's name by its `id` value
});

router.delete('/:id', async (req, res) => {
  try {
    const data = await Tag.destroy({
      where: { id: req.params.id,
    },
    // same const used for delete function to remain consistent in each route file. 
    });
    if (!data) {
      res.status(404).json({ message: 'The tag id is unable to be found or does not exist!'});
      return;
    }
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
  // delete on tag by its `id` value
});

module.exports = router;
