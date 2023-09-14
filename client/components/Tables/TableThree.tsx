"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
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
const token = Cookies.get("user_token");

const TableThree = () => {
  const [loan, setLoan] = useState<Loan | null>(null);
  //   const router = useRouter();
  const searchParams = useSearchParams();

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

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <tbody>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Loan ID
              </th>
              <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                {loan._id}
              </td>
            </tr>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                Amount
              </th>
              <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                {loan.amount}
              </td>
            </tr>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Term
              </th>
              <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                {loan.term}
              </td>
            </tr>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                User
              </th>
              <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                {loan.user}
              </td>
            </tr>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                <p
                  className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                    loan.status === "PAID"
                      ? "text-success bg-success"
                      : loan.status === "REJECTED"
                      ? "text-danger bg-danger"
                      : loan.status === "PARTIALLY PAID"
                      ? "text-body bg-body"
                      : "text-warning bg-warning"
                  }`}
                >
                  {loan.status}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
        {loan.status === "APPROVED" && (
          <>
            <h1 className="text-2xl font-bold py-3 mt-5">
              Scheduled Repayments
            </h1>

            <Link href={`/manage-loans/pay-loan?loanId=${loan._id}`}>
              Pay Loan
            </Link>

            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                    Date
                  </th>
                  <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                    Amount
                  </th>
                  <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {loan?.scheduledRepayments?.map((repayment, index) => (
                  <tr key={index}>
                    <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {new Date(repayment.date).toLocaleDateString()}
                      </h5>
                      {/* <p className="text-sm">(in Rupees)</p> */}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {repayment.amount}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <p
                        className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                          repayment.status === "PAID"
                            ? "text-success bg-success"
                            : repayment.status === "REJECTED"
                            ? "text-danger bg-danger"
                            : repayment.status === "PARTIALLY PAID"
                            ? "text-body bg-body"
                            : "text-warning bg-warning"
                        }`}
                      >
                        {repayment.status}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default TableThree;
