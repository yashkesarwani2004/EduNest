import mongoose from 'mongoose';

const instituteSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a name for the institute'],
    trim: true,
    maxlength: [100, 'Name can not be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description can not be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please specify category (e.g. JEE, NEET, UPSC, K-12)'],
    enum: ['JEE', 'NEET', 'UPSC', 'K-12', 'Language', 'IT Skills', 'Other']
  },
  fees: {
    type: Number,
    required: [true, 'Please specify average fees']
  },
  mode: {
    type: String,
    enum: ['Offline', 'Online', 'Hybrid'],
    default: 'Offline'
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  timings: {
    type: String,
    required: true,
    default: '9:00 AM - 6:00 PM'
  },
  contactEmail: {
    type: String
  },
  contactPhone: {
    type: String
  },
  images: {
    type: [String],
    default: []
  },
  averageRating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating must can not be more than 5'],
    default: 0
  },
  consultancyIncome: {
    type: Number,
    default: 0
  },
  totalReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create geospatial index
instituteSchema.index({ location: '2dsphere' });

export default mongoose.model('Institute', instituteSchema);
