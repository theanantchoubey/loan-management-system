"use client";
import React from "react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import TableTwo from "../Tables/TableTwo";
import Cookies from "js-cookie";
const AllLoans: React.FC = () => {
  const token = Cookies.get("user_token");
  return (
    <>
      <Breadcrumb
        pageName={`${
          token ? "All Loans" : "Welcome to Loan Management System"
        }`}
      />
      {token && (
        <div className="flex flex-col gap-10">
          <TableTwo />
        </div>
      )}
    </>
  );
};

export default AllLoans;
