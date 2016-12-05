/**
 * Created by hanyonghao on 2016/12/5.
 */
(function(){
    window.onload = function(){
        var $calendar = calendar.bind(".calendar",function(_,strDate){
            $calendar.el.querySelector("input[type='text']").setAttribute("value",strDate);
        });
    };
})();