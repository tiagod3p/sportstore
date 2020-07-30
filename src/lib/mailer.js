const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "1f128224f34249",
      pass: "5dc26dd8dc47a2"
    }
  })