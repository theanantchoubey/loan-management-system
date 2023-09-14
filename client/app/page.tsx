import AllLoans from "@/components/Dashboard/All-loans";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Loan Management System",
  description: "This is the Loan Management System built using Next.js",
  // other metadata
};

export default function Home() {
  return (
    <>
      <AllLoans />
    </>
  );
}
