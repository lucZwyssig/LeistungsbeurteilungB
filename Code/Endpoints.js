const express = require("express")
const app = express()
app.use(express.json())
const session = require('express-session')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use(
    session({
        secret: 'geheimnis',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
    })
)
// app.use von alten code kopiert

let tasks = [
    { "id": "2020323", "createdDate": "2023-06-15", "completedDate": null, "title": "23423", "email": "luc@gmail.com" },
    { "id": "334344344", "createdDate": "2023-06-14", "completedDate": "2023-06-16", "title": "3434344", "email": "cul@liamg.com" },
    { "id": "23020302323", "createdDate": "2023-06-12", "completedDate": null, "title": "Task 3", "email": "luc@gmail.com" },
    { "id": "23020302355", "createdDate": "2023-06-10", "completedDate": "2023-06-13", "title": "34345454", "email": "cul@liamg.com" }
];
// daten von chat.openai.com generiert.



const users = ["luc@gmail.com", "cul@liamg.com"]
const correctPassword = "m295"

const checkEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regex.test(email)
    //regex kombination von chat.openai.com generiert
}

app.post('/login', (req, res) => {
    /* #swagger.parameters['credentials'] = {
    in: 'body',
    description: 'The credentials of the user. They must be correct to receive access to the API',
    required: true,
    schema: {
      email: 'email with an @ for example 123@321.com',
      password: 'string'
    }
  } */

    /* #swagger.responses[200] = {
              description: 'User successfully logged in .',
              
      } */

    /* #swagger.responses[415] = {
            description: 'User entered wrong email schema',
            schema: 'not an email' 
    } */
    /* #swagger.responses[401] = {
            description: 'Not autherized',
            
    } */
    /* #swagger.responses[40] = {
            description: 'user did not enter email',
            6
    } */

    if (!req.is('json')) {
        res.sendStatus(415)
        return
    }
    const emailInput = req.body.email
    const isEmail = checkEmail(emailInput)
    if (!isEmail) {
        res.status(406).json("not an email")
        return
    }

    //check type
    const userPassword = req.body.password
    if (userPassword === correctPassword && users.find((email) => email === emailInput)) {
        req.session.email = emailInput
        res.sendStatus(200)
    }
    else {
        res.sendStatus(401)
    }

})

const verify = (req, res, next) => {
    if (!req.session.email) {
        res.sendStatus(403)
    }
    else {
        next()
    }
} // von Library copiert


app.get('/verify', (req, res) => {


    /* #swagger.responses[200] = {
              description: 'User successfully logged in .',
              schema: {status: "you are logged in", cookie: "123@321.com"}
              
      } */

    /* #swagger.responses[401] = {
            description: 'Not autherized',
            schema: {status: "you are not logged in" }
            
            
    } */
    if (!req.session.email) {
        res.status(401).json({
            "status": "you are not logged in"
        })
    }
    else {
        const email = req.session.email;
        res.status(200).json({
            "status": "you are logged in",
            "cookie": email
        })
    }
})

app.delete('/logout', (req, res) => {

    /* #swagger.responses[204] = {
              description: 'User successfully logged out .',
              
      } */


    req.session.destroy();
    res.sendStatus(204)
})



app.get('/tasks', verify, (req, res) => {

    /* #swagger.responses[200] = {
              description: 'User recieves objects .',
              schema: [{ "id": "2020323", "createdDate": "2023-06-15", "completedDate": null, "title": "23423", "email": "luc@gmail.com" },
      { "id": "334344344", "createdDate": "2023-06-14", "completedDate": "2023-06-16", "title": "3434344", "email": "cul@liamg.com" }]
              
      } */
    /* #swagger.responses[403] = {
            description: 'Forbidden',
            
    } */
    const userTasks = tasks.filter((task) => task.email === req.session.email)
    res.status(200).json(userTasks)
})

