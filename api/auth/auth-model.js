const db = require('../../data/dbConfig');

function fetchUsers() {
    return db('users')
}

function fetchUserById(id) {
    return db('users').where('id', id).first()
}

function fetchUserByUsername(username) {
    return db('users').where('username', username).first()
}

function register(credentials) {

    return db('users').insert(credentials)
        .then(id => {
            return fetchUserById(id)
        })
        .catch(err => console.log(err))

}

module.exports = {
    register,
    fetchUsers,
    fetchUserByUsername
}