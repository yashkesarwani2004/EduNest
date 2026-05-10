import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 5']
  },
  comment: {
    type: String,
    required: [true, 'Please add a comment text']
  },
  institute: {
    type: mongoose.Schema.ObjectId,
    ref: 'Institute',
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Prevent user from submitting more than one review per institute
reviewSchema.index({ institute: 1, user: 1 }, { unique: true });

// Static method to get avg rating and save
reviewSchema.statics.getAverageRating = async function(instituteId) {
  const obj = await this.aggregate([
    {
      $match: { institute: instituteId }
    },
    {
      $group: {
        _id: '$institute',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  try {
    await this.model('Institute').findByIdAndUpdate(instituteId, {
      averageRating: obj[0] ? Number(obj[0].averageRating.toFixed(1)) : 0,
      totalReviews: obj[0] ? obj[0].totalReviews : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageRating after save
reviewSchema.post('save', function() {
  this.constructor.getAverageRating(this.institute);
});

// Call getAverageRating after remove
reviewSchema.post('deleteOne', { document: true, query: false }, function() {
  this.constructor.getAverageRating(this.institute);
});

export default mongoose.model('Review', reviewSchema);
