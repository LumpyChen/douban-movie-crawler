import mongoose from 'mongoose'

const Schema = mongoose.Schema
const MovieSchema = new Schema({
  name: { type: String, required: true, unique: true },
  box_office: { type: Number, required: true },
  comments_count: { type: Number },
  reviews_count: { type: Number },
  wish_count: { type: Number },
  collect_count: { type: Number },
  ratings_count: { type: Number },
  genres: { type: Array },
  average: { type: Number },
})

export default mongoose.model('Movie', MovieSchema)
