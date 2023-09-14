"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
const token = Cookies.get("user_token");

export const metadata: Metadata = {
  title: "Loan Request form",
  description: "Request a loan from the Admins",
  // other metadata
};

const RequestLoan = () => {
  const router = useRouter();

  // State to manage form input values
  const [loanAmount, setLoanAmount] = useState<number | "">("");
  const [term, setTerm] = useState<number | "">("");
  const [err, setErr] = useState("");
  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data (you can add more validation logic here)
    if (isNaN(Number(loanAmount)) || Number(loanAmount) <= 0) {
      alert("Please enter a valid loan amount.");
      return;
    }

    if (isNaN(Number(term)) || Number(term) <= 0) {
      alert("Please enter a valid loan term.");
      return;
    }

    // Create a request body object
    const requestBody = {
      loanAmount: Number(loanAmount), // Convert to a number
      term: Number(term), // Convert to a number
    };
    try {
      // Send the request to the server (e.g., via an API call)
      const response = await fetch(
        "/api/loans/createLoan/" + Cookies.get("userId"),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Handle successful response (e.g., show a success message)
        alert(`Loan application successful.`);
        // Reset form fields after submission
        router.push("/manage-loans/my-loans");
        setLoanAmount("");
        setTerm("");
      } else {
        setErr("Loan application failed. Please try again.");
        alert("Loan application failed. Please try again.");
      }
    } catch (error) {
      console.error("Loan application error:", error);
      setErr("Loan Application Failed! Please try again later");
      // Handle error (e.g., display an error message)
      alert("Loan application failed. Please try again later.");
    }
    // Reset form fields after submission
    setLoanAmount("");
    setTerm("");
  };

  return (
    <>
      <Breadcrumb pageName="Loan Request Form" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* <!-- Loan Request Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Request a Loan
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Loan Amount (in Rupees)
                    <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="number"
                    id="loanAmount"
                    name="loanAmount"
                    placeholder="Enter the loan amount"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Loan Term (in Weeks)
                    <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="number"
                    id="term"
                    name="term"
                    placeholder="Enter loan term"
                    value={term}
                    min={1}
                    onChange={(e) => setTerm(Number(e.target.value))}
                    required
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>
                <p className="text-meta-1">{err}</p>
                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
                  Ask for Approval
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestLoan;
