import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database';
import { config } from '../config/env';

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  birthDate?: Date;
  city?: string;
  state?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  async register(data: RegisterData) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phone: data.phone,
        birthDate: data.birthDate,
        city: data.city,
        state: data.state,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return { user, token };
  }

  async login(data: LoginData) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Return user without password
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        phone: true,
        birthDate: true,
        bio: true,
        city: true,
        state: true,
        latitude: true,
        longitude: true,
        preferredSports: true,
        preferredPositions: true,
        level: true,
        xp: true,
        rating: true,
        totalRatings: true,
        isAvailable: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, data: Partial<RegisterData> & {
    bio?: string;
    latitude?: number;
    longitude?: number;
    preferredSports?: string[];
    preferredPositions?: string[];
    isAvailable?: boolean;
  }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        preferredSports: data.preferredSports as any,
        preferredPositions: data.preferredPositions as any,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        phone: true,
        birthDate: true,
        bio: true,
        city: true,
        state: true,
        latitude: true,
        longitude: true,
        preferredSports: true,
        preferredPositions: true,
        level: true,
        rating: true,
        isAvailable: true,
        role: true,
      },
    });

    return user;
  }
}

export default new AuthService();
