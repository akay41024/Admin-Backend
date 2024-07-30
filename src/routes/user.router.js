import { Router } from "express";
import Item from '../models/items.model.js'


const router = Router();

// View items
router.get('/items', async (req, res) => {
    const items = await Item.find();
    res.send(items);
});

// View item details
router.get('/items/:id', async (req, res) => {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).send('Item not found.');
    res.send(item);
});

// Add comment
router.post('/items/:id/comments', async (req, res) => {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).send('Item not found.');
    item.comments.push(req.body.comment);
    await item.save();
    res.send(item);
});

// Add rating
router.post('/items/:id/rating', async (req, res) => {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).send('Item not found.');
    item.rating = req.body.rating;
    await item.save();
    res.send(item);
});


export default router;