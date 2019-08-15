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
