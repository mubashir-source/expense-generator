const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection URI
const mongoURI = "mongodb+srv://muhammadmubashir:u22XOED5IRz3MlZ8@cluster0.93m22.mongodb.net/expensedb?retryWrites=true&w=majority&appName=Cluster0";

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB Atlas successfully");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Define schema and model
const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  date: Date,
});

const Expense = mongoose.model('Expense', expenseSchema);

// Route to create a new expense
app.post('/create-expense', async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).send(expense);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to get all expenses
app.get('/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).send(expenses);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to delete an expense by its ID
app.delete('/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByIdAndDelete(id);

    if (!expense) {
      return res.status(404).send({ message: 'Expense not found' });
    }

    res.status(200).send({ message: 'Expense deleted successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Route to update an expense by its ID
app.put('/expenses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Ensure required fields are present
    if (!updateData.description || !updateData.amount || !updateData.date) {
      return res.status(400).send({ message: 'Please provide all required fields' });
    }

    // Update expense
    const updatedExpense = await Expense.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedExpense) {
      return res.status(404).send({ message: 'Expense not found' });
    }

    res.status(200).send(updatedExpense);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Set the port, defaulting to 3000 if not specified in the environment
const PORT = 3124;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
