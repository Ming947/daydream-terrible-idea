import { useState, useEffect } from 'react'
import './App.css';

function Game() {
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [balance, setBalance] = useState(0);
  const [lastEarnings, setLastEarnings] = useState(0);
  const [showEarnings, setShowEarnings] = useState(false);
  const [earningHistory, setEarningHistory] = useState([]);
  const [moneyDrops, setMoneyDrops] = useState([]);

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

  useEffect(() => {
    if (lastEarnings !== null) {
      setShowEarnings(true);
      const timer = setTimeout(() => {
        setShowEarnings(false); 
        setTimeout(() => setLastEarnings(null), 500); 
      }, 1000);

      return () => clearTimeout(timer);
    }
  }
  , [lastEarnings]);

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

    const moneyCount = Math.floor(Math.random() * 10) + 1;
    const newMoneyDrops = Array.from({ length: moneyCount }, (_, index) => ({
      id: index,
      x: Math.random()* 200 + 100,
      duration: Math.floor(Math.random() * 1.5) + 1
    }));
    setMoneyDrops(newMoneyDrops);

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
      <div className='earnings-container'>
        <button className='earn-btn' onClick={earnMoney}>
          GET Money
        </button>

        {lastEarnings !== null && (
          <span  className={`earnings-text ${showEarnings ? "fade-in" : "fade-out"}`}>
            +${lastEarnings}
          </span>
        )}

        {moneyDrops.map((money) => (
          <span 
            key={money.id} 
            className="money"
            style={{
              left: `calc(50% + ${money.x}px)`,
              animation: `money-fall ${money.duration}s ease-in-out forwards`
            }}>
            💸
          </span>
        ))}
      </div>
    </>
  )
}

export default Game;
