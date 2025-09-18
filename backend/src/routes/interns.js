const express = require('express');
const router = express.Router();
const { Intern } = require('../models');
const auth = require('../middleware/auth');

/**
 * GET /api/interns
 * Query:
 *   q - search string (name, email, role)
 *   page - 1-based
 *   pageSize
 *   status - filter by status
 */
router.get('/', auth, async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const page = Math.max(1, parseInt(req.query.page || '1'));
    const pageSize = Math.min(100, parseInt(req.query.pageSize || '20'));
    const status = req.query.status;

    const where = {};
    if (status && status !== 'All') where.status = status;

    // simple search
    const Op = require('sequelize').Op;
    if (q) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${q}%` } },
        { email: { [Op.iLike]: `%${q}%` } },
        { role: { [Op.iLike]: `%${q}%` } }
      ];
    }

    const { count, rows } = await Intern.findAndCountAll({
      where,
      limit: pageSize,
      offset: (page - 1) * pageSize,
      order: [['start', 'DESC']]
    });

    res.json({ total: count, page, pageSize, items: rows });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET one
router.get('/:id', auth, async (req, res) => {
  const it = await Intern.findByPk(req.params.id);
  if (!it) return res.status(404).json({ error: 'Not found' });
  res.json(it);
});

// CREATE
router.post('/', auth, async (req, res) => {
  try {
    const payload = req.body;
    payload.ownerId = req.user.id;
    const it = await Intern.create(payload);
    res.status(201).json(it);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Bad request' });
  }
});

// UPDATE
router.put('/:id', auth, async (req, res) => {
  try {
    const it = await Intern.findByPk(req.params.id);
    if (!it) return res.status(404).json({ error: 'Not found' });
    await it.update(req.body);
    res.json(it);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Bad request' });
  }
});

// DELETE
router.delete('/:id', auth, async (req, res) => {
  try {
    const it = await Intern.findByPk(req.params.id);
    if (!it) return res.status(404).json({ error: 'Not found' });
    await it.destroy();
    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

// IMPORT JSON (bulk)
router.post('/import/json', auth, async (req, res) => {
  try {
    const arr = req.body;
    if (!Array.isArray(arr)) return res.status(400).json({ error: 'Expecting array' });
    const withOwner = arr.map(x => ({ ...x, ownerId: req.user.id }));
    const created = await Intern.bulkCreate(withOwner);
    res.json({ imported: created.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
