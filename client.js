const jwt = ''
const io = require('socket.io-client')
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
});

const socket = io(seurl, {
    transports: ['websocket']
});
socket.on('connect',async()=>{
    console.log(`[info]:connected`)
    onConnect()
    for await (const line of rl) {
        // Each line in input.txt will be successively available here as `line`.
        socket.send(line)
      }
})
socket.on('event:test', (data) => {
    console.log(data);
        // Structure as on JSON Schema
});
socket.on('event',(data)=>onMessage(data))
function onMessage(data){
    console.log(data)
}
socket.on('message',test=>console.log(test))
function onConnect() {
    socket.emit('authenticate', {
        method: 'jwt',
        token: jwt
    });
}
