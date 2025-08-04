import React from 'react'

const Expense = () => {
  return (
    <div>
      <h2>Expense</h2>
      <form>
        <div>
          <label>Email:</label>
          <input type="email" name="email" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit">Expense</button>
      </form>
    </div>
  )
}

export default Expense
