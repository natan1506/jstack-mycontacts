const http = require('http')
const { URL } = require('url')

const routes = require('./routes')

const server = http.createServer((req, res) => {
  const parseUrl = new URL(`http://localhost:3000${req.url}`)

  let { pathname } = parseUrl;
  let id = null

  const splitEndPoint = pathname.split('/').filter(Boolean)

  if(splitEndPoint.length > 1) {
    pathname = `/${splitEndPoint[0]}/:id`
    id = splitEndPoint[1]
  }

  const route = routes.find((routeObj) => (
    routeObj.endpoint === pathname && routeObj.method === req.method
  ))

  if (route) {
    req.query = Object.fromEntries(parseUrl.searchParams)
    req.params = { id }

    res.send = (statusCode, body) => {
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(body))
    }

    route.handler(req, res)
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(`Cannot ${req.method} ${parseUrl.pathname}`)
  }
 
})

server.listen(3000, () => console.log('🔥 Server started at http://localhost:3000'))