app.post('/tasks', verify, (req, res) => {
    /* #swagger.parameters['task'] = {
    in: 'body',
    description: 'The task the user wants to post',
    required: true,
    schema: {  "createdDate": "2023-06-14", "completedDate": "2023-06-16", "title": "3434344"}
  } */

    /* #swagger.responses[201] = {
              description: 'User successfully posted task.',
              schema: [{ "id": "2020323", "createdDate": "2023-06-15", "completedDate": null, "title": "23423", "email": "luc@gmail.com" },
      { "id": "334344344", "createdDate": "2023-06-14", "completedDate": "2023-06-16", "title": "3434344", "email": "cul@liamg.com" }]
              
      } */

    /* #swagger.responses[415] = {
            description: 'unsupported media type'
            
    } */
    /* #swagger.responses[406] = {
            description: 'task doesnt follow schema'
            
    } */
    /* #swagger.responses[403] = {
            description: 'Forbidden',
            
    } */
    const userTasks = tasks.filter((task) => task.email === req.session.email)
    const newTask = req.body
    if (!req.is("json")) {
        res.sendStatus(415)
    }
    else if (!newTask.title || !newTask.createdDate) {
        res.sendStatus(406)
    }
    else {
        const id = Math.floor(Math.random() * 10000000 + 1).toString();
        if (!newTask.completedDate) {

            const newTaskUpdated = {
                ...newTask,
                "completedDate": null,
                "id": id,
                "email": req.session.email
            }
            tasks.push(newTaskUpdated)
        } else {
            const newTaskUpdated = {
                ...newTask,
                "id": id,
                "email": req.session.email
            }
            tasks.push(newTaskUpdated)
        }

        res.status(201).json(tasks[tasks.length - 1])
        //Das mit length von https://www.freecodecamp.org/news/how-to-get-the-last-item-in-an-array-in-javascript/ kopiert
    }
})

app.get('/tasks/:id', verify, (req, res) => {
    /* #swagger.parameters['id'] = {
   in: 'path',
   description: 'ID of the task that the user wants to get',
   required: true,
   type: 'string'
} */

    /* #swagger.responses[200] = {
              description: 'gets task.',
              schema:  { "id": "334344344", "createdDate": "2023-06-14", "completedDate": "2023-06-16", "title": "3434344", "email": "cul@liamg.com" }
              
      } */

    /* #swagger.responses[403] = {
            description: 'Forbidden',
            
    } */
    /* #swagger.responses[404] = {
            description: 'task not found',
            
    } */


    const userTasks = tasks.filter((task) => task.email === req.session.email)
    const taskID = req.params.id;
    const singleTask = userTasks.findIndex((task) => task.id === taskID)
    if (singleTask === -1) {
        res.sendStatus(404)
    } else {
        res.status(200).send(userTasks[singleTask])
    }
})

app.put('/tasks/:id', verify, (req, res) => {
    /* #swagger.parameters['id'] = {
    in: 'path',
    description: 'ID of the task that the user wants to replace',
    required: true,
    type: 'string'
} */

    /* #swagger.responses[201] = {
              description: 'updates task.',
              schema:  { "id": "334344344", "createdDate": "2023-06-14", "completedDate": "2023-06-16", "title": "3434344", "email": "cul@liamg.com" }
              
      } */

    /* #swagger.responses[403] = {
            description: 'Forbidden',
            
    } */
    /* #swagger.responses[404] = {
            description: 'task not found',
            
    } */
    /* #swagger.responses[415] = {
            description: 'task in not supported media type',
            
    } */
    /* #swagger.responses[406] = {
            description: 'task not in correct format',
            
    } */
    const userTasks = tasks.filter((task) => task.email === req.session.email)
    const taskID = req.params.id
    const newTask = req.body
    const taskIndex = userTasks.findIndex((task) => task.id === taskID)

    if (!req.is("json")) {
        res.sendStatus(415)

    } else if (!newTask.title || !newTask.createdDate) {
        res.status(406).send("your task does not match criteria")
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
                "id": id,
                "email": req.session.email
            }
            tasks.splice(tasks.findIndex((task) => task.id === taskID), 1, newTaskUpdated)
        } else {
            const newTaskUpdated = {
                ...newTask,
                "id": id,
                "email": req.session.email
            }
            tasks.splice(tasks.findIndex((task) => task.id === taskID), 1, newTaskUpdated)
        }

        res.status(201).json(tasks[taskIndex])
    }
})

app.delete('/tasks/:id', verify, (req, res) => {
    /* #swagger.parameters['id'] = {
    in: 'path',
    description: 'ID of the task that the user wants to delete',
    required: true,
    type: 'string'
} */

    /* #swagger.responses[204] = {
              description: 'deleted task.'
              
      } */

    /* #swagger.responses[403] = {
            description: 'Forbidden',
            
    } */
    /* #swagger.responses[404] = {
            description: 'task not found',
            
    } */
   
    
    const userTasks = tasks.filter((task) => task.email === req.session.email)
    const taskID = req.params.id
    const taskIndex = userTasks.findIndex((task) => task.id === taskID)
    if (taskIndex === -1) {
        res.sendStatus(404)
    }
    else {
        tasks.splice(tasks.findIndex((task) => task.id === taskID), 1)
        res.sendStatus(204)
    }

})



//Das mit dem stern von https://stackoverflow.com/questions/52552150/how-to-deal-when-calling-a-wrong-endpoint-using-app-get


app.all('/*', (req, res) => {
    res.sendStatus(404)
})

app.listen(3000, () => console.log("server started"));


