import { useState, useEffect } from 'react'

function Game() {
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
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
  };

  const saveUsername = () => {
    localStorage.setItem("username", username);
    setIsEditing(false); 
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
      <h2>Hello {username || ""}
        <span
          aria-label="edit"
          style={{ cursor: "pointer", fontSize: "18px", marginLeft: "5px" }}
          onClick={() => setIsEditing(true)}>
          ✏️
        </span>
      </h2>
      
      {isEditing && (
        <div>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            placeholder="Enter your name"
          />
          <button 
            style={{ marginLeft: "5px", cursor: "pointer", fontSize: "14px", all:"unset" }}
            onClick={saveUsername}>
            ✅
          </button>
        </div>
      )}

      <h2>Wallet Balance: ${balance}</h2>
      <div>
        <button onClick={earnMoney}>
          GET Money
        </button>
        {lastEarnings > 0 && <span>+${lastEarnings}</span>}
      </div>
    </>
  )
}

export default Game;
