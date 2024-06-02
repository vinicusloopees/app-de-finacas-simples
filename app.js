// Variável para armazenar o nome do usuário atual
let currentUser = null;

// Função para salvar dados no localStorage por usuário
function saveToLocalStorage() {
    if (currentUser) {
        // Salva transações, metas e valor do orçamento no localStorage
        localStorage.setItem(`${currentUser}-transactions`, JSON.stringify(transactions));
        localStorage.setItem(`${currentUser}-goals`, JSON.stringify(goals));
        localStorage.setItem(`${currentUser}-budget`, JSON.stringify(budgetAmount));
    }
}

// Função para carregar dados do localStorage por usuário
function loadFromLocalStorage() {
    if (currentUser) {
        // Carrega transações, metas e valor do orçamento do localStorage
        transactions = JSON.parse(localStorage.getItem(`${currentUser}-transactions`)) || [];
        goals = JSON.parse(localStorage.getItem(`${currentUser}-goals`)) || [];
        budgetAmount = JSON.parse(localStorage.getItem(`${currentUser}-budget`)) || 0;

        // Adiciona transações e metas na interface do usuário e atualiza saldo
        transactions.forEach(addTransactionDOM);
        goals.forEach(addGoalDOM);
        updateBalance();
        updateBudget(budgetAmount); // Adiciona "R$" ao orçamento atual
    }
}

// Evento de escuta para o formulário de login
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Captura o nome do usuário e exibe o aplicativo principal
    currentUser = document.getElementById('username').value;

    if (currentUser) {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('app-container').style.display = 'block';
        loadFromLocalStorage();
    }
});

// Declaração inicial de variáveis
let transactions = [];
let goals = [];
let budgetAmount = 0;

// Evento de escuta para o formulário de transação
document.getElementById('transaction-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Captura os dados da transação, adiciona na lista e atualiza a interface
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    const transaction = {
        id: generateID(),
        description: description,
        amount: amount,
        type: type
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateBalance();
    saveToLocalStorage();
    document.getElementById('transaction-form').reset();
});

// Evento de escuta para o formulário de orçamento
document.getElementById('budget-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Captura o valor do orçamento e atualiza a interface
    budgetAmount = parseFloat(document.getElementById('budget-amount').value);
    updateBudget(budgetAmount); // Atualiza o orçamento com "R$"
    saveToLocalStorage();
});

// Evento de escuta para o formulário de meta
document.getElementById('goal-form').addEventListener('submit', function(e) {
    e.preventDefault();
    // Captura os dados da meta, adiciona na lista e atualiza a interface
    const description = document.getElementById('goal-description').value;
    const amount = parseFloat(document.getElementById('goal-amount').value);

    const goal = {
        id: generateID(),
        description: description,
        amount: amount
    };

    goals.push(goal);
    addGoalDOM(goal);
    saveToLocalStorage();
    document.getElementById('goal-form').reset();
});

// Evento de escuta para o botão de redefinição
document.getElementById('reset-button').addEventListener('click', function() {
    if (currentUser) {
        // Remove dados do localStorage, reseta variáveis e limpa a interface
        localStorage.removeItem(`${currentUser}-transactions`);
        localStorage.removeItem(`${currentUser}-goals`);
        localStorage.removeItem(`${currentUser}-budget`);
        transactions = [];
        goals = [];
        budgetAmount = 0;
        document.getElementById('transactions').innerHTML = '';
        document.getElementById('goals').innerHTML = '';
        document.getElementById('current-budget').textContent = "R$ 0,00"; // Resetar o orçamento com "R$"
        updateBalance();
    }
});

// Função para gerar um ID aleatório
function generateID() {
    return Math.floor(Math.random() * 1000000);
}

// Função para adicionar uma transação na interface do usuário
function addTransactionDOM(transaction) {
    const list = document.getElementById('transactions');
    const listItem = document.createElement('li');
    listItem.textContent = `${transaction.description}: ${formatCurrency(transaction.amount)}`;
    listItem.classList.add(transaction.type === 'income' ? 'income' : 'expense');
    list.appendChild(listItem);
}

// Função para adicionar uma meta na interface do usuário
function addGoalDOM(goal) {
    const goalsList = document.getElementById('goals');
    const listItem = document.createElement('li');
    listItem.textContent = `${goal.description}: ${formatCurrency(goal.amount)}`;
    goalsList.appendChild(listItem);
}

// Função para atualizar o saldo na interface do usuário
function updateBalance() {
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;

    document.getElementById('balance-amount').textContent = formatCurrency(balance);
    document.getElementById('income-amount').textContent = formatCurrency(income);
    document.getElementById('expense-amount').textContent = formatCurrency(expense);
}

// Função para atualizar o orçamento na interface do usuário com "R$"
function updateBudget(amount) {
    document.getElementById('current-budget').textContent = formatCurrency(amount);
}

// Função para formatar um valor numérico como moeda brasileira
function formatCurrency(amount) {
    return amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
