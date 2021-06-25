import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/Users';

class UserController {
    static getUsers(req, res) {
        User.find()
            .sort({ createdAt: -1 })
            .then(users => {
                if (users.length === 0) {
                    return res.status(200).json({
                        message: 'There are no users in the database',
                    });
                }
                res.json(users);
            })
            .catch(err => {
                console.log('Could not retrieve users', err);
            });
    }

    static async addUser(req, res) {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
        } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: 'Password and Confirm Password should be equal',
            });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ email: 'Email already exists' });
        }
        const newUser = new User({
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
                    .then(user =>
                        res.status(201).json({
                            user,
                            message: 'You have successfully registered a user',
                        })
                    )
                    .catch(err => console.log(err));
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

        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // User Matched

                const payload = {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                }; // Create JWT Payload

                // Sign Token
                jwt.sign(
                    payload,
                    keys.JWT_SECRET,
                    { expiresIn: 3600 },
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
