const db = require('../../data/dbConfig');

function fetchUsers() {
    return db('users')
}

function fetchUser(id) {
    return db('users').where('id', id).first()
}

function register(credentials) {

    return db('users').insert(credentials)
        .then(id => {
            return fetchUser(id)
        })
        .catch(err => console.log(err))

}

module.exports = {
    register,
    fetchUsers
}