"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
interface Loan {
  _id: string;
  amount: number;
  term: number;
  user: string;
  scheduledRepayments: {
    _id: string;
    date: Date;
    amount: number;
    status: string;
  }[];
  status: string;
  // Add other loan details here
}

export const metadata: Metadata = {
  title: "Pay your Loan",
  description: "This is the page to payout your loan.",
  // other metadata
};
const token = Cookies.get("user_token");

const PayLoan = () => {
  const [loan, setLoan] = useState<Loan | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number | "">("");
  //   const router = useRouter();
  const searchParams = useSearchParams();

  const router = useRouter();
  const loanId = searchParams.get("loanId");
  const fetchLoanDetails = async () => {
    try {
      const response = await fetch(`/api/loans/getLoanDetails/${loanId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // You can include other headers as needed
        },
      }); // Replace with your API endpoint
      if (response.ok) {
        const data = await response.json();
        setLoan(data);
      } else {
        console.error("Error fetching loan details:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching loan details:", error);
    }
  };
  useEffect(() => {
    // if (!token) router.push("/login");
    // Fetch the loan details by loanId from the backend when the component mounts
    if (loanId) {
      fetchLoanDetails();
    }
  }, [loanId, token]);

  if (!loan) {
    return <div>Loading...</div>;
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the payment amount
    if (!paymentAmount || isNaN(paymentAmount) || paymentAmount <= 0) {
      // Handle invalid payment amount (e.g., show an error message)
      return;
    }

    try {
      // Send a POST request to your backend to process the repayment
      const response = await fetch(`/api/loans/processRepayment/${loanId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amountPaid: paymentAmount }),
      });

      if (response.ok) {
        // Repayment processed successfully
        // You can update the loan details if needed
        // Reload or update the loan data
        fetchLoanDetails();
        if (response.status === 200)
          router.push(`/manage-loans/loan-details?loanId=${loanId}`);
        // Reset the payment amount input
        setPaymentAmount("");
      } else {
        // Handle errors (e.g., show an error message)
        console.error("Error processing repayment:", response.statusText);
      }
    } catch (error) {
      console.error("Error processing repayment:", error);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Pay Your Loan EMI" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* <!-- Contact Form --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Process the Payment
              </h3>
            </div>
            <form onSubmit={handlePaymentSubmit}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Payment Amount (in Rupees)
                    <span className="text-meta-1">*</span>
                  </label>
                  <input
                    type="number"
                    id="paymentAmount"
                    value={paymentAmount}
                    placeholder={`Minimum Rs.${loan.amount / loan.term}`}
                    onChange={(e) => setPaymentAmount(e.target.valueAsNumber)}
                    required
                    min={loan.amount / loan.term}
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
                  Process Repayment
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayLoan;
