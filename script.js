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

document.querySelector('.balance-text em').textContent = `As of ${getTodayDateString()}`;

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


let totalDaysInput = Number(prompt("How many days would you like to track your expenses?"));
const savingsLabel = document.querySelector(".meter-label1");
const expensesLabel = document.querySelector(".meter-label2");
if (totalDaysInput === 28 || totalDaysInput === 30) {
    savingsLabel.textContent = "Monthly Savings";
    expensesLabel.textContent = "Monthly Expenses";
}
else if (totalDaysInput > 360) {
    savingsLabel.textContent = "Yearly Savings";
    expensesLabel.textContent = "Yearly Expenses";
}
else {
    savingsLabel.textContent = `${totalDaysInput} Days Savings`;
    expensesLabel.textContent = `${totalDaysInput} Days Expenses`;
}

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
    let trackingChoice;

    if (acc.Job_status.toLowerCase() === "yes") {
        trackingChoice = prompt(
            "How would you like to track your expenses?\n" +
            "1. Only Balance\n" +
            "2. Only Monthly Salary\n" +
            "3. Balance + Salary"
        );
    } else {
        trackingChoice = "1";
    }

    let baseAmount = 0;

    if (trackingChoice === "1") {
        baseAmount = initialBalanceInput;
    }
    else if (trackingChoice === "2") {
        baseAmount = Number(acc.Salary);
    }
    else if (trackingChoice === "3") {
        baseAmount = initialBalanceInput + Number(acc.Salary);
    }
    else {
        alert("Invalid choice. Defaulting to Balance.");
        baseAmount = initialBalanceInput;
    }

    acc.initial_balance = baseAmount;
    acc.balance = baseAmount;

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


document.addEventListener('mousemove', resetInactivity);
document.addEventListener('keydown', resetInactivity);
document.addEventListener('click', resetInactivity);


const timerElement = document.querySelector('.timer');
let timerInterval;
let timerDuration = 300;

let maxSessionTime = 7200;
let totalElapsedTime = 0;
let extensionSlots = [1500, 3000, 2700];
let extensionCount = 0;

let inactivityLimit = 30;
let inactivityTime = 0;
let isPaused = false;

function resetInactivity() {
    inactivityTime = 0;

    if (isPaused) {
        isPaused = false;
    }
}

