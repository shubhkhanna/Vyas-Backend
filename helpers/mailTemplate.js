const mailTemplate = (code, email) => {
  return {
    to: email,
    from: { email: process.env.ADMIN_MAIL, name: "Vyas" },
    subject: "Verify your Email",
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">              
    </head>
    <body>
        <div>
            <div>
                <h3>Thanks for signing up for Vyas!</h3>               
                <p>We're happy you're here. Let's get your email address verified:</p>
                <div>
                    <small>Copy this one-time password: </small>
                    <strong>${code}</strong>                  
                </div>
            </div>
        </div>
    </body>
</html>`,
  };
};

module.exports = { mailTemplate };
