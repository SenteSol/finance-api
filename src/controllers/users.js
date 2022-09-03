import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/Users';
import shortid from 'shortid';

class UserController {
    static async getUsers(req, res) {
        const users = await User.find().sort({ createdAt: -1 });
        if (users.length === 0) {
            return res.status(200).json({
                message: 'There are no users in the database',
            });
        }
        res.json(users);
    }

    static async addUser(req, res) {
        const { firstName, lastName, email, password, confirmPassword } =
            req.body;
        const keys = process.env;

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: 'Password and Confirm Password should be equal',
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ email: 'Email already exists' });
        }
        const userId = shortid.generate();
        const newUser = new User({
            userId,
            firstName,
            lastName,
            email,
            password,
        });
        bcrypt.genSalt(8, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                    .save()
                    .then((user) => {
                        const payload = {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                        };
                        jwt.sign(
                            payload,
                            keys.JWT_SECRET,
                            { expiresIn: 3600 },
                            (err, token) => {
                                res.status(201).json({
                                    user,
                                    success: true,
                                    token: 'Bearer ' + token,
                                    message:
                                        'You have successfully registered a user',
                                });
                            }
                        );
                    })
                    .catch((err) => console.log(err));
            });
        });
    }

    static async loginUser(req, res) {
        const keys = process.env;
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        bcrypt.compare(password, user.password).then((isMatch) => {
            if (isMatch) {
                // User Matched

                const payload = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                }; // Create JWT Payload

                // Sign Token
                jwt.sign(
                    payload,
                    keys.JWT_SECRET,
                    { expiresIn: '7d' },
                    (err, token) => {
                        res.status(201).json({
                            success: true,
                            token: 'Bearer ' + token,
                        });
                    }
                );
            } else {
                return res.status(400).json({ error: 'Incorrect Password' });
            }
        });
    }
}

export default UserController;
