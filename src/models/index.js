import mongoose from 'mongoose'
import config from 'config-lite'
import setDebug from 'debug'
import IpModel from './ip.model'
import MovieModel from './movie.model'

const debug = setDebug('App:connectDB')
const mongodb = config.mongodb

mongoose.Promise = Promise
mongoose.connect(mongodb, (err) => {
  if (err) {
    debug(`Connect to ${mongodb} error.`)
    debug(`Error message: ${err.message}.`)
    process.exit(1)
  }
  debug(`The connection to ${mongodb} has been built sucessfully.`)
})

export const Ip = IpModel
export const Movie = MovieModel
