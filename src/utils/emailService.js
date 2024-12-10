import nodemailer from 'nodemailer';

const sendOtpEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        secure: true,
        auth: {
            user: process.env.MAILER_ADDRESS,
            pass: process.env.MAILER_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.MAILER_ADDRESS,
        to: email,
        subject: 'Your OTP for Registration',
        html: `
            <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .email-container {
                            width: 100%;
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            border-radius: 8px;
                            border: 1px solid #ddd;
                            box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            background-color: #2e2e2e;
                            color: #ffffff;
                            padding: 20px;
                            border-top-left-radius: 8px;
                            border-top-right-radius: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 1rem;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .otp {
                            font-size: 24px;
                            font-weight: bold;
                            color: #2e2e2e;
                            margin: 10px 0;
                        }
                        .footer {
                            background-color: #f9f9f9;
                            color: #888888;
                            padding: 15px;
                            text-align: center;
                            font-size: 12px;
                            border-bottom-left-radius: 8px;
                            border-bottom-right-radius: 8px;
                        }
                        .button {
                            display: inline-block;
                            padding: 10px 20px;
                            background-color: #ff347b;
                            color: #ffffff;
                            text-decoration: none;
                            border-radius: 5px;
                            font-size: 16px;
                            margin-top: 20px;
                        }
                        .button:hover {
                            background-color: #e3306b;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="header">
                            <img src="https://static.wixstatic.com/media/b94792_fbd993b4dd984fd8aca3c7ddbd07b15c~mv2.png/v1/fill/w_205,h_49,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Original%20on%20Transparent.png" alt="XOffices Logo" height="20px" />
                            <h1>Welcome to XOffices</h1>
                        </div>
                        <div class="content">
                            <p>Thank you for signing up at XOffices, the premier coworking space in Jaipur, Rajasthan, India.</p>
                            <p>Your OTP for registration is:</p>
                            <div class="otp">${otp}</div>
                            <p>Please enter this OTP to complete your registration process.</p>
                            <a href="#" class="button">Verify OTP</a>
                        </div>
                        <div class="footer">
                            <p>If you did not request this, please ignore this email.</p>
                            <p>&copy; ${new Date().getFullYear()} XOffices | All Rights Reserved</p>
                        </div>
                    </div>
                </body>
            </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.log('Error sending email:', err);
        throw new Error('Failed to send OTP email');
    }
};

export default sendOtpEmail;