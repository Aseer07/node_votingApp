const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require("../jwt");
const {
  addCandidate,
  updateCandidate,
  deleteCandidate,
  voteCandidate,
  getVoteCount,
  getAllCandidates,
} = require("../controller/candidates-controller");

router
  .post("/", jwtAuthMiddleware, addCandidate)
  .put("/:candidateId", jwtAuthMiddleware, updateCandidate)
  .delete("/:candidateId", jwtAuthMiddleware, deleteCandidate)
  .post("/vote/:candidateId", jwtAuthMiddleware, voteCandidate)
  .get("/vote/count", getVoteCount)
  .get("/", getAllCandidates);

module.exports = router;
