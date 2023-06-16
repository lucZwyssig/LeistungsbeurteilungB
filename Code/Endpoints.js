const express = require("express")
const app = express()
app.use(express.json())     
const session = require('express-session')

app.use(
    session({
      secret: 'geheimnis',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false }
    })
  )
// app.use von alten code kopiert

const tasks = [
    { "id": "2020323", "createdDate": "2023-06-15", "completedDate": null, "title": "23423" },
    { "id": "334344344", "createdDate": "2023-06-14", "completedDate": "2023-06-16", "title": "3434344" },
    { "id": "23020302323", "createdDate": "2023-06-12", "completedDate": null, "title": "Task 3" },
    { "id": "23020302355", "createdDate": "2023-06-10", "completedDate": "2023-06-13", "title": "34345454" }
];
// daten von chat.openai.com generiert.

const users =["luc@gmail.com", "cul@liamg.com"]
const correctPassword = "m295"

const checkEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regex.test(email)
    //regex kombination von chat.openai.com generiert
  }

app.post('/login', (req, res) => {

    if(!req.is('json')){
        res.sendStatus(415)
        return
    }
    const emailInput = req.body.email
    const isEmail = checkEmail(emailInput)
    if(!isEmail){
        res.status(415).json("not an email")
        return
    }
    
    //check type
    const userPassword = req.body.password
    if(userPassword === correctPassword && users.find((email) => email === emailInput)){
        req.session.email = emailInput
        res.sendStatus(200)
    }
    else{
        res.sendStatus(401)
    }
    
})

const verify = (req, res, next) => {
    if(!req.session.email){
        res.sendStatus(401)
    }
    else{
        next()
    }
} // von Library copiert


app.get('/verify', (req, res) => {
    if(!req.session.email){
        res.status(401).json({
            "status" : "you are not logged in"
        })
    }
    else{
        const email = req.session.email;
        res.status(200).json({
            "status": "you are logged in",
            "cookie" : email
        })
    }
})

app.delete('/logout', (req, res) => {
    req.session.destroy();
    res.sendStatus(204)
})



app.get('/tasks', verify, (req, res) => {
    res.status(200).json(tasks)
})

app.post('/tasks', verify, (req, res) => {
    const newTask = req.body
    if (!req.is("json")) {
        res.sendStatus(415)
    }
    else if (!newTask.title || !newTask.createdDate) {
        res.send("no")
    }
    else {
        const id = Math.floor(Math.random() * 10000000 + 1).toString();
        if (!newTask.completedDate) {

            const newTaskUpdated = {
                ...newTask,
                "completedDate": null,
                "id": id
            }
            tasks.push(newTaskUpdated)
        } else {
            const newTaskUpdated = {
                ...newTask,
                "id": id
            }
            tasks.push(newTaskUpdated)
        }

        res.status(201).json(tasks[tasks.length - 1])
        //Das mit length von https://www.freecodecamp.org/news/how-to-get-the-last-item-in-an-array-in-javascript/ kopiert
    }
})

app.get('/tasks/:id', verify, (req, res) => {
    const taskID = req.params.id;
    const task = tasks.find((task) => task.id === taskID)
    if (task === -1) {
        res.sendStatus(404)
    } else {
        res.status(200).send(tasks[task])
    }
})

app.put('/tasks/:id', verify, (req, res) => {
    const taskID = req.params.id
    const newTask = req.body
    const taskIndex = tasks.findIndex((task) => task.id === taskID)

    if (!req.is("json")) {
        res.sendStatus(415)
    } else if (!newTask.title || !newTask.createdDate) {
        res.send("no")
    }

    else if (taskIndex === -1) {
        res.sendStatus(404)
    }
    else {
        const id = Math.floor(Math.random() * 10000000 + 1).toString();
        if (!newTask.completedDate) {
            const newTaskUpdated = {
                ...newTask,
                "completedDate": null,
                "id": id
            }
            tasks.splice(taskIndex, 1, newTaskUpdated)
        } else {
            const newTaskUpdated = {
                ...newTask,
                "id": id
            }
            tasks.splice(taskIndex, 1, newTaskUpdated)
        }

        res.status(201).json(tasks[taskIndex])
    }
})

app.delete('/tasks/:id', verify, (req, res) => {
    const taskID = req.params.id
    const taskIndex = tasks.findIndex((task) => task.id === taskID)
    if (taskIndex === -1) {
        res.sendStatus(404)
    }
    else {
        tasks.splice(taskIndex, 1)
        res.sendStatus(200)
    }

})












app.listen(3000, () => console.log("server started"));

//do Authentifizierung #9
// do change no if wrong format