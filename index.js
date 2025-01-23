const express = require('express');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(bodyParser.json());

// Serve index.html explicitly when the root URL is accessed
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kunalsuryawanshi2008@gmail.com',  // Your Gmail address
        pass: 'ozqe tvye pgst txri'      // Use your app password here
    }
});

// POST route to schedule email
app.post("/schedule-email", (req, res) => {
    const { email, message, scheduleTime } = req.body;

    // Convert the scheduleTime to a Date object
    const scheduleDate = new Date(scheduleTime);

    // Cron expression to match the exact schedule time
    const cronExpression = `${scheduleDate.getSeconds()} ${scheduleDate.getMinutes()} ${scheduleDate.getHours()} ${scheduleDate.getDate()} ${scheduleDate.getMonth() + 1} *`;

    // Schedule email using cron
    cron.schedule(cronExpression, () => {
        sendEmail(email, message);
    });

    res.json({ status: "success", message: "Email scheduled successfully!" });
});

// Function to send email
function sendEmail(recipientEmail, messageContent) {
    const mailOptions = {
        from: 'kunalsuryawanshi2008@gmail.com',
        to: 'adityasuryawanshi470@gmail.com',
        subject: 'Scheduled Email',
        text: messageContent
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email: ", error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
