const express = require("express")
const app = express()
app.use(express.json())
//do content type header

const tasks = [
    { "id": "2020323", "createdDate": "2023-06-15", "completedDate": null, "title": "23423" },
    { "id": "334344344", "createdDate": "2023-06-14", "completedDate": "2023-06-16", "title": "3434344" },
    { "id" : "23020302323", "createdDate": "2023-06-12", "completedDate": null, "title": "Task 3" },
    { "createdDate": "2023-06-10", "completedDate": "2023-06-13", "title": "34345454" }
];

app.get('/tasks', (req, res) => {
    res.status(200).json(tasks)
})

app.post('/tasks', (req, res) => {
    const newTask = req.body
    if(!req.is("json")){
        res.sendStatus(415)
    }
    else if (!newTask.title || !newTask.createdDate){
        res.send("no")
    }
    else{
        const id = Math.floor(Math.random() * 10000000 + 1).toString();
        if(!newTask.completedDate){
            
            const newTaskUpdated = {
                ...newTask,
                "completedDate": null,
                "id": id
            }
            tasks.push(newTaskUpdated)
        } else{
            const newTaskUpdated = {
                ...newTask,
                "id": id
            }
            tasks.push(newTaskUpdated)
        }
        
        res.status(201).json(tasks[tasks.length - 1])
        //Das mit length von https://www.freecodecamp.org/news/how-to-get-the-last-item-in-an-array-in-javascript/ kopiert
    }
} )

app.get('/tasks/:id', (req, res) => {
    const taskID = req.params.id;
    const task = tasks.find((task) => task.id === taskID)
    if (task === -1) {
        res.sendStatus(404)
    } else {
        res.status(200).send(tasks[task])
    }
})

app.put('/tasks', (req, res) => {
    
})











app.listen(3000, () => console.log("server started"));