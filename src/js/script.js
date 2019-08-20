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
