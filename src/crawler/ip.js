import request from 'superagent'
import proxy from 'superagent-proxy'
import cheerio from 'cheerio'
import setDebug from 'debug'
import config from 'config-lite'
import { Ip } from '../models/index'

const debug = setDebug('App:getIp')
const { testUrl } = config
proxy(request)

export default async () => {
  for (let i = 1; i < 2; i += 1) {
    const res = await request.get(`http://www.xicidaili.com/nn/${i}`)
    const $ = cheerio.load(res.text)
    const tr = $('tr')
    debug(`Get http://www.xicidaili.com/nn/${i} success.`)
    for (let j = 1; j < tr.length; j += 1) {
      const td = $(tr[j]).children('td')
      const proxyUrl = `http://${td[1].children[0].data}:${td[2].children[0].data}`
      debug(`Get proxy url: ${proxyUrl}.`)
      try {
        const testIp = await request.get(testUrl).proxy(proxyUrl).timeout(3000)
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
}
