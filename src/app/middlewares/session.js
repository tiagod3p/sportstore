function userNotLogged(req, res, next) {
    if (!req.session.userId){
        return res.redirect('/user/login')
    }

    next()
}

function userLogged(req, res, next) {
    if (req.session.userId){
        return res.redirect('/user/dashboard')
    }

    next()
}

module.exports = {
    userNotLogged,
    userLogged
}