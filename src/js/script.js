export default doctors = [
    {
        type: "cardiologist",
        fields: [
            {
                name: "Обычное давление",
                type: "text"
            },
            {
                name: "Индекс массы тела",
                type: "text"
            },
            {
                name: "Перенесенные заболевания сердечно-сосудистой системы",
                type: "text"
            },
            {
                name: "Возраст",
                type: "text"
            }
        ]
    },
    {
        type: "dentist",
        fields: [
            {
                name: "Обычное давление",
                type: "text"
            },
            {
                name: "Дата последнего посещения",
                type: "date"
            }
        ]
    },
    {
        type: "therapist",
        fields: [
            {
                name: "Обычное давление",
                type: "text"
            },
            {
                name: "Возраст",
                type: "text"
            }
        ]
    }
];
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
