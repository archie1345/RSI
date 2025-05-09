import React, { useState, useEffect } from 'react'
import {
  createUser, getUsers, updateUser, deleteUser
} from './api/userApi'
import {
  createSession, getSessions, updateSession, deleteSession
} from './api/sessionApi'
import {
  createRecipe, getRecipes, deleteRecipe, updateRecipe
} from './api/recipeApi'
import {
  createIngredient, getIngredients, updateIngredients, deleteIngredients
} from './api/ingredientApi'
import {
  createStep, getSteps, updateSteps, deleteSteps
} from './api/stepApi'

export default function App() {
  const [users, setUsers] = useState([])
  const [sessions, setSessions] = useState([])
  const [recipes, setRecipes] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [steps, setSteps] = useState([])

  const [newUser, setNewUser] = useState({ username: '', email: '', password: '' })
  const [newRecipe, setNewRecipe] = useState({ userId: '', title: '', description: '', visibility: 'private' })
  const [newIngredient, setNewIngredient] = useState({ recipeId: '', name: '', quantity: '' })
  const [newStep, setNewStep] = useState({ recipeId: '', instruction: '', stepNumber: 1 })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { data: userList } = await getUsers()
    const { data: sessionList } = await getSessions()
    const { data: recipeList } = await getRecipes()
    const { data: ingredientList } = await getIngredients()
    const { data: stepList } = await getSteps()
    setUsers(userList || [])
    setSessions(sessionList || [])
    setRecipes(recipeList || [])
    setIngredients(ingredientList || [])
    setSteps(stepList || [])
  }

  // User CRUD
  const handleAddUser = async () => {
    await createUser(newUser)
    setNewUser({ username: '', email: '', password: '' })
    fetchData()
  }

  const handleDeleteUser = async (userId) => {
    await deleteUser(userId)
    fetchData()
  }

  // Recipe CRUD
  const handleAddRecipe = async () => {
    await createRecipe(newRecipe)
    setNewRecipe({ userId: '', title: '', description: '', visibility: 'private' })
    fetchData()
  }

  // Ingredient CRUD
  const handleAddIngredient = async () => {
    await createIngredient(newIngredient)
    setNewIngredient({ recipeId: '', name: '', quantity: '' })
    fetchData()
  }

  const handleDeleteIngredient = async (ingredientId) => {
    await deleteIngredients(ingredientId)
    fetchData()
  }

  // Step CRUD
  const handleAddStep = async () => {
    await createStep(newStep)
    setNewStep({ recipeId: '', instruction: '', stepNumber: 1 })
    fetchData()
  }

  const handleDeleteStep = async (stepId) => {
    await deleteSteps(stepId)
    fetchData()
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Supabase Full CRUD UI</h1>

      {/* USER FORM */}
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

      {/* SESSION LIST */}
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

      {/* RECIPE FORM */}
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

      {/* INGREDIENT FORM */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Add Ingredient</h2>
        <input className="border p-2 rounded" placeholder="Recipe ID" value={newIngredient.recipeId} onChange={(e) => setNewIngredient({ ...newIngredient, recipeId: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Name" value={newIngredient.name} onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Quantity" value={newIngredient.quantity} onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })} />
        <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={handleAddIngredient}>Add Ingredient</button>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Ingredients</h2>
        <ul className="space-y-2">
          {ingredients.map(ingredient => (
            <li key={ingredient.ingredientId} className="border p-2 rounded flex justify-between">
              <span>{ingredient.name} - {ingredient.quantity} (Recipe ID: {ingredient.recipeId})</span>
              <button className="text-red-600" onClick={() => handleDeleteIngredient(ingredient.ingredientId)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {/* STEP FORM */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Add Step</h2>
        <input className="border p-2 rounded" placeholder="Recipe ID" value={newStep.recipeId} onChange={(e) => setNewStep({ ...newStep, recipeId: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Step #" type="number" value={newStep.stepNumber} onChange={(e) => setNewStep({ ...newStep, stepNumber: parseInt(e.target.value) })} />
        <textarea className="border p-2 rounded" placeholder="Instruction" value={newStep.instruction} onChange={(e) => setNewStep({ ...newStep, instruction: e.target.value })} />
        <button className="bg-yellow-600 text-white px-4 py-2 rounded" onClick={handleAddStep}>Add Step</button>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Steps</h2>
        <ul className="space-y-2">
          {steps.map(step => (
            <li key={step.stepId} className="border p-2 rounded flex justify-between">
              <span>#{step.stepNumber} - {step.instruction} (Recipe ID: {step.recipeId})</span>
              <button className="text-red-600" onClick={() => handleDeleteStep(step.stepId)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
