//Set up
const express = require('express')
const morgan = require('morgan')
const path = require('path')
const pool = require('./database')

const PORT = 3000
const app = express()

app.use(morgan('dev'))
app.set('view engine', 'ejs')
app.use('/static', express.static(path.join(__dirname, 'public')))
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({
    extended: true
}))
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.listen(PORT, () => {
    console.log(`server is listening on localhost:${PORT}!\n`)
})

app.get('/test', (req, res) => {
    console.log("test")
})

//sql
let sql = "SELECT b.username, CASE WHEN a.day = 1 THEN 'Monday' WHEN a.day = 2 THEN 'Tuesday' WHEN a.day = 3 THEN 'Wednesday' WHEN a.day = 4 THEN 'Thursday' WHEN a.day = 5 THEN 'Friday' WHEN a.day = 6 THEN 'Saturday' ELSE 'Sunday' END AS day, TO_CHAR(start_at, 'HH:MM') as start_at, TO_CHAR(end_at, 'HH:MM') as end_at  FROM schedules a JOIN users b ON a.user_id = b.user_id ORDER BY b.username ASC" 

//Create the routes
//--Get all schedules
app.get('/', (req, res) => {
    pool.query(sql, (error, results) => {
        console.log(results.rows)
        if (error) {
            throw error
        } else {
            res.render('pages/schedule', {
                title: "Welcome to Mr.Coffee schedule management website",
                subTitle: "Our schedules",
                schedules: results.rows,
                ScheduleFormEnabled: false,
                username: ""
            })
        }
    })
})

//--Add a new schedule
app.get('/new', function(req, res){
    pool.query('SELECT user_id, username FROM users ORDER BY username ASC', (error, results) => {
        //console.log(results.rows)
        if (error) {
            throw error
        } else {
            res.render('pages/schedule', {
                title: "Welcome to Mr.Coffee schedule management website",
                subTitle: "Add a schedule",
                schedules: "",
                ScheduleFormEnabled: true,
                username: results.rows
            })
        }
    })
});
//----Access the parse results as request.body
app.post('/new', async(req, res) => {
    try {
        //var userId = req.body.schedule.userId
        var userId = req.body.schedule.user
        var day = req.body.schedule.day
        var startAt = req.body.schedule.startHr +":"+ req.body.schedule.startMin +":00"
        var endAt = req.body.schedule.endHr +":"+ req.body.schedule.endMin +":00"
        
        pool.query('INSERT INTO schedules (user_id, day, start_at, end_at) VALUES ($1, $2, $3, $4)', [userId, day, startAt, endAt], (error, results) => {
            if (error) {
                throw error
            } else {
                pool.query(sql, (error, results) => {
                    console.log(results.rows)
                    if (error) {
                        throw error
                    } else {
                        res.render('pages/schedule', {
                            title: "Welcome to Mr.Coffee schedule management website",
                            subTitle: "Our schedules",
                            schedules: results.rows,
                            ScheduleFormEnabled: false,
                            username: ""
                        })
                    }
                })
            }
        })
    } catch (error) {
        console.log(error.message)
    }
});