const Review = require("../models/review.model");

exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json({ success: true, data: reviews, count: reviews.length });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.createReview = async (req, res) => {
    try {
        const { name, image, foodId, foodImage, text, rating } = req.body;

        if (!name || !text) {
            return res.status(400).json({ success: false, msg: "Name and text required" });
        }

        const review = await Review.create({
            name,
            image: image || null,
            food: foodId || null,
            foodImage: foodImage || null,
            text,
            rating: rating || 5,
        });

        res.status(201).json({ success: true, msg: "Review created", review });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ success: false, msg: "Review not found" });

        res.json({ success: true, msg: "Review deleted" });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};
