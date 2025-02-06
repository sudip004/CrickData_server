const router = require('express').Router();
const { userRegister, userLogin } = require('../controllers/UserController');
const Match = require("../models/matchModel")
const Prediction = require("../models/predictionModel")
const  UserBalance = require("../models/balance")

// middleware
const { authenticate } = require('../middlewares/AuthUser');


// User Routes
router.post('/register', userRegister);
router.post('/login', userLogin);

// Create Match
router.post('/matchcreate', authenticate, async (req, res) => {
    try {
        const match = new Match({ ...req.body, createdBy: req.user._id });
        await match.save();
        res.status(201).send(match);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// Update match API (Only Creator Can Update)
router.patch('/matchupdate/:id', authenticate, async (req, res) => {
    try {
        const matchId = req.params.id;

        // // Find the match first
        // const match = await Match.findById(matchId);
        // if (!match) {
        //     return res.status(404).send({ message: 'Match not found' });
        // }

        // // Check if the authenticated user is the match creator
        // if (match.createdBy.toString() !== req.user._id.toString()) {
        //     return res.status(403).send({ message: 'You are not authorized to update this match' });
        // }

        // Update the match
        const updatedMatch = await Match.findByIdAndUpdate(
            matchId,
            req.body,
            { new: true, runValidators: true }
        );

        res.send(updatedMatch);
        console.log("Match updated successfully by the creator");

    } catch (err) {
        console.log("Server Error:", err);
        res.status(400).send({ message: err.message });
    }
});


// Get perticular Match
router.get('/findcurrentmatch/:id', authenticate, async (req, res) => {
    try {
        const matchId = req.params.id;
        const matches = await Match.findById(matchId);
        res.send(matches);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Get all matches
router.get('/findlivematches', authenticate, async (req, res) => {
    try {
        const matches = await Match.find({ status: 'live' });
        res.send(matches);
    } catch (err) {
        res.status(500).send(err.message);
    }
});
//upcomming matches
router.get('/draftmatches', authenticate, async (req, res) => {
    try {
        const matches = await Match.find({ status: 'draft' });
        res.send(matches);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


// Create Prediction By User
router.post('/prediction/:id', authenticate, async (req, res) => {
    try {
        const matchId = req.params.id;
        const userId = req.user._id;

        const match = await Match.findById(matchId);
        if (!match) return res.status(404).json({ message: "Match not found" });

        if (match.status !== 'live') {
            return res.status(400).json({ message: "Betting is only allowed on live matches!" });
        }

        const prediction = new Prediction({ ...req.body, user: userId,match:matchId });
        await prediction.save();
        res.status(201).send(prediction);
    } catch (err) {
        res.status(400).send(err.message);
    }
});


router.patch('/prediction/:id', authenticate, async (req, res) => {
    try {
        const predictId = req.params.id;
        

        const predictionMatch = await Prediction.findByIdAndUpdate(
            predictId,
            {
                $set: {
                    ...req.body
                }
            },
            { new: true, runValidators: true }
        );
        res.status(201).send(predictionMatch);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.get('/findprediction/:id', authenticate, async (req, res) => {
    try {
        const matchId = req.params.id;
        const prediction = await Prediction.findOne({ match: matchId, user: req.user._id }); // ✅ Use `findOne` instead of `find`

        if (!prediction) {
            return res.status(200).json(null); // ✅ Return `null` instead of `[]`
        }

        res.json(prediction);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/balance', authenticate, async (req, res) => {
    try {
        const balance = await UserBalance.findOne({ user: req.user._id });
        if (!balance) return res.status(404).json({ message: "Balance not found" });

        res.json(balance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/balance', authenticate, async (req, res) => {
    try {
        const balance = new UserBalance({ ...req.body, user: req.user._id });
        await balance.save();
        res.status(201).send(balance);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

router.patch('/balance', authenticate, async (req, res) => {
    try {
        const balance = await UserBalance.findOne({ user: req.user._id });
        if (!balance) return res.status(404).json({ message: "Balance not found" });

        balance.balance = req.body.balance;
        await balance.save();
        res.send(balance);
    } catch (err) {
        res.status(400).send(err.message);
    }
});

//logout
router.post('/logout', authenticate, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.user.save();
        res.send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});




module.exports = router;