import { useState, useEffect } from 'react'

function Game() {
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState(0);
  const [lastEarnings, setLastEarnings] = useState(0);
  const [earningHistory, setEarningHistory] = useState([]);

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedBalance = localStorage.getItem("balance");
    const savedHistory = localStorage.getItem("earningHistory");

    if (savedUsername) {
      setUsername(savedUsername)
    }
    if (savedBalance) {
      setBalance(Number(savedBalance))
    }
    if (savedHistory) {
      setEarningHistory(JSON.parse(savedHistory))
    }
  }
  , []);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
    localStorage.setItem("username", event.target.value)
  };

  const earnMoney = () => {
    const amount = Math.floor(Math.random() * 100) + 1;
    const newBalance = balance + amount;
    const newHistory = [amount, ...earningHistory];
    setBalance(newBalance);
    setLastEarnings(amount);
    setEarningHistory(newHistory);

    localStorage.setItem("balance", newBalance);
    localStorage.setItem("earningHistory", JSON.stringify(newHistory))
  };

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
        {lastEarnings > 0 && <span>+${lastEarnings}</span>}
      </div>
    </>
  )
}

export default Game;
