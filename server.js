const express = require('express');
const app = express();
const path = require('path');
const Sequelize = require('sequelize');
const { STRING, BOOLEAN } = Sequelize;

// middleware to serve static file from /dist as transpiled for react setup
app.use('/dist', express.static(path.join(__dirname, 'dist')));
app.get('/', (req, res)=> {
  try{
    res.sendFile(path.join(__dirname, 'index.html'))
  }
  catch(ex){
    next(ex)
  }
});

// additional API routes
app.get('/api/guitars', async(req, res, next) => {
  try{
    res.send(await Guitar.findAll());
  }
  catch(error){
    next(error)
  }
});

app.get('/api/guitars/:id', async(req, res, next) => {
  try{
    const guitar = await Guitar.findByPk(req.params.id);
    res.send(guitar)
  }
  catch(error){
    next(error)
  }
});


// bind and listen to connection, handle requests and provide both HTTP and HTTPS versions of this app.
const init = async()=> {
  try{
    await syncAndSeed();
    const port = process.env.PORT || 5000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  }
  catch(error){
    console.log(error);
  }
};

const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/myguitarcollection')

// Models
const Guitar = conn.define('guitar', {
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  purchased: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  imageURL: {
    type: STRING,
    allowNull: false,
    defaultValue: 'https://thumb7.shutterstock.com/image-photo/stock-vector-guitar-450w-5599069.jpg'
  },
  msrp: {
    type: STRING,
    allowNull: false,
    defaultValue: 1000
  }
});

const Wallet = conn.define('wallet', {
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  amount: {
    type: STRING,
    allowNull: false,
    defaultValue: 3000
  }
})

// db connection
const syncAndSeed = async() => {
  await conn.sync({ force: true });
  await Promise.all([
    Guitar.create({ name: 'Fender Strat', msrp: '1500', imageURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/1958_Fender_Stratocaster.jpg/377px-1958_Fender_Stratocaster.jpg'}),
    Wallet.create({ name: 'Stephen', amount: '3000' })
  ])
}

//


init();

