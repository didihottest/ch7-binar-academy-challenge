// use morgan to log activity
const logger = (req, res, next) => {
    console.log(
        `${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`
    )
    next();
}
//export logger module
module.exports = logger;