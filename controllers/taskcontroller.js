const Task = require('../models/task'); // Import the model

exports.getTasks = async (req, res) => {
    try {
        const filter = { owner: req.user.id };

        // --- 2. SORTING (The "Order" Logic) ---
        // Default: Sort by newest first (Descending order of creation)
        // URL Example: /tasks?sort=oldest
        let sortOption = { createdAt: -1 }; 

        if (req.query.sort === 'oldest') {
            sortOption = { createdAt: 1 }; // Ascending
        } else if (req.query.sort === 'title') {
            sortOption = { title: 1 }; // A-Z
        }

        // --- 3. PAGINATION (The "Slice" Logic) ---
        // URL Example: /tasks?page=2&limit=5
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // QUERY 1: Fetch the actual data
        const tasks = await Task.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        // QUERY 2: Count the total documents (The new part)
        // .countDocuments() is fast and tells us the total matching the filter
        const total = await Task.countDocuments(filter);

        res.json({
            results: tasks.length, // Items on THIS page
            total: total,          // Items in TOTAL (e.g., 50)
            totalPages: Math.ceil(total / limit), // e.g., 50/10 = 5 Pages
            currentPage: page,
            data: tasks
        });

    } catch (err) {
        res.status(500).send(err.message);
    }
};

// 2. Create Task
exports.createTask = async (req, res) => {
    try {
        const { title } = req.body;
        
        // Validation
        if (!title || typeof title !== 'string' || title.trim().length === 0) {
            return res.status(400).send("Title is required and must be a non-empty string");
        }
        
        if (title.length > 200) {
            return res.status(400).send("Title must be less than 200 characters");
        }

        const newTask = await Task.create({
            title: title.trim(),
            owner: req.user.id
        });
        res.json(newTask);
    } catch (err) { res.status(500).send(err.message); }
};

// 3. Update Task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).send("Not Found");

        if (task.owner.toString() !== req.user.id) return res.status(403).send("Not Allowed");

        const { title, isComplete } = req.body;
        
        // Validation for title if provided
        if (title !== undefined) {
            if (typeof title !== 'string' || title.trim().length === 0) {
                return res.status(400).send("Title must be a non-empty string");
            }
            if (title.length > 200) {
                return res.status(400).send("Title must be less than 200 characters");
            }
            task.title = title.trim();
        }
        
        // Validation for isComplete if provided
        if (isComplete !== undefined) {
            if (typeof isComplete !== 'boolean') {
                return res.status(400).send("isComplete must be a boolean");
            }
            task.isComplete = isComplete;
        }

        await task.save();
        res.json(task);
    } catch (err) { res.status(500).send(err.message); }
};

// 4. Delete Task
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).send("Not Found");

        if (task.owner.toString() !== req.user.id) return res.status(403).send("Not Allowed");

        await task.deleteOne();
        res.send("Deleted");
    } catch (err) { res.status(500).send(err.message); }
};