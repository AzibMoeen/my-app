import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

// Use capitalized model name `Image` and check if it exists in `mongoose.models`
export default mongoose.models.Image || mongoose.model('Image', imageSchema);
