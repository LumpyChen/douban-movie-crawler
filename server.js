import http from 'http'

import express from 'express'
import EventProxy from 'eventproxy'
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fs from "fs"
import fetch from "isomorphic-fetch";

const ep = new EventProxy(),
  times = 1000

ep.after('CRAW_FINISHED', times, (movies) => {
  fs.apendFile('./data/movie.json', movies, 'utf-8')
  console.log('Append success!');
})

console.log("let's Go")

for (let i = 0; i<1000000; i++){
  (function(j){
    let count = 2000001-j
    setTimeout(() => {
      console.log(j)
      fetch(`http://api.douban.com/v2/movie/subject/${count}`)
        .then((body) => {
          console.log(body)
          if (body.status>=400) { throw new Error() }
          console.log('Go!')
          return body.json()
        })
        .then((result) => {
          console.log(`success: http://api.douban.com/v2/movie/subject/${count}`)
          ep.emit('CRAW_FINISHED', [count, result.rating.average, result.wishcount])
        }).catch(() => {
          console.log(`fail: http://api.douban.com/v2/movie/subject/${count}`)
      })
    }, 1000*j)
  })(i)
}