function start_timer() {
    if (timerInterval) clearInterval(timerInterval);

    timerDuration = 300;
    let lastPromptTime = -1;

    timerInterval = setInterval(function () {

        inactivityTime++;

        if (inactivityTime >= inactivityLimit) {
            if (!isPaused) {
                isPaused = true;
                document.body.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                timerElement.textContent = "Paused due to inactivity";
            }
            return;
        }

        if (isPaused) {
            isPaused = false;
            inactivityTime = 0;
            alert("Application paused due to inactivity");
        }
        document.body.style.backgroundColor = "#e0f7fa";

        if (timerDuration > 0 && totalElapsedTime < maxSessionTime) {

            let hours = Math.trunc(timerDuration / 3600);
            let minutes = Math.trunc((timerDuration % 3600) / 60);
            let seconds = Math.trunc(timerDuration % 60);

            timerElement.textContent =
                `You will be logged out in: ${
                    hours < 10 ? '0' + hours : hours
                }:${
                    minutes < 10 ? '0' + minutes : minutes
                }:${
                    seconds < 10 ? '0' + seconds : seconds
                }`;

            if (
                timerDuration <= 60 &&
                timerDuration % 30 === 0 &&
                lastPromptTime !== timerDuration &&
                extensionCount < 3
            ) {
                lastPromptTime = timerDuration;

                let slotMinutes = extensionSlots[extensionCount] / 60;

                alert(
                    `Max session = 2 hours\n` +
                    `Extensions left: ${3 - extensionCount}\n` +
                    `Next: ${slotMinutes} minutes`
                );

                let extend = confirm("Extend session?");

                if (extend) {
                    let extraTime = extensionSlots[extensionCount];

                    if (totalElapsedTime + timerDuration + extraTime <= maxSessionTime) {
                        timerDuration += extraTime;
                        extensionCount++;
                    } else {
                        alert("Cannot exceed 2 hours total session.");
                    }
                }
            }

            timerDuration--;
            totalElapsedTime++;

        } else {
            timerElement.textContent = "Time is up! Logging out...";
            document.body.style.display = 'none';
            clearInterval(timerInterval);
            alert("Logged out due to session limit or inactivity.");
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
        dailyLimitDisplayElement.textContent = `₹${dailyLimit.toFixed(2)}`;
        return dailyLimit;
    }
    dailyLimitDisplayElement.textContent = `0.00`;
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

function getNameFromId(id) {
    if (!current_account.member_ids || !current_account.member_list) return id;
    const index = current_account.member_ids.indexOf(id);
    return index !== -1 ? current_account.member_list[index] : id;
}

let analyticsChoice1Active = false;
let analyticsChoice2Active = false; 
let latestClusterResult = null;     

function showAnalyticsChoiceBox() {
    document.getElementById('analyticsChoiceBox').style.display = 'block';
}

document.getElementById('choice1Btn').addEventListener('click', function () {
    analyticsChoice1Active = true;
    analyticsChoice2Active = false;
    document.getElementById('choice2AnalyticsBox').style.display = 'none';
    alert("Analysis will be shown automatically when your balance reaches ₹0.");
});

document.getElementById('choice2Btn').addEventListener('click', function () {
    analyticsChoice2Active = true;
    analyticsChoice1Active = false;
    document.getElementById('choice2AnalyticsBox').style.display = 'block';
     document.getElementById('scrollHintText').style.display = 'block';
    alert("Spending analytics will update after each transfer transaction.");
    const transferTransactions = current_account.transactions.filter(t => t.type === 'transfer');
    if (transferTransactions.length >= 2) {
        runAnalytics('choice2');
    }
});

function getTransferData() {
    return current_account.transactions
        .filter(t => t.type === 'transfer')
        .map(t => ({
            purpose: t.purpose, 
            amount: Math.abs(t.amount)
        }));
}

async function runAnalytics(mode) {
    const transferData = getTransferData();

    if (transferData.length < 2) {
        if (mode !== 'silent') {
            alert("Need at least 2 transfer transactions for clustering analysis.");
        }
        return;
    }

    try {
        const response = await fetch('https://expense-tracker-backend-ewar.onrender.com/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transactions: transferData })
        });

        if (!response.ok) {
            const err = await response.json();
            if (mode !== 'silent') alert("Analytics error: " + err.error);
            return;
        }

        const result = await response.json();
        latestClusterResult = result;

        if (mode === 'choice2') {
            drawScatterPlot(result, 'choice2');
        } else if (mode === 'choice1') {
            drawScatterPlot(result, 'choice1');
        }

    } catch (e) {
        if (mode !== 'silent') {
            alert("Could not connect to analytics server.\nMake sure Flask is running on port 5000.\nError: " + e.message);
        }
    }
}

function drawScatterPlot(result, mode) {
    const canvasId = mode === 'choice1' ? 'analyticsCanvas1' : 'analyticsCanvas2';
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    const { encoded_purposes, amounts, labels, centroids, elbow_k, label_mapping } = result;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const colors = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c','#e67e22','#34495e','#e91e63','#00bcd4'];

    const pad = { top: 40, right: 100, bottom: 60, left: 80 };
    const plotW = canvas.width - pad.left - pad.right;
    const plotH = canvas.height - pad.top - pad.bottom;

    const maxAmount = Math.max(...amounts);
    const maxEncoded = Math.max(...encoded_purposes);

    const scaleX = val => pad.left + (val / (maxAmount || 1)) * plotW;
    const scaleY = val => pad.top + plotH - (val / (maxEncoded || 1)) * plotH;

    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad.left, pad.top);
    ctx.lineTo(pad.left, pad.top + plotH);
    ctx.lineTo(pad.left + plotW, pad.top + plotH);
    ctx.stroke();

    // Title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`K-Means Spending Clusters (k=${elbow_k})`, pad.left + plotW / 2, 20);

    ctx.font = '13px Arial';
    ctx.fillText('Amount (₹)', pad.left + plotW / 2, canvas.height - 10);

    ctx.save();
    ctx.translate(15, pad.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Purpose (Encoded)', 0, 0);
    ctx.restore();
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    Object.entries(label_mapping).forEach(([enc, name]) => {
        const y = scaleY(parseInt(enc));
        ctx.fillStyle = '#555';
        ctx.fillText(name, pad.left - 5, y + 4);
        ctx.strokeStyle = '#eee';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(pad.left, y);
        ctx.lineTo(pad.left + plotW, y);
        ctx.stroke();
    });

    ctx.textAlign = 'center';
    const xTicks = 5;
    for (let i = 0; i <= xTicks; i++) {
        const val = (maxAmount / xTicks) * i;
        const x = scaleX(val);
        ctx.fillStyle = '#555';
        ctx.font = '10px Arial';
        ctx.fillText(`₹${Math.round(val)}`, x, pad.top + plotH + 20);
        ctx.strokeStyle = '#eee';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, pad.top);
        ctx.lineTo(x, pad.top + plotH);
        ctx.stroke();
    }

    encoded_purposes.forEach((enc, i) => {
        const x = scaleX(amounts[i]);
        const y = scaleY(enc);
        const cluster = labels[i];
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = colors[cluster % colors.length];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();
    });

    centroids.forEach(([encCentroid, amtCentroid]) => {
        const x = scaleX(amtCentroid);
        const y = scaleY(encCentroid);
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
    });

    ctx.font = '11px Arial';
    ctx.textAlign = 'left';
    for (let i = 0; i < elbow_k; i++) {
        const ly = pad.top + i * 20;
        ctx.fillStyle = colors[i % colors.length];
        ctx.fillRect(pad.left + plotW + 10, ly, 12, 12);
        ctx.fillStyle = '#333';
        ctx.fillText(`Cluster ${i + 1}`, pad.left + plotW + 26, ly + 10);
    }
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(pad.left + plotW + 16, pad.top + elbow_k * 20 + 6, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#333';
    ctx.fillText('Centroid', pad.left + plotW + 26, pad.top + elbow_k * 20 + 10);
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

        transactionsBox.innerHTML = `
            <h2>Daily Transactions</h2>
            <table style="width:100%; border-collapse:collapse; font-size:13px;">
                <tr style="background-color:#00796b; color:white;">
                    <th style="padding:8px; border:1px solid #ccc;">S.No</th>
                    <th style="padding:8px; border:1px solid #ccc;">From</th>
                    <th style="padding:8px; border:1px solid #ccc;">To</th>
                    <th style="padding:8px; border:1px solid #ccc;">Purpose</th>
                    <th style="padding:8px; border:1px solid #ccc;">Time</th>
                    <th style="padding:8px; border:1px solid #ccc;">Amount</th>
                </tr>
            </table>
        `;

        if (current_account.transactions.length > 0) {
            const table = transactionsBox.querySelector('table');
            current_account.transactions.slice().reverse().forEach((trans, index) => {
                const type = trans.type === 'transfer' ? 'Transfer' : (trans.type === 'loan' ? 'Loan' : 'Deposit');
                const fromAccount = current_account.Name;
                const toAccount = trans.type === 'transfer' ? getNameFromId(trans.recipient) : 'Self';
                const sign = trans.amount > 0 ? '+' : '-';
                const displayAmount = Math.abs(trans.amount);
                const rowBg = index % 2 === 0 ? '#f9f9f9' : '#ffffff';
                const transDate = new Date(trans.date);
                const formattedDate = transDate.toLocaleDateString();
                const formattedTime = transDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                table.insertAdjacentHTML('beforeend', `
                    <tr style="background-color:${rowBg};">
                        <td style="padding:8px; border:1px solid #ccc; text-align:center;">${index + 1}</td>
                        <td style="padding:8px; border:1px solid #ccc; text-align:center;">${fromAccount}</td>
                        <td style="padding:8px; border:1px solid #ccc; text-align:center;">${toAccount}</td>
                        <td style="padding:8px; border:1px solid #ccc; text-align:center;">${trans.purpose}</td>
                        <td style="padding:8px; border:1px solid #ccc; text-align:center;">${formattedDate} ${formattedTime}</td>
                        <td style="padding:8px; border:1px solid #ccc; text-align:center; color:${trans.amount > 0 ? 'green' : 'red'}; font-weight:bold;">${sign}₹${displayAmount}</td>
                    </tr>
                `);
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
        showAnalyticsChoiceBox();
        const dailyLimit = calculateAndDisplayDailyLimit();
        if (dailyLimit > 0) alert(`Your current daily spending limit is: ₹${dailyLimit}.`);
    } else {
        alert("Invalid User ID or PIN. Please try again.");
    }
});

const transfer_button = document.querySelector('.transfer-box button');
const transferRecipientIdInput = document.querySelector('.transfer-box input[placeholder="Recipient User ID"]');
const transferPurposeInput = document.querySelector('.transfer-box input[placeholder="Purpose"]');
const transferAmountInput = document.querySelector('.transfer-box input[placeholder="Amount to Transfer"]');

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

    if (analyticsChoice1Active) {
        await runAnalytics('silent');
        if (current_account.balance <= 0 && latestClusterResult) {
            transactionsBox.style.display = 'none';
            document.getElementById('analyticsCanvas1').style.display = 'block';
            drawScatterPlot(latestClusterResult, 'choice1');
        }
    }

    if (analyticsChoice2Active) {
        await runAnalytics('choice2');
    }
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
