const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const app = express();



// Set up multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });



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

app.post('/addStudent', upload.single('image'), (req, res) => {
    const { name, dob, contact } = req.body;

    let image;

    if (req.file) {
        image = req.file.filename;
    } else {
        image = null;
    }


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

app.get('/editStudent/:id', (req, res) => {
    const studentId = req.params.id;

    const sql = 'SELECT * FROM student WHERE studentId = ?';

    connection.query(sql, [studentId], (error, results) => {
        if (error) {
            console.error("Error retrieving student:", error);
            res.send('Error retrieving student');
        }

        if (results.length > 0) {
            res.render('editStudent', {
                student: results[0]
            });
        } else {
            res.send('Student not found');
        }
    });
});

app.post('/editStudent/:id', upload.single('image'), (req, res) => {
    const studentId = req.params.id;
    const { name, dob, contact } = req.body;
    let image = req.body.image;

    if (req.file) {
        image = req.file.filename;
    }
    const sql = `
        UPDATE student
        SET name = ?, dob = ?, contact = ?, image = ?
        WHERE studentId = ?
    `;

    connection.query(sql,
        [name, dob, contact, image, studentId],
        (error, results) => {

            if (error) {
                console.error("Error updating student:", error);
                res.send('Error updating student');
            } else {
                res.redirect('/');
            }
        });
});



app.get('/deleteStudent/:id', (req, res) => {
    const studentId = req.params.id;

    const sql = 'DELETE FROM student WHERE studentId = ?';

    connection.query(sql, [studentId], (error, results) => {
        if (error) {
            console.error("Error deleting student:", error);
            res.send('Error deleting student');
        } else {
            res.redirect('/');
        }
    });
});




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});