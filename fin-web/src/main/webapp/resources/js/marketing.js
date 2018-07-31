$(function() {
    var nowClick
    $('.taskItem').on('click',function() {
        $('.taskItem').removeClass('now')
        $(this).addClass('now')

        $('.taskItem').each(function(index) {
            if($(this).hasClass('now')) {
                nowClick = index
                console.log(nowClick)
                return index
            }
        })
        $('.taskDetails').removeClass('now')
        $('.taskDetails').eq(nowClick).addClass('now')
    })
})