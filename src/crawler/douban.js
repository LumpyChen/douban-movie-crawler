import request from 'superagent'
import proxy from 'superagent-proxy'
import setDebug from 'debug'
import config from 'config-lite'
import { Movie, Ip } from '../models/index.js'

const debug = setDebug('App:crawlDouban')
const { interval } = config
let IpNo = 0

proxy(request)

const searchCrawler = async (q, Ips) => {
  try {
    return await request.get('http://api.douban.com/v2/movie/search').query({
      q,
    }).proxy(Ips[IpNo].proxy).timeout(8000)
  } catch (err) {
    debug(err)
    debug(`Fail to search the movie: ${q}, change Ip and try again.`)
    IpNo += 1
    if (IpNo > Ips.length) {
      IpNo = 0
    }
    return searchCrawler(q, Ips)
  }
}

const dataCrawler = async (id, q, Ips) => {
  try {
    return await request.get(`http://api.douban.com/v2/movie/subject/${id}`).proxy(Ips[IpNo].proxy).timeout(8000)
  } catch (err) {
    debug(err)
    debug(`Fail to search the movie: ${q}, change Ip and try again.`)
    IpNo += 1
    if (IpNo > Ips.length) {
      IpNo = 0
    }
    return dataCrawler(id, q, Ips)
  }
}

const sleep = async () => {
  await new Promise((res) => {
    setTimeout(() => {
      debug(`Sleep ${interval} second in case of Warning.`)
      res()
    }, interval)
  })
}

export default async () => {
  const Ips = await Ip.find().exec()
  const Movies = await Movie.find({ "average": { "$exists": false } }).exec()
  debug('Begin the crawling on Douban')
  for (let i = 0; i < Movies.length; i += 1) {
    if (IpNo > Ips.length) {
      IpNo = 0
    }
    const { name } = Movies[i]
    debug(`Begin searching of ${name}.`)
    try {
      const queryRes = await searchCrawler(name, Ips)
      const { id } = JSON.parse(queryRes.text).subjects[0]
      debug(`Searching ${name} success, id is ${id}`)
      const res = await dataCrawler(id, name, Ips)
      const {
        rating,
        reviews_count,
        commects_count,
        wish_count,
        collect_count,
        ratings_count,
        genres,
      } = JSON.parse(res.text)
      debug(`Get data of ${name} successfully.`)
      const { average } = rating
      await Movie.update({
        name,
      }, {
        reviews_count,
        commects_count,
        wish_count,
        collect_count,
        ratings_count,
        genres,
        average,
      })
      debug(`Update the data of ${name} in db successfully.`)
      await sleep()
      IpNo += 1
    } catch (err) {
      debug(`Movie: ${name} data fails, error is ${err}, skip it.`)
      if (err instanceof SyntaxError) {
        Ips.splice(IpNo, 1)
        debug(`Movie: ${name} data fails, error is ${err}, skip the Ip.`)
      } else {
        debug(`Movie: ${name} data fails, error is ${err}, skip it.`)
      }
      debug(`Remove ${name} in db successfully.`)
    }
  }
}
