const express = require('express')
const Shell = require('node-powershell');
const { v4: uuidv4 } = require('uuid');
const ws = require('ws');
const https =require('https');
const fs = require('fs');
const { NodeSSH } = require('node-ssh');
const app = express()
const server = app.listen(9898,()=>{console.log('[SERVER]: Server is now online');})
const wss = new ws.Server({server})
httpsServer = https.createServer({  key: fs.readFileSync('key.pem'),cert: fs.readFileSync('cert.pem')})
const secsecsec = new ws.Server({server:httpsServer})
httpsServer.listen(8000,()=>{console.log(`[HTTPS]:Started`);})

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
            var run = this.arr.pop()
            if(!run(message)){
                
            }
        }else{
            this.next = this.endfunc
            this.next(message)
        }
        

    }
}

function onConnect(soc,serverid,socmode){
    soc.buff =''
    soc.sshClient = new NodeSSH()
    var id= uuidv4()
    soc.id= id
    if(socmode ==1 ){
        soc.asend =(message)=>{
            soc.buff = `${soc.buff}${message}`
            soc.send(soc.buff)
        }
    }else{
        soc.asend= (message)=>{
        soc.send(message)
        }
    

    };
    soc.runner = new Runner([
        (message)=>{
            soc.sshPassword = message
            if(soc.sshHost && soc.sshUser){
                opts = {}
                opts.host = soc.sshHost
                opts.username = soc.sshUser
                if(soc.sshPassword){
                    opts.sshPassword = soc.sshPassword
                    soc.asend(`${soc.sshPassword.replace(/./g, "*")}\n`)
                }else(soc.asend(`\n`))

                opts.privateKey ='c:/users/admin/.ssh/id_rsa'
               
                soc.sshClient.connect(opts).then(
                    ()=>{soc.asend(`you are connected`)}
                )
            }
        },
        (message)=>{
            soc.sshUser = message
            soc.asend(`${message}\nEnter the password:`)
        },
        (message)=>{
            soc.sshHost = message
            soc.asend(message)
            soc.asend(`\nEnter the username:`)
        }
        
    ],(message='')=>{
        if(/^exit.*/m.test(message.toLowerCase())){
            soc.sshClient.execCommand(`exit`)
            send('\n exiting')
            soc.terminate()
        }
        soc.sshClient.execCommand(message).then(
        (result)=>{
            console.log(result)
            soc.asend((result.stderr)?result.stderr:''+result.stdout)
        }
        )
            
        },soc)
    


    console.log(`[SERVER ${serverid}]: New Connection id:${id} `+((soc.protocol)?`Protocal:${soc.protocol.toString()}`:``));
    soc.on('message',(message)=>{soc.runner.next(message)})
    soc.asend(`Enter ssh host name:`)
    
}