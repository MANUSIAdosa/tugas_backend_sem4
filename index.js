import express from 'express';
import { prisma } from './lib/prisma';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Setup multer untuk file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/avatars';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Hanya file gambar yang diperbolehkan (jpeg, jpg, png, gif, webp)'));
        }
    }
});

app.get('/api/users', async(req, res) => {
    try {
        const showAllUser = await prisma.users.findMany()
        res.status(200).json({ success: true, message: "User berhasil ditampilkan semua", data: showAllUser });
    } catch (err) {
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
    }
})

app.post('/api/register', async(req, res) => {
    try {
        const { email, username, password } = req.body;

        // Validasi input
        if (!email || !username || !password) {
            return res.status(400).json({ success: false, message: "Email, username, dan password wajib diisi" });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password minimal 6 karakter" });
        }

        // Cek duplikasi email atau username
        const existingUser = await prisma.users.findFirst({
            where: { OR: [{ email }, { username }] }
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ success: false, message: "Email sudah digunakan" });
            }
            if (existingUser.username === username) {
                return res.status(400).json({ success: false, message: "Username sudah digunakan" });
            }
        }

        const joinDate = new Date().toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });

        const createUser = await prisma.users.create({
            data: {
                email,
                username,
                password,
                joinDate,
                createdAt: new Date()
            }
        });
        res.json({ success: true, message: "User berhasil dibuat", data: createUser });
    } catch (err) {
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
    }
})

// Upload avatar endpoint
app.post('/api/upload-avatar', upload.single('avatar'), async(req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID diperlukan" });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "File gambar diperlukan" });
        }

        // Simpan path avatar ke database
        const avatarPath = `/uploads/avatars/${req.file.filename}`;

        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: { avatar: avatarPath }
        });

        res.json({
            success: true,
            message: "Avatar berhasil diupload",
            data: { avatar: avatarPath }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Gagal upload avatar: " + err.message });
    }
});

// Update profile endpoint
app.put('/api/profile/:userId', async(req, res) => {
    try {
        const { userId } = req.params;
        const { username, email, password, birthday, gender } = req.body;

        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (password) updateData.password = password;
        if (birthday !== undefined) updateData.birthday = birthday;
        if (gender !== undefined) updateData.gender = gender;

        const updatedUser = await prisma.users.update({
            where: { id: userId },
            data: updateData
        });

        res.json({
            success: true,
            message: "Profile berhasil diupdate",
            data: updatedUser
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Gagal update profile: " + err.message });
    }
});

app.post('/api/login', async(req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Username/Email dan Password wajib diisi" });
        }
        // Cari user berdasarkan email atau username
        const user = await prisma.users.findFirst({
            where: { OR: [ { email: username }, { username: username }]}
        });

        if (!user) {
            return res.status(401).json({ success: false, message: "Username/Email tidak ditemukan" });
        }
        if (user.password !== password) {
            return res.status(401).json({ success: false, message: "Password salah" });
        }

        res.json({ success: true, message: "Login berhasil", data: {
                id: user.id,
                email: user.email,
                username: user.username,
                avatar: user.avatar || "/asset/profile.png",
                level: user.level || 1,
                joinDate: user.joinDate || new Date().toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }),
                birthday: user.birthday || "-",
                gender: user.gender || "-"
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
    }
})

app.delete('/api/deleteUser/:userId', async(req, res) => {
    try {
        const { userId } = req.params;

        const deletedUser = await prisma.users.delete({
            where: { id: userId }
        });

        res.json({ success: true, message: "User berhasil dihapus", data: deletedUser });
    } catch (err) {
        res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
    }
})

app.listen(3000, () => {
    console.log("server berhasil dijalankan http://localhost:3000")
})