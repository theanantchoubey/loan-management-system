import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableThree from "@/components/Tables/TableThree";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "My Loans",
  description: "This is Page for My Loans",
  // other metadata
};

const MyLoans = () => {
  return (
    <>
      <Breadcrumb pageName="Loan Details" />

      <div className="flex flex-col gap-10">
        <TableThree />
      </div>
    </>
  );
};

export default MyLoans;
