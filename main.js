require('dotenv').config()
const express = require('express');
const app = express();
const { Pool } = require('pg');
const path = require('path');
const multer = require('multer');

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/files', express.static(path.join(__dirname, 'files')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: process.env.DB_PASSWORD,
    port: 5432
});


app.get('/input_attended', (req, res) => {
    res.sendFile(path.join(__dirname, 'input_attended.html'));
});


app.get('/input_organised', (req, res) => {
    res.sendFile(path.join(__dirname, 'input_organised.html'));
});

app.get('/input_invited', (req, res) => {
    res.sendFile(path.join(__dirname, 'input_invited.html'));
});

app.post('/input_organised', upload.single('file'), (req, res) => {
    const { name, event, title, start_date, end_date, participant, resource, sponsors, expenditure } = req.body;
    const filename = req.file.filename;

    pool.query('INSERT INTO sdp_invited(name,event,title, start_date, end_date, participant ,resource,sponsors,expenditure,file) VALUES($1, $2, $3, $4, $5, $6, $7, $8,$9,$10)', [name, event, title, start_date, end_date, participant, resource, sponsors, expenditure, filename], (err, result) => {
        if (err) {
            console.error('Error executing query', err);
            res.status(500).send('Error inserting data');
        } else {
            res.status(200).send('Data inserted successfully');
        }
    });
});

app.post('/input_attended', upload.single('file'), (req, res) => {
    const { staff, nature, type, name, conference, conducted, days, start_date, end_date } = req.body;
    const filename = req.file.filename;
    const int_days = parseInt(text)
    if (int_days <= 5 && int_days >= 2) {
        var nba = '3'
    }
    else if (int_days > 5) {
        var nba = '5'
    }
    else {
        var nba = null
    }
    pool.query('INSERT INTO sdp_attended(staff, nature, type, name, conference, conducted, days, start_date,end_date,file,nba) VALUES($1, $2, $3, $4, $5, $6, $7, $8 ,$9,$10,$11)', [staff, nature, type, name, conference, conducted, days, start_date, end_date, filename, nba], (err, result) => {
        if (err) {
            console.error('Error executing query', err);
            res.status(500).send('Error inserting data');
        } else {
            res.status(200).send('Data inserted successfully');
        }
    });
});

app.post('/input_invited', upload.single('file'), (req, res) => {
    const { faculty, type, event, start_date, end_date, venue, talk_date, topic } = req.body;
    const filename = req.file.filename;

    pool.query('INSERT INTO sdp_invited(faculty,type,event,start_date, end_date, venue,talk_date,topic,file) VALUES($1, $2, $3, $4, $5, $6, $7, $8,$9)', [faculty, type, event, start_date, end_date, venue, talk_date, topic, filename], (err, result) => {
        if (err) {
            console.error('Error executing query', err);
            res.status(500).send('Error inserting data');
        } else {
            res.status(200).send('Data inserted successfully');
        }
    });
});


// Serve sdp1.html
app.get('/sdp1.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'sdp1.html'));
});

app.get('/sdp2.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'sdp2.html'));
});

app.get('/sdp3.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'sdp3.html'));
});


//chart.js sdp attended and organised
app.get('/analytic.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'analytic.html'));
});

