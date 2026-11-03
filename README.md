# Advance-Bank-Transaction-System

##### Backend for a banking application that transfers money between accounts without duplicates or partial updates. It uses a double-entry ledger, MongoDB ACID transactions, and idempotency keys so retries never cause double payments.

### Tech stack
Runtime and framework: Node.js, Express.js 5
Database: MongoDB, Mongoose (ODM, aggregation pipeline, multi-document transactions, TTL and compound indexes)
Auth and security: JWT, bcrypt, cookie-parser, token blacklist
Email: Nodemailer (Gmail OAuth2)
Other: dotenv, Git/GitHub, Postman
