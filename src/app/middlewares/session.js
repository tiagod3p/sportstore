function userNotLogged(req, res, next) {
    if (!req.session.userId){
        return res.redirect('/users/login')
    }

    next()
}

function userLogged(req, res, next) {
    if (req.session.userId){
        return res.redirect('/users/dashboard')
    }

    next()
}

module.exports = {
    userNotLogged,
    userLogged
}