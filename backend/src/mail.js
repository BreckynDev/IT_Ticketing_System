import nodemailer from 'nodemailer'
import dotenv from "dotenv"
dotenv.config()

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASSWORD
  }
})

export const sendTicketEmail = async (ticketData) => {
    return await transporter.sendMail({
        from: '"IT Support Desk" <' + process.env.EMAIL_USER + '>',
        to: process.env.EMAIL_WORK,
        replyTo: ticketData.email,
        subject: `New Ticket | ${ticketData.name}`,
        html: getTicketEmailTemplate(ticketData)
    })
}

export const getTicketEmailTemplate = (data) => {
    return `
        <div style="font-family: sans-serif; color: #333;">
            <h2>New Ticket</h2>
            <p><strong>From:</strong> ${data.name}</p>
            <p><strong>Email:</strong> (${data.email}</p>
            <p><strong>Room:</strong> ${data.room}</p>
            <p><strong>Category:</strong> ${data.category}</p>
            <p><strong>Description:</strong> ${data.description}</p>
        </div>
    `
}

export { transporter };
