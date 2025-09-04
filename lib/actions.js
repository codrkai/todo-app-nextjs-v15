'use server'

import { client, clientdb } from "./db"

export const getItems = async (id) => {
    try {
        await client.connect()
        const db = client.db(clientdb.name)
        const items = db.collection(clientdb.items)

        let itemList = []
        const data = await items.find().toArray()

        if (data.length > 0) {
            data.forEach(item => (
                itemList.push({id: item.item_id, content:item.content, checked:item.checked})
            ))
        }

        return itemList
    } catch (error) {
        console.log(error)
        return []
    } finally {
        await client.close()
    }
}

export const insertItem = async (itemId, userId, content) => {
    try {
        await client.connect()
        const db = client.db(clientdb.name)
        const items = db.collection(clientdb.items)

        // new item
        const newItem = {
            item_id: itemId,
            user_id: userId,
            content: content,
            checked: false
        }

        // insert item
        const insertItem = await items.insertOne(newItem)
        if (!insertItem.acknowledged) {
            console.log('Insert item failed')
            return null
        }

        return insertItem
    } catch (error) {
        console.log(error)
        return null
    } finally {
        await client.close()
    }
}

export const deleteItem = async (id) => {
    try {
        await client.connect()
        const db = client.db(clientdb.name)
        const items = db.collection(clientdb.items)

        // delete item
        const deleteItem = await items.deleteOne({item_id: id})
        if (!deleteItem.deletedCount) {
            console.log('Delete item failed')
            return null
        }

        return deleteItem
    } catch (error) {
        console.log(error)
        return null
    } finally {
        await client.close()
    }
}

export const updateItem = async (itemId, userId, checked) => {
    try {
        await client.connect()
        const db = client.db(clientdb.name)
        const items = db.collection(clientdb.items)

        // update item
        const updateItem = await items.updateOne(
            {item_id: itemId, user_id: userId},
            {$set: {checked: checked}}
        )
        if (!updateItem.modifiedCount) {
            console.log('Update item failed')
            return null
        }

        return updateItem
    } catch (error) {
        console.log(error)
        return null
    } finally {
        await client.close()
    }
}
