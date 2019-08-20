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
