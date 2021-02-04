const http=require('http')
const app=require('./app.js')


const port=3000


server=http.createServer(app)



server.listen(port);