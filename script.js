const { useState, useEffect } = React;

function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function App() {
  const [account, setAccount] = useState({
    Name: prompt("Please enter your full name:"),
    Current_location: prompt("Please enter your current location:"),
    Job_status: prompt("Are you currently employed? (Yes/No)"),
    user_ID: null,
    PIN_details: null,
    balance: 0,
    initial_balance: 0,
    transactions: [],
    daily_spent: 0,
    last_spent_date: getTodayDateString(),
    total_expenses: 0,
    total_days_to_track_expense: 0,
    member_list: [],
    member_ids: [],
  });
  const [timer, setTimer] = useState(300);

  useEffect(() => {
    let interval;
    if (timer > 0) interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    if (account.Job_status.toLowerCase() === "no") alert("That's okay. Hoping you land your desired job soon until then I will help manage your expenses.");

    let initialBalanceInput = Number(prompt("Enter your initial balance amount:"));
    while ((!Number(initialBalanceInput) || initialBalanceInput < 0)) initialBalanceInput = Number(prompt("Invalid amount. Enter valid non-negative number:"));

    let totalDaysInput = Number(prompt("How many days would you like to track your expenses?"));
    while (totalDaysInput <= 0 || isNaN(totalDaysInput)) totalDaysInput = Number(prompt("Invalid number. Please enter a positive number of days:"));

    setAccount(a => ({ ...a, balance: initialBalanceInput, initial_balance: initialBalanceInput, total_days_to_track_expense: totalDaysInput }));

    const create_account_choice = prompt("Would you like to create your account by answering a few questions? (Yes/No)").toLowerCase();
    if (create_account_choice === "yes") {
      const num_members = Number(prompt("How many people would you like to involve in transactions?"));
      const member_names = [];
      const member_ids = [];
      for (let i = 0; i < num_members; i++) member_names.push(prompt(`Enter name of member ${i+1}:`));
      const useShortIDs = prompt("Would you like me to generate short IDs for each member? (Yes/No)").toLowerCase();
      if (useShortIDs === "yes") for (let name of member_names) member_ids.push(name.toLowerCase().split(' ').map(w => w[0]).join(''));
      else member_ids.push(...member_names);
      setAccount(a => ({ ...a, member_list: member_names, member_ids }));
    } else alert("This app works only with created accounts.");

    const user_id_choice = prompt("Should I generate a User ID for you? (Yes/No)").toLowerCase();
    let userId, pin;
    if (user_id_choice === "yes") userId = account.Name.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);
    else userId = prompt("Enter your preferred User ID:");
    do { pin = prompt("Create a 4-digit PIN:"); } while (!/^\d{4}$/.test(pin));
    setAccount(a => ({ ...a, user_ID: userId, PIN_details: pin }));
    alert(`Your User ID: ${userId} and PIN: ${pin}`);
  }, []);

  const dailyLimit = account.total_days_to_track_expense > 0 ? (account.balance / account.total_days_to_track_expense) : 0;
  const totalSavings = account.initial_balance - account.total_expenses;
  const spendingPercent = Math.min(100, (account.total_expenses / account.initial_balance) * 100);
  const savingsPercent = Math.min(100, (totalSavings / account.initial_balance) * 100);

  return (
    <div>
      <div className="navbar">
        <p className="message-up">Welcome, {account.Name || "Guest"}!</p>
        <img src="https://cdn1.iconfinder.com/data/icons/male-profession-colour-flat/1063/24-512.png" alt="profile" className="image-view" />
        <form className="form">
          <input type="text" className="userid" placeholder="User ID"/>
          <input type="password" className="PIN" placeholder="PIN"/>
          <button id="btn">=></button>
        </form>
      </div>

      <div className="account-overview">
        <p className="balance-text"><strong>Current Balance</strong><br/><em>(As of {getTodayDateString()})</em></p>
        <p className="balance-amount">₹{account.balance}</p>
      </div>

      <div className="metrics-display">
        <h2>Your Spending Overview</h2>
        <p>Daily Spending Limit: <span>₹{dailyLimit}</span></p>
        <p>Daily Spent Today: <span>₹{account.daily_spent}</span></p>
        <p>Total Expenses: <span>₹{account.total_expenses}</span></p>
        <p>Remaining Potential Savings: <span>₹{totalSavings}</span></p>
      </div>

      <div className="transactions-box">
        <h2>Daily Transactions</h2>
        {account.transactions.length === 0 ? <p>No transactions yet.</p> :
          account.transactions.slice().reverse().map((t, i) => (
            <div key={i} className="transaction-item">
              <span>{t.type} - {t.purpose} ({new Date(t.date).toLocaleDateString()})</span>
              <span>{t.amount > 0 ? '+' : ''} ₹{Math.abs(t.amount)}</span>
            </div>
          ))
        }
      </div>

      <div className="right-stack">
        <div className="loan-box">
          <p className="box-title">Request Loan</p>
          <input type="text" placeholder="Loan User ID"/>
          <input type="text" placeholder="Purpose"/>
          <input type="text" placeholder="Amount to Request"/>
          <button>=></button>
        </div>

        <div className="transfer-box">
          <p className="box-title">Transfer Money</p>
          <input type="text" placeholder="Recipient ID"/>
          <input type="text" placeholder="Purpose"/>
          <input type="text" placeholder="Amount"/>
          <button>=></button>
        </div>

        <div className="circular-meter" style={{background:`conic-gradient(rgb(54, 129, 93) ${savingsPercent}%, lightgray ${savingsPercent}%)`}}>
          <div className="inside-circle">{Math.round(savingsPercent)}%</div>
        </div>
        <p className="meter-label">Monthly Savings</p>

        <div className="circular-meter" style={{background:`conic-gradient(rgb(192, 57, 43) ${spendingPercent}%, lightgray ${spendingPercent}%)`}}>
          <div className="inside-circle">{Math.round(spendingPercent)}%</div>
        </div>
        <p className="meter-label">Monthly Expenses</p>
      </div>

      <div className="timer">You will be logged out in: {Math.trunc(timer/60)}:{(timer%60 < 10 ? '0' : '') + timer%60}</div>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
