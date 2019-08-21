;(function () {

        // Общий клсс
        class Visit {
            constructor(reason, date, name) {
                this.reason = reason;
                this.date = date;
                this.name = name;
            }
        }

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
            modalCardClose = document.getElementById('modal-card-close'),
            selectDoctor = document.getElementById('select-doctor'),
            inputComment = document.getElementById('input-comment'),
            inputCommon = document.querySelector('.input-box__common'),
            inputDate = document.getElementById('input-date'),
            submitModal = document.getElementById('submit-btn__modal'),
            cardsContainer = document.getElementById('cards-container'),
            DEFAULT_GUTTER = 20;

        // Открытые модалки
        createVisit.addEventListener('click', function (e) {
            e.stopPropagation();
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

        // Минимальная дата приема = текущая дата
        function setMinDate(currDate, el) {
            let year = currDate.getFullYear(),
                month = (currDate.getMonth() + 1) > 9 ? (currDate.getMonth() + 1) : '0' + (currDate.getMonth() + 1),
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

        // Создание карточки
        function createCards() {
            console.log('create cards');
            let lastIndexCards = 0;

            return function ({name, type, reason, ...other}) {
                let index = ++lastIndexCards;

                let str = '';
                for (let i in other) {
                    const nameVal = document.querySelector(`[data-id=${i}]`).getAttribute('placeholder');
                    str += `<p>${nameVal}: <span>${other[i]}</span></p>`;
                }

                const wrapperDiv = document.createElement('div');
                const cartGutter = index * DEFAULT_GUTTER + DEFAULT_GUTTER;
                wrapperDiv.innerHTML = `
                <div class="record-card" draggable="true" id="record-card_${index}" data-index="${index}" style="left: ${cartGutter}px; top: ${cartGutter}px; z-index: ${index}">
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
                </div>`;

                let card = cardsContainer.appendChild(wrapperDiv.firstElementChild);

                card
                    .querySelector('.fa-trash-alt')
                    .addEventListener('click', function() {
                        recordCard.parentNode.removeChild(recordCard);
                    });


                let recordCard = document.getElementById(`record-card_${index}`);
                let dragArea = document.getElementById('cards-container');
                let offsetX;
                let offsetY;

                recordCard.addEventListener('mousedown', function (e) {
                    const element = e.target;
                    if (element) {
                        element.style.zIndex = '999';
                    }
                });

                recordCard.addEventListener('mouseup', function (e) {
                    const element = e.target;
                    if (element) {
                        element.style.zIndex = element.getAttribute('data-index');
                    }
                });

                recordCard.addEventListener('dragstart', function (e) {
                    const element = e.target;
                    if (element) {
                        offsetX = e.offsetX;
                        offsetY = e.offsetY;
                    }
                });

                recordCard.addEventListener('drag', function (e) {
                    if ((e.pageY < dragArea.offsetTop + offsetY) || (e.pageX < dragArea.offsetLeft + offsetX)) {
                        recordCard.style.borderColor = "red";
                    } else {
                        recordCard.style.borderColor = "#3fafbc";
                    }
                });

                recordCard.addEventListener('dragend', function (e) {
                    recordCard.style.borderColor = "#3fafbc";
                    if ((e.pageY < dragArea.offsetTop + offsetY) || (e.pageX < dragArea.offsetLeft + offsetX)) {
                        console.log('can not drag there');
                    } else {
                        this.style.top = (e.pageY - dragArea.offsetTop - offsetY) + 'px';
                        this.style.left = (e.pageX - dragArea.offsetLeft - offsetX) + 'px';
                    }
                });
            }
        }

        const createCard = createCards();

        // Отображение сохраненных карточек
        ;(function () {
            const currentCards = window.localStorage.getItem('ClientCard');
            if (currentCards) {
                document.querySelector('.cards-container__empty').remove('cards-container__empty--hide');

                const arr = JSON.parse(currentCards);
                arr.forEach(e => createCard(e));
            }
        })();

        // Проверка заполенніх полей
        function checkRequired(idEl) {
            let resCheck = true;
            const arrCheck = document.querySelectorAll(`#${idEl} [required]`);

            arrCheck.forEach(e => {
                if (e.parentElement.classList.value.indexOf('hide') < 0) {
                    if (e.value.length === 0) {
                        resCheck = false;
                    }
                }
            });

            return resCheck
        }

        // Получение всех обязательно заполненных полей
        function getAllInputForm(idEl) {
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
            });

            return resObj
        }

        // Сохранение карточек в localStorage
        function setCardStorage(obj) {
            const currentCards = window.localStorage.getItem('ClientCard');
            const allCards = currentCards ? JSON.parse(currentCards) : [];

            allCards.push(obj);
            window.localStorage.setItem('ClientCard', JSON.stringify(allCards));
        }

        // Сабмит формы карточки
        submitModal.addEventListener('click', function (e) {
            const idForm = this.parentElement.getAttribute('id');

            if (checkRequired(idForm)) {
                const type = selectDoctor.value;
                const comment = document.getElementById('input-comment');

                let allInp = getAllInputForm(idForm);
                allInp[comment.getAttribute('data-id')] = comment.value;

                createCard(allInp);

                const infoHasCards = document.querySelector('.cards-container__empty');
                infoHasCards ? infoHasCards.remove('cards-container__empty--hide') : null;

                if (type === 'cardiologist') {
                    setCardStorage(new Cardiologist(allInp));

                } else if (type === 'dentist') {
                    setCardStorage(new Dentist(allInp));

                } else if (type === 'therapist') {
                    setCardStorage(new Therapist(allInp));
                }

                modalCard.classList.add('modal-card--hide');
            }
        })

    }

)();