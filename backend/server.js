const dotenv = require('dotenv')
const dns = require('dns')
const app = require('./app')
const connectDB = require('./config/db')

dotenv.config()

if (process.env.DNS_SERVER) {
  dns.setServers(process.env.DNS_SERVER.split(',').map((s) => s.trim()))
  console.log(`Using custom DNS server(s): ${process.env.DNS_SERVER}`)
}

const PORT = process.env.PORT || 5000

const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`)
    process.exit(1)
  }
}

startServer()
