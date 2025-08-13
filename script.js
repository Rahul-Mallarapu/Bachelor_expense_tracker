alert("Welcome to the Bachelor Expense Tracker!");

function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const current_account = {
  Name: String(prompt("Please enter your full name:")),
  Current_location: String(prompt("Please enter your current location:")),
  Job_status: String(prompt("Are you currently employed? (Yes/No)")),
  user_ID: null,
  PIN_details: null,
  balance: 0,
  initial_balance: 0,
  transactions: [],
  daily_spent: 0,
  last_spent_date: getTodayDateString(),
  total_expenses: 0,
  total_days_to_track_expense: 0
};

if (current_account.Job_status.toLowerCase() === "no") {
  alert("I'm sorry to hear about your job delay. Hoping you land your desired job soon. I will help manage your expenses with your remaining amount.");
}

let initialBalanceInput = Number(prompt("Enter your initial balance amount:"));
let attempts = 3;
while ((!Number(initialBalanceInput) || initialBalanceInput < 0) && attempts > 0) {
  attempts--;
  initialBalanceInput = Number(prompt(`Invalid amount. Please enter a valid non-negative number:\nAttempts left: ${attempts}`));
  if (attempts === 0) {
    document.body.style.display = "none";
    break;
  }
}

current_account.balance = initialBalanceInput;
current_account.initial_balance = initialBalanceInput;

let totalDaysInput = Number(prompt("How many days would you like to track your expenses?"));
while (totalDaysInput <= 0 || isNaN(totalDaysInput)) {
  totalDaysInput = Number(prompt("Invalid number. Please enter a positive number of days:"));
}
current_account.total_days_to_track_expense = totalDaysInput;

const create_account_choice = String(prompt("Would you like to create your account by answering a few questions? (Yes/No)"));

function add_details_list(acc) {
  if (create_account_choice.toLowerCase() === "yes") {
    const num_members = Number(prompt("How many people would you like to involve in transactions?"));

    if (num_members >= 1) {
      const member_names = [];
      const member_ids = [];

      alert(`Okay ${acc.Name}, I will now ask for the names of the ${num_members} members.`);

      for (let i = 0; i < num_members; i++) {
        const name = prompt(`Enter name of member ${i + 1}:`);
        member_names.push(name);
      }

      const useShortIDs = prompt("Would you like me to generate short IDs for each member? (Yes/No)").toLowerCase();

      if (useShortIDs === "yes") {
        for (let name of member_names) {
          const id = name.toLowerCase().split(' ').map(word => word[0]).join('');
          member_ids.push(id);
          alert(`Use "${id}" for member "${name}"`);
        }
      } else {
        member_ids.push(...member_names);
        for (let name of member_names) {
          alert(`Use "${name}" as the transaction ID for "${name}"`);
        }
      }

      acc.member_list = member_names;
      acc.member_ids = member_ids;
    }

    if (acc.Job_status.toLowerCase() === "yes") {
      acc.Salary = prompt("Please enter your monthly salary:");
    }

    const user_id_choice = prompt(`Okay ${acc.Name}, should I generate a User ID for you? (Yes/No)`);

    if (user_id_choice.toLowerCase() === "yes") {
      const generated_id = acc.Name.toLowerCase().replace(/\s+/g, '') + Math.floor(Math.random() * 1000);
      let pin;
      do {
        pin = prompt("Create a 4-digit PIN:");
      } while (!/^\d{4}$/.test(pin));

      acc.user_ID = generated_id;
      acc.PIN_details = pin;
      alert(`Your User ID is "${generated_id}" and PIN is "${pin}". Save them!`);
    } else {
      const customID = prompt("Enter your preferred User ID:");
      let pin;
      do {
        pin = prompt("Create a 4-digit PIN:");
      } while (!/^\d{4}$/.test(pin));

      acc.user_ID = customID;
      acc.PIN_details = pin;
      alert(`Your User ID is "${customID}" and PIN is "${pin}". Save them!`);
    }
  } else if (create_account_choice.toLowerCase() === "no") {
    alert("This app currently works only with created accounts. Thank you for visiting.");
    document.body.style.display = "none";
  } else {
    alert("Invalid input. Please answer with 'Yes' or 'No'.");
    document.body.style.display = "none";
  }
}

add_details_list(current_account);


const timerElement = document.querySelector('.timer');
let timerInterval;
let timerDuration = 300;

function start_timer() {
    if (timerInterval) clearInterval(timerInterval);
    timerDuration = 300;
    timerInterval = setInterval(function () {
        if (timerDuration > 0) {
            let min = Math.trunc(timerDuration / 60);
            let sec = Math.trunc(timerDuration % 60);
            timerElement.textContent = `You will be logged out in: ${min}:${sec < 10 ? '0' + sec : sec}`;
            timerDuration--;
        } else {
            timerElement.textContent = "Time is up! Logging out...";
            document.body.style.display = 'none';
            clearInterval(timerInterval);
            alert("You have been logged out due to inactivity.");
        }
    }, 1000);
}

