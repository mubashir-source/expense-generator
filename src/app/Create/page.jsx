"use client";
import React, { useState, useEffect } from "react";
import { DatePicker, Input, Card, CardHeader, CardBody, CardFooter, Divider } from "@nextui-org/react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExpenseChart from '../utils/ExpenseChart'; // Import the chart component

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(null);
  const [monthlyTotals, setMonthlyTotals] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:3124/expenses")
      .then((response) => {
        setExpenses(response.data);
        processExpenses(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
        toast.error("Error fetching expenses.");
      });
  }, []);

  const processExpenses = (expenses) => {
    const monthlyTotals = {};

    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const month = `${date.getFullYear()}-${date.getMonth() + 1}`;

      if (!monthlyTotals[month]) {
        monthlyTotals[month] = 0;
      }

      monthlyTotals[month] += expense.amount;
    });

    setMonthlyTotals(monthlyTotals);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
  
    if (!expenseName || !expenseAmount || !expenseDate) {
      toast.error("Please fill in all fields.");
      return;
    }
    const dateToSend = expenseDate instanceof Date ? expenseDate.toISOString() : new Date(expenseDate).toISOString();
  
    axios
      .post("http://localhost:3124/create-expense", {
        description: expenseName,
        amount: expenseAmount,
        date: dateToSend,
      })
      .then((response) => {
        setExpenses([...expenses, response.data]);
        processExpenses([...expenses, response.data]); // Update monthly totals
        setExpenseName("");
        setExpenseAmount("");
        setExpenseDate(null);
        toast.success("Expense added successfully!");
      })
      .catch((error) => {
        console.error("There was an error adding the expense!", error);
        toast.error("Error adding expense.");
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3124/expenses/${id}`)
      .then(() => {
        const updatedExpenses = expenses.filter(expense => expense._id !== id);
        setExpenses(updatedExpenses);
        processExpenses(updatedExpenses); // Update monthly totals
        toast.success("Expense deleted successfully!");
      })
      .catch((error) => {
        console.error("There was an error deleting the expense!", error);
        toast.error("Error deleting expense.");
      });
  };

  return (
    <>
      <div className="mt-5">
        <h1 className="text-center text-5xl font-bold">Expense Generator</h1>
      </div>
      <div className="px-4 mx-auto max-w-2xl py-10">
        <form onSubmit={handleFormSubmit}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="sm:col-span-2">
              <Input
                type="text"
                label="Expense Name"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                type="number"
                label="Expense Amount"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
              />
            </div>
            <div className="sm:col-span-2">
              <DatePicker
                label="Date"
                value={expenseDate}
                onChange={(date) => setExpenseDate(date)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
          >
            Add Expense
          </button>
        </form>
      </div>
      <div className="py-10">
        <h1 className="text-center text-3xl font-bold">EXPENSE LISTS</h1>
      </div>
      <div className="container mx-auto grid grid-cols-3 gap-4">
        {expenses.length > 0 ? (
          expenses.map((expense) => (
            <div key={expense._id}>
              <Card>
                <CardHeader className="flex gap-3">
                  <div className="flex flex-col">
                    <p className="text-2xl">{new Date(expense.date).toLocaleDateString()}</p> {/* Display date */}
                    <p className="text-lg">${expense.amount}</p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <p>{expense.description}</p>
                </CardBody>
                <Divider />
                <CardFooter>
                  <button
                    onClick={() => handleDelete(expense._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                  <a href={`/Edit/${expense._id}`} className="text-blue-500 hover:text-blue-700 mx-2">Edit</a>
                </CardFooter>
              </Card>
            </div>
          ))
        ) : (
          <p className="text-center">No expenses available</p>
        )}
      </div>
      <div className="container mx-auto py-5 w-full h-[1000px]">
  <ExpenseChart monthlyTotals={monthlyTotals} />
</div>
      <ToastContainer />
    </>
  );
}
