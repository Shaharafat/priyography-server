/*
 *
 * Title: email messages to be sent
 * Description: different email message template
 * Author: Shah Arafat
 * Date: 09-04-2021
 *
 */

export const generatePasswordResetMessage = (name, resetToken) => `
  <body>
    <h2>Reset Password</h2>
    <br/>
    <p>Hello ${name},</p>
    <p>We have noticed that, recently you applied to reset your noteit account password. <a href='http://localhost:3000/resetpassword/${resetToken}'>Click here</a> to go to the next step of password reseting process.</p>

    <p>Thank You. Have a nice day.</p>
  </body>
  `;
