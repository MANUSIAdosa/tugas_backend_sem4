import BaseService from './BaseService.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { generateToken } from '../middleware/auth.js';

class UserService extends BaseService {

  async register(email, username, password) {
    if (!email || !username || !password) {
      throw new Error("Email, username, dan password wajib diisi");
    }
    if (password.length < 6) {
      throw new Error("Password minimal 6 karakter");
    }

    const existingUser = await this.prisma.users.findFirst({
      where: { OR: [{ email }, { username }] }
    });
    if (existingUser) {
      if (existingUser.email === email) throw new Error("Email sudah digunakan");
      if (existingUser.username === username) throw new Error("Username sudah digunakan");
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    const joinDate = new Date().toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });

    const newUser = await this.prisma.users.create({
      data: { email, username, password: hashedPassword, joinDate, createdAt: new Date() }
    });

    // Generate JWT token for the new user
    const token = generateToken(newUser);

    return {
      id: newUser.id,
      email: newUser.email,
      username: newUser.username,
      avatar: newUser.avatar ? `/api/avatar/${newUser.id}` : "/asset/profile.png",
      level: newUser.level || 1,
      joinDate: newUser.joinDate || joinDate,
      birthday: newUser.birthday || "-",
      gender: newUser.gender || "-",
      isAdmin: newUser.isAdmin || false,
      token
    };
  }

  async login(username, password) {
    if (!username || !password) {
      throw new Error("Username/Email dan Password wajib diisi");
    }

    const user = await this.prisma.users.findFirst({
      where: { OR: [{ email: username }, { username: username }] }
    });

    if (!user) throw new Error("Username/Email tidak ditemukan");

    // Compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Password salah");

    // Generate JWT token
    const token = generateToken(user);

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      avatar: user.avatar ? `/api/avatar/${user.id}` : "/asset/profile.png",
      level: user.level || 1,
      joinDate: user.joinDate || new Date().toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
      }),
      birthday: user.birthday || "-",
      gender: user.gender || "-",
      isAdmin: user.isAdmin || false,
      token
    };
  }

  async getAllUsers() {
    const users = await this.prisma.users.findMany({
      select: { id: true, email: true, username: true, joinDate: true, birthday: true, gender: true, createdAt: true, isAdmin: true }
    });
    return users.map(user => ({
      ...user,
      avatar: `/api/avatar/${user.id}`
    }));
  }

  async updateProfile(userId, { username, email, password, birthday, gender }) {
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) {
      // Hash new password before updating
      updateData.password = await bcrypt.hash(password, 10);
    }
    if (birthday !== undefined) updateData.birthday = birthday;
    if (gender !== undefined) updateData.gender = gender;

    const updatedUser = await this.prisma.users.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        username: true,
        joinDate: true,
        birthday: true,
        gender: true,
        avatar: true,
        createdAt: true,
        level: true,
        isAdmin: true
      }
    });

    return {
      ...updatedUser,
      avatar: updatedUser.avatar ? `/api/avatar/${updatedUser.id}` : "/asset/profile.png"
    };
  }

  async uploadAvatar(userId, buffer) {
    await this.prisma.users.update({
      where: { id: userId },
      data: { avatar: buffer }
    });
  }

  async getAvatar(userId) {
    return await this.prisma.users.findUnique({
      where: { id: userId },
      select: { avatar: true }
    });
  }

  async getPoints(userId) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
      select: { points: true }
    });
    if (!user) throw new Error("User tidak ditemukan");
    return user.points;
  }

  async requestPasswordReset(email) {
    if (!email) {
      throw new Error("Email wajib diisi");
    }

    const user = await this.prisma.users.findUnique({
      where: { email }
    });

    // Jangan kasih tahu attacker apakah email terdaftar atau tidak
    if (!user) {
      return { message: "Jika email terdaftar, link reset password akan dikirim" };
    }

    // Cegah spam — check apakah sudah ada token yang belum expired
    if (user.resetTokenExpiry && new Date(user.resetTokenExpiry) > new Date()) {
      const cooldown = Math.ceil(
        (new Date(user.resetTokenExpiry).getTime() - Date.now()) / 1000 / 60
      );
      throw new Error(
        `Tunggu ${cooldown} menit sebelum meminta reset password lagi`
      );
    }

    // Generate secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Token berlaku 15 menit
    const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

    // Simpan ke database
    await this.prisma.users.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry }
    });

    return { resetToken, email: user.email };
  }

  async confirmPasswordReset(token, newPassword) {
    if (!token || !newPassword) {
      throw new Error("Token dan password baru wajib diisi");
    }
    if (newPassword.length < 6) {
      throw new Error("Password minimal 6 karakter");
    }

    // Cari user dengan token ini
    const user = await this.prisma.users.findFirst({
      where: { resetToken: token }
    });

    if (!user) {
      throw new Error("Token reset password tidak valid");
    }

    // Cek expiry
    if (!user.resetTokenExpiry || new Date(user.resetTokenExpiry) < new Date()) {
      // Bersihkan token yang expired
      await this.prisma.users.update({
        where: { id: user.id },
        data: { resetToken: null, resetTokenExpiry: null }
      });
      throw new Error("Token reset password sudah kedaluwarsa. Silakan minta ulang.");
    }

    // Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password dan hapus token (single-use)
    await this.prisma.users.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    return { message: "Password berhasil direset" };
  }

  async deleteUser(userId) {
    // Cegah penghapusan demo_user
    const user = await this.prisma.users.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User tidak ditemukan");
    if (user.username === 'demo_user') throw new Error("Akun demo tidak dapat dihapus");

    // Hapus transaksi terkait terlebih dahulu
    await this.prisma.transactions.deleteMany({
      where: { userId: userId }
    });
    // Hapus contact messages terkait
    await this.prisma.contact_messages.deleteMany({
      where: { userId: userId }
    });
    // Hapus voucher redemptions terkait
    await this.prisma.voucher_redemptions.deleteMany({
      where: { userId: userId }
    });
    // Baru hapus user
    return await this.prisma.users.delete({ where: { id: userId } });
  }
}

export default UserService;