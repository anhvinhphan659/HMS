function getCurrentDay() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    today = yyyy + '-' + mm + '-' + dd;
    return today
}

function nextDayDate(checkin) {
    // get today's date then add one
    var nextDay = new Date(checkin);
    nextDay.setDate(nextDay.getDate() + 1);

    var month = nextDay.getMonth() + 1;
    var day = nextDay.getDate();
    var year = nextDay.getFullYear();

    if (month < 10) { month = "0" + month } 
    if (day < 10) { day = "0" + day }

    return `${year}-${month}-${day}`;
}


const btnFind = document.querySelector('.btn-find')
const inputCheckIn = document.querySelector('#checkin')
const inputCheckOut = document.querySelector('#checkout')
btnFind.disabled = true
inputCheckIn.setAttribute('min', getCurrentDay())

inputCheckIn.addEventListener('change', e => {
    inputCheckOut.value = ''
    const minCheckoutDate = nextDayDate(e.target.value)
    inputCheckOut.setAttribute('min', e.target.value)
})

inputCheckOut.addEventListener('change', e => {
    btnFind.disabled = inputCheckIn.value >  e.target.value 
})
