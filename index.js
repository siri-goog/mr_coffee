//set up express
const express = require('express')
const app = express()
const PORT = 3000
const db = require('./db/data.js')

var obj = db

//Step 2 : Create the first routes to return all the information
//--root path
app.get('/', (req, res) => {
    res.send('Welcome to our schedule website')
})
//--users path
app.get('/users', (req, res) => {
    res.json(obj.users)
})
//--schedules path
app.get('/schedules', (req, res) => {
    res.json(obj.schedules)
})

//Step 3 : Create parameterized routes
//--user details (specific index)
app.get('/users/:usersParams', (req, res) => {
    //console.log(req.params.usersParams)
    res.send(obj.users[req.params.usersParams])
})
//--user details (specific index) and schedule details
app.get('/users/:usersParams/schedules', (req, res) => {
    var result = []
    for (let i=0; i<obj.schedules.length; i++) {
        if(obj.schedules[i].user_id == req.params.usersParams) {
            console.log(obj.schedules[i])
            result.push(obj.schedules[i])
        }
    }
    res.send(result)
})

//Step 4 : Create routes to update data
    //example
    //queries
    //? = begining of query
    //key:value separated by the ""="" symbol
    //key:value pairs separated by the "&" symbol
    //ex. /hello?name=GooG&car=Toyota
    /*app.post('/hello', (req, res) => {
        console.log(req.query.name)
        if (req.query.name) {
            res.send(`hello back at you ${req.query.name}!`)
        } else {
            res.send('hello nameless')
        }
        
    })*/
//--add  a new user
app.post('/users', (req, res) => {
    var crypto = require('crypto');
    var pwdEncrypt = crypto.createHash('sha256').update(req.query.password).digest('base64');

    var newUser = {
        firstname: req.query.firstname,
        lastname: req.query.lastname,
        email: req.query.email,
        password: pwdEncrypt
    }
    obj.users.push(newUser)
    
    res.send(obj.users)
})

//--add a new schedule
app.post('/schedules', (req, res) => {
    var newSchedule = {
        user_id: parseInt(req.query.user_id),
        day: parseInt(req.query.day),
        start_at: req.query.start_at,
        end_at: req.query.end_at
    }
    obj.schedules.push(newSchedule)

    res.send(obj.schedules)
})

//set up server
app.listen(PORT, () => {
    console.log(`server is listening on localhost:${PORT}!\n`)
}) 