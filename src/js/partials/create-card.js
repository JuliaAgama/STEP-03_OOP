;(function () {

    // Общий клсс
    class Visit {
        constructor( reason, date, name ) {
            this.reason = reason;
            this.date = date;
            this.name = name;
        }

        setStorage() {
            const currentCards = window.localStorage.getItem('ClientCard');
            const allCards = currentCards ? JSON.parse(currentCards) : [];
    
            allCards.push( {...this} );
            window.localStorage.setItem('ClientCard', JSON.stringify(allCards));
        }

        createCard( cardsContainer, cardInput = this ) {
            Visit.indexCard++;

            let { name, type, reason, ...other} = cardInput;
            let str = '';
            
            for (let i in other) {
                const nameVal = document.querySelector(`[data-id=${i}]`).getAttribute('data-name');
                str += `<p>${nameVal}: <span>${other[i]}</span></p>`;
            }

            const wrapperDiv = document.createElement('div');
            const cartGutter = Visit.indexCard * DEFAULT_GUTTER + DEFAULT_GUTTER;
            wrapperDiv.innerHTML = `
            <div class="record-card" 
                            draggable="true" 
                            id="record-card_${Visit.indexCard}" 
                            data-index="${Visit.indexCard}" 
                            style="left: ${cartGutter}px; 
                            top: ${cartGutter}px; 
                            z-index: ${Visit.indexCard}"
                        >
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
                    <p class="record-card__more-less--more" id="show-more-card">show more</p>
                </div>
            </div>`;
            
            let card = cardsContainer.appendChild(wrapperDiv.firstElementChild);
            let offsetX;
            let offsetY;

            // Удаление карточки
            card
                .querySelector('.fa-trash-alt')
                .addEventListener('click', function() {
                    card.parentNode.removeChild(card);
                });

                
            card.addEventListener('mousedown', function (e) {
                const element = e.target;
                if (element) {
                    element.style.zIndex = '999';
                }
            });

            card.addEventListener('mouseup', function (e) {
                const element = e.target;
                if (element) {
                    element.style.zIndex = element.getAttribute('data-index');
                }
            });

            card.addEventListener('dragstart', function (e) {
                const element = e.target;
                if (element) {
                    offsetX = e.offsetX;
                    offsetY = e.offsetY;
                }
            });

            card.addEventListener('drag', function (e) {
                if ((e.pageY < cardsContainer.offsetTop + offsetY) || (e.pageX < cardsContainer.offsetLeft + offsetX)) {
                    card.style.borderColor = "red";
                } else {
                    card.style.borderColor = "#3fafbc";
                }
            });

            card.addEventListener('dragend', function (e) {
                card.style.borderColor = "#3fafbc";
                if ((e.pageY < cardsContainer.offsetTop + offsetY) || (e.pageX < cardsContainer.offsetLeft + offsetX)) {
                    console.log('can not drag there');
                } else {
                    this.style.top = (e.pageY - cardsContainer.offsetTop - offsetY) + 'px';
                    this.style.left = (e.pageX - cardsContainer.offsetLeft - offsetX) + 'px';
                }
            });

            // Показ и скрытие доп полей
            const showMore = card.querySelector("#show-more-card");
            const showMoreSection = card.querySelector(`#record-card__${type}`);
            showMore.addEventListener('click', function (e) {
                let curr = this.innerText.toLowerCase();
                this.innerText = `${curr === 'show more' ? 'show less' : 'show more' }`;
                showMoreSection.classList.toggle('hidden');
            });
        }
    }

    // Порядковый номер карточки
    Visit.indexCard = 0;

    class Cardiologist extends Visit {
        constructor({reason, date, name, ...other}) {
            super(reason, date, name);

            for (let i in other) {
                this[i] = other[i];
            }
        }
    }

    class Dentist extends Visit {
        constructor({reason, date, name, ...other}) {
            super(reason, date, name);

            for (let i in other) {
                this[i] = other[i];
            }
        }
    }

    class Therapist extends Visit {
        constructor({reason, date, name, ...other}) {
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
        cardsContainer = document.getElementById('cards-container'),
        modalCardClose = document.getElementById('modal-card-close'),
        selectDoctor = document.getElementById('select-doctor'),
        inputComment = document.getElementById('input-comment'),
        inputCommon = document.querySelector('.input-box__common'),
        submitModal = document.getElementById('submit-btn__modal'),
        DEFAULT_GUTTER = 20;

    // Открытые модалки
    createVisit.addEventListener('click', function (e) {
        e.stopPropagation();
        resetInput(modalCard.getAttribute('id'));
        modalCard.classList.remove('modal-card--hide');
    });

    // Закрытие модалки по кнопке
    modalCardClose.addEventListener('click', function (e) {
        e.stopPropagation();
        modalCard.classList.add('modal-card--hide');
    });

    // Закрытие модалки по клику в не окна
    document.body.addEventListener('click', function (e) {
        const modalCardHide = document.querySelector('.modal-card--hide');

        if (modalCardHide === null) {
            if ((findAncestor(e.target, 'modal-card')) === null) {
                modalCard.classList.add('modal-card--hide');
            }
        }
    });

    // Хелпер для поиск родительских елементов по айди.
    function findAncestor(el, id) {
        while ((el = el.parentElement) && el.id !== id) ;
        return el;
    }

    // Наполнение селекта докторов и полей с БД
    doctors.forEach(e => {

        // Селекты
        const wrapperOption = document.createElement('div');
        wrapperOption.innerHTML = `<option 
                                        value="${e.type}" 
                                        data-id="type" 
                                        class="select-doctor__option">${e.type}
                                    </option>`;
        selectDoctor.appendChild(wrapperOption.firstElementChild)

        // Поля к заполеннию
        const wrapperDiv = document.createElement('div');
        wrapperDiv.innerHTML = `<div 
                                    class="input-box input-box__special input-box__special--hide"
                                    id="input-box__${e.type}"
                                >`;

        e.fields.forEach(ev => {
            const wrapperInput = document.createElement('div');
            wrapperInput.innerHTML = `<input 
                                        class="input-field" 
                                        type="${ev.type}" 
                                        placeholder="${ev.type !== 'date' ? ev.name : '' }" 
                                        data-name="${ev.name}"
                                        data-id="${ev.id}" 
                                        ${ev.required ? 'data-required="true"' : null}
                                    >`;
            wrapperDiv.firstElementChild.appendChild(wrapperInput.firstElementChild);
        });

        inputComment.before(wrapperDiv.children[0]);
    });

    // Выбор врача и отображение полей
    selectDoctor.addEventListener('change', function (e) {
        inputCommon.classList.remove('input-box__common--hide');
        inputComment.classList.remove('input-comment--hide');
        submitModal.classList.remove('submit-btn--hide');

        const lastSelect = document.querySelector('.input-box__special:not(.input-box__special--hide)');
        if (lastSelect) lastSelect.classList.add('input-box__special--hide');

        document.getElementById(`input-box__${this.value}`).classList.remove('input-box__special--hide');
    });

    // Отображение сохраненных карточек
    ;(function () {
        const currentCards = window.localStorage.getItem('ClientCard');
        if (currentCards) {
            document.querySelector('.cards-container__empty').remove('cards-container__empty--hide');
            const arr = JSON.parse(currentCards);

            arr.forEach(e => Visit.prototype.createCard(cardsContainer, e));
        }
    })();

    // Проверка обязательно заполенных полей
    function checkRequired(idEl) {
        let resCheck = true;
        const arrCheck = document.querySelectorAll(`#${idEl} [data-required="true"]`);
    
        arrCheck.forEach(e => {
            e.classList.remove('err-field');

            if (e.parentElement.classList.value.indexOf('hide') < 0) {
                if (e.value.length === 0) {
                    resCheck = false;
                    e.classList.add('err-field');
                }
            }
        })

        return resCheck;
    }

    // Получение всех обязательно заполненных полей
    function getAllInputForm(idEl) {
        resObj = {};
        const arrInp = document.querySelectorAll(`#${idEl} [data-required="true"]`);
    
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
        
        return resObj;
    }

    // Стирание всех инпутов
    function resetInput(idEl) {
        const arrInp = document.querySelectorAll(`#${idEl} .input-field`);
        
        arrInp.forEach(e => {
            e.value = "";
            e.classList.remove('err-field');
        });
    }

    // Сабмит формы карточки
    submitModal.addEventListener('click', function (e) {
        e.preventDefault();

        const cardsContainer = document.getElementById('cards-container');
        const idForm = this.parentElement.getAttribute('id');

        if (checkRequired(idForm)) {
            
            const type = selectDoctor.value;
            const comment = document.getElementById('input-comment');

            let allInp = getAllInputForm(idForm);
            allInp[comment.getAttribute('data-id')] = comment.value;

            const infoHasCards = document.querySelector('.cards-container__empty');
            infoHasCards ? infoHasCards.remove('cards-container__empty--hide') : null;
            
            let UserCard = {};
            if (type === 'cardiologist') {
                UserCard = new Cardiologist(allInp);

            } else if (type === 'dentist') {
                UserCard = new Dentist(allInp);

            } else if (type === 'therapist') {
                UserCard = new Therapist(allInp);
            }

            UserCard.setStorage();
            UserCard.createCard(cardsContainer);

            modalCard.classList.add('modal-card--hide');
        }
    })
}

)();