app.get('/days-data', async (req, res) => {
    try {
        const fromYear = req.query.startYear; // Extract fromYear from query parameters
        const toYear = req.query.endYear; // Extract toYear from query parameters
        const colname = req.query.columnName
        console.log(colname)
        const email = req.query.email
        const table = req.query.table
        const startDate = new Date(fromYear, 7, 1);
        const endDate = new Date(toYear, 6, 31);
        if (email === 'none') {
            var ename = 'none';
        }
        else {
            const parts = email.split('@');
            var ename = parts[0];
        }

        let sqlQuery

        if (email === 'none') {
            if (table === 'sa') {
                sqlQuery = `SELECT ${colname} as days, COUNT(*) AS count FROM sdp_attended WHERE start_date >= $1 AND end_date <= $2 and ${colname} !='NULL' GROUP BY ${colname} `;
            }
            if (table === 'so') {
                sqlQuery = `SELECT ${colname} as days, COUNT(*) AS count FROM sdp_organised WHERE start_date >= $1 AND end_date <= $2 and ${colname} !='NULL' GROUP BY ${colname} `;
            }
            if (table === 'si') {
                sqlQuery = `SELECT ${colname} as days, COUNT(*) AS count FROM sdp_invited WHERE start_date >= $1 AND end_date <= $2 and ${colname} !='NULL' GROUP BY ${colname} `;
            }
        }

        else {
            if (table === 'sa') {
                sqlQuery = `SELECT ${colname} as days, COUNT(*) AS count FROM sdp_attended WHERE (staff LIKE '%${ename}%' OR LOWER(staff) LIKE '%${ename}%') and (start_date >= $1 AND end_date <= $2) and (${colname} !='NULL') GROUP BY ${colname} `;
            }
            if (table === 'so') {
                sqlQuery = `SELECT ${colname} as days, COUNT(*) AS count FROM sdp_organised WHERE (name LIKE '%${ename}%' OR LOWER(name) LIKE '%${ename}%') and (start_date >= $1 AND end_date <= $2) and (${colname} !='NULL') GROUP BY ${colname} `;
            }
            if (table === 'si') {
                sqlQuery = `SELECT ${colname} as days, COUNT(*) AS count FROM sdp_invited WHERE (faculty LIKE '%${ename}%' OR LOWER(faculty) LIKE '%${ename}%') and (start_date >= $1 AND end_date <= $2) and (${colname} !='NULL') GROUP BY ${colname} `;
            }
        }

        const result = await pool.query(sqlQuery, [startDate, endDate]);
        console.log
        const data = result.rows.map(row => ({ days: row.days, count: parseInt(row.count) }));
        console.log('Table Contents:', data);
        res.json(data);
    }

    catch (error) {
        console.error('Error fetching days data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.get('/faculty_attended.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'faculty_attended.html'));
});

app.get('/faculty_organised.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'faculty_organised.html'));
});

app.get('/faculty_invited.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'faculty_invited.html'));
});


app.get('/page.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'page.html'));
});


app.get('/sdp.js', (req, res) => {
    res.set('Content-Type', 'text/javascript');
    res.sendFile(path.join(__dirname, 'sdp.js'));
});






app.get("/", (req, res) => {
    res.sendFile(__dirname + "/home.html");

});

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/sign_in.html");
});

app.post("/submit", (req, res) => {
    const { email, password } = req.body;

    console.log(`Email: ${email}, Password: ${password}`);

    if (email === 'admin@ssn.edu.in' && password === 'admin') {
        res.redirect("/page.html?email=" + encodeURIComponent('none'))
    }
    else if (email === 'gayathri@gmail.com' && password === 'gayathri') {
        res.redirect("/page.html?email=" + encodeURIComponent(email));
    }
    else {
        res.send('Incorrect credentials');
    }
});



