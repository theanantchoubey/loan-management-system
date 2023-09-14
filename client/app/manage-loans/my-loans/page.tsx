import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import TableOne from "@/components/Tables/TableOne";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "My Loans",
  description: "This is Page for My Loans",
  // other metadata
};

const MyLoans = () => {
  return (
    <>
      <Breadcrumb pageName="My Loans" />

      <div className="flex flex-col gap-10">
        <TableOne />
      </div>
    </>
  );
};

export default MyLoans;
