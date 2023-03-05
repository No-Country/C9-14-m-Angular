const nodemailer = require('nodemailer')
const {EMAIL_HOST,EMAIL_USER,EMAIL_PASSWORD} = require('../config/config.js')

const sendEmail = async(subject,message,receiver,sender) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASSWORD
        }
    });


    const options = {
        from: sender,
        to: receiver,
        subject: subject,
        html: message
    }

    transporter.sendMail(options, function (err,info){
        if (err) {
            console.log(err)
        } else {
            console.log(info)
        }
    })
}


module.exports = {sendEmail}



