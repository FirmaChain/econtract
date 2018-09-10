import {app, BrowserWindow} from 'electron'
import path from 'path'
import url from 'url'
import Window from "./Window"
import {current_platform} from "../common/utils"
import {WEB_SERVER_PORT} from "./webserver"

console.log(current_platform())

function createWindow () {
  let win = new Window({
    isMain:true, 
    url:`http://localhost:${WEB_SERVER_PORT}`
  })
}

app.on('ready', createWindow)