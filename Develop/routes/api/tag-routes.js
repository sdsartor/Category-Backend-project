const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
try {
  const tag = await Tag.findAll(req.params.Product, {
    include: [{ model: Product }]
  });
  res.status(200).json(tag);
} catch (err) {
  console.error(err);
  res.status(500).json(err);

}
});

router.get('/:id', async (req, res) => {
try {
  const tag = await Tag.findByPk(req.params.id, {
  include: [{ model: Product }],
  });
  if (!tag) {
    res.status(404).json({ message: 'This tag is unable to be found or does not exist!'});
    return;
  }
  res.status(200).json(tag);
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
.catch(err => {
  console.error(err);
  res.status(500).json(err)
})
});

router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id
    }
  })
  .then(data => {
    if (!data){
      res.status(404).json({ message: 'The tag id is unable to be found or does not exist!' });
      return;
    }
    res.json(data);
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
