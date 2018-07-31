$(function() {
    var nowClick
    $('.activityType li').on('click',function() {
        $('.activityType li').removeClass('now')
        $(this).addClass('now')

        $('.activityType li').each(function(index) {
            if($(this).hasClass('now')) {
                nowClick = index
                console.log(nowClick)
                return index
            }
        })
        $('.activityInfo').removeClass('now')
        $('.activityInfo').eq(nowClick).addClass('now')
    })
})