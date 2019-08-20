;(function() {

    // Общий клсс
    class Visit {
        constructor(reason, date, name) {
            this.reason = reason;
            this.date = date;
            this.name = name;
        }
    }

    class Cardiologist extends Visit {
        constructor( { reason, date, name, ...other }){
            super(reason, date, name);

            for (let i in other) {
                this[i] = other[i];
            }
        }
    }
    
    class Dentist extends Visit {
        constructor( { reason, date, name, ...other }){
            super(reason, date, name);

            for (let i in other) {
                this[i] = other[i];
            }
        }
    }
    
    class Therapist extends Visit {
        constructor( { reason, date, name, ...other }){
            super(reason, date, name);

            for (let i in other) {
                this[i] = other[i];
            }
        }
    }

    // Получение списка докторов с их полями с БД
    const doctors = getDoctors();
    
    const createVisit = document.getElementById('header-btn'),
          modalCard = document.getElementById('modal-card'),
          modalCardClose = document.getElementById('modal-card-close'),
          selectDoctor = document.getElementById('select-doctor'),
          inputComment = document.getElementById('input-comment'),
          inputCommon= document.querySelector('.input-box__common'),
          inputDate = document.getElementById('input-date'),
          submitModal = document.getElementById('submit-btn__modal'),
          cardsContainer = document.getElementById('cards-container');

    // Открытые модалки
    createVisit.addEventListener('click', function(e) {
        e.stopPropagation();
        modalCard.classList.remove('modal-card--hide');
    })

    // Закрытие модалки по кнопке
    modalCardClose.addEventListener('click', function(e) {
        e.stopPropagation();
        modalCard.classList.add('modal-card--hide');
    })

    // Закрытие модалки по клику в не окна
    document.body.addEventListener('click', function(e) {
        const modalCardHide = document.querySelector('.modal-card--hide');
        
        if (modalCardHide === null) {
            if((findAncestor(e.target, 'modal-card')) === null) {
                modalCard.classList.add('modal-card--hide');
            }
        }
    })

    // Хелпер для поиск родительских елементов по айди.
    function findAncestor (el, id) {
        while ((el = el.parentElement) && el.id !== id);
        return el;
    }

    // Минимальная дата приема = текущая дата
    function setMinDate(currDate, el) {
        let year = currDate.getFullYear(),
            month = (currDate.getMonth() +1 ) > 9 ? (currDate.getMonth() +1 ) : '0' + (currDate.getMonth() +1 ),
            date = currDate.getDate();
        el.setAttribute('min', `${year}-${month}-${date}`);
    }

    setMinDate(new Date(), inputDate);


    // Наполнение селекта докторов и полей с БД
    doctors.forEach(e => {

        // Селекты
        const wrapperOption = document.createElement('div');
        wrapperOption.innerHTML = `<option value="${e.type}" data-id="type" class="select-doctor__option">${e.type}</option>`;
        selectDoctor.appendChild(wrapperOption.firstElementChild)

        // Поля к заполеннию
        const wrapperDiv = document.createElement('div');
        wrapperDiv.innerHTML = `<div class="input-box input-box__special input-box__special--hide" id="input-box__${e.type}">`;

        e.fields.forEach(ev => {
            const wrapperInput = document.createElement('div');
            wrapperInput.innerHTML = `<input class="input-field" type="${ev.type}" placeholder="${ev.name}" data-id="${ev.id}" required="">`;
            wrapperDiv.firstElementChild.appendChild(wrapperInput.firstElementChild);
        })

        inputComment.before(wrapperDiv.children[0]);
    })

    // Выбор врача и отображение полей
    selectDoctor.addEventListener('change', function(e) {
        inputCommon.classList.remove('input-box__common--hide');
        inputComment.classList.remove('input-comment--hide');
        submitModal.classList.remove('submit-btn--hide');

        const lastSelect =  document.querySelector('.input-box__special:not(.input-box__special--hide)');
        if (lastSelect) lastSelect.classList.add('input-box__special--hide');
        
        document.getElementById(`input-box__${this.value}`).classList.remove('input-box__special--hide');
    })

    // Создание карточки
    function createCards () {
        let lastIndexCards = 0;

        return function({ name, type, reason, ...other }) {
            let index = ++lastIndexCards;
            
            let str = '';
            for(let i in other) {
                const nameVal = document.querySelector(`[data-id=${i}]`).getAttribute('placeholder');
                str += `<p>${nameVal}: <span>${other[i]}</span></p>`;
            }

            const wrapperDiv = document.createElement('div');
            wrapperDiv.innerHTML = `
                <div class="record-card" id="record-card_${index}" data-index="${index}">
                <div class="close-btn record-card__close">
                    <i class="fas fa-trash-alt"></i>
                </div>

                <div class="record-card__main-text">
                    <p id="patient-name">${name}</p>
                    <p id="doctor-selected">${type}</p>
                </div>

                <div class="record-card__extended-text">
                    <p id="reason">Problem: <span>${reason}</span></p>

                    <div class="record-card__special hidden" id=record-card__${type}>
                     ${str}
                    </div>
                </div>
                    
                <div class="record-card__more-less">
                    <p class="record-card__more-less--more">show more</p>
                    <p class="record-card__more-less--less hidden">show less</p>
                </div>
                </div>
            `

            cardsContainer.appendChild(wrapperDiv.firstElementChild);
        }
    }
    const createCard = createCards();

    // Отображение сохраненных карточек
    ;(function() {
        const currentCards = window.localStorage.getItem('ClientCard');
        if (currentCards) {
            document.querySelector('.cards-container__empty').remove('cards-container__empty--hide');
            
            const arr = JSON.parse(currentCards);
            arr.forEach(e => createCard(e));
        }
    })();

    // Проверка заполенніх полей
    function checkRequired (idEl) {
        let resCheck = true;
        const arrCheck = document.querySelectorAll(`#${idEl} [required]`);
    
        arrCheck.forEach(e => {
            if (e.parentElement.classList.value.indexOf('hide') < 0) {
                if (e.value.length === 0) {
                    resCheck = false;
                }
            }
        })

        return resCheck
    }

    // Получение всех обязательно заполненных полей
    function getAllInputForm (idEl) {
        resObj = {};
        const arrInp = document.querySelectorAll(`#${idEl} [required]`);
    
        arrInp.forEach(e => {
            if (e.parentElement.classList.value.indexOf('hide') < 0) {
                if (e.tagName === 'SELECT') {
                    let el = e.options[e.options.selectedIndex];
                    resObj[el.getAttribute('data-id')] = el.value;
                } else {
                    resObj[e.getAttribute('data-id')] = e.value;
                }
            }
        })

        return resObj
    }

})();
function getDoctors (){
    return [
        {
            type: "cardiologist",
            fields: [
                {
                    name: "Normal pressure",
                    type: "text",
                    id: "pressure"
                },
                {
                    name: "Body mass index",
                    type: "text",
                    id: "massIndex"
                },
                {
                    name: "Past diseases of the cardiovascular system",
                    type: "text",
                    id: "pastDiseases"
                },
                {
                    name: "Age",
                    type: "text",
                    id: "age"
                }
            ]
        },
        {
            type: "dentist",
            fields: [
                {
                    name: "Normal pressure",
                    type: "text",
                    id: "pressure"
                },
                {
                    name: "Date last visited",
                    type: "date",
                    id: "lastVisited"
                }
            ]
        },
        {
            type: "therapist",
            fields: [
                {
                    name: "Normal pressure",
                    type: "text",
                    id: "pressure"
                },
                {
                    name: "Age",
                    type: "text",
                    id: "age"
                }
            ]
        }
    ];
}
;
/********** FOOTER **********/

// При клике на лого в футере - плавно прокручивать страницу вверх.

document.getElementById('footer-logo').addEventListener('click', scrollToTop);

function scrollToTop () {
    if (window.scrollY!=0) {
        setTimeout(function() {
            window.scrollTo(0 , window.scrollY - 30);
            scrollToTop();
        }, 100);
    }
}
