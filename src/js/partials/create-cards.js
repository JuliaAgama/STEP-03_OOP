;(function() {

    const doctors = getDoctors();

    const createVisit = document.getElementById('header-btn');
        modalCard = document.getElementById('modal-card'),
        modalCardClose = document.getElementById('modal-card-close'),
        selectDoctor = document.getElementById('select-doctor'),
        inputComment = document.getElementById('input-comment'),
        inputCommon= document.querySelector('.input-box__common'),
        inputDate = document.getElementById('input-date'),
        submitModal = document.getElementById('submit-btn__modal');

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

    // Хелпер для поиск родительских елементов по Айди.
    function findAncestor (el, id) {
        while ((el = el.parentElement) && el.id !== id);
        return el;
    }

    // Минимальная доата приема = текущая дата
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
        const option = document.createElement('option');
        option.setAttribute('value', e.type);
        option.classList.add('select-doctor__option');
        option.innerText = e.type;

        selectDoctor.appendChild(option)

        // Поля к заполеннию
        const wrapper = document.createElement('div');
        wrapper.classList.add('input-box', 'input-box__special');
        wrapper.classList.add('input-box__special--hide');
        wrapper.setAttribute('id', `input-box__${e.type}`)

        e.fields.forEach(ev => {
            const input = document.createElement('input');
            input.classList.add('input-field');
            input.setAttribute('type', ev.type);
            input.setAttribute('placeholder', ev.name);

            wrapper.appendChild(input);
        })

        inputComment.before(wrapper);
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