const userIdInput = document.querySelector('.userid');
const pinInput = document.querySelector('.PIN');
const loginButton = document.getElementById('btn');
const welcomeMessageElement = document.querySelector('.message-up');
const balanceAmountElement = document.querySelector('.balance-amount');
const transactionsBox = document.getElementById('transactionsBox');
const dailyLimitDisplayElement = document.querySelector('.daily-limit-display');
const dailySpentDisplayElement = document.querySelector('.daily-spent-display');
const totalExpensesDisplayElement = document.querySelector('.total-expenses-display');
const totalSavingsDisplayElement = document.querySelector('.total-savings-display');
const spendingMeterElement = document.querySelector('.spending-meter');
const spendingPercentElement = document.getElementById('spendingPercent');
const savingsMeterElement = document.querySelector('.savings-meter');
const savingsPercentElement = document.getElementById('savingsPercent');

function calculateAndDisplayDailyLimit() {
    if (current_account.total_days_to_track_expense > 0) {
        const dailyLimit = current_account.balance / current_account.total_days_to_track_expense;
        dailyLimitDisplayElement.textContent = `₹${dailyLimit}`;
        return dailyLimit;
    }
    dailyLimitDisplayElement.textContent = `0`;
    return 0;
}

function checkDailyExpenditure() {
    const todayDate = getTodayDateString();
    const dailyLimit = calculateAndDisplayDailyLimit();
    if (current_account.last_spent_date !== todayDate) {
        current_account.daily_spent = 0;
        current_account.last_spent_date = todayDate;
        if (dailyLimit > 0) alert(`Good morning! Your daily spending limit for today is: ₹${dailyLimit}.`);
    }
    if (current_account.daily_spent > dailyLimit && dailyLimit > 0) {
        alert(`You have crossed your daily expenditure! Your limit was ₹${dailyLimit} and you have spent ₹${current_account.daily_spent} today.`);
    }
}

function updateMeters() {
    let spendingPercentage = 0;
    if (current_account.initial_balance > 0) {
        spendingPercentage = (current_account.total_expenses / current_account.initial_balance) * 100;
        let visualSpendingPercentage = Math.min(spendingPercentage, 100);
        spendingMeterElement.style.background = `conic-gradient(rgb(192, 57, 43) ${visualSpendingPercentage}%, lightgray ${visualSpendingPercentage}%)`;
    } else {
        spendingMeterElement.style.background = `conic-gradient(lightgray 0%, lightgray 100%)`;
    }
    spendingPercentElement.textContent = `${Math.round(spendingPercentage)}%`;

    let savingsPercentage = 0;
    if (current_account.initial_balance > 0) {
        const currentSavings = current_account.initial_balance - current_account.total_expenses;
        savingsPercentage = (currentSavings / current_account.initial_balance) * 100;
        let visualSavingsPercentage = Math.max(0, Math.min(savingsPercentage, 100));
        savingsMeterElement.style.background = `conic-gradient(rgb(54, 129, 93) ${visualSavingsPercentage}%, lightgray ${visualSavingsPercentage}%)`;
    } else {
        savingsMeterElement.style.background = `conic-gradient(lightgray 0%, lightgray 100%)`;
    }
    savingsPercentElement.textContent = `${Math.round(savingsPercentage)}%`;
}

async function promptForTransactionValidity() {
    return confirm("Is the purpose valid and is it necessary to make the transaction? (Click OK for Yes, Cancel for No)");
}

function updateUI() {
    if (current_account.Name) {
        welcomeMessageElement.textContent = `Welcome, ${current_account.Name}!`;
        balanceAmountElement.textContent = `₹${current_account.balance}`;
        checkDailyExpenditure();
        dailySpentDisplayElement.textContent = `₹${current_account.daily_spent}`;
        totalExpensesDisplayElement.textContent = `₹${current_account.total_expenses}`;
        totalSavingsDisplayElement.textContent = `₹${current_account.initial_balance - current_account.total_expenses}`;
        updateMeters();
        transactionsBox.innerHTML = '<h2>Daily Transactions</h2>';
        if (current_account.transactions.length > 0) {
            current_account.transactions.slice().reverse().forEach(trans => {
                const type = trans.type === 'transfer' ? 'Transfer' : (trans.type === 'loan' ? 'Loan Approved' : 'Deposit');
                const sign = trans.amount > 0 ? '+' : '';
                const displayAmount = Math.abs(trans.amount);
                const transactionHtml = `<div class="transaction-item"><span>${type} - ${trans.purpose} (${new Date(trans.date).toLocaleDateString()})</span><span>${sign} ₹${displayAmount}</span></div>`;
                transactionsBox.insertAdjacentHTML('beforeend', transactionHtml);
            });
        } else {
            transactionsBox.insertAdjacentHTML('beforeend', '<p>No transactions yet.</p>');
        }
    }
}

