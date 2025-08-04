import React from 'react'

const Home = () => {
  return (
    <div>
      <h2>Home</h2>
      <form>
        <div>
          <label>Email:</label>
          <input type="email" name="email" required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" required />
        </div>
        <button type="submit">Home</button>
      </form>
    </div>
  )
}

export default Home
