const express = require('express')
const config = require("../config/config.json")
const request = require('request')
const app = express()
app.use(express.json())

app.use(function (req, res) {
    if (!req.body) {
      res.writeHead(400)
      res.end('invalid json body')
      return
    }
    if (!req.body.method) {
      res.writeHead(400)
      res.end('missing method')
      return
    }

    if (!config.methods.includes(req.body.method)) {
        res.writeHead(400)
        res.end('method unavailable')
        return
    }
    request
      .post({
        url: `${config.server_url}:${config.server_port}`,
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' }
      })
      .on('error', function (e) {
        res.writeHead(500)
        res.end(`error in proxy: ${e}`)
      })
      .pipe(res)
  })
  
  app.listen(config.listen_port, () => {
    console.log(`proxy listening at ${config.listen_port} and forwarding to ${config.server_url}:${config.server_port}`)
  })
