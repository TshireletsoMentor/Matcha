const express = require('express');
const router = express.Router();
const connection = require('../config/connect');

router.get('/', (req, res) => {
  let errors = [];

  session = req.session;

  errors.push({ msg: 'No page provided!'});
  
  res.redirect('login');

});

router.get('/:page', (req, res) => {
  let perPage = 8;
  let page = req.params.page || 1;

  session = req.session;

  if (session.username !== 'admin'){
    const sql3 = "SELECT * FROM users WHERE email = ?";
    connection.query(sql3, [
      session.email
    ], (err, result) => {
      if (err) throw err;

      const sql4 = "SELECT COUNT(*) AS count FROM users WHERE username NOT IN (?, ?) AND suspended != 1";
      connection.query(sql4, [
        'admin',
        session.username,
      ], (err, count) => {
        if (err) throw err;
        const sql5 = "SELECT * FROM users WHERE username NOT IN (?, ?) AND suspended != 1 LIMIT ?, ?";
        connection.query(sql5, [
          'admin',
          session.username,
          (perPage * page) - perPage,
          perPage,
        ], (err, ret) => {
          if (err) throw err;
          res.render('dashboard', { result, ret, current: page, pages: Math.ceil(count[0].count / perPage) })
        })
      })
    })
  } else {
    const sql6 = "SELECT * FROM users WHERE email = ?";
    connection.query(sql6, [
      session.email
    ], (err, result) => {
      if (err) throw err;

      const sql7 = "SELECT COUNT(*) AS count FROM users WHERE online = 'Y'";
      connection.query(sql7, (err, count) => {
        if (err) throw err;
        const sql8 = "SELECT * FROM users LIMIT ?, ? WHERE online = 'Y'";
        connection.query(sql8, [
          (perPage * page) - perPage,
          perPage,
        ], (err, ret) => {
          if (err) throw err;
          res.render('dashboard', { result, ret, current: page, pages: Math.ceil(count[0].count / perPage) })
        })
      })
    })
  }
});

module.exports = router;