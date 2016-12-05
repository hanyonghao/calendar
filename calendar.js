/**
 * Created by hanyonghao on 2016/11/26.
 */
var calendar = (function(){

    function Calendar(){

        //变量
        var week = ['日', '一', '二', '三', '四', '五', '六'];
        var contentClass = "calendar-content";
        var headClass = "calendar-head";
        var bodyClass = "calendar-body";
        var prevClass = "calendar-prev";
        var prevIcon = '<i class="fa fa-chevron-left" aria-hidden="true"></i>';
        var nextIcon = '<i class="fa fa-chevron-right" aria-hidden="true"></i>';
        var nextClass = "calendar-next";
        var titleClass = "calendar-title";
        var weekClass = "calendar-week";
        var itemClass = "calendar-item";
        var transitionTime = 300; //ms
        var currentDate = new Date(); //当前日期
        var selectDate = new Date(); //选中日期
        var selectFn = function(){}; //选择事件
        var openFn = function(){}; //打开事件
        var createFn = function(){}; //创建事件
        var closeFn = function(){}; //关闭事件
        var removeFn = function(){}; //移除事件
        var self = this;

        /** 公共方法 **/
        function hasClass(obj, clazz) {
            return obj.className.match(new RegExp('(\\s|^)' + clazz + '(\\s|$)'));
        }

        function addClass(obj, clazz) {
            if (!hasClass(obj, clazz)) obj.className += " " + clazz;
        }

        function removeClass(obj, clazz) {
            if (hasClass(obj, clazz)) {
                var reg = new RegExp('(\\s|^)' + clazz + '(\\s|$)');
                obj.className = obj.className.replace(reg, ' ');
            }
        }

        function createElement(option){
            var element = option && option.element && document.createElement(option.element);
            if(element){
                element.className = option.className || "";
                element.style.cssText = option.cssText || "";
                element.innerHTML = option.html || "";
                for(var key in option.attr || {}){
                    element.setAttribute(key,option.attr[key]);
                }
                for(var key in option.event || {}){
                    element.addEventListener(key,option.event[key]);
                }
            }
            return element;
        }

        /**私有方法**/
        var createTransition,removeTransition;

        function create(){

            var content = createElement({
                element : "div",
                className : contentClass,
                cssText : " -webkit-transition: opacity " + transitionTime + "ms ease;" +
                " -moz-transition: opacity " + transitionTime + "ms ease;" +
                " -ms-transition: opacity " + transitionTime + "ms ease;" +
                " -o-transition: opacity " + transitionTime + "ms ease;" +
                " transition: opacity " + transitionTime + "ms ease;" +
                " -webkit-user-select: none;" +
                " -moz-user-select: none;" +
                " -ms-user-select: none;" +
                " user-select: none;" +
                " opacity: 0;",
                event : {
                    click : function(e){
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    }
                }
            });

            createDateSelect(content);

            createTransition = setTimeout(function(){
                window.onclick = self.close;
                content.style.opacity = "1";
                typeof createFn == 'function' ? createFn() : undefined;
            },20);

            self.el.appendChild(content);

        }

        function createDateSelect(content){

            var head = createElement({element : "div", className : headClass});
            var title = createElement({element : "div", className : titleClass});

            var yearBtn = createElement({
                element : "span",
                html: selectDate.getFullYear() +'年',
                event : {
                    click : function(){
                        update(content,createYearSelect);
                    }
                }
            });

            var monthBtn = createElement({
                element : "span",
                html: ( selectDate.getMonth() + 1 ) +'月',
                event : {
                    click : function(){
                        update(content,createMonthSelect)
                    }
                }
            });

            var prevBtn = createElement({
                element : "div",
                className : prevClass,
                html: prevIcon,
                event : {
                    click : function(){
                        var tempMonth = selectDate.getMonth();
                        if(tempMonth == 0){
                            tempMonth = 11;
                            selectDate.setFullYear(selectDate.getFullYear() - 1)
                        }else{
                            tempMonth--;
                        }
                        selectDate.setMonth(tempMonth);
                        update(content,createDateSelect);
                    }
                }
            });

            var nextBtn = createElement({
                element : "div",
                className : nextClass,
                html: nextIcon,
                event : {
                    click : function(){
                        var tempMonth = selectDate.getMonth();
                        if(tempMonth == 11){
                            tempMonth = 0;
                            selectDate.setFullYear(selectDate.getFullYear() + 1)
                        }else{
                            tempMonth++;
                        }
                        selectDate.setMonth(tempMonth);
                        update(content,createDateSelect);
                    }
                }
            });

            title.appendChild(yearBtn);
            title.appendChild(monthBtn);
            head.appendChild(prevBtn);
            head.appendChild(title);
            head.appendChild(nextBtn);
            content.appendChild(head);

            var weeks = createElement({element : "div", className : weekClass});
            week.map(function(item){
                item = createElement({element : "div", className : itemClass, html: item});
                weeks.appendChild(item);
                return item
            });

            content.appendChild(weeks);

            var body = createElement({element : "div", className : bodyClass});
            var maxDay = new Date(selectDate.getFullYear(), selectDate.getMonth() + 1, 0).getDate();
            var firstDayWeek = new Date(selectDate.getFullYear(), selectDate.getMonth(), 1).getDay();
            var cellCount = firstDayWeek + maxDay + ((firstDayWeek + maxDay) % 7 ? 7 - (firstDayWeek + maxDay) % 7 : 0);

            for(var i = 1,currentDay = 1 ; i <= cellCount ; i ++){
                var item;
                if(i <= firstDayWeek || i > firstDayWeek + maxDay){
                    item = createElement({element : "div", className : itemClass});
                }else{
                    var strDate = selectDate.getFullYear() + "-" + (selectDate.getMonth() + 1) + "-" + currentDay;
                    if(currentDate.getFullYear() == selectDate.getFullYear() && currentDate.getMonth() == selectDate.getMonth() && currentDay == selectDate.getDate()){
                        item = createElement({element : "div", className : itemClass + " active", html : currentDay, attr: {data: strDate}});
                    }else{
                        item = createElement({element : "div", className : itemClass, html : currentDay, attr: {data: strDate}});
                    }
                    item.addEventListener("click", function(){
                        typeof selectFn == "function" ? selectFn(new Date(this.getAttribute("data")),this.getAttribute("data")) : undefined;
                        currentDate = new Date(this.getAttribute("data"));
                        self.close();
                    });
                    currentDay++;
                }
                body.appendChild(item);
            }
            content.appendChild(body);

        }

        function createMonthSelect(content){

            var head = createElement({element : "div", className : headClass});
            var title = createElement({element : "div", className : titleClass});

            var yearBtn = createElement({
                element : "span",
                html: selectDate.getFullYear() +'年',
                event : {
                    click : function(){
                        update(content,createYearSelect);
                    }
                }
            });

            var prevBtn = createElement({
                element : "div",
                className : prevClass,
                html: prevIcon,
                event : {
                    click : function(){
                        selectDate.setFullYear(selectDate.getFullYear() - 1);
                        update(content,createMonthSelect);
                    }
                }
            });

            var nextBtn = createElement({
                element : "div",
                className : nextClass,
                html: nextIcon,
                event : {
                    click : function(){
                        selectDate.setFullYear(selectDate.getFullYear() + 1);
                        update(content,createMonthSelect);
                    }
                }
            });

            title.appendChild(yearBtn);
            head.appendChild(prevBtn);
            head.appendChild(title);
            head.appendChild(nextBtn);
            content.appendChild(head);

            var body = createElement({element : "div", className : bodyClass + " month"});
            for(var currentMonth = 1 ; currentMonth <= 12 ; currentMonth ++){
                var item;
                if(currentDate.getFullYear() == selectDate.getFullYear() && selectDate.getMonth() + 1 == currentMonth){
                    item = createElement({element : "div", className : itemClass + " active", html : currentMonth + "月", attr: {data: currentMonth}});
                }else{
                    item = createElement({element : "div", className : itemClass, html : currentMonth + "月", attr: {data: currentMonth}});
                }
                item.addEventListener("click", function(){
                    selectDate.setMonth(parseInt(this.getAttribute("data")) - 1);
                    update(content,createDateSelect)
                });
                body.appendChild(item);
            }

            content.appendChild(body);

        }

        function createYearSelect(content){

            var head = createElement({element : "div", className : headClass});
            var body = createElement({element : "div", className : bodyClass + " year"});
            var title = createElement({element : "div", className : titleClass});

            var startYear = parseInt(selectDate.getFullYear() / 10) * 10;

            var yearBtn = createElement({
                element : "span",
                className : titleClass,
                cssText : "background: transparent; cursor: default;",
                html: startYear + 1 + '~' + ( startYear + 10 ) +'年',
                attr : {
                    start : startYear + 1,
                    end : startYear + 10
                }
            });

            var prevBtn = createElement({
                element : "div",
                className : prevClass,
                html: prevIcon,
                event : {
                    click : function(){
                        var start = parseInt(yearBtn.getAttribute("start")) - 10;
                        var end = parseInt(yearBtn.getAttribute("end")) - 10;
                        yearBtn.setAttribute("start", start + "");
                        yearBtn.setAttribute("end", end + "");
                        yearBtn.textContent = start + "~" + end +'年';
                        updateBody(body);
                    }
                }
            });

            var nextBtn = createElement({
                element : "div",
                className : nextClass,
                html: nextIcon,
                event : {
                    click : function(){
                        var start = parseInt(yearBtn.getAttribute("start")) + 10;
                        var end = parseInt(yearBtn.getAttribute("end")) + 10;
                        yearBtn.setAttribute("start", start + "");
                        yearBtn.setAttribute("end", end + "");
                        yearBtn.textContent = start + "~" + end +'年';
                        updateBody(body);
                    }
                }
            });

            title.appendChild(yearBtn);
            head.appendChild(prevBtn);
            head.appendChild(title);
            head.appendChild(nextBtn);
            content.appendChild(head);

            function updateBody(body){
                body.innerHTML = "";
                var start = parseInt(yearBtn.getAttribute("start"));
                var end = parseInt(yearBtn.getAttribute("end"));
                for(var currentYear = start ; currentYear <= end ; currentYear ++){
                    var item;
                    if(selectDate.getFullYear() == currentYear){
                        item = createElement({element : "div", className : itemClass + " active", html : currentYear + "年", attr: {data: currentYear}});
                    }else{
                        item = createElement({element : "div", className : itemClass, html : currentYear + "年", attr: {data: currentYear}});
                    }
                    item.addEventListener("click", function(){
                        selectDate.setYear(parseInt(this.getAttribute("data")));
                        update(content,createMonthSelect)
                    });
                    body.appendChild(item);
                }
            }

            updateBody(body);

            content.appendChild(body);

        }

        function remove(content){
            window.onclick = null;
            content.style.opacity = "0";
            removeTransition = setTimeout(function(){
                self.el.removeChild(content);
                typeof removeFn == 'function' ? removeFn() : undefined;
            },transitionTime);
        }

        function update(content,action){
            content.innerHTML = "";
            typeof action == "function" ? action(content) : undefined;
        }

        /** 公开方法 **/
        this.init = function(selector,callback){

            selectFn = callback;
            var el = document.querySelector(selector);

            el.addEventListener("click", this.toggle);

            self.el = el;
            self.status = "close";

            return self;
        };

        this.open = function(){
            if(removeTransition) clearTimeout(removeTransition);
            if(self.status == "close"){
                self.status = "open";
                addClass(self.el, "active");
                selectDate = new Date(currentDate);
                var content = self.el.querySelector("." + contentClass);

                typeof openFn == 'function' ? openFn() : undefined;

                if(!content){
                    create();
                }else{
                    createTransition = setTimeout(function(){
                        window.onclick = self.close;
                    },20);
                    update(content,createDateSelect);
                    content.style.opacity = "1";
                }
            }
        };

        this.close = function(){
            if(createTransition) clearTimeout(createTransition);
            var content = self.el.querySelector("." + contentClass);
            if(content && self.status == "open") {
                self.status = "close";
                removeClass(self.el, "active");

                typeof closeFn == 'function' ? closeFn() : undefined;

                remove(content);
            }
        };

        this.toggle = function(){
            self.status == "close" ? self.open() : self.close();
        };

        this.on = function(event, callback){
            switch(event){
                case 'open':
                    openFn = callback || function(){};
                    break;
                case 'close':
                    closeFn = callback || function(){};
                    break;
                case 'create':
                    createFn = callback || function(){};
                    break;
                case 'remove':
                    removeFn = callback || function(){};
                    break;
                case 'select':
                    selectFn = callback || function(){};
                    break;
            }
        };

        return self;
    }

    /** 静态方法 **/
    Calendar.bind = function(selector,callback){
        return new Calendar().init(selector,callback);
    };

    return Calendar;
})();

