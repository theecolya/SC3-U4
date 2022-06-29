const Auth = require('./auth-model'
)
const checkCredentials = (req, res, next) => {
    const credentials = req.body
    if(typeof credentials.username != 'string' ||
       typeof credentials.password != 'string') {
        return res.status(400).json('username and password required')
       } else {
        next()
       }
}

const checkUsername = (req, res, next) => {
    const credentials = req.body
    Auth.fetchUsers().then((users) => {
        let resArr = users.map(item => item.username)
        if(resArr.includes(credentials.username)) {
            return res.status(400).json('username taken')}
        else {
            next()
        }})
}

module.exports = {
    checkCredentials,
    checkUsername
}