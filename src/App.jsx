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
  const [newRecipe, setNewRecipe] = useState({ userid: '', title: '', description: '', visibility: 'private' })
  const [newIngredient, setNewIngredient] = useState({ recipeid: '', name: '', quantity: '', unit:'-' })
  const [newStep, setNewStep] = useState({ recipeid: '', instruction: '', steporder: 1 })

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

  const handleAddUser = async () => {
    await createUser(newUser)
    setNewUser({ username: '', email: '', password: '' })
    fetchData()
  }

  const handleDeleteUser = async (userid) => {
    if (!userid) return
    await deleteUser(userid)
    fetchData()
  }

  const handleAddRecipe = async () => {
  if (!newRecipe.userid || !newRecipe.title || !newRecipe.description) {
    alert('Please fill in all required fields.')
    return
  }

  const recipeData = {
    ...newRecipe,
    userid: parseInt(newRecipe.userid)
  }

  try {
    const { error } = await createRecipe(recipeData)
    if (error) {
      console.error('Error creating recipe:', error)
      alert('Failed to create recipe. Check the console for details.')
    } else {
      setNewRecipe({ userid: '', title: '', description: '', visibility: 'private' })
      fetchData()
    }
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}


  const handleAddIngredient = async () => {
    if(!newIngredient.recipeid || !newIngredient.name || !newIngredient.quantity){
      alert('please fill in all required fields.')
      return
    }

    const ingredientData = {
      ...newIngredient,
      recipeid: parseInt(newIngredient.recipeid),
      quantity: parseInt(newIngredient.quantity),
      unit: newIngredient.unit
    }

    try{
      const {error} = await createIngredient(ingredientData)
      if (error){
        console.error('Error creating Ingredients:', error)
      alert('Failed to create Ingredients. Check the console for details.')
    } else {
      setNewIngredient({ recipeid: '', name: '', quantity: '',unit:'-' })
      fetchData()
    }
    } catch (err){
      console.error('Unexpected error:', err)
    }
  }

  const handleDeleteIngredient = async (ingredientid) => {
    await deleteIngredients(ingredientid)
    fetchData()
  }

  const handleAddStep = async () => {
  if (!newStep.recipeid || !newStep.instruction) {
    alert('Please fill in all required fields.')
    return
  }

  const recipeIdInt = parseInt(newStep.recipeid)

  // Get current steps for the recipe to find max steporder
  const currentSteps = steps.filter(step => step.recipeid === recipeIdInt)
  const maxsteporder = currentSteps.length > 0
    ? Math.max(...currentSteps.map(s => s.steporder))
    : 0

  const stepData = {
    recipeid: recipeIdInt,
    instruction: newStep.instruction,
    steporder: maxsteporder + 1
  }

  try {
    const { error } = await createStep(stepData)
    if (error) {
      console.error('Error creating step:', error)
      alert('Failed to create step.')
    } else {
      setNewStep({ recipeid: '', instruction: '', steporder: 1 })
      fetchData()
    }
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}



  const handleDeleteStep = async (stepid) => {
  // Get the recipeid of the step being deleted
  const stepToDelete = steps.find(step => step.stepid === stepid)
  if (!stepToDelete) return

  const recipeId = stepToDelete.recipeid

  try {
    await deleteSteps(stepid)

    // Get remaining steps for the same recipe
    const remainingSteps = steps
      .filter(step => step.recipeid === recipeId && step.stepid !== stepid)
      .sort((a, b) => a.steporder - b.steporder)

    // Reassign steporders sequentially (1, 2, 3...)
    for (let i = 0; i < remainingSteps.length; i++) {
      await updateSteps(remainingSteps[i].stepid, {
        steporder: i + 1
      })
    }

    fetchData()
  } catch (err) {
    console.error('Error deleting or updating steps:', err)
  }
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
  <li key={user.userid} className="flex flex-col md:flex-row justify-between items-start md:items-center border p-2 rounded gap-2">
    <div>
      <input
        className="border p-1 rounded mr-2"
        value={user.username}
        onChange={(e) => {
          const updated = users.map(u => u.userid === user.userid ? { ...u, username: e.target.value } : u)
          setUsers(updated)
        }}
      />
      <input
        className="border p-1 rounded mr-2"
        value={user.email}
        onChange={(e) => {
          const updated = users.map(u => u.userid === user.userid ? { ...u, email: e.target.value } : u)
          setUsers(updated)
        }}
      />
    </div>
    <div className="flex gap-2">
      <button
        className="text-blue-600"
        onClick={async () => {
          await updateUser(user.userid, { username: user.username, email: user.email })
          fetchData()
        }}>
        Update
      </button>
      <button
        className="text-red-600"
        onClick={() => handleDeleteUser(user.userid)}>
        Delete
      </button>
    </div>
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
              <div>User ID: {session.userid}</div>
              <div>Timestamp: {session.loginTimestamp}</div>
              <div>Active: {session.isActive ? 'Yes' : 'No'}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* RECIPE FORM */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Add Recipe</h2>
        <input className="border p-2 rounded" placeholder="User ID" value={newRecipe.userid} onChange={(e) => setNewRecipe({ ...newRecipe, userid: e.target.value })} />
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
            <li key={recipe.recipeid} className="border p-2 rounded">
              <div>Title: {recipe.title}</div>
              <div>User ID: {recipe.userid}</div>
              <div>Visibility: {recipe.visibility}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* INGREDIENT FORM */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Add Ingredient</h2>
        <input className="border p-2 rounded" placeholder="Recipe ID" value={newIngredient.recipeid} onChange={(e) => setNewIngredient({ ...newIngredient, recipeid: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Name" value={newIngredient.name} onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })} />
        <input className="border p-2 rounded" placeholder="quantity" value={newIngredient.quantity} onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })} />
        <select
          className="border p-2 rounded"
          value={newIngredient.unit}
          onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}>
          <option value="-">-</option>
          <option value="tbsp">tbsp</option>
          <option value="ml">ml</option>
          <option value="gr">gr</option>
          <option value="ons">ons</option>
          <option value="others">others</option>
        </select>
        <button className="bg-purple-600 text-white px-4 py-2 rounded" onClick={handleAddIngredient}>Add Ingredient</button>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Ingredients</h2>
        <ul className="space-y-2">
          {ingredients.map(ingredient => (
            <li key={ingredient.ingredientid} className="border p-2 rounded flex justify-between">
              <span>
                {ingredient.name} - {ingredient.quantity} {ingredient.unit} (Recipe ID: {ingredient.recipeid})
              </span>
              <button className="text-red-600" onClick={() => handleDeleteIngredient(ingredient.ingredientid)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {/* STEP FORM */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Add Step</h2>
        <input className="border p-2 rounded" placeholder="Recipe ID" value={newStep.recipeid} onChange={(e) => setNewStep({ ...newStep, recipeid: e.target.value })} />
        <textarea className="border p-2 rounded" placeholder="Instruction" value={newStep.instruction} onChange={(e) => setNewStep({ ...newStep, instruction: e.target.value })} />
        <button className="bg-yellow-600 text-white px-4 py-2 rounded" onClick={handleAddStep}>Add Step</button>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Steps</h2>
        <ul className="space-y-2">
          {steps.map(step => (
            <li key={step.stepid} className="border p-2 rounded flex justify-between">
              <span>#{step.steporder} - {step.instruction} (Recipe ID: {step.recipeid})</span>
              <button className="text-red-600" onClick={() => handleDeleteStep(step.stepid)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
