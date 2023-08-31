import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail, sendVerificationEmail } from '../helpers/EmailService';

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       description: User registration details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       500:
 *         description: An error occurred
 */
router.post('/register', async (req, res) => {
  const { firstName, lastName, username, email, password,phone,address,sex,role } = req.body;
  try {
    const verificationToken = uuidv4();
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      username:username,
      email:email,
      password:password,
      phone:phone,
      address:address,
      sex:sex,
      role:role,
      verified: false,
      verificationToken:verificationToken,
    });
    await user.save();
    // sendVerificationEmail(user);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get('/verify-email/:token', async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ error: 'Invalid verification token' });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in user
 *     requestBody:
 *       description: User login details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: An error occurred
 */
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email:email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.verificationToken = uuidv4();
    await user.save();

    res.status(200).json({ message: 'New verification email sent' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!user.verified) {
      return res.status(401).json({ error: 'Email not verified' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });
    const userResponse = {
      _id: user._id,
      email: user.email,
      phone: user.phone,
      address: user.address,
      sex: user.sex,
      role: user.role,
      verified: user.verified,
      token:token
    };
    res.json({ userResponse });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export default router;
