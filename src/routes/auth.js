import express from 'express';
import { validateRegister, validateLogin, validateChangePassword } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * @openapi
 * /api/register:
 *   post:
 *     summary: Register new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, username, password]
 *             properties:
 *               email: { type: string, format: email }
 *               username: { type: string }
 *               password: { type: string, minLength: 6 }
 *     responses:
 *       200: { description: User created with JWT token }
 *       400: { description: Validation error }
 */
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const newUser = await req.userService.register(email, username, password);
    res.json({ success: true, message: "User berhasil dibuat", data: newUser });
  } catch (err) {
    req.userService.errorResponse(res, err.message);
  }
});

/**
 * @openapi
 * /api/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful with JWT token }
 *       401: { description: Invalid credentials }
 */
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { username, password } = req.body;
    const userData = await req.userService.login(username, password);
    res.json({ success: true, message: "Login berhasil", data: userData });
  } catch (err) {
    req.userService.errorResponse(res, err.message, 401);
  }
});

/**
 * @openapi
 * /api/change-password:
 *   put:
 *     summary: Change password (authenticated)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldPassword, newPassword, confirmPassword]
 *             properties:
 *               oldPassword: { type: string }
 *               newPassword: { type: string, minLength: 6 }
 *               confirmPassword: { type: string }
 *     responses:
 *       200: { description: Password changed successfully }
 *       400: { description: Validation error / wrong old password }
 *       401: { description: Unauthorized }
 */
router.put('/change-password', authenticate, validateChangePassword, async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return req.userService.errorResponse(res, "Konfirmasi password tidak cocok");
    }

    await req.userService.changePassword(req.user.userId, oldPassword, newPassword);
    res.json({ success: true, message: "Password berhasil diubah" });
  } catch (err) {
    req.userService.errorResponse(res, err.message);
  }
});

export default router;