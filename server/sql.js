const MySQL = require("./mysql")
const uuid = require("uuid")
//let mysql = new MySQL("210.89.188.7","root","02881212","tototalk")
let mysql = new MySQL("54.250.2.129","root","ubuntu","tototalk");

module.exports = {
    async newUser(token){
        //let ret = await mysql.query(`INSERT INTO users(token,addedAt) VALUES(?,NOW())`,[_uuid])
        let ret = await mysql.query(`INSERT INTO users(token) VALUES(?)`,[token])

        if(ret.insertId){
            return token
        }
        return null
    },

    async findUser(userId){
        return await mysql.query(`SELECT * FROM users WHERE id=?`,[userId])
    },
    
    async tokenValidate(token){
        let rows = await mysql.query(`SELECT * FROM users WHERE token=?`,[token])
        return rows[0]
    },

    async getRooms(token){
        let rows = await mysql.query(`
            SELECT 
                c.*
            FROM users a
            INNER JOIN room_joiner b ON b.user_id = a.user_id
            INNER JOIN rooms c ON b.room_id = c.room_id
            WHERE 
                a.token=?
        `,[token])
        return rows;
    },
}