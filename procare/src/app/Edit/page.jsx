"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
// import { useSearchParams } from "next/navigation";
import { DatePicker, Input } from "@nextui-org/react";
// import { useSearchParams } from "next/navigation";
import { useParams, useRouter} from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Edit() {
  const params = useParams()
  const {id }= params
  const router = useRouter()
  // const { id } = router.query; // Extract ID from URL
  console.log(id, "ID")
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dateToSend = expenseDate instanceof Date ? expenseDate.toISOString() : new Date(expenseDate).toISOString();
    const updatedExpense = {
      description: expenseName,
      amount: expenseAmount,
      date: dateToSend,
    };
    

    try {
      const response = await axios.put(`http://localhost:3124/expenses/${id}`, updatedExpense); // Replace {expenseId} with the actual ID
      console.log("Expense updated successfully:", response.data);
      router.push('/');
      toast.success("Expense edit successfully!");
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  return (
    <>
      <div className="mt-5">
        <h1 className="text-center text-5xl font-bold">Edit Expense</h1>
      </div>
      <div className="px-4 mx-auto max-w-2xl py-10">
        <form onSubmit={handleSubmit}>
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
            Edit Expense
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
