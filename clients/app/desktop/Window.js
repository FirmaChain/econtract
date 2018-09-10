import {app, BrowserWindow} from 'electron'

let default_config = {
    width: 800, height: 600
}
export default class Window{
    constructor(config = {}){
        this.config = {
            ...default_config,
            ...config
        }
        this.win = new BrowserWindow()
        this.win.loadURL(this.config.url)
        
        if(this.config.isMain){
            this.win.on('closed', function () {
                app.quit()
            })
        }
    }
}