// without email
app.get('/records1', (req, res) => {
    const { column, value, fromYear, toYear, table, columndays } = req.query;
    const startDate = new Date(fromYear, 7, 1);
    const endDate = new Date(toYear, 6, 31);
    let sqlQuery = '';
    let queryParams = [];

    if (table === 'sa') {

        if (column === 'range') {
            if (columndays === 'low') {
                sqlQuery = `SELECT * FROM sdp_attended WHERE (nba = '3') and (start_date >= $1 AND end_date <= $2);`

            }
            if (columndays === 'high') {
                sqlQuery = `SELECT * FROM sdp_attended WHERE (nba = '5') and (start_date >= $1 AND end_date <= $2);`
            }
            queryParams.push(startDate, endDate)
        }

        else if (fromYear === "" || toYear === "") {
            if (column === 'all') {
                sqlQuery = `SELECT * FROM sdp_attended`;
            } else {
                sqlQuery = `SELECT * FROM sdp_attended WHERE ${column}`;
                if (['name', 'staff', 'conference', 'duration', 'nature', 'type', 'days'].includes(column)) {
                    sqlQuery += ` LIKE $1 OR LOWER(${column}) LIKE $1`;
                } else {
                    sqlQuery += ` = $1 OR LOWER(${column}) = $1`;
                }
                queryParams.push(`%${value}%`);
            }
        }


        else {
            sqlQuery = `SELECT * FROM sdp_attended WHERE (start_date >= $1 AND end_date <= $2) `;
            queryParams.push(startDate, endDate);
            if (column !== 'all') {
                sqlQuery += ` AND (${column}`;
                if (['name', 'staff', 'conference', 'duration', 'nature', 'type', 'days'].includes(column)) {
                    sqlQuery += ` LIKE $${queryParams.length + 1} OR LOWER(${column}) LIKE $${queryParams.length + 1}`;
                } else {
                    sqlQuery += ` = $${queryParams.length + 1} OR LOWER(${column}) = $${queryParams.length + 1}`;
                }
                queryParams.push(`%${value}%`);

                sqlQuery += ')';
            }
        }
    }

    if (table === 'so') {
        if (fromYear === "" || toYear === "") {
            if (column === 'all') {
                sqlQuery = `SELECT * FROM sdp_organised`;
            } else {
                sqlQuery = `SELECT * FROM sdp_organised WHERE ${column} `;
                if (['name', 'event', 'title', 'resource', 'sponsors'].includes(column)) {
                    sqlQuery += `LIKE $1 OR LOWER(${column}) LIKE $1`;
                } else {
                    sqlQuery += `= $1 OR LOWER(${column}) = $1`;
                }
                queryParams.push(`%${value}%`);
            }
        } else {
            sqlQuery = `SELECT * FROM sdp_organised WHERE (start_date >= $1 AND end_date <= $2)`;
            queryParams.push(startDate, endDate);
            if (column !== 'all') {
                sqlQuery += ` AND (${column}`;
                if (['name', 'event', 'title', 'resource', 'sponsors'].includes(column)) {
                    sqlQuery += `LIKE $${queryParams.length + 1} OR LOWER(${column}) LIKE $${queryParams.length + 1}`;
                } else {
                    sqlQuery += `= $${queryParams.length + 1} OR LOWER(${column}) = $${queryParams.length + 1}`;
                }
                queryParams.push(`%${value}%`);

                sqlQuery += ')';

            }
        }
    }

    if (table === 'si') {

        if (fromYear === "" || toYear === "") {
            if (column === 'all') {
                sqlQuery = `SELECT * FROM sdp_invited`;
            } else {
                sqlQuery = `SELECT * FROM sdp_invited WHERE ${column} `;
                if (['faculty', 'type', 'event', 'venue', 'topic', 'talk_date'].includes(column)) {
                    sqlQuery += `LIKE $1 OR LOWER(${column}) LIKE $1`;
                } else {
                    sqlQuery += `= $1 OR LOWER(${column}) = $1`;
                }
                queryParams.push(`%${value}%`);
            }
        } else {
            sqlQuery = `SELECT * FROM sdp_invited WHERE (start_date >= $1 AND end_date <= $2)`;
            queryParams.push(startDate, endDate);
            if (column !== 'all') {
                sqlQuery += ` AND (${column} `;
                if (['faculty', 'type', 'event', 'venue', 'topic', 'talk_date'].includes(column)) {
                    sqlQuery += `LIKE $${queryParams.length + 1} OR LOWER(${column}) LIKE $${queryParams.length + 1}`;
                } else {
                    sqlQuery += `= $${queryParams.length + 1} OR LOWER(${column}) = $${queryParams.length + 1}`;
                }
                queryParams.push(`%${value}%`);
                sqlQuery += ')';
            }
        }
    }


    pool.query(sqlQuery, queryParams, (error, results) => {
        if (error) {
            console.error('Error executing query', error);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.rows.length === 0) {
            res.json({ message: 'No records found' });
        } else {
            res.json(results.rows);
        }
    });
});
// with email
app.get('/records2', (req, res) => {
    const { column, value, fromYear, toYear, email, table } = req.query;
    const startDate = new Date(fromYear, 7, 1);
    const endDate = new Date(toYear, 6, 31);
    const parts = email.split('@');
    const ename = parts[0];

    let sqlQuery = '';
    let queryParams = [];


    if (table === 'sa') {
        if (fromYear === "" || toYear === "") {
            if (column === 'all' || value === '') {
                sqlQuery = `SELECT nature,type,name,conference,conducted,days,start_date,end_date FROM sdp_attended where (staff like '%${ename}%' or lower(staff) like '%${ename}%')`;
            } else {
                sqlQuery = `SELECT nature,type,name,conference,conducted,days,start_date,end_date FROM sdp_attended WHERE (staff like '%${ename}%' or lower(staff) like '%${ename}%') and ${column}`;
                if (['name', 'conference', 'duration', 'nature', 'type', 'days'].includes(column)) {
                    sqlQuery += ` LIKE $1 OR LOWER(${column}) LIKE $1  `;
                } else {
                    sqlQuery += ` = $1 OR LOWER(${column}) = $1`;
                }
                queryParams.push(`%${value}%`);
            }
        } else {
            sqlQuery = `SELECT nature,type,name,conference,conducted,days,start_date,end_date FROM sdp_attended WHERE (start_date >= $1 AND end_date <= $2) and (staff like '%${ename}%' or lower(staff) like '%${ename}%')`;
            queryParams.push(startDate, endDate);
            if (column !== 'all') {
                sqlQuery += ` AND (${column}`;
                if (['name', 'conference', 'duration', 'nature', 'type', 'days'].includes(column)) {
                    sqlQuery += ` LIKE $${queryParams.length + 1} OR LOWER(${column}) LIKE $${queryParams.length + 1}`;
                } else {
                    sqlQuery += ` = $${queryParams.length + 1} OR LOWER(${column}) = $${queryParams.length + 1}`;
                }
                queryParams.push(`%${value}%`);

                sqlQuery += ')';
            }
        }
    }

    if (table === 'so') {
        if (fromYear === "" || toYear === "") {
            if (column === 'all' || value === '') {
                sqlQuery = `SELECT event,title,start_date,end_date,days,participants,resource,sponsors,expenditure FROM sdp_organised where (name like '%${ename}%' or lower(name) like '%${ename}%' ) `;
            } else {
                sqlQuery = `SELECT * FROM sdp_organised WHERE (name like '%${ename}%' or lower(name) like '%${ename}%') and ${column} `;
                if (['event', 'title', 'resource', 'sponsors'].includes(column)) {
                    sqlQuery += `LIKE $1 OR LOWER(${column}) LIKE $1`;
                } else {
                    sqlQuery += `= $1 OR LOWER(${column}) = $1`;
                }
                queryParams.push(`%${value}%`);
            }
        } else {
            sqlQuery = `SELECT event,title,start_date,end_date,days,participants,resource,sponsors,expenditure FROM sdp_organised WHERE (name like '%${ename}%' or lower(name) like '%${ename}%') and (start_date >= $1 AND end_date <= $2)`;
            queryParams.push(startDate, endDate);
            if (column !== 'all') {
                sqlQuery += ` AND (${column}`;
                if (['event', 'title', 'resource', 'sponsors'].includes(column)) {
                    sqlQuery += `LIKE $${queryParams.length + 1} OR LOWER(${column}) LIKE $${queryParams.length + 1}`;
                } else {
                    sqlQuery += `= $${queryParams.length + 1} OR LOWER(${column}) = $${queryParams.length + 1}`;
                }
                queryParams.push(`%${value}%`);

                sqlQuery += ')';
            }
        }

    }

    if (table === 'si') {
        if (fromYear === "" || toYear === "") {
            if (column === 'all' || value === '') {
                sqlQuery = `SELECT faculty,type,event,start_date,end_date,venue,talk_date,topic FROM sdp_invited where (faculty like '%${ename}%' or lower(faculty) like '%${ename}%' ) `;
            } else {
                sqlQuery = `SELECT * FROM sdp_invited WHERE (faculty like '%${ename}%' or lower(faculty) like '%${ename}%') and ${column} `;
                if (['faculty', 'type', 'event', 'venue', 'topic', 'talk_date'].includes(column)) {
                    sqlQuery += `LIKE $1 OR LOWER(${column}) LIKE $1`;
                } else {
                    sqlQuery += `= $1 OR LOWER(${column}) = $1`;
                }
                queryParams.push(`%${value}%`);
            }
        } else {
            sqlQuery = `SELECT faculty,type,event,start_date,end_date,venue,talk_date,topic FROM sdp_invited WHERE (faculty like '%${ename}%' or lower(faculty) like '%${ename}%') and (start_date >= $1 AND end_date <= $2)`;
            queryParams.push(startDate, endDate);
            if (column !== 'all') {
                sqlQuery += ` AND (${column}`;
                if (['faculty', 'type', 'event', 'venue', 'topic', 'talk_date'].includes(column)) {
                    sqlQuery += `LIKE $${queryParams.length + 1} OR LOWER(${column}) LIKE $${queryParams.length + 1}`;
                } else {
                    sqlQuery += `= $${queryParams.length + 1} OR LOWER(${column}) = $${queryParams.length + 1}`;
                }
                queryParams.push(`%${value}%`);

                sqlQuery += ')';
            }
        }
    }



    pool.query(sqlQuery, queryParams, (error, results) => {
        if (error) {
            console.error('Error executing query', error);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.rows.length === 0) {
            res.json({ message: 'No records found' });
        } else {
            res.json(results.rows);
        }
    });
});


