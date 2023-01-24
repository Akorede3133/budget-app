let totalIncome = 0; 
let totalExpense = 0;
let incomeId = 0;
let expenseId = 0;
let incomeList = [];
let expenseList = [];
class DOMSelector {
    constructor() {
        this.incomeListContainer = document.querySelector('.budget-income-col');
        this.expenseListContainer = document.querySelector('.budget-expense-col');
        this.budgetTotal = document.querySelector('.budget-total');
        this.budgetIncomeAmount = document.querySelector('.budget-income-amount');
        this.budgetExpenseAmount = document.querySelector('.budget-expense-amount');
        this.budgetExpensePercent = document.querySelector('.budget-expense-percent');
        this.inputBox = document.querySelector('.input-box');
        this.valueInput = document.querySelector('.value-input');
        this.submitBtn = document.querySelector('.submit-container');
        this.dropDown = document.querySelector('.drop-down-container select');
        this.budgetDetail = document.querySelector('.budget-detail')
    }
    getInputValues() {
        this.submitBtn.addEventListener('click', ()=> {
            const dropDownValue = this.dropDown.value;
            const numberValue = this.valueInput.value;
            const descriptionValue = this.inputBox.value;
            if (numberValue) {
                if (dropDownValue === '+') {
                    let income = calculateValues.calculateTotalIncome(numberValue);
                    updateDOM.updateIncomeDOM(income);
                    this.getIncomeList(descriptionValue, numberValue);
                    Storage.setIncomeLocal(incomeList);
                }
                else {
                    let expense = calculateValues.calculateTotalExpense(numberValue);
                    updateDOM.updateExpenseDOM(expense);
                    updateDOM.updateExpenseDOMPercent();
                    this.getExpenseList(descriptionValue, numberValue);
                    Storage.setExpenseLocal(expenseList);
                    //console.log(CalculateValues.calculateExpensePercent());
                } 
                let netIncome = calculateValues.calculateNetIncome();
                domSelector.budgetTotal.textContent = `${netIncome.toLocaleString()}`;
            }
            this.inputBox.value = "";
        })
    }
    getIncomeList(descriptionValue, numberValue) {
        let incomeObj = {descriptionValue, numberValue};
        if (incomeList) {
            incomeId++;
        }
        incomeObj.id = incomeId;
        incomeList = [...incomeList, incomeObj];
        updateDOM.displayIncomeList(descriptionValue, numberValue, incomeId);
        console.log(incomeList);
    }
    getExpenseList(descriptionValue, numberValue) {
        let expenseObj = {descriptionValue, numberValue};
        let percent  = calculateValues.calculateExpensePercent(expenseObj.numberValue);
        expenseObj = {...expenseObj, percent};
        if (expenseList) {
            expenseId++;
        }
        expenseObj.id = expenseId;
        expenseList = [...expenseList, expenseObj];

        updateDOM.displayExpenseList(descriptionValue, numberValue, expenseId, percent);
        console.log(expenseList);
    }
}
class UpdateDOM {
    getNetIncome() {
        return calculateValues.calculateNetIncome();
    }
    updateIncomeDOM(value) {
        domSelector.budgetIncomeAmount.textContent = `${value.toLocaleString()}`;
        //console.log(value);
    }
    updateExpenseDOM(value) {
       domSelector.budgetExpenseAmount.textContent = `${value.toLocaleString()}`;
       //console.log(value);
    }
    updateExpenseDOMPercent() {
        //console.log(domSelector.budgetExpensePercent.textContent);
        let percent = calculateValues.calculateExpensePercent();
        domSelector.budgetExpensePercent.textContent = `${percent}%`;
        //console.log(domSelector.budgetExpensePercent.textContent);

    }
    displayIncomeList(descriptionValue, numberValue, id) {
        //incomeList.forEach(item => {
        //})
        let elem = ` <div class=" col-grp income-col-grp">
        <span class="col-grp-title">${descriptionValue}</span>
        <span class="col-grp-content">
            <span>${numberValue}</span>
            <span class="col-icon" data-id=${id}><i class="bi bi-x-circle"></i></span>
        </span>
    </div>`;
    domSelector.incomeListContainer.insertAdjacentHTML('beforeend', elem);
    icon.displayIcons();
    }
    displayExpenseList(descriptionValue, numberValue, id, percent) {
        //incomeList.forEach(item => {
        //})
        let elem =`<div class="col-grp expense-col-grp">
        <span class="col-grp-title">${descriptionValue}</span>
        <span class="col-grp-content">
            <span class="col-grp-price">${numberValue}</span>
            <span class="col-grp-percent">${percent}%</span>
            <span class="col-icon" data-id=${id}><i class="bi bi-x-circle"></i></span>
        </span>
    </div>`;
    domSelector.expenseListContainer.insertAdjacentHTML('beforeend', elem);
    icon.displayIcons();
    }
}
class IconFunctionality {
    displayIcons() {
        let incomeAmnt = 0;
        let expenseAmnt = 0;
        let icons = domSelector.budgetDetail.querySelectorAll('.col-icon');
        icons.forEach(icon => {
            icon.addEventListener('click', (e)=> {
                let parent = icon.parentElement.parentElement;
                let parentId = e.currentTarget.dataset.id;
                //console.log(parentId);
                if (parent.classList.contains('income-col-grp')) {
                   this.removeElemFromIncomeList(parent, parentId);
                    this.updateTotalIncome();
                }
                else {
                    this.removeElemFromExpenseList(parent, parentId);
                    this.updateTotalExpense();
                }
                this.updateBudgetTotal();
            })
        })
    }
    /*removeElemFromList(id, list) {
        list = list.filter(item=> {
            return item.id != id;
        })
        return list;
    }
    updateTotal(list, amount) {
        let sum = 0;
        if (list) {
            list.forEach(item=> {
                sum += +item.numberValue;
            })
        }
        amount = sum;
        return amount;
    }*/
    removeElemFromIncomeList(parent, id) {
        incomeList = incomeList.filter(item=> {
            return item.id != id;
        })
        parent.remove();
        Storage.setIncomeLocal(incomeList);
        //console.log(expenseList);
    }
    updateTotalIncome() {
        let sum = 0;
        if (incomeList) {
            incomeList.forEach(item=> {
                sum += +item.numberValue;
            })
        }
        totalIncome = sum;
        updateDOM.updateIncomeDOM(totalIncome);
    }
    removeElemFromExpenseList(parent, id) {
        expenseList = expenseList.filter(item=> {
            return item.id != id;
        })
        parent.remove();
        Storage.setExpenseLocal(expenseList);
        //console.log(expenseList);
    }
    updateTotalExpense() {
        let sum = 0;
        if (expenseList) {
            expenseList.forEach(item=> {
                sum += +item.numberValue;
            })
        }
        totalExpense = sum;
        updateDOM.updateExpenseDOM(totalExpense);
    }
    updateBudgetTotal() {
        let newNetTotal = totalIncome - totalExpense;
        domSelector.budgetTotal.textContent = newNetTotal.toFixed(2).toLocaleString();
    }
}
class CalculateValues {
    calculateTotalIncome(amount) {
        totalIncome += +amount;
        return totalIncome;
        //console.log(totalIncome);
    } 
    calculateTotalExpense(amount) {
        totalExpense += +amount;
        return totalExpense;
    }
    calculateNetIncome() {
        //console.log(totalIncome, totalExpense);
        return totalIncome - totalExpense;
    }
    calculateExpensePercent(numberValue) {
        return Math.ceil((numberValue / totalIncome) * 100);
    }
}
class Storage {
    static setIncomeLocal(list) {
        localStorage.setItem('income', JSON.stringify(list));
    }
    static setExpenseLocal(list) {
        localStorage.setItem('expense', JSON.stringify(list));
    }
    static getIncomeLocal() {
        let list = localStorage.getItem('income') ? JSON.parse(localStorage.getItem('income')) : [];
        list.forEach(item => {
            updateDOM.displayIncomeList(item.descriptionValue, item.numberValue, item.id);
            //console.log(item);
        })
    }
    static getExpenseLocal() {
        let list = localStorage.getItem('expense') ? JSON.parse(localStorage.getItem('expense')) : [];
        list.forEach(item => {
            updateDOM.displayExpenseList(item.descriptionValue, item.numberValue, item.id);
            //console.log(item);
        })
    }
}
const domSelector = new DOMSelector();
const calculateValues = new CalculateValues();
const updateDOM = new UpdateDOM();
const icon = new IconFunctionality();
const drValue = domSelector.getInputValues();
Storage.getIncomeLocal();
Storage.getExpenseLocal();