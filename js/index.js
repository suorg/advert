$(document).ready(function () {
    var url = 'http://somon.pakhomov.im/api/items/by_cat/nedvizhimost/arenda-kvartir/',
        underscore = _,
        loading = false, // переменная для проверки идет ли загрузка
        listTemplate = underscore.template([
            '<div class="list-item">',
                '<div class="list-item-image" style="' + '<%- image %>' + '"></div>',
                '<div class="list-item-info">',
                    '<div class="list-item-info-title"><%- title %></div>',
                    '<div class="list-item-info-price"><%- price %></div>',
                    '<div class="list-item-info-desc"><%- description %></div>',
                    '<div class="list-item-info-date"><%- date %></div>',
                '</div>',
            '</div>'].join("\n"));


    function scrolling() {

        // если уже грузится останавливаем функцию
        if (loading) return;
        if ((window.pageYOffset + window.innerHeight + 500) > document.body.offsetHeight) {

            // запускаем функцию загрузки, передавая переменную page
            loadFeed();
        }
    }


    function loadFeed() {

        // говорим, что пошла загрузка
        loading = true;
        $.ajax({
            url: url,
            success: function (msg) {

                // записываем следующую страницу в локальную переменную
                if (msg.next) {
                    url = msg.next;
                }

                // проходимся по пришедшему массиму
                underscore.each(msg.results, function(list){

                    // вставляем картинку, если она приходит в json-объекте
                    var image = '';
                    if (list.images && list.images[0]) {
                        image = "background: rgba(0, 0, 0, 0) url('" + list.images[0] + "') no-repeat scroll center center / cover";
                    }

                    // вставляем в темплейт данные из json-массива, затем вставляем темплейт в ноду листинга
                    var listsHtml = listTemplate({ title: list.title, price: list.price, description: list.description,  date: 'Сегодня 12:44', image: image});
                    $('.list').append(listsHtml);
                });

                // обнуляем после удачной загрузки
                loading = false;
            },
            error: function (msg) {
                console.log(msg, 'Failed!');
            }
        });
    }


    $(window).scroll(scrolling); // при каждом скролле также проверяем стоит ли загружать данные
    scrolling(); // первый раз при ините
});