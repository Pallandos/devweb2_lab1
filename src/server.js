const http = require('http')
const PORT = process.env.PORT || 5000

const todos = require('./data/todo')
const getRequestData = require('./utils')

//Create server - returns a server object
const server = http.createServer(async (request, response) => {
    if (request.url === '/api/todos' && request.method === 'GET') {
        response.writeHead(200, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify(todos))
    }
    else if (request.url === '/api/todos' && request.method === 'POST') {
        let req_body = await getRequestData(request)
        let todo = JSON.parse(req_body)
        todos.push(todo)
        response.writeHead(201, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify({ message: 'Todo added successfully', todo }))
    }
    else if (request.url.match(/\/api\/todos\/([0-9]+)/) && request.method === 'PUT') {
        const id = request.url.split('/')[3]
        const todo = todos.find(t => t.id === parseInt(id));
        if (!todo) {
            response.writeHead(404, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify({ message: 'Todo not found' }))
        }
        else {
            let req_body = await getRequestData(request)
            let updatedTodo = JSON.parse(req_body)
            const index = todos.indexOf(todo)
            todos[index] = { ...todo, ...updatedTodo }
            response.writeHead(200, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify({ message: 'Todo updated successfully', todo: todos[index] }))
        }
    }
    else if (request.url.match(/\/api\/todos\/([0-9]+)/) && request.method === 'DELETE') {
        const id = request.url.split('/')[3]
        const todo = todos.find(t => t.id === parseInt(id));
        if (!todo) {
            response.writeHead(404, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify({ message: 'Todo not found' }))
        }
        else {
            const index = todos.indexOf(todo)
            todos.splice(index, 1)
            response.writeHead(200, { 'Content-Type': 'application/json' })
            response.end(JSON.stringify({ message: 'Todo deleted successfully', todo }))
        }
    }

})

server.listen(PORT, () => {
    console.log('Server is ready and running on Port ', PORT)
})

//make the server listen for clients
//event emitter model
//server -> emits a listen event on the port
server.on('error', (error) => {
    if(error.code='EADRINUSE'){
        console.log('Port is already in use')
    }
})