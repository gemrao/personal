const http = require('http')
const { WebSocketServer } = require('ws')
const uuidv4 = require('uuid').v4
const url = require('url')
const server = http.createServer()
const wsServer = new WebSocketServer({ server })

const port = 8000

const connections = {}
const users = {}

const broadcast = () => {
    Object.keys(connections).forEach(uuid => {
        const connextion = connections[uuid]
        const message = JSON.stringify(users)
        connextion.send(message)
    })
}

const handleClose = (uuid) => {
    console.log(`${users[uuid].username} disconnected`)
    delete connections[uuid]
    delete users[uuid]
    broadcast()

}


const handleMessage = (bytes, uuid) => {
    const message = JSON.parse(bytes.toString())
    const user = users[uuid]
    user.state = message
    console.log(message)
    broadcast()
    console.log(`${users[uuid].username} updated their state ${JSON.stringify(user.state)}`)

}

wsServer.on("connection", (connection, request) => {

    const { username } = url.parse(request.url, true).query
    const uuid = uuidv4()
    console.log(username)
    console.log(uuid)
    connections[uuid] = connection
    users[uuid] = {
        username: username,
        state: {
            x: 0,
            y: 0
        }
    }

    connection.on("message", message => handleMessage(message, uuid))
    connection.on("close", message => handleClose(uuid))
})

server.listen(port, () => {
    console.log(`listening on ${port}`)
}) 