import { Request, Response } from 'express';
import mongoose from 'mongoose';
import * as userService from './user.service';

const allowedRoles = ['admin', 'studio', 'customer'];

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      message: 'Get user list successfully',
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getUserDetail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid user id' });
      return;
    }

    const user = await userService.getUserById(id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      message: 'Get user detail successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { fullName, email, password, phone, role, isActive } = req.body;

    if (!fullName || !email || !password) {
      res.status(400).json({
        message: 'fullName, email, password are required',
      });
      return;
    }

    if (role && !allowedRoles.includes(role)) {
      res.status(400).json({
        message: 'role must be admin, studio, or customer',
      });
      return;
    }

    const user = await userService.createUser({
      fullName,
      email,
      password,
      phone,
      role,
      isActive,
    });

    res.status(201).json({
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : 'Create user failed',
    });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { role } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid user id' });
      return;
    }

    if (role && !allowedRoles.includes(role)) {
      res.status(400).json({
        message: 'role must be admin, studio, or customer',
      });
      return;
    }

    const updatedUser = await userService.updateUser(id, req.body);

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      message: error instanceof Error ? error.message : 'Update user failed',
    });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid user id' });
      return;
    }

    const deletedUser = await userService.deleteUser(id);

    if (!deletedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      message: 'User deleted successfully',
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Delete user failed',
      error: error instanceof Error ? error.message : error,
    });
  }
};
export const suspendUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid user id' });
      return;
    }

    const user = await userService.suspendUser(id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      message: 'User suspended successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Suspend user failed',
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const activateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid user id' });
      return;
    }

    const user = await userService.activateUser(id);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json({
      message: 'User activated successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Activate user failed',
      error: error instanceof Error ? error.message : error,
    });
  }
};