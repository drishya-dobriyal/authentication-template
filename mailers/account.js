const nodeMailer = require("../config/nodemailer");
require("dotenv").config();

// this is another way of exporting a method
module.exports.new_account_confirmation = (user) => {
  let htmlString = nodeMailer.renderTemplate(
    { user: user },
    "/account_create_confirmation.ejs"
  );
  nodeMailer.transporter.sendMail(
    {
      from: process.env.EMAIL_ADDRESS,
      to: user.email,
      subject: "Account Created!",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("Error in sending mail", err);
        return;
      }
      console.log("Message sent", info);
      return;
    }
  );
};

module.exports.send_new_password = (user) => {
  let htmlString = nodeMailer.renderTemplate(
    { user: user },
    "/send_new_password.ejs"
  );
  nodeMailer.transporter.sendMail(
    {
      from: process.env.EMAIL_ADDRESS,
      to: user.email,
      subject: "New password!",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("Error in sending mail", err);
        return;
      }
      console.log("Message sent", info);
      return;
    }
  );
};
