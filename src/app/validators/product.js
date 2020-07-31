function post(req, res, next) {
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (key == "removedImage") {
            continue
        }
        if (!req.body[key]) return res.send("Please fill in all fields!")
    }

    if (!req.files || req.files.length == 0 ) 
        return res.send("Please, send at least 1 image!")

    next()
}

function update(req, res, next) {
    const keys = Object.keys(req.body)

    for (key of keys) {
        if (req.body[key] == "" && key!="removedImage")
             return res.send("Please, fill in all fields!")
    }

    next()
}

module.exports = {
    post,
    update
}