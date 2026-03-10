const mongoose = require("mongoose");

const aiCacheSchema = new mongoose.Schema(
  {
    inputHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    inputData: {
      type: Object,
      required: true,
    },
    outputData: {
      type: Object,
      required: true,
    },
    useCase: {
      type: String,
      enum: ["generateNotes", "summarizeHistory", "analyzeChronicCase"],
      required: true,
    }
  },
  { timestamps: true }
);

// TTL index to expire cache after 30 days
aiCacheSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

module.exports = mongoose.model("AICache", aiCacheSchema);
