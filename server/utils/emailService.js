// utils/emailServiceSMTP.js
import nodemailer from 'nodemailer';

// Hardcoded values for testing - replace with your actual app password
const smtpConfig = {
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'someshmuduli720@gmail.com',
    pass: 'lczukzdkuoolprib' // Your actual app password without spaces
  },
};

console.log('🔧 SMTP Configuration:');
console.log('   Host:', smtpConfig.host);
console.log('   Port:', smtpConfig.port);
console.log('   User:', smtpConfig.auth.user);

const transporter = nodemailer.createTransport(smtpConfig);

// Verify transporter configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log('❌ SMTP Configuration Error:', error.message);
  } else {
    console.log('✅ SMTP Server is ready to send emails');
  }
});

export const sendPasswordResetEmail = async (email, resetToken, userType) => {
  const resetLink = `http://localhost:5173/reset-password?token=${resetToken}&role=${userType}`;
  
  const userTypeDisplay = {
    doctor: 'Doctor',
    patient: 'Patient',
  }[userType] || 'User';

  const mailOptions = {
    from: `"MediCare System" <someshmuduli720@gmail.com>`,
    to: email,
    subject: `Password Reset Request - ${userTypeDisplay} Account`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #007bff; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
          <h2>Password Reset Request</h2>
        </div>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px;">
          <p>Hello,</p>
          <p>You requested to reset your password for your <strong>${userTypeDisplay} Account</strong>.</p>
          <p>Click the button below to reset your password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #007bff; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 5px; display: inline-block;
                      font-size: 16px; font-weight: bold;">
              Reset Your Password
            </a>
          </div>
          
          <p><strong>⚠️ This link will expire in 15 minutes.</strong></p>
          
          
          
          <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 5px;">
            <p style="margin: 0; color: #856404;">
              <strong>Security Note:</strong> If you didn't request this reset, please ignore this email. 
              Your account security is not compromised.
            </p>
          </div>
        </div>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; text-align: center;">
          <p>This is an automated message. Please do not reply to this email.</p>
          <p>&copy; ${new Date().getFullYear()} MediCare System. All rights reserved.</p>
        </div>
      </div>
    `
  };

  try {
    console.log(`\n📨 SENDING RESET EMAIL:`);
    console.log(`   From: someshmuduli720@gmail.com`);
    console.log(`   To: ${email}`);
    console.log(`   User Type: ${userType}`);
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email sent successfully!');
    console.log(`📧 Message ID: ${info.messageId}`);
    
    return {
      success: true,
      messageId: info.messageId
    };
    
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('🔐 Authentication failed - check your Gmail app password');
      console.error('💡 Make sure:');
      console.error('   1. 2FA is enabled on your Gmail');
      console.error('   2. You generated an App Password (not your regular password)');
      console.error('   3. The app password is correct (16 characters, no spaces)');
    } else if (error.code === 'ECONNECTION') {
      console.error('🌐 Connection failed - check your internet connection');
    }
    
    return {
      success: false,
      error: error.message
    };
  }
};