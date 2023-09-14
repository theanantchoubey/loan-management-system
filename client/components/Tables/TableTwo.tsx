"use client";
// import { Package } from "@/types/package";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
// Define an interface for loan data
interface Loan {
  _id: string;
  amount: number;
  term: number;
  status: string;
  fullName: string;
  // Add more loan details here
}

const TableTwo = () => {
  const token = Cookies.get("user_token");
  const router = useRouter();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>(""); // State to track selected status
  const fetchLoans = async () => {
    try {
      const response = await fetch("/api/loans/getAllLoans", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // You can include other headers as needed
        },
      }); // Replace with your API endpoint
      if (response.ok) {
        const data = await response.json();
        setLoans(data);
      } else {
        console.error("Error fetching loans:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching loans:", error);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [token]);
  // Function to handle status updates
  const handleStatusUpdate = async (loanId: string) => {
    try {
      const response = await fetch(`/api/loans/updateLoanStatus/${loanId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newStatus: selectedStatus }), // Send selected status
      });

      if (response.ok) {
        fetchLoans();
        console.log("Loan status updated successfully");
        // You can handle any additional logic here if needed
      } else {
        console.error("Error updating loan status:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating loan status:", error);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Full Name
              </th>

              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Amount
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Term
              </th>
              <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Update the Status
              </th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan, index) => (
              <tr key={index}>
                <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <h5 className="font-medium text-black dark:text-white">
                    {loan.fullName}
                  </h5>
                  <p className="text-sm">{loan._id}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{loan.amount}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p className="text-black dark:text-white">{loan.term}</p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <p
                    className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                      loan.status === "PAID"
                        ? "text-success bg-success"
                        : loan.status === "REJECTED"
                        ? "text-danger bg-danger"
                        : loan.status === "APPROVED"
                        ? "text-body bg-body"
                        : "text-warning bg-warning"
                    }`}
                  >
                    {loan.status}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center space-x-3.5">
                    {loan?.status === "PENDING" && (
                      <td className="border border-gray-300 px-4 py-2 text-black">
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="APPROVED">APPROVE</option>
                          {/* <option value="PAID">PAID</option> */}
                          <option value="REJECTED">REJECT</option>
                        </select>
                        <button
                          onClick={() => handleStatusUpdate(loan._id)}
                          className="flex w-full justify-center rounded bg-primary p-1 font-medium text-gray"
                        >
                          Update
                        </button>
                      </td>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableTwo;
