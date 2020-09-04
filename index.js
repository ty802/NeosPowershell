const express = require('express')
const Shell = require('node-powershell');
const { v4: uuidv4 } = require('uuid');
const ws = require('ws');
const https =require('https');
const fs = require('fs');
const { on, nextTick } = require('process');
const { debug } = require('console');
var isauth=0
require('dotenv').config()
const app = express()
const server = app.listen(9898,()=>{console.log('[SERVER]: Server is now online');})
const wss = new ws.Server({server})
httpsServer = https.createServer({  key: fs.readFileSync('key.pem'),cert: fs.readFileSync('cert.pem')})
const secsecsec = new ws.Server({server:httpsServer})
httpsServer.listen(8000,()=>{console.log(`[HTTPS]:Started`);})
const next =()=>{}
/* async function authFlow(soc){
    stat ={waiting:true,resalt:false}
    for(f=0;f<stupedobjectcuzjs.length;f++){
        soc.on('message',(message,stat)=>stupedobjectcuzjs[f])
        console.log(`[LOG]:waiting ${f}`)
    while(stat.waiting){
        await sleep(100)
        console.log(stat);
    }
    console.log(`[LOG]:${f} ${resalt}`);
    if(resalt=false)return;
    waiting=true
} 
return resalt
}*/
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }   
secsecsec.on('connection', soc=>{
    onConnect(soc,2,1)
})
wss.on('connection',(soc)=> {
       onConnect(soc,1,1)
    

})
class Runner {
    constructor(funcs = new Array(),endfunc =i=>{},socket)
    {
        this.socket = socket
        this.arr = funcs
        this.endfunc = endfunc
        
    }
    next(message){
        if (this.arr.length>0) {
            console.log(`[AUTH]:running condtion`)
            var run = this.arr.pop()
            if(!run(message)){
                this.socket.terminate()
            }
        }else{
            this.next = this.endfunc
            console.log(this.next);
            this.next(message)
        }
        

    }
}

function onConnect(soc,serverid,socmode){
    var isdebug=0
    soc.buff= ""
    soc.socmode =socmode
    const id = uuidv4()
    soc.id =id
    if(socmode ==1 ){
        soc.asend =(message)=>{
            if(isdebug)console.log(`[DEBUG]:${message}`);
            soc.buff = `${soc.buff}${message}`
            soc.send(soc.buff)
        }
    }else{
        soc.asend= (message)=>{
            if(isdebug)console.log(`[DEBUG]:${message}`);
        soc.send(message)
        }
    

    };
    soc.runner = new Runner([
        (message)=>{
            if(message==process.env.Passwd){
                soc.asend(`Welcome!`)
                return true
            }else{
                console.log(`oof`);
                return false
            }
        },
        (message)=>{
            
            if(message=='test'){
                soc.asend(`[Connected]:you are id ${soc.id}\n`)
                soc.asend(`Please enter the Password:`)
                return true
            }
            return false
        }
        
    ],(message='')=>{
            if(soc.buff.length>2000 && socmode==1){
                soc.buff =soc.buff.split(soc.buff.length-600,soc.buff.length)
            }
            console.log(`<${shortid}>: ${message}`);
            if(/^exit.*/m.test(message.toLowerCase())){
                ps.addCommand('exit')
                ps.invoke().catch(e=>{console.log(`[error ${shortid}]:${e}`);})
                send('\\n exiting')
                soc.terminate()
            }
            if(/^clear.*/m.test(message.toLowerCase())){
                if(socmode==1){
                soc.buff=''
                soc.send(soc.buff)
                }
                return
            }
            /* ps.addCommand(`pwsh {${message}}`) */
            ps.addCommand(message)
    /*         psargs = message.split(' ')
            console.log(psargs);
            pscmd = psargs.pop()
            if(psargs.length){
                ps.addCommand(pscmd,psargs)
            }else{
                ps.addCommand(pscmd)
            }
             */
            soc.asend(`\n${message}\n   `)
            ps.invoke().catch(e=>{
                soc.asend(`\n${e}`)
            })
        },soc)
    var send= (message)=>{}
    

    const ps = new Shell({
        executionPolicy: 'Bypass',
    })
    const shortid = id.split('-')[0]
    if(socmode==1){
    ps.on('output',data=>{
      soc.asend(data)
    })
    }else{
    ps.on('output', data => {
        lines= data.split(/\r?\n/)
        for(var line in lines){
            if(lines[line] !== ''){
                out= lines[line].trim()
            soc.send(out)
            }
        }
    })}

    console.log(`[SERVER ${serverid}]: New Connection id:${id} `+((soc.protocol)?`Protocal:${soc.protocol.toString()}`:``));
    soc.on('message',(message)=>{soc.runner.next(message)})
    soc.send(`ﳣﳣﳣ`)
    
}