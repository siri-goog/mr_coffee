//Set up
const express = require('express')
const morgan = require('morgan')
const path = require('path')

const PORT = 4000
const app = express()
const db = require('./db/data.js')

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

//Initialised data
var obj = db

//Create the routes to return all the information
//--Title
app.get('/', (req, res) => {
    res.render('pages/form', {
      title: "Welcome to our schedule website",
      subTitle: "",
      users: "",
      schedules: "",
      UserFormEnabled: false,
      ScheduleFormEnabled: false
    })
})
//--Users path
app.get('/users', (req, res) => {
    res.render('pages/form', {
        title: "Welcome to our schedule website",
        subTitle: "Here are our users",
        users: obj.users,
        schedules: "",
        UserFormEnabled: false,
        ScheduleFormEnabled: false
    })
})
app.get('/users/new', function(req, res){
    console.log
    res.render('pages/form', {
        title: "Welcome to our schedule website",
        subTitle: "Add a user",
        users: "",
        schedules: "",
        UserFormEnabled: true,
        ScheduleFormEnabled: false
    })
});
//--Schedules path
app.get('/schedules', (req, res) => {
    console.log(obj.users)
    res.render('pages/form', {
        title: "Welcome to our schedule website",
        subTitle: "Here are schedules",
        users: "",
        schedules: obj.schedules,
        UserFormEnabled: false,
        ScheduleFormEnabled: false
    })
})
app.get('/schedules/new', function(req, res){
    res.render('pages/form', {
        title: "Welcome to our schedule website",
        subTitle: "Add a schedule",
        users: "",
        schedules: "",
        UserFormEnabled: false,
        ScheduleFormEnabled: true,
        userName: obj.users
    })
});

//Create parameterized routes
//--User details (specific index)
app.get('/users/:usersParams', (req, res) => {
    var userResult = []
    userResult.push(obj.users[req.params.usersParams])

    res.render('pages/form', {
        title: "Welcome to our schedule website",
        subTitle: "Here is user details",
        users: userResult,
        schedules: "",
        UserFormEnabled: false,
        ScheduleFormEnabled: false
    })
})
//--User details (specific index) and schedule details
app.get('/users/:usersParams/schedules', (req, res) => {
    var userResult = []
    userResult.push(obj.users[req.params.usersParams])

    var scheduleResult = []
    for (let i=0; i<obj.schedules.length; i++) {
        if(obj.schedules[i].user_id == req.params.usersParams) {
            scheduleResult.push(obj.schedules[i])
        }
    }

    res.render('pages/form', {
        title: "Welcome to our schedule website",
        subTitle: "Here is the schedules of the user",
        users: userResult,
        schedules: scheduleResult,
        UserFormEnabled: false,
        ScheduleFormEnabled: false
    })
})

//--Add a new user
//----Access the parse results as request.body
app.post('/users/new', function(req, res){
    var firstname = req.body.user.firstname
    var lastname = req.body.user.lastname
    var email = req.body.user.email
    var password = req.body.user.password

    var crypto = require('crypto');
    var pwdEncrypt = crypto.createHash('sha256').update(password).digest('base64');

    var newUser = {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: pwdEncrypt
    }
    obj.users.push(newUser)

    res.render('pages/form', {
        title: "Welcome to our schedule website",
        subTitle: "Here are our users",
        users: obj.users,
        schedules: "",
        UserFormEnabled: false,
        ScheduleFormEnabled: false
    })
});

//--Add a new schedule
//----Access the parse results as request.body
app.post('/schedules/new', function(req, res){
    //var userId = req.body.schedule.userId
    var userId = req.body.schedule.user
    var day = req.body.schedule.day
    var startAt = req.body.schedule.startAt+req.body.schedule.startAMPM
    var endAt = req.body.schedule.endAt+req.body.schedule.endAMPM
    var newSchedule = {
        userId: userId,
        day: day,
        start_at: startAt,
        end_at: endAt
    }
    obj.schedules.push(newSchedule)

    res.render('pages/form', {
        title: "Welcome to our schedule website",
        subTitle: "Here are our schedules",
        users: "",
        schedules: obj.schedules,
        UserFormEnabled: false,
        ScheduleFormEnabled: false
    })
});