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

    static addUser(req, res) {
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
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
        });
        newUser
            .save()
            .then(user => res.status(201).json(user))
            .catch(err => {
                console.log('Could not add a  user', err);
            });
    }
}

export default UserController;
