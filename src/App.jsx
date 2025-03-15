import { useState, useEffect } from 'react'
import './App.css';
import backgroundPic from "./assets/background.png";
import coinSound from "./assets/coin-recieved.mp3";

const randomEvents = [
  { message: "💰 You found a wallet!", multiplier: 1.2 },
  { message: "🎁 You opened a mysterious treasure chest!", multiplier: 2 },
  { message: "🍀 The goddess of luck is smiling at you!", multiplier: 1.5 },
  { message: "🏆 You won a prize in a competition!", multiplier: 1.8 },
  { message: "💎 You found a diamond!", multiplier: 2.5 },
  { message: "🎰 You hit the jackpot in a slot machine!", multiplier: 3 },
  { message: "🚀 Your stock investments skyrocketed!", multiplier: 2 },
  { message: "📦 You received a mysterious gift!", multiplier: 1.3 },
  { message: "🤑 You won a small lottery!", multiplier: 1.4 },
  { message: "🪙 You found a coin on the ground!", multiplier: 1.1 }
];

function Game() {
  const [username, setUsername] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [balance, setBalance] = useState(0);
  const [lastEarnings, setLastEarnings] = useState(0);
  const [showEarnings, setShowEarnings] = useState(false);
  const [earningHistory, setEarningHistory] = useState([]);
  const [moneyDrops, setMoneyDrops] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const coinAudio = new Audio(coinSound);

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

  useEffect(() => {
    if (moneyDrops.length > 0) {
      const timer = setTimeout(() => setMoneyDrops([]), 1500);
      return () => clearTimeout(timer);
    }
  }, [moneyDrops]);  

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
    coinAudio.play();

    setBalance(newBalance);
    setLastEarnings(amount);
    setEarningHistory(newHistory);

    if (Math.random() < 0.2) {
      const randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];
      const eventMessage = randomEvent.message;
      const multiplier = randomEvent.multiplier;

      const bonusAmount = Math.floor(amount * (multiplier - 1));
      setBalance(newBalance + bonusAmount);
      setLastEarnings(bonusAmount);

      setModalMessage(eventMessage);
      setShowModal(true);

      setTimeout(() => {
        setShowModal(false);
      }, 1500);
    }

    const moneyCount = Math.floor(Math.random() * 6) + 5;
    const newMoneyDrops = Array.from({ length: moneyCount }, (_, index) => ({
      id: index,
      x: Math.random()* 300 + 50,
      y: Math.random() * 100 + 50,
      duration: (Math.random() * 1.5 + 1).toFixed(2)
    }));

    setMoneyDrops([...newMoneyDrops]);

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
            className='username-input'
          />
          <button 
            className='save-btn'
            onClick={saveUsername}>
            √
          </button>
        </div>
      )}

      <img src={backgroundPic}
        alt="forest"
        className='background-image'
      />

      <h2>Wallet Balance: ${balance}</h2>
      <div className='earnings-container'>
        <button className='earn-btn' onClick={earnMoney}>
          GET Money
        </button>

        {earningHistory.length > 0 && earningHistory[0].eventMessage && (
          <p className="event-message">{earningHistory[0].eventMessage}</p>
        )}

        {lastEarnings !== null && (
          <span  className={`earnings-text`}>
            +${lastEarnings}
          </span>
        )}

        {moneyDrops.map((money) => (
          <span 
            key={money.id} 
            className="money"
            style={{
              left: `calc(50% + ${money.x}px)`,
              "--fall-distance": `${money.y}px`,
              "--duration": `${money.duration}s`            
            }}>
            💸
          </span>
        ))}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <p>{modalMessage}</p>
          </div>
        </div>
      )}
    </>
  )
}

export default Game;
