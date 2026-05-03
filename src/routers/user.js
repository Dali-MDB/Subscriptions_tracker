import { Router } from 'express';
import User from '../models/user.model.js';
import { getAllUsers, getUser, editUser, deleteUser } from '../controllers/user.controllers.js';
import isAuthenticated from '../middlewares/auth.middlewares.js';

const user_router = Router();

user_router.get('/',getAllUsers);

user_router.get('/:id',getUser);

user_router.put('/:id',isAuthenticated,editUser);

user_router.delete('/:id',isAuthenticated,deleteUser);



export default user_router;