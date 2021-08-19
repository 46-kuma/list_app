const express = require('express');
var mysql = require('mysql');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

const connection = mysql.createConnection({
  host: 'us-cdbr-east-04.cleardb.com',
  user: 'b1697e3f9f3791',
  password: '35c81551',
  database: 'heroku_daa7d2ad0787280'
});

var pool = mysql.createPool(connection);

var port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  console.log("heroku-mysql!!");
  pool.getConnection(function(err, connection){
    connection.query('SELECT * FROM t_message WHERE id=1', function(err, rows, fields){
      if(err){
        console.log('error: ', err);
//        throw err;
      }
      response.writeHead(200,{'Content-Type': 'text/plain'});
      response.write(rows[0].message);
      response.end();
      connection.release();
    });
  });
  //  res.send('hello'+items[0].name);
  res.render('top.ejs');
});

app.get('/index', (req, res) => {
  connection.query(
    'SELECT * FROM items',
    (error, results) => {
      res.render('index.ejs', {items: results});
    }
  );
});

app.get('/new', (req, res) => {
  res.render('new.ejs');
});

app.post('/create', (req, res) => {
  connection.query(
    'INSERT INTO items (name) VALUES (?)',
    [req.body.itemName],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.post('/delete/:id', (req, res) => {
  connection.query(
    'DELETE FROM items WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.redirect('/index');
    }
  );
});

app.get('/edit/:id', (req, res) => {
  connection.query(
    'SELECT * FROM items WHERE id = ?',
    [req.params.id],
    (error, results) => {
      res.render('edit.ejs', {item: results[0]});
    }
  );
});

app.post('/update/:id', (req, res) => {
  connection.query(
    'UPDATE items SET name=? WHERE id=?',
    [req.body.itemName, req.params.id],
    (error, results) => {
      res.redirect('/index');
    }
  )
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