loginButton.addEventListener('click', function (e) {
    e.preventDefault();
    const user_input_value = String(userIdInput.value);
    const pin_input_value = String(pinInput.value);

    if (current_account.user_ID === null || current_account.PIN_details === null) {
        alert("No account has been created yet. Please create an account first.");
        return;
    }
    if (user_input_value === current_account.user_ID && pin_input_value === String(current_account.PIN_details)) {
        alert("Congrats... You have successfully logged in to your Expense Tracker account!");
        userIdInput.value = '';
        pinInput.value = '';
        updateUI();
        start_timer();
        const dailyLimit = calculateAndDisplayDailyLimit();
        if (dailyLimit > 0) alert(`Your current daily spending limit is: ₹${dailyLimit}.`);
    } else {
        alert("Invalid User ID or PIN. Please try again.");
    }
});

const transfer_button = document.querySelector('.transfer-box button');
const transferRecipientIdInput = document.querySelector('.transfer-box input[placeholder="Recipient ID"]');
const transferPurposeInput = document.querySelector('.transfer-box input[placeholder="Purpose"]');
const transferAmountInput = document.querySelector('.transfer-box input[placeholder="Amount"]');

transfer_button.addEventListener('click', async function(e) {
    e.preventDefault();
    const proceed = await promptForTransactionValidity();
    if (!proceed) {
        alert("Transaction cancelled by user.");
        return;
    }
    const recipientId = transferRecipientIdInput.value;
    const purpose = transferPurposeInput.value;
    const amount = Number(transferAmountInput.value.trim());

    if (!recipientId || !purpose || amount <= 0) {
        alert("Please enter valid recipient, purpose, and a positive amount for transfer.");
        return;
    }
    if (!current_account.member_ids?.length) {
        alert("No members defined for transfer. Please create an account with members first.");
        return;
    }
    const isRecipientValid = current_account.member_ids.includes(recipientId);
    if (!isRecipientValid) {
        alert(`Recipient ID "${recipientId}" is not recognized as a valid member. Please check the ID.`);
        return;
    }
    if (current_account.balance < amount) {
        alert("Insufficient balance for this transfer.");
        return;
    }

    current_account.balance -= amount;
    current_account.total_expenses += amount;
    current_account.daily_spent += amount;
    current_account.transactions.push({
        type: 'transfer',
        amount: -amount,
        purpose: purpose,
        recipient: recipientId,
        date: new Date().toISOString(),
    });

    alert(`Successfully transferred ₹${amount.toLocaleString('en-IN')} to ${recipientId} for "${purpose}".`);
    updateUI();
    transferRecipientIdInput.value = '';
    transferPurposeInput.value = '';
    transferAmountInput.value = '';
});

const loan_button = document.querySelector('.loan-box button');
const loanUserIdInput = document.querySelector('.loan-box input[placeholder="Loan User ID"]');
const loanPurposeInput = document.querySelector('.loan-box input[placeholder="Purpose"]');
const loanAmountInput = document.querySelector('.loan-box input[placeholder="Amount to Request"]');

loan_button.addEventListener('click', async function(e) {
    e.preventDefault();
    const proceed = await promptForTransactionValidity();
    if (!proceed) {
        alert("Loan request cancelled by user.");
        return;
    }
    const requestedLoanUserId = loanUserIdInput.value.trim();
    const loanPurpose = loanPurposeInput.value.trim();
    const loanAmount = Number(loanAmountInput.value.trim());

    if (!requestedLoanUserId || !loanPurpose || isNaN(loanAmount) || loanAmount <= 0) {
        alert("Please enter a valid User ID, purpose, and a positive amount to request for loan.");
        return;
    }
    if (current_account.user_ID === null) {
        alert("Please log in to your account to request a loan.");
        return;
    }
    if (requestedLoanUserId !== current_account.user_ID) {
        alert(`The Loan User ID "${requestedLoanUserId}" does not match your logged-in User ID "${current_account.user_ID}". Please enter your own ID.`);
        return;
    }

    current_account.balance += loanAmount;
    current_account.transactions.push({
        type: 'loan',
        amount: loanAmount,
        purpose: loanPurpose,
        date: new Date().toISOString(),
    });

    alert(`Loan of ₹${loanAmount.toLocaleString('en-IN')} for "${loanPurpose}" has been successfully approved and added to your balance!`);
    updateUI();
    loanUserIdInput.value = '';
    loanPurposeInput.value = '';
    loanAmountInput.value = '';
});