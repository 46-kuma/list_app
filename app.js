const express = require('express');
var mysql = require('mysql');
const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

var pool = mysql.createPool({
  //mysql://b1697e3f9f3791:35c81551@us-cdbr-east-04.cleardb.com/heroku_daa7d2ad0787280?reconnect=true
  host: 'us-cdbr-east-04.cleardb.com',
  user: 'b1697e3f9f3791',
  password: '35c81551',
  database: 'heroku_daa7d2ad0787280'
});

app.set('port', (process.env.PORT || 5000));

app.get('/', (req, res) => {
//  res.send('hello'+items[0].name);
  res.render('top.ejs');
});

app.get('/index', (req, res) => {
  pool.getConnection(function(err, connection){
  connection.query(
      'SELECT * FROM items',
      (error, results) => {
        res.render('index.ejs', {items: results});
      }
    );
    connection.release();
  });
});

app.get('/new', (req, res) => {
  res.render('new.ejs');
});

app.post('/create', (req, res) => {
  pool.getConnection(function(err, connection){
    connection.query(
      'INSERT INTO items (name) VALUES (?)',
      [req.body.itemName],
      (error, results) => {
        res.redirect('/index');
      }
    );
    connection.release();
  });
});

app.post('/delete/:id', (req, res) => {
  pool.getConnection(function(err, connection){
    connection.query(
      'DELETE FROM items WHERE id = ?',
      [req.params.id],
      (error, results) => {
        res.redirect('/index');
      }
    );
    connection.release();
  });
});

app.get('/edit/:id', (req, res) => {
  pool.getConnection(function(err, connection){
    connection.query(
      'SELECT * FROM items WHERE id = ?',
      [req.params.id],
      (error, results) => {
        res.render('edit.ejs', {item: results[0]});
      }
    );
    connection.release();
  });
});

app.post('/update/:id', (req, res) => {
  pool.getConnection(function(err, connection){
    connection.query(
      'UPDATE items SET name=? WHERE id=?',
      [req.body.itemName, req.params.id],
      (error, results) => {
        res.redirect('/index');
      }
    );
    connection.release();
  });
});

app.listen(app.get('port'), function() {
  console.log('heroku-mysql app is running on port', app.get('port'));
});