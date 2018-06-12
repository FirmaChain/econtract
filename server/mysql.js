const  mysql = require('mysql2/promise');

class MySQL{
    constructor(host,id,pass,database){
        mysql.createConnection({host:host, user:id, password:pass, database: database}).then((conn)=>{
            this.conn = conn
        })
    }

    async query(sql,args){
        const [rows, fields] = await this.conn.execute(sql, args);
        return rows
    }
}

module.exports = MySQL