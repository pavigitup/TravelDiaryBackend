const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authMiddleware = require('./middleware/auth'); 
const User = require('./models/User');
const DiaryEntry = require('./models/DiaryEntry'); 
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const initializeDB = require('./db');

const app = express();

initializeDB(app); 

app.use(express.json());


const options = {
  definition: {
    openapi: '3.1.0',
    info: {
      title: "Travel Diary",
      version: '1.0.0'
    },
    servers: [
      { url: 'http://localhost:3004' } 
    ]
  },
  apis: ['./index.js'] 
};


const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); 



/**
 * @swagger
 * /:
 *  get: 
 *      summary: This api is used to check if get method is working or not
 *      description: This api is used to check if get method is working or not
 *      responses: 
 *            200:
 *                description: "Successful response"
 *                content:
 *                  text/plain:
 *                    schema:
 *                      type: string
 *                      example: "Hello World!"
 */


app.get("/", (req, res) => {
    res.send("Hello World!");
  });

/**
 * @swagger
 * /register:
 *   post:
 *     summary: "Register a new user"
 *     description: "Endpoint to register a new user."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       201:
 *         description: "User registered successfully"
 *       400:
 *         description: "Bad request - Username and password are required"
 *       409:
 *         description: "Username already exists"
 *       500:
 *         description: "Internal server error"
 */
app.post("/register", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).send("username and password are required");
      }
      const existingUserByUsername = await User.findOne({ username: username });
      console.log(existingUserByUsername);
      if (existingUserByUsername) {
        return res.status(409).send("User already exists");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        username: username,
        password: hashedPassword
      });
      console.log(newUser);
      await newUser.save();
      res.status(201).send("User registered successfully");
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).send("Internal server error");
    }
  });
  
  

/**
 * @swagger
 * /login:
 *   post:
 *     summary: "User login"
 *     description: "This endpoint is used for user authentication and login."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: "Successful login"
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MTUyMjE3YzQ5ODQ4ZjExOWFkNjdkOSIsIm5hbWUiOiJEaXZ5YSIsImlhdCI6MTY0NzAxNjE4M30.m4C3o2fXtFwd4y2qATsoVb3pFzBc-uw27bPZoxJVhHw"
 *       400:
 *         description: "Bad request - Username and password are required"
 *       401:
 *         description: "Invalid password"
 *       404:
 *         description: "User not found"
 *       500:
 *         description: "Internal server error"
 */


app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        const token = jwt.sign({ username: user.username }, 'your_secret_key_here');
        return res.json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     DiaryEntry:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the diary entry.
 *         description:
 *           type: string
 *           description: The description of the diary entry.
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date of the diary entry.
 *         location:
 *           type: string
 *           description: The location of the diary entry.
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *           description: Optional photos as an array of URLs.
 */

/**
 * @swagger
 * /diary-entries:
 *   get:
 *     summary: "Get all diary entries"
 *     description: "Endpoint to retrieve all diary entries."
 *     security:
 *       - bearerAuth: []   # Use this if authentication is required
 *     responses:
 *       200:
 *         description: "Successful operation"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DiaryEntry'
 *       401:
 *         description: "Unauthorized - JWT token missing or invalid"
 *       500:
 *         description: "Internal server error"
 */




app.get('/diary-entries', authMiddleware, async (req, res) => {
    try {
        const entries = await DiaryEntry.find();
        res.json(entries);
    } catch (error) {
        console.error('Error fetching diary entries:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



/**
 * @swagger
 * /diary-entries:
 *   post:
 *     summary: "Create a new diary entry"
 *     description: "Endpoint to create a new diary entry."
 *     security:
 *       - bearerAuth: []   # Use this if authentication is required
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               location:
 *                 type: string
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: "Diary entry created successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiaryEntry'
 *       500:
 *         description: "Internal server error"
 */

app.post('/diary-entries',authMiddleware, async (req, res) => {
    try {
        const { title, description, date, location, photos } = req.body;
        const newEntry = new DiaryEntry({ title, description, date, location, photos });
        await newEntry.save();
        res.status(201).json(newEntry);
    } catch (error) {
        console.error('Error creating diary entry:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


/**
 * @swagger
 * /diary-entries/{id}:
 *   get:
 *     summary: "Get a diary entry by ID"
 *     description: "Endpoint to retrieve a diary entry by its ID."
 *     security:
 *       - bearerAuth: []  
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the diary entry to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: "Successful operation"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiaryEntry'
 *       404:
 *         description: "Diary entry not found"
 *       500:
 *         description: "Internal server error"
 */

app.get('/diary-entries/:id',authMiddleware, async (req, res) => {
    try {
        const entry = await DiaryEntry.findById(req.params.id);
        if (!entry) {
            return res.status(404).json({ message: 'Diary entry not found' });
        }
        res.json(entry);
    } catch (error) {
        console.error('Error fetching diary entry by ID:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


/**
 * @swagger
 * /diary-entries/{id}:
 *   put:
 *     summary: "Update a diary entry by ID"
 *     description: "Endpoint to update a diary entry by its ID."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the diary entry to update.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               location:
 *                 type: string
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: "Diary entry updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiaryEntry'
 *       404:
 *         description: "Diary entry not found"
 *       500:
 *         description: "Internal server error"
 */

app.put('/diary-entries/:id', async (req, res) => {
    try {
        const { title, description, date, location, photos } = req.body;
        const updatedEntry = await DiaryEntry.findByIdAndUpdate(req.params.id, 
            { title, description, date, location, photos }, 
            { new: true });
        if (!updatedEntry) {
            return res.status(404).json({ message: 'Diary entry not found' });
        }
        res.json(updatedEntry);
    } catch (error) {
        console.error('Error updating diary entry:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



/**
 * @swagger
 * /diary-entries/{id}:
 *   delete:
 *     summary: "Delete a diary entry by ID"
 *     description: "Endpoint to delete a diary entry by its ID."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the diary entry to delete.
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: "Diary entry deleted successfully"
 *       404:
 *         description: "Diary entry not found"
 *       500:
 *         description: "Internal server error"
 */


app.delete('/diary-entries/:id', async (req, res) => {
    try {
        const deletedEntry = await DiaryEntry.findByIdAndDelete(req.params.id);
        if (!deletedEntry) {
            return res.status(404).json({ message: 'Diary entry not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting diary entry:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = app;
