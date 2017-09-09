import request from 'superagent'
import proxy from 'superagent-proxy'
import setDebug from 'debug'
import config from 'config-lite'
import { Ip } from '../models/index'

const debug = setDebug('App:getGoodIp')
const { testUrl } = config
proxy(request)

export default async () => {
  const res = await request.get('http://tpv.daxiangdaili.com/ip/?tid=555889400938475&num=500&filter=on&format=json')
  const ips = JSON.parse(res.text)
  debug('Get Ip success!')
  for (let i = 1; i < ips.length; i += 1) {
    const proxyAd = ips[i].host.concat(':', ips[i].port)
    const proxyUrl = 'http://'.concat(proxyAd)
    debug(`Get proxy url: ${proxyUrl}.`)
    try {
      const testIp = await request.get(testUrl).proxy(proxyUrl).timeout(5000)
      if (testIp.statusCode === 200) {
        debug(`${proxyUrl} is availiable.`)
        await Ip.create({
          proxy: proxyUrl,
        })
        debug(`${proxyUrl} added to db.`)
      }
    } catch (err) {
      debug(`Abort ${proxyUrl}.`)
      debug(`Error is ${err}.`)
    }
  }
}
