const Loan = require("../models/Loan");
const uuid = require("uuid");
// For Admin Only
exports.updateLoanStatus = async (req, res) => {
  try {
    const { loanId } = req.params;
    const { newStatus } = req.body;

    if (!["PENDING", "APPROVED", "PAID", "REJECTED"].includes(newStatus)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const loan = await Loan.findOne({ _id: loanId });

    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    loan.status = newStatus;
    await loan.save();

    res.status(200).json({ message: "Loan status updated successfully" });
  } catch (error) {
    console.error("Error updating loan status:", error);
    res.status(500).json({ error: "Failed to update loan status" });
  }
};

// For Admin Only
exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate("user", "fullName");

    const loansWithFullName = loans.map((loan) => ({
      _id: loan._id,
      amount: loan.amount,
      term: loan.term,
      status: loan.status,
      fullName: loan.user.fullName,
    }));

    res.status(200).json(loansWithFullName);
  } catch (error) {
    console.error("Error fetching loans:", error);
    res.status(500).json({ error: "Failed to fetch loans" });
  }
};

exports.createLoan = async (req, res) => {
  try {
    const userId = req.params.userId;

    const { loanAmount, term } = req.body;

    const weeklyRepaymentAmount = loanAmount / term;

    const scheduledRepayments = [];

    let currentDate = new Date();

    for (let i = 0; i < term; i++) {
      const scheduledRepayment = {
        date: currentDate,
        amount: weeklyRepaymentAmount,
        status: "PENDING",
      };
      scheduledRepayments.push(scheduledRepayment);

      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() + 7);
    }

    const loan = new Loan({
      amount: loanAmount,
      term,
      user: userId,
      scheduledRepayments,
      status: "PENDING",
    });

    await loan.save();

    res.status(201).json({ message: "Loan created successfully" });
  } catch (error) {
    console.error("Error creating loan:", error);
    res.status(500).json({ error: "Failed to create loan" });
  }
};

exports.getUserLoans = async (req, res) => {
  try {
    const userId = req.params.userId;

    const loans = await Loan.find({ user: userId });

    const userLoans = loans.map((loan) => {
      const loanDetails = {
        loanId: loan._id,
        amount: loan.amount,
        status: loan.status,
      };

      const totalAmountLeft = loan.scheduledRepayments
        .filter(
          (repayment) =>
            repayment.status === "PAID" || repayment.status === "PARTIALLY PAID"
        )
        .reduce((total, repayment) => total + repayment.amount, 0);

      loanDetails.amountLeft = loan.amount - totalAmountLeft;

      return loanDetails;
    });
    res.status(200).json(userLoans);
  } catch (error) {
    console.error("Error fetching user loans:", error);
    res.status(500).json({ error: "Failed to fetch user loans" });
  }
};

exports.getLoanDetails = async (req, res) => {
  try {
    const loanId = req.params.loanId;

    const loan = await Loan.findOne({ _id: loanId });

    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    res.status(200).json(loan);
  } catch (error) {
    console.error("Error fetching loan details:", error);
    res.status(500).json({ error: "Failed to fetch loan details" });
  }
};

exports.processRepayment = async (req, res) => {
  try {
    const loanId = req.params.loanId;

    const { amountPaid } = req.body;

    const loan = await Loan.findById(loanId);

    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    if (loan.status === "PAID") {
      return res.status(400).json({ error: "Loan already marked as PAID" });
    }

    let totalAmountPaid = amountPaid;

    for (const repayment of loan.scheduledRepayments) {
      if (
        repayment.status === "PENDING" ||
        repayment.status === "PARTIALLY PAID"
      ) {
        if (totalAmountPaid >= repayment.amount) {
          totalAmountPaid -= repayment.amount;
          repayment.amount = 0;
          repayment.status = "PAID";
        } else if (totalAmountPaid === 0) break;
        else {
          repayment.amount -= totalAmountPaid;
          repayment.status = "PARTIALLY PAID";
          break;
        }
      }
    }
    const allRepaymentsPaid = loan.scheduledRepayments.every(
      (repayment) => repayment.status === "PAID"
    );

    if (allRepaymentsPaid) {
      loan.status = "PAID";
    }

    await loan.save();

    res.status(200).json({ message: "Repayments processed successfully" });
  } catch (error) {
    console.error("Error processing repayments:", error);
    res.status(500).json({ error: "Failed to process repayments" });
  }
};
