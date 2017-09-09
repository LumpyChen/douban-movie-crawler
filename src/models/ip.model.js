import mongoose from 'mongoose'

const Schema = mongoose.Schema

const IpSchema = new Schema({
  proxy: {
    type: String,
    required: true,
    unique: true,
  },
})

IpSchema.index({
  proxy: 1,
})

export default mongoose.model('Ip', IpSchema)