app.get('/consolidated.js', (req, res) => {
    res.set('Content-Type', 'text/javascript');
    res.sendFile(path.join(__dirname, 'consolidated.js'));
});

// function to filter database records
const separateData = (result, fields) => {
    const combinedData = result.rows.reduce((acc, curr) => {
        const matchedField = fields.find(field => new RegExp(field, 'i').test(curr.type));
        if (matchedField) {
            const existingItem = acc.find(item => item.type.toLowerCase() === matchedField.toLowerCase());
            if (existingItem) {
                existingItem.count += parseInt(curr.count, 10);
            } else {
                acc.push({ type: matchedField, count: parseInt(curr.count, 10) });
            }
        } else {
            acc.push({ ...curr, count: parseInt(curr.count, 10) });
        }
        return acc;
    }, []);

    return combinedData;
};


app.get('/data_consol', async (req, res) => {
    const fromYear = req.query.fromYear; // Extract fromYear from query parameters
    const toYear = req.query.toYear;
    const startDate = new Date(fromYear, 7, 1);
    const endDate = new Date(toYear, 6, 31);

    try {
        // sqlQuery = `SELECT type , COUNT(*) AS count FROM sdp_attended WHERE start_date >= $1 AND end_date <= $2 and type !='NULL' GROUP BY type `;
        // const result = await pool.query(sqlQuery, [startDate, endDate]);
        sqlQuery = `select ac_year as type , count(*) as count from sdp_attended group by ac_year order by ac_year`;
        const result = await pool.query(sqlQuery)

        sqlQuery1 = `SELECT event as type, COUNT(*) AS count FROM sdp_organised WHERE start_date >= $1 AND end_date <= $2 and event !='NULL' GROUP BY event `;
        const result1 = await pool.query(sqlQuery1, [startDate, endDate]);

        sqlQuery2 = `SELECT  type, COUNT(*) AS count FROM sdp_invited WHERE start_date >= $1 AND end_date <= $2 and type!='NULL' GROUP BY type`;
        const result2 = await pool.query(sqlQuery2, [startDate, endDate]);


        const fields = ['Workshop', 'FDP', 'Conference', 'Seminar', 'STTP', 'Webinar', 'Lecture', 'Training'];
        const sa = separateData(result, fields)
        const so = separateData(result1, fields)
        const si = separateData(result2, fields)

        res.json({ data: sa, data1: so, data2: si });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }


});

app.get('/nba', async (req, res) => {
    try {
        const sqlQuery = `select nba ,ac_year , count(*) as count from sdp_attended where (ac_year is not null) and 
         (nba='3' or nba = '5') group by nba,ac_year order by ac_year`;
        const result = await pool.query(sqlQuery)

        res.json(result.rows);
    }


    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
})

const PORT = 7777;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});



