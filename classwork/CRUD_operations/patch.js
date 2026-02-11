const express = require('express');
const app = express();
app.use(express.json());

let items = [
    { id: 1, name: 'rajit', description: 'This is rajit.' },
    { id: 2, name: 'Sanskar', description: 'This is sanskar' },
    { id: 3, name: 'Ayushman', description: 'This is Ayushman' }
];

app.patch('/items/:id', (req, res) => {
    const itemId = parseInt(req.params.id);
    const item = items.find(i => i.id === itemId);

    if (!item) {
        return res.status(404).json({ message: 'student not found' });
    }

    const { name, description } = req.body;

    if (name) {
        item.name = name;
    }
    if (description) {
        item.description = description;
    }

    res.json({ message: 'Student updated successfully', item });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

