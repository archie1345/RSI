import React, { useState, useEffect } from 'react'
import { createUser, getUsers, updateUser, deleteUser } from './api/userApi'
import { createSession, getSessions, updateSession, deleteSession } from './api/sessionApi'
import { createRecipe, getRecipes, deleteRecipe } from './api/recipeApi'
import { createIngredient, getIngredients } from './api/ingredientApi'
import { createStep, getSteps } from './api/stepApi'
import { createPicture, getPictures } from './api/pictureApi'

export default function App() {
  const [users, setUsers] = useState([])
  const [sessions, setSessions] = useState([])
  const [recipes, setRecipes] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [steps, setSteps] = useState([])
  const [pictures, setPictures] = useState([])
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '' })
  const [newRecipe, setNewRecipe] = useState({ userId: '', title: '', description: '', visibility: 'private' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: userList } = await getUsers()
    const { data: sessionList } = await getSessions()
    const { data: recipeList } = await getRecipes()
    const { data: ingredientList } = await getIngredients()
    const { data: stepList } = await getSteps()
    const { data: pictureList } = await getPictures()
    setUsers(userList || [])
    setSessions(sessionList || [])
    setRecipes(recipeList || [])
    setIngredients(ingredientList || [])
    setSteps(stepList || [])
    setPictures(pictureList || [])
  }

  const handleAddUser = async () => {
    await createUser(newUser)
    setNewUser({ username: '', email: '', password: '' })
    fetchData()
  }

  const handleDeleteUser = async (userId) => {
    await deleteUser(userId)
    fetchData()
  }

  const handleAddRecipe = async () => {
    await createRecipe(newRecipe)
    setNewRecipe({ userId: '', title: '', description: '', visibility: 'private' })
    fetchData()
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Supabase Full CRUD UI</h1>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Add User</h2>
        <input className="border p-2 rounded" placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleAddUser}>Add User</button>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Users</h2>
        <ul className="space-y-2">
          {users.map(user => (
            <li key={user.userId} className="flex justify-between items-center border p-2 rounded">
              <span>{user.username} - {user.email}</span>
              <button className="text-red-600" onClick={() => handleDeleteUser(user.userId)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Sessions</h2>
        <ul className="space-y-2">
          {sessions.map(session => (
            <li key={session.sessionId} className="border p-2 rounded">
              <div>User ID: {session.userId}</div>
              <div>Timestamp: {session.loginTimestamp}</div>
              <div>Active: {session.isActive ? 'Yes' : 'No'}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Add Recipe</h2>
        <input className="border p-2 rounded" placeholder="User ID" value={newRecipe.userId} onChange={(e) => setNewRecipe({ ...newRecipe, userId: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Title" value={newRecipe.title} onChange={(e) => setNewRecipe({ ...newRecipe, title: e.target.value })} />
        <textarea className="border p-2 rounded" placeholder="Description" value={newRecipe.description} onChange={(e) => setNewRecipe({ ...newRecipe, description: e.target.value })} />
        <select className="border p-2 rounded" value={newRecipe.visibility} onChange={(e) => setNewRecipe({ ...newRecipe, visibility: e.target.value })}>
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleAddRecipe}>Add Recipe</button>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Recipes</h2>
        <ul className="space-y-2">
          {recipes.map(recipe => (
            <li key={recipe.recipeId} className="border p-2 rounded">
              <div>Title: {recipe.title}</div>
              <div>User ID: {recipe.userId}</div>
              <div>Visibility: {recipe.visibility}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}