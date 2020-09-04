const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNWViYzY1YjE0NzAyNTIwNzg2NWM4MDdkIiwicm9sZSI6Im93bmVyIiwiY2hhbm5lbCI6IjVlYmM2NWIxNDcwMjUyMzUzZDVjODA3ZSIsInByb3ZpZGVyIjoidHdpdGNoIiwiYXV0aFRva2VuIjoiRm9IZUg2Um45M0VpWER6eE5XaUN4RVlDU0ZySWxWOGdUV0c0eEhRVlNtckVTMHZRIiwiaWF0IjoxNTk5MTY0NzUyLCJpc3MiOiJTdHJlYW1FbGVtZW50cyJ9.rDUc6dkYLTrYK8soHQJA4PQjiBENXAI02TMNVcazv94'
const seurl ='https://realtime.streamelements.com'
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