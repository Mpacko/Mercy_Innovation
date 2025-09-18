const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize, User } = require('./models');
const config = require('./config');

const authRoutes = require('./routes/auth');
const internRoutes = require('./routes/interns');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

app.get('/', (req, res) => res.json({ ok: true, message: 'MercyLab API' }));

app.use('/api/auth', authRoutes);
app.use('/api/interns', internRoutes);

// sync DB and seed an admin user if not exists
async function init() {
  try {
    await sequelize.authenticate();
    // sync (for demo/small project it's ok). For prod, use migrations.
    await sequelize.sync();

    // seed admin if none
    const adminEmail = 'admin@mercylab.com';
    const existing = await User.findOne({ where: { email: adminEmail }});
    if (!existing) {
      const bcrypt = require('bcrypt');
      const passwordHash = await bcrypt.hash('password123', 10);
      await User.create({ name: 'Admin', email: adminEmail, passwordHash });
      console.log('Seeded admin user: admin@mercylab.com / password123 (change it!)');
    }

    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to start', err);
    process.exit(1);
  }
}

init();
