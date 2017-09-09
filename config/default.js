export default {
  port: process.env.PORT || 4000,
  host: 'localhost',
  mongodb: 'mongodb://127.0.0.1:12345/movie',
  testUrl: 'http://ip.chinaz.com/getip.aspx',
  interval: 1000,
  movieNum: [
    {
      area: 1,
      num: 5,
      sum: 63,
    },
    {
      area: 2,
      num: 1,
      sum: 5,
    },
    {
      area: 50,
      num: 20,
      sum: 283,
    },
    {
      area: 37,
      num: 5,
      sum: 57,
    },
    {
      area: 40,
      num: 1,
      sum: 10,
    },
    {
      area: 25,
      num: 1,
      sum: 14,
    },
    {
      area: 4,
      num: 1,
      sum: 15,
    },
    {
      area: 30,
      num: 1,
      sum: 7,
    },
    {
      area: 16,
      num: 1,
      sum: 10,
    },
    {
      area: 29,
      num: 1,
      sum: 7,
    },
  ],
}
