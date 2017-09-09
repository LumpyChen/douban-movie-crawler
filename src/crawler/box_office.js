import request from 'superagent'
import proxy from 'superagent-proxy'
import setDebug from 'debug'
import config from 'config-lite'
import { Ip, Movie } from '../models/index'

const debug = setDebug('App:getBoxOffice')
const { movieNum } = config
const getRandomInt = (max, num) => {
  const arr = []
  for (let i = 0; i < num; i += 1) {
    const temp = Math.floor(Math.random() * (max + 1))
    if (arr.some(ele => ele === temp)) {
      i += 1
    } else {
      arr.push(temp)
    }
  }
  return arr.sort((a, b) => a - b)
}

proxy(request)

export default async () => {
  const ip = await Ip.find({}).exec()
  const arr = movieNum.map((ele) => {
    const newEle = Object.assign({}, ele, {
      select: getRandomInt(ele.sum, ele.num),
    })
    return newEle
  })
  let ipNo = 0

  debug('Random array generated.')

  for (let i = 0; i < arr.length; i += 1) {
    for (let j = 0; j < arr[i].num; j += 1) {
      if (ipNo > ip.length) {
        ipNo = 0
      }
      try {
        const res = await request.get('http://www.cbooo.cn/Mdata/getMdata_movie').query({
          area: arr[i].area,
          pIndex: arr[i].select[j],
        })
        const data = JSON.parse(res.text).pData

        debug(`Access area: ${arr[i].area} in ${arr[i].select[j]} successfully.`)
        for (let k = 0; k < data.length; k += 1) {
          if (data[k].BoxOffice === '' || data[k].name === '') {
            debug(`Crawling movie: ${data[k].MovieName} fails, infomation missed.`)
          } else {
            await Movie.create({
              name: data[k].MovieName,
              box_office: data[k].BoxOffice,
            }).catch((err) => {
              debug(`Crawling movie: ${data[k].MovieName} fails, the error is ${err}.`)
            }).then(() => {
              debug(`Insert movie: ${data[k].MovieName} in DB successfully.`)
            })
          }
        }
        ipNo += 1
      } catch (err) {
        debug(`Area: ${arr[i].area}, pIndex: ${arr[i].select[j]} fails.`)
        debug(`The error is ${err}.`)
      }
    }
  }
}
