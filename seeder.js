const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const User = require('./models/User');
const Club = require('./models/Club');
const Player = require('./models/Player');
const Match = require('./models/Match');
const Order = require('./models/Order');
const Report = require('./models/Report');

mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

const clubs = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/clubs.json`, 'utf-8')
);

const players = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/players.json`, 'utf-8')
);

const matches = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/matches.json`, 'utf-8')
);

const orders = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/orders.json`, 'utf-8')
);

const reports = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reports.json`, 'utf-8')
);

const importData = async () => {
  try {
    await User.create(users);
    await Club.create(clubs);
    await Player.create(players);
    await Match.create(matches);
    await Order.create(orders);
    await Report.create(reports);

    console.log('Data imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

const deleteData = async () => {
  try {
    await User.deleteMany();
    await Club.deleteMany();
    await Player.deleteMany();
    await Match.deleteMany();
    await Order.deleteMany();
    await Report.deleteMany();

    console.log('Data destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-import') {
  importData();
} else if (process.argv[2] === '-destroy') {
  deleteData();
}
