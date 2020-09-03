const express = require('express')
const ws = require('ws')
const Shell = require('node-powershell');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config()

const bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = 3000
const { spawn } = require("child_process");
app.get('/test',async(req,res)=>{
    res.send('OK')
})
app.post('/post-test', (req, res) => {
    console.log('Got body:', req.body);
    res.sendStatus(200);
});
app.post('/send-command', async(req,res)=>{
    var out = {}
    args= req.body.command.split(' ') 
    const command = spawn(args.shift(), args);
    await command.on('exit',()=>{
        out.stdin = command.stdin
        out.stdout = command.stdout
        out.stderr = command.stderr
        res.send(out)
    })
    
})
app.get('/stop',()=>(process.exit()))
app.listen(port,()=>{})
const server = app.listen(9898,()=>{console.log('[SERVER]: Server is now online');})
const wss = new ws.Server({server})
wss.on('connection',(soc)=> {
    var buff= ""
    const ps = new Shell({
        executionPolicy: 'Bypass',
    });
    const id = uuidv4()
    const shortid = id.split('-')[0]
    var code =0
    ps.on('output',data=>{
        buff = `${buff}${data}`
        soc.send(buff)
    })
    /* ps.on('output', data => {
        lines= data.split(/\r?\n/)
        for(var line in lines){
            if(lines[line] !== ''){
                out= lines[line].trim()
            soc.send(out)
            }
        }
    }); */
    console.log(`[SERVER]: New Connection id:${id}`);
    buff =`[Connected]:you are id ${id} please enter the password \n`
    soc.send(buff)
    soc.on('message',(message)=>{
        if(code){
        console.log(`<${shortid}>: ${message}`);
        if(/^exit.*/m.test(message.toLowerCase())){
            ps.addCommand('exit')
            ps.invoke().catch(e=>{console.log(`[error ${shortid}]:${e}`);})
            buff =`${buff}\\n exiting`
            soc.send(buff)
            soc.terminate()
        }
        if(/^clear.*/m.test(message.toLowerCase())){
            buff=''
            soc.send(buff)
            return
        }
        ps.addCommand(message)
        buff = `${buff}\n${message}\n`
        ps.invoke().catch(e=>{
        buff=`${buff}\n${e}`
        soc.send(buff)
        })
    }else if(message===process.env.Passwd){
        code=1;
        buff=`${buff}[Auth]you are now live :) \n`;
        soc.send(buff);
        console.log(`[Connection]:${id} is now live`)
    }else{
        soc.terminate();console.log(`[AUTH]:${id} failed`)
    }
        

        
    })
})