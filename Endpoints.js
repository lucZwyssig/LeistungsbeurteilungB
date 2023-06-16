const express = require("express")
const app = express()
app.use(express.json())

const tasks =
    [
        { "createdDate": "2023-06-15", "completedDate": null, "title": "Task 1" },
        { "createdDate": "2023-06-14", "completedDate": "2023-06-16", "title": "Task 2" },
        { "createdDate": "2023-06-12", "completedDate": null, "title": "Task 3" },
        { "createdDate": "2023-06-10", "completedDate": "2023-06-13", "title": "Task 4" }
    ] //von chat.openai.com generiert



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
        if(!newTask.completedDate){
            const newTaskUpdated = {
                ...newTask,
                "completedDate": null
            }
            tasks.push(newTaskUpdated)
        } else{
            tasks.push(newTask)
        }
        
        res.status(201).json(tasks[tasks.length - 1])
        //Das mit length von https://www.freecodecamp.org/news/how-to-get-the-last-item-in-an-array-in-javascript/ kopiert
    }
} )











app.listen(3000, () => console.log("server started"));