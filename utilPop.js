const connection = require('./config/connect')

module.exports = {
    popularity: function popularity(username){

      const sql = `SELECT
        (SELECT (count(*) * 0.1) AS myViews FROM profileviews WHERE viewed = ?)
      + (SELECT (count(*) * 0.25) AS myLikes FROM likes WHERE liked = ?) 
      - (SELECT (count(*) * 0.5) AS myBlocks FROM blocked WHERE blocked = ?) AS popularity`;
      connection.query(sql, [
        username,
        username,
        username
      ], (err, result) => {
        if (err) throw err;
        // console.log(result);
        if(result[0].popularity >= 10){
          const sql4 = "UPDATE users SET popularity = ? WHERE username = ?";
          connection.query(sql4, [
            '10',
            username
          ], (err, response) => {
            if (err) throw err;
          })
        }
        else if(result[0].popularity <= 0){
          const sql4 = "UPDATE users SET popularity = ? WHERE username = ?";
          connection.query(sql4, [
            '1',
            username
          ], (err, response) => {
            if (err) throw err;
          })
        } else {
          const sql4 = "UPDATE users SET popularity = ? WHERE username = ?";
          connection.query(sql4, [
            result[0].popularity + 5,
            username
          ], (err, response) => {
            if (err) throw err;
          })
        }
      });      
    }
}