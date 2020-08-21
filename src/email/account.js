const nodemailer=require('Nodemailer')
const sendwelcomemail=(email,name)=>{
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "abner.roob@ethereal.email", // generated ethereal user
          pass: "h2HBqztMuMRgkqQcv7", // generated ethereal password
        },
      });
      let info = transporter.sendMail({
          from: 'abner.roob@ethereal.email', // sender address
          to: email, // list of receivers
          subject: "welcome ✔", // Subject line
          name:name,
          text: "account created?", // plain text body
          html: "<b>Hello world?</b>", // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...}
      
      
}
const sendcancelmail=(email,name)=>{
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "abner.roob@ethereal.email", // generated ethereal user
          pass: "h2HBqztMuMRgkqQcv7", // generated ethereal password
        },
      });
      let info = transporter.sendMail({
          from: 'abner.roob@ethereal.email', // sender address
          to: email, // list of receivers
          name: name,
          subject: "cancel✔", // Subject line
          text:"account removed", // plain text body
          html: "<b>Hello world?</b>", // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...}
      
      

}
module.exports={
    sendwelcomemail,sendcancelmail
}