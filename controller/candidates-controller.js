const Candidate = require("../models/candidate");
const User = require("../models/user");

async function checkAdminRole(userId) {
  try {
    const user = await User.findById(userId);
    if (user.role === "admin") {
      return true;
    }
  } catch (error) {
    return false;
  }
}

const addCandidate = async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      console.log("use doest not have admin role");
      return res.status(403).json({ message: "user does not have admin role" });
    }
    const candidateData = req.body;
    const newCandidate = new Candidate(candidateData);
    const response = await newCandidate.save();
    res
      .status(200)
      .json({ message: "candidate created successfully", candidate: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateCandidate = async (req, res) => {
  try {
    if (!checkAdminRole(req.params.id)) {
      return res.status(403).json({ message: "user does not have admin role" });
    }
    const candidateId = req.params.candidateId;
    const candidateData = req.body;
    const response = await Candidate.findByIdAndUpdate(
      candidateId,
      candidateData,
      { new: true, runValidators: true }
    );
    if (!response) {
      return res.status(404).json({ message: "candidate not found" });
    }
    res
      .status(200)
      .json({ message: "candidate updated successfully", candidate: response });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteCandidate = async (req, res) => {
  try {
    if (!checkAdminRole(req.params.id)) {
      return res.status(403).json({ message: "user does not have admin role" });
    }
    const candidateId = req.params.candidateId;
    const response = await Candidate.findByIdAndDelete(candidateId);
    if (!response) {
      return res.status(404).json({ message: "candidate not found" });
    }
    res.status(200).json({ message: "candidate deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const voteCandidate = async (req, res) => {
  const candidateId = req.params.candidateId;
  const userId = req.user.id;
  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "candidate not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    if (user.isVoted) {
      return res.status(400).json({ message: "you have already voted" });
    }
    if (user.role === "admin") {
      return res.status(403).json({ message: "admin can not vote" });
    }
    //update the candidate record with vote

    candidate.votes.push({ user: userId });
    candidate.voteCount++;
    await candidate.save();

    //update the user document

    user.isVoted = true;
    await user.save();

    res.status(200).json({ message: "vote recorded successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getVoteCount = async (req, res) => {
  try {
    const candidate = await Candidate.find().sort({ voteCount: "desc" });
    const voteRecord = candidate.map((data) => {
      return {
        party: data.party,
        count: data.voteCount,
      };
    });

    res.status(200).json(voteRecord);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllCandidates = async (req, res) => {
  try {
    const candidate = await Candidate.find({});
    res
      .status(200)
      .json({ message: "fetched candidate", candidate: candidate });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  addCandidate,
  updateCandidate,
  deleteCandidate,
  voteCandidate,
  getVoteCount,
  getAllCandidates,
};
