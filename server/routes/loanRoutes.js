const express = require("express");
const router = express.Router();
const loanController = require("../controller/loanController");
const authenticateJWT = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdminMiddleware");
router.use(authenticateJWT);

router.put(
  "/updateLoanStatus/:loanId",
  isAdmin,
  loanController.updateLoanStatus
);
router.get("/getAllLoans", isAdmin, loanController.getAllLoans);
router.post("/createLoan/:userId", loanController.createLoan);
router.get("/getUserLoans/:userId", loanController.getUserLoans);
router.get("/getLoanDetails/:loanId", loanController.getLoanDetails);
router.post("/processRepayment/:loanId", loanController.processRepayment);

module.exports = router;
