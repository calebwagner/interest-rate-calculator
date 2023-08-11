let loanCounter = 1;

function addLoanField() {
    const loanInputsContainer = document.getElementById('loanInputsContainer');
    const newLoanInput = document.createElement('div');
    newLoanInput.classList.add('loanInput');
    newLoanInput.innerHTML = `
        Principal: <input type="number" class="principal">
        Interest Rate: <input type="number" class="interest" step="0.01">
        Months: <input type="number" class="months">
        Interest: <span class="individualInterest">$0.00</span>
        <button class="removeBtn">Remove</button>
    `;
    loanInputsContainer.appendChild(newLoanInput);

    const principalElem = newLoanInput.querySelector('.principal');
    const interestElem = newLoanInput.querySelector('.interest');
    const monthsElem = newLoanInput.querySelector('.months');
    const displayElem = newLoanInput.querySelector('.individualInterest');

    const loanID = `loan_${loanCounter++}`;
    principalElem.dataset.loanId = loanID;
    interestElem.dataset.loanId = loanID;
    monthsElem.dataset.loanId = loanID;
    displayElem.dataset.loanId = loanID;

    const removeBtn = newLoanInput.querySelector('.removeBtn');
    removeBtn.addEventListener('click', () => {
        newLoanInput.classList.add('closing');
        setTimeout(() => {
            loanInputsContainer.removeChild(newLoanInput);
        }, 500);
    });
}


function calculateTotalInterest() {
    const principals = document.querySelectorAll('.principal');
    const interests = document.querySelectorAll('.interest');
    const monthsInputs = document.querySelectorAll('.months');
    const individualInterests = document.querySelectorAll('.individualInterest');

    let totalInterest = 0;

    for (let i = 0; i < principals.length; i++) {
        let principal = parseFloat(principals[i].value);
        const annualInterestRate = parseFloat(interests[i].value);
        const months = parseInt(monthsInputs[i].value);

        const monthlyRate = annualInterestRate / 12;
        const mPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);

        let loanInterest = 0;

        for (let j = 0; j < months; j++) {
            const monthlyInterest = principal * monthlyRate;
            principal -= (mPayment - monthlyInterest);
            totalInterest += monthlyInterest;
            loanInterest += monthlyInterest;
        }

        individualInterests[i].innerText = `$${loanInterest.toFixed(2)}`;
    }

    document.getElementById('result').innerText = totalInterest.toFixed(2);
}

function calculateSingleLoanInterest(principalElem, interestElem, monthsElem) {
    if (!principalElem || !interestElem || !monthsElem) {
      console.log("exiting calculateSingleLoanInterest function b/c not all values present")
        return;
    }
    let principal = parseFloat(principalElem.value);
    let annualInterestRate = parseFloat(interestElem.value);
    let months = parseInt(monthsElem.value);


    let monthlyRate = annualInterestRate / 12;
    let mPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);

    let loanInterest = 0;
    for (let j = 0; j < months; j++) {
        let monthlyInterest = principal * monthlyRate;
        principal -= (mPayment - monthlyInterest);
        loanInterest += monthlyInterest;
    }

        const loanID = principalElem.dataset.loanId;
    const displayElem = document.querySelector(`[data-loan-id="${loanID}"].individualInterest`);
    if (displayElem) {
        displayElem.innerText = `$${loanInterest.toFixed(2)}`;
    }
}

function inputChanged(principalElem, interestElem, monthsElem, displayElem) {
    if (principalElem.value && interestElem.value && monthsElem.value) {
        calculateSingleLoanInterest(principalElem, interestElem, monthsElem, displayElem);
    }
}

document.body.addEventListener('input', function(event) {
    const target = event.target;

    if (target.classList.contains('principal') || target.classList.contains('interest') || target.classList.contains('months')) {
        const container = target.closest('.loanInput');
        if (!container) return;

        const principalElem = container.querySelector('.principal');
        const interestElem = container.querySelector('.interest');
        const monthsElem = container.querySelector('.months');

        calculateSingleLoanInterest(principalElem, interestElem, monthsElem);
    }
});



