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
        subject: `New Ticket #${ticketData.id} | ${ticketData.name}`,
        text: getTicketEmailText(ticketData)
    })
}

export const getTicketEmailText = (data) => {
    return [
        `New Ticket #${data.id}`,
        '',
        `From: ${data.name}`,
        `Email: ${data.email}`,
        `Room: ${data.room}`,
        `Category: ${data.category}`,
        '',
        'Description:',
        data.description
    ].join('\n')
}

export { transporter };
