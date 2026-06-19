import {
  Body,
  Controller,
  Get,
  Headers,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import mongoose, { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET || 'dev_secret';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const itemSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

const User: any = mongoose.models.User || model('User', userSchema);
const CatalogItem: any =
  mongoose.models.CatalogItem || model('CatalogItem', itemSchema);

function getUserIdFromAuthHeader(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, jwtSecret) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

@Controller()
export class AppController {
  constructor() {
    if (mongoose.connection.readyState === 0) {
      mongoose
        .connect(process.env.MONGODB_URI || '')
        .then(() => console.log('[ MongoDB ] connected'))
        .catch((error) =>
          console.error('[ MongoDB ] connection failed:', error.message)
        );
    }
  }

  @Get()
  getRoot() {
    return { message: 'Procurement Portal API is running' };
  }

  @Post('auth/signup')
  async signup(@Body() body: any, @Res() res: Response) {
    try {
      const { name, email, password } = body;

      if (!name || !email || !password) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: 'Name, email, and password are required',
        });
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(HttpStatus.CONFLICT).json({
          success: false,
          error: 'Email already exists',
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        passwordHash,
      });

      const token = jwt.sign({ userId: user._id }, jwtSecret, {
        expiresIn: '8h',
      });

      return res.status(HttpStatus.CREATED).json({
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error instanceof Error ? error.message : 'Server error',
      });
    }
  }

  @Post('auth/signin')
  async signin(@Body() body: any, @Res() res: Response) {
    try {
      const { email, password } = body;

      if (!email || !password) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: 'Email and password are required',
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          error: 'Invalid email or password',
        });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.passwordHash
      );

      if (!isPasswordValid) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          error: 'Invalid email or password',
        });
      }

      const token = jwt.sign({ userId: user._id }, jwtSecret, {
        expiresIn: '8h',
      });

      return res.json({
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        },
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error instanceof Error ? error.message : 'Server error',
      });
    }
  }

  @Get('items')
  async getItems(
    @Headers('authorization') authHeader: string | undefined,
    @Query('search') search = '',
    @Res() res: Response
  ) {
    try {
      const userId = getUserIdFromAuthHeader(authHeader);

      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const query: any = search
        ? {
            $or: [
              { title: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
              { category: { $regex: search, $options: 'i' } },
            ],
          }
        : {};

      const items = await CatalogItem.find(query).sort({ createdAt: -1 });

      return res.json({ success: true, data: items });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error instanceof Error ? error.message : 'Server error',
      });
    }
  }

  @Post('items')
  async createItem(
    @Headers('authorization') authHeader: string | undefined,
    @Body() body: any,
    @Res() res: Response
  ) {
    try {
      const userId = getUserIdFromAuthHeader(authHeader);

      if (!userId) {
        return res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          error: 'Unauthorized',
        });
      }

      const { title, description, category, price } = body;

      if (!title || !description || !category || price === undefined) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          error: 'All item fields are required',
        });
      }

      const item = await CatalogItem.create({
        title,
        description,
        category,
        price,
        createdBy: userId,
      });

      return res.status(HttpStatus.CREATED).json({
        success: true,
        data: item,
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        error: error instanceof Error ? error.message : 'Server error',
      });
    }
  }
}