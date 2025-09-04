'use server'

import { supabase } from "./db"

export const getItems = async (id) => {
    const { data, error } = await supabase.from('items').select('*').eq('user_id', id)
    let itemList = []

    if (data.length > 0) {
        data.forEach(item => (
            itemList.push({id: item.item_id, content:item.content, checked:item.checked})
        ))
    }

    return itemList
}

export const insertItem = async (itemId, userId, content) => {
    const newItem = {
        item_id: itemId,
        user_id: userId,
        content: content
    }

    const { error } = await supabase.from('items').insert(newItem)
    
    if (error) {
        console.log('Insert Error: ' + error)
        return error
    } else {
        return null
    }
}

export const deleteItem = async (id) => {
    const { error } = await supabase.from('items').delete().match({item_id: id})
    
    if (error) {
        console.log('Delete Error: ' + error)
        return error
    } else {
        return null
    }
}

export const updateItem = async (itemId, userId, checked) => {
    const { error } = await supabase.from('items').update({checked: checked}).match({item_id: itemId, user_id: userId})

    if (error) {
        console.log('Delete Error: ' + error)
        return error
    } else {
        return null
    }
}
