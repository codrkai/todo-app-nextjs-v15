import { MongoClient } from "mongodb"

if (!process.env.MONGODB_URI) {
    throw new Error('Please add your MongoDB URI to the .env.local file.')
}

const client = new MongoClient(process.env.MONGODB_URI)

const clientdb = {
    name: 'todo',
    users: 'users',
    items: 'items',
}

export { client, clientdb }
