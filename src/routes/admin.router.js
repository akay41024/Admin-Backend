import jwt from 'jsonwebtoken';
import User from '../models/user.model.js'
import Item from '../models/items.model.js'
import { Router } from 'express';

const router = Router();
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access denied. No token provided.');

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) return res.status(401).send('Invalid token.');
        req.user = decoded;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) return res.status(403).send('Access denied.');
    next();
};

// Admin login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !await user.comparePassword(password)) {
        return res.status(400).send('Invalid username or password.');
    }
    const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, process.env.SECRET, { expiresIn: '1h' });
    res.send({ token });
});

// CRUD operations for items
router.post('/items', [authenticate, isAdmin], async (req, res) => {
    const item = new Item(req.body);
    await item.save();
    res.send(item);
});

router.get('/items', [authenticate, isAdmin], async (req, res) => {
    const items = await Item.find();
    res.send(items);
});

router.get('/items/:id', [authenticate, isAdmin], async (req, res) => {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).send('Item not found.');
    res.send(item);
});

router.put('/items/:id', [authenticate, isAdmin], async (req, res) => {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).send('Item not found.');
    res.send(item);
});

router.delete('/items/:id', [authenticate, isAdmin], async (req, res) => {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).send('Item not found.');
    res.send(item);
});

// Dashboard
router.get('/dashboard', [authenticate, isAdmin], async (req, res) => {
    const itemCount = await Item.countDocuments();
    res.send({ itemCount });
});

export default router;