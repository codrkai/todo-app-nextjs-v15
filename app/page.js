'use client'

import Image from "next/image"
import { useState } from "react"
import { signIn, signOut, useSession } from "next-auth/react"
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { v4 } from "uuid"
import { insertItem, deleteItem, updateItem, getItems } from "@/lib/actions"

export default function Home() {
  const [todo, setTodo] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const { data:session, status } = useSession()

  let auth = {
    isAuth: false,
    id: null,
    name: 'not signed in',
    email: null,
    image: "http://www.gravatar.com/avatar/?d=mp",
    bgImage: "bg-[url('https://images.unsplash.com/photo-1489549132488-d00b7eee80f1?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]",
    // bgImage: "bg-gray-800"
  }

  if (status === 'authenticated') {
    auth = {
      isAuth: true,
      id: session.user.id,
      name: "Signed in as " + session.user.name,
      email: session.user.email,
      image: session.user.image,
      bgImage: "bg-[url('https://images.unsplash.com/photo-1489549132488-d00b7eee80f1?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]",
    }

    if (todo.length < 1) {
      const res = getItems(auth.id).then((data) => {
        if (data.length > 0) {
          setTodo(data)
        }
      })
    }
  }

  const handleKeyUp = (e) => {
    console.log(e.key, e.target.value)
    if (e.key === 'Enter' && e.target.value) {
      const itemId = v4()
      
      const newItem = {
        id: itemId,
        content: e.target.value,
        checked: false
      }

      setTodo(todo.concat(newItem))
      setNewTodo('')

      // insert into db
      if (auth.isAuth) {
        const error = insertItem(itemId, auth.id, e.target.value)
      }

      e.target.value = ''
    }
  }

  const handleDelete = (id, itemId) => {
    if (id > -1) {
      setTodo(todo.slice(0, id).concat(todo.slice(id+1)))

      //delete from db
      if (auth.isAuth) {
        const error = deleteItem(itemId)
      }
    }
  }

  const handleUpdate = (id, checked) => {
    const newTodo = [...todo]

    const todoItem = newTodo.find(
      item => item.id === id
    )

    todoItem.checked = checked

    setTodo(newTodo)

    // update db
    if (auth.isAuth) {
      const error = updateItem(id, auth.id, checked)
    }
  }

  const handleOnDragEnd = (result) => {
    const { destination, source } = result

    if (!destination) {
      return
    }

    const items = reorder(todo, source.index, destination.index)

    setTodo(items)
  }

  const reorder = (list, startIndex, endIndex) => {
      const result = Array.from(list)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)
      return result
  }

  return (
    <>
      <div className={`w-screen h-screen bg-black bg-bottom bg-no-repeat bg-cover ${auth.bgImage}`}>
        <div className="absolute flex w-full justify-end items-right align-right p-5">
          {
            auth.isAuth ? 
            <button onClick={() => signOut()} className="rounded-3xl bg-gray-800 p-2 border-4 border-gray-700 text-sm text-gray-400 hover:text-gray-300 hover:border-gray-500">Sign Out</button>
            :
            <button onClick={() => signIn()} className="rounded-3xl bg-gray-800 p-2 border-4 border-gray-700 text-sm text-gray-400 hover:text-gray-300 hover:border-gray-500">Sign In</button>
          }
        </div>

        <div className="flex min-h-min justify-center pt-40">
          <div className="max-w-sm w-full shadow-lg bg-white p-8 rounded-xl opacity-70">
            
            <div className="flex justify-center items-center bg-gray-100 rounded-3xl px-4 py-1 color-gray">
              <div className="relative">
                <button onClick={() => signIn()} type="button" className="rounded-3xl hover:ring-2 hover:ring-white hover:ring-offset-2 hover:ring-offset-gray-400">
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open profile menu</span>
                    <Image className="rounded-3xl w-16 h-13" src={auth.image} width={16} height={13} alt="profile" />
                </button>
              </div>

              <div className="w-full p-3">
                <p className="text-3xl text-gray-600">Todo List</p>
                <p className="text-sm text-gray-600 pl-2 italic">{auth.name}</p>
              </div>
            </div>

            <div className="relative">
              <div className="inset-y-0 left-2 flex justify-end pl-3 pointer-events-none">
                <svg className="relative top-9 right-6" width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M21 4C21.5128 4 21.9355 4.38604 21.9933 4.88338L22 5V11.5C22 13.3686 20.5357 14.8951 18.692 14.9948L18.5 15H5.415L8.70711 18.2929C9.06759 18.6534 9.09532 19.2206 8.7903 19.6129L8.70711 19.7071C8.34662 20.0676 7.77939 20.0953 7.3871 19.7903L7.29289 19.7071L2.29289 14.7071C2.2575 14.6717 2.22531 14.6343 2.19633 14.5953L2.12467 14.4841L2.07123 14.3713L2.03585 14.266L2.01102 14.1485L2.00398 14.0898L2 14L2.00279 13.9248L2.02024 13.7993L2.04974 13.6879L2.09367 13.5768L2.146 13.4793L2.2097 13.3871L2.29289 13.2929L7.29289 8.29289C7.68342 7.90237 8.31658 7.90237 8.70711 8.29289C9.06759 8.65338 9.09532 9.22061 8.7903 9.6129L8.70711 9.70711L5.415 13H18.5C19.2797 13 19.9204 12.4051 19.9931 11.6445L20 11.5V5C20 4.44772 20.4477 4 21 4Z" fill="#212121"/></svg>
              </div>
              <input type="text" id="newTodo" onKeyUp={(e) => handleKeyUp(e)} className="block w-full pl-4 pr-12 py-2 border-4 rounded-full bg-gray-600 text-white" placeholder="new todo item" />
            </div>

            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={true} droppableId="todos">
              {(droppableProvided) => (
                <div 
                  {...droppableProvided.droppableProps} 
                  ref={droppableProvided.innerRef}
                >
                  <ul className="block w-full pt-6">
                  {
                    todo?.map( (item, index) => {
                      return (
                        <Draggable draggableId={item.id} key={item.id} index={index}>
                          {(draggableProvided) => (
                            <div 
                              {...draggableProvided.draggableProps} 
                              {...draggableProvided.dragHandleProps} 
                              ref={draggableProvided.innerRef}
                            >
                              <li key={item.id} className="w-full border-2 rounded-xl mt-2 hover:border-blue-300">
                                <input id={index} checked={item.checked} onChange={(e) => handleUpdate(item.id, e.target.checked)} type="checkbox" className="float-left block w-6 h-6 m-3" />
                                <button id={index} onClick={() => handleDelete(index, item.id)} className="float-right w-7 h-7 m-2.5 rounded-2xl bg-gray-700 text-gray-200 shadow-md hover:bg-gray-900 hover:scale-105">x</button>
                                <label htmlFor={index} className="block w-full p-3 text-gray-800">{item.content}</label>
                              </li>
                            </div>
                          )}
                        </Draggable>
                      )
                    })
                  }
                  </ul>
                  {droppableProvided.placeholder}
                </div>
              )}
              </Droppable>
            </DragDropContext>

          </div>
        </div>
      </div>
    </>
  )
}
