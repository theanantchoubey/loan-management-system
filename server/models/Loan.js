const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loanSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  term: {
    type: Number,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  scheduledRepayments: [
    {
      date: {
        type: Date,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      status: {
        type: String,
        enum: ["PENDING", "PAID", "PARTIALLY PAID"],
        default: "PENDING",
      },
    },
  ],
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "PAID", "REJECTED"],
    default: "PENDING",
  },
});

const Loan = mongoose.model("Loan", loanSchema);

module.exports = Loan;
