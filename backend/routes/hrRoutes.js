const express = require('express');

const router = express.Router();
const hrDetails = require('../models/hrDetails');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.post("/register", async (req, res) => {
    const { name, allowedEmail, email, password, hrId } = req.body;

    try {
        // Find the HR by the unique hrId (not email)
        let hr = await hrDetails.findOne({ hrId });

        // If HR does not exist, create a new record
        if (!hr) {
            hr = new hrDetails({
                hrId,  // Using hrId as the unique identifier
                name,
                allowedEmail,
                email,
                password
            });

            // Hash password before saving
            const salt = await bcrypt.genSalt(10);
            hr.password = await bcrypt.hash(password, salt);

            await hr.save();
        } else {
            // If HR exists, you can update the details
            hr.name = name || hr.name;
            hr.allowedEmail = allowedEmail || hr.allowedEmail;
            hr.email = email || hr.email;
            hr.password = password ? await bcrypt.hash(password, 10) : hr.password; // Only update password if provided

            await hr.save();
        }

        // Generate a JWT token
        const payload = {
            hr: { id: hr.id }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
