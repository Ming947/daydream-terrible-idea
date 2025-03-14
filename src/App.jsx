import { useState, useEffect } from 'react'

function Game() {
  const [username, setUsername] = useState("")
  const [balance, setBalance] = useState(0)

  useEffect(() => {
    const savedUsername = localStorage.getItem("username")
    const savedBalance = localStorage.getItem("balance")  
    if (savedUsername) {
      setUsername(savedUsername)
    }
    if (savedBalance) {
      setBalance(Number(savedBalance))
    }
  }
  , [])

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
    localStorage.setItem("username", event.target.value)
  }

  const earnMoney = () => {
    const amount = Math.floor(Math.random() * 100) + 1;
    const newBalance = balance + amount
    setBalance(newBalance)
    localStorage.setItem("balance", newBalance)
    alert(`You earned $${amount}!`)
  }

  return (
    <>
      <h2>Hello {username || ""}</h2>
      <input 
        type="text"
        placeholder='Enter your name'
        value={username}
        onChange={handleUsernameChange}
      />
      <h2>Wallet Balance: ${balance}</h2>
      <div>
        <button onClick={earnMoney}>
          Earn Money
        </button>
      </div>
    </>
  )
}

export default Game
