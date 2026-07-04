const express = require('express');
const mysql = require('mysql2');
const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'RP738964$',
    database: 'c237_studentlistapp'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(express.urlencoded({
    extended: false
}));

app.get('/', (req, res) => {
    const sql = 'SELECT * FROM student';

    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            return res.send('Error Retrieving students');
        }
        res.render('index', { students: results });
    });
});

app.get('/addStudent', (req, res) => {
    res.render('addStudent');
});

app.post('/addStudent', (req, res) => {
    const { name, dob, contact, image } = req.body;

    const sql = 'INSERT INTO student (name, dob, contact, image) VALUES (?, ?, ?, ?)';

    connection.query(sql, [name, dob, contact, image], (error, results) => {
        if (error) {
            console.error("Error adding student:", error);
            res.send('Error adding student');
        } else {
            res.redirect('/');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});