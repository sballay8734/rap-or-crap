import { logServer } from "./helpers/logFormatter"
import { createServer } from "./serverConfig"

const port = process.env.PORT || 5001
const server = createServer()

server.listen(port, () => {
  logServer(`Api running on port ${port}`)
})

//  /auth/undefined/api/auth/signin
