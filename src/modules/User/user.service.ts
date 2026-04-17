import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';
import config from '../../config';
import { PrismaClient, UserStatus } from '../../../generated/prisma/client';
const getAllUsers = async (query: Record<string, unknown>) => {
  const searchTerm = query.searchTerm as string;
  let whereConditions = {};

  if (searchTerm) {
    whereConditions = {
      OR: ['name', 'email'].map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    };
  }

  const result = await prisma.user.findMany({
    where: whereConditions,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      subscription: true,
      planExpiresAt: true,
      createdAt: true,
    },
  });

  return result;
};

const getSingleUser = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      subscription: true, // ✅ এটি ফ্রন্টএন্ডের 'undefined' সমস্যা দূর করবে
      planExpiresAt: true, // ✅ এটিও যোগ করে দিন
      createdAt: true,
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  return result;
};

const updateUser = async (id: string, payload: Partial<any>) => {
  // ১. ইউজার আছে কিনা চেক করা (এটা ঠিক আছে)
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // ২. সেনসিটিভ ডাটা ফিল্টার করা
  // পাসওয়ার্ডের পাশাপাশি ইমেইল এবং রোল আপডেট করা এখানে ব্লক করা উচিত
  if (payload.password) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Password updates require a dedicated route');
  }

  // ৩. প্রটেক্টেড ফিল্ডস (ইউজার নিজে নিজে যেন এডমিন না হতে পারে)
  // যদি এই ফাংশনটি সাধারণ ইউজার তার প্রোফাইল এডিট করার জন্য ব্যবহার করে, তবে রোল/ইমেইল বাদ দিন
  const { role, email, ...updateData } = payload;

  const result = await prisma.user.update({
    where: { id },
    data: updateData, // শুধু নিরাপদ ডাটা আপডেট হবে (যেমন: name, avatar)
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      subscription: true,
      planExpiresAt: true,
      createdAt: true,
    },
  });

  return result;
};

const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await prisma.user.delete({
    where: { id },
  });

  return result;
};



const updateStatusIntoDB = async (id: string, payload: { status: UserStatus }) => {
  // প্রথমে চেক করে নিন ইউজার আছে কি না
  const isUserExist = await prisma.user.findUnique({
    where: { id },
  });

  if (!isUserExist) {
    throw new Error("User not found!");
  }

  // স্ট্যাটাস আপডেট করা
  const result = await prisma.user.update({
    where: { id },
    data: {
      status: payload.status,
    },
    select: { // ✅ আপডেট হওয়ার পর ফ্রন্টএন্ডকে ফ্রেশ ডাটা দিন
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
    }
  });

  return result;
};



export const UserService = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  updateStatusIntoDB
};