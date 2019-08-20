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

})();