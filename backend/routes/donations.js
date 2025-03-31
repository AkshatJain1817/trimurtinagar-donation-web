const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const Donation = require('../models/Donation');

// @route   POST api/donations
// @desc    Add a donation
router.post('/', auth, async (req, res) => {
  const { donorName, amount, description, address, date, type } = req.body;
  try {
    const donation = new Donation({
      user: req.user.id,
      donorName,
      amount,
      description,
      address,
      date,
      type,
    });
    await donation.save();
    res.json(donation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/donations
// @desc    Get all donations for the authenticated temple/user
router.get('/', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ user: req.user.id }).sort({ date: -1 });
    res.json(donations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedDonation = await Donation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedDonation);
  } catch (err) {
    res.status(500).json({ error: 'Error updating donation' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Donation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Donation deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting donation' });
  }
});


module.exports = router;
