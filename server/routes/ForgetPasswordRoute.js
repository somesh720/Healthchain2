// routes/ForgetPasswordRoute.js
import express from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import { sendPasswordResetEmail } from  "../utils/emailService.js";


const router = express.Router();

// FORGOT PASSWORD - Step 1: Request reset link
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, role } = req.body;
    
    console.log('\n=== FORGOT PASSWORD REQUEST ===');
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Requested Role: ${role}`);
    console.log(`⏰ Time: ${new Date().toISOString()}`);

    // Validate email
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: 'Email address is required' 
      });
    }

    let user = null;
    let userType = '';

    // Check based on requested role
    if (role === 'patient') {
      user = await Patient.findOne({ email: email.toLowerCase() });
      if (user) {
        userType = 'patient';
        console.log(`✅ Found patient: ${user.email}`);
      }
    } else if (role === 'doctor') {
      user = await Doctor.findOne({ email: email.toLowerCase() });
      if (user) {
        userType = 'doctor';
        console.log(`✅ Found doctor: ${user.email}`);
      }
    } else {
      // If no role specified, search both
      user = await Patient.findOne({ email: email.toLowerCase() });
      if (user) {
        userType = 'patient';
        console.log(`✅ Found patient: ${user.email}`);
      } else {
        user = await Doctor.findOne({ email: email.toLowerCase() });
        if (user) {
          userType = 'doctor';
          console.log(`✅ Found doctor: ${user.email}`);
        }
      }
    }

    // For security, always return same message regardless of email existence
    const successResponse = {
      success: true,
      message: 'If this email is registered, you will receive a password reset link shortly.'
    };

    if (!user) {
      console.log('⚠️ Email not found in any user collection');
      return res.json(successResponse);
    }

    console.log(`👤 User found: ${user.fullName || user.name} (${userType})`);

    // Generate secure reset token and expiration
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    console.log(`🔄 Generated reset token: ${resetToken.substring(0, 20)}...`);
    console.log(`⏰ Token expires: ${resetTokenExpires}`);

    // Save reset token to the appropriate user document
    if (userType === 'patient') {
      await Patient.findByIdAndUpdate(user._id, {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpires
      });
    } else {
      await Doctor.findByIdAndUpdate(user._id, {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpires
      });
    }

    console.log(`💾 Reset token saved to ${userType} collection`);

    // Send reset email
    console.log(`📨 Attempting to send email to: ${email}`);
    const emailResult = await sendPasswordResetEmail(email, resetToken, userType);

    if (emailResult.success) {
      console.log('✅ Password reset process completed successfully!');
      console.log('=========================================\n');
    } else {
      console.log('⚠️ Email sending failed, but process completed');
      console.log('=========================================\n');
    }

    // Always return success for security
    return res.json(successResponse);

  } catch (error) {
    console.error('❌ Forgot password error:', error);
    console.log('=========================================\n');
    
    // Even on error, return generic message for security
    return res.json({
      success: true,
      message: 'If this email is registered, you will receive a password reset link shortly.'
    });
  }
});

// VERIFY RESET TOKEN - Step 2: Check if token is valid
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const currentTime = new Date();

    console.log(`\n=== VERIFYING RESET TOKEN ===`);
    console.log(`🔐 Token: ${token.substring(0, 20)}...`);

    // Check Patient collection
    let user = await Patient.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: currentTime }
    });

    let userType = 'patient';

    if (!user) {
      // Check Doctor collection
      user = await Doctor.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: currentTime }
      });
      userType = 'doctor';
    }

    if (user) {
      console.log(`✅ Token valid for ${userType}: ${user.email}`);
      console.log(`👤 User: ${user.fullName || user.name}`);
      
      return res.json({ 
        success: true,
        valid: true,
        role: userType,
        email: user.email,
        name: user.fullName || user.name,
        message: 'Reset token is valid'
      });
    }

    console.log('❌ Invalid or expired token');
    return res.status(400).json({ 
      success: false,
      message: 'This reset link is invalid or has expired. Please request a new password reset.' 
    });

  } catch (error) {
    console.error('❌ Verify token error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

// RESET PASSWORD - Step 3: Update password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, role, newPassword } = req.body;

    console.log('\n=== RESET PASSWORD REQUEST ===');
    console.log(`🔐 Token: ${token ? token.substring(0, 20) + '...' : 'missing'}`);
    console.log(`👤 Role: ${role}`);

    if (!token || !newPassword) {
      return res.status(400).json({ 
        success: false,
        message: 'Reset token and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters long' 
      });
    }

    const currentTime = new Date();
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    let user = null;
    let userType = '';

    // Find user based on role
    if (role === 'patient') {
      user = await Patient.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: currentTime }
      });
      userType = 'patient';
    } else if (role === 'doctor') {
      user = await Doctor.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: currentTime }
      });
      userType = 'doctor';
    } else {
      // If no role, search both
      user = await Patient.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: currentTime }
      });
      if (user) {
        userType = 'patient';
      } else {
        user = await Doctor.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: currentTime }
        });
        userType = 'doctor';
      }
    }

    if (!user) {
      console.log('❌ No valid token found for password reset');
      return res.status(400).json({ 
        success: false,
        message: 'This reset link is invalid or has expired. Please request a new password reset.' 
      });
    }

    console.log(`✅ Found ${userType} for password reset: ${user.email}`);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    console.log('✅ Password reset successfully!');
    console.log('=========================================\n');
    
    return res.json({ 
      success: true,
      message: 'Password reset successfully! You can now login with your new password.'
    });

  } catch (error) {
    console.error('❌ Reset password error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
});

export default router;