const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const type = document.getElementById("type");
// const dummyTransactions = [
//   { id: 1, text: 'Salary', amount: 30000 },
//   { id: 2, text: 'Flower', amount: -200 },
//   { id: 3, text: 'Book', amount: -300 },
//   { id: 4, text: 'Camera', amount: -1500 }
// ];

const localStorageTransactions = JSON.parse(
    localStorage.getItem("transactions"),
);

let transactions =
    localStorage.getItem("transactions") !== null
        ? localStorageTransactions
        : [];

// Generate random ID
function generateID() {
    return Math.floor(Math.random() * 100000000);
}

// Add transactions to DOM list
function addTransactionDOM(transaction) {
    // Get sign
    const sign = transaction.type === "Expense" ? "-" : "+";

    const item = document.createElement("li");

    // Add class based on value
    item.classList.add(transaction.type === "Expense" ? "minus" : "plus");

    item.innerHTML = `
      ${transaction.text} <span>${sign}${Math.abs(
        transaction.amount,
    )}</span> <button class="delete-btn" onclick="removeTransaction(${
        transaction.id
    })">x</button>
    `;

    list.appendChild(item);
}

// Add transaction
function addTransaction(e) {
    e.preventDefault();

    if (text.value.trim() === "" || amount.value.trim() === "") {
        alert("Please fill all the Fields");
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount:
                type.value === "Expense" ? -amount.value : Number(amount.value),
            type: type.value,
        };

        transactions.push(transaction);

        addTransactionDOM(transaction);

        updateValues();

        updateLocalStorage();

        text.value = "Salary";
        amount.value = "";
        type.value = "Income";

        // Scroll to the top of the page
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }
}

// Update the balance, income and expense
function updateValues() {
    const amounts = transactions.map((transaction) => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    const income = amounts
        .filter((item) => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const expense = (
        amounts
            .filter((item) => item < 0)
            .reduce((acc, item) => (acc += item), 0) * -1
    ).toFixed(2);

    balance.innerText = `₹${total}`;
    money_plus.innerText = `₹${income}`;
    money_minus.innerText = `₹${expense}`;
}

// Remove transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter((transaction) => transaction.id !== id);

    updateLocalStorage();

    init();
}

// Update local storage transactions
function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Clear All Transactions
function clearAllTransaction() {
    transactions = [];
    updateLocalStorage();
    location.reload();

    init();
}

// Init app
function init() {
    list.innerHTML = "";

    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();

form.addEventListener("submit", addTransaction);
