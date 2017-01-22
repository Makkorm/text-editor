(function(){

    var table = document.getElementById("table"),
        regEdit = /i_edit/,
        regSave = /i_save/,
        regStop = /i_stop/,
        newTextWrap = document.getElementById("addText"), // див после таблицы
        textBox = document.getElementById("newText"), // поле ввода нового текста
        coordinates = document.getElementById("coordinates"),// див с формой и полями воода координат
        formCoord = document.getElementById("f_coord"), // форма с полнями ввода координат
        tableCoord = document.getElementById("table_coord"),
        x = tableCoord.getElementsByClassName("x")[0],
        y = tableCoord.getElementsByClassName("y")[0],
        z = tableCoord.getElementsByClassName("z")[0],
        // регулярное выражение для парсера ссылок
        https = /(https?:\/\/[-\w;/?:@&=+$\|_.!~*'()\[\]%#,☺]+[\w/#](\(\))?)(?=$|[\s',\|\(\).:;?\-\[\]>])/;


    events(table,"click",edit, false); // events - функция которая вешает обработчик
    events(newTextWrap,"click", AddToTable, false);
    events(document,"DOMContentLoaded", checkLinks, false);
	events(formCoord, "focus", clearWarning, true); // убираем предупреждающие подсказки при нажатии на input (как placeholder)
	events(formCoord, "blur", showWarning, true); // убираем предупреждающие подсказки при нажатии на input (как placeholder)

 
    function edit(e){
        var parentDiv,
            parentTd,
            parentA,
            parentRow,
            text, // в переменную будет занесен изначальный текст
            p;

        // проверяем на что было нажато
        if (regEdit.test(e.target.className)){ // если наэали на иконку "редактировать"
            e.preventDefault();
            parentA = e.target.parentNode; // тэг a
            parentDiv = parentA.parentNode; //div class="box"
            parentTd = parentDiv.parentNode; // td
            parentRow = parentTd.parentNode; // tr

            p = parentRow.getElementsByClassName("text")[0];
            text = p.innerText;

            vipe();
            parentRow.setAttribute("class", "active"); // вешаем класс для проверки
            hideShowIcon(e.target);  // прячем иконку "редактировать" и показываем остальные
            textEdit(parentRow, text); // ищем соседний столбец, создаем textarea и прячем исходный текст
			

        } else if (regSave.test(e.target.className)){ // если нажали на иконку "сохранить"
            e.preventDefault();
            parentA = e.target.parentNode; // тэг a
            parentDiv = parentA.parentNode; //div class="box"
            parentTd = parentDiv.parentNode; // td
            parentRow = parentTd.parentNode; // tr

            saveText(parentRow);
            hideShowIcon(e.target);

        } else if (regStop.test(e.target.className)){ // если нажали на иконку "Сохранить"
            e.preventDefault();
            parentA = e.target.parentNode; // тэг a
            parentDiv = parentA.parentNode; //div class="box"
            parentTd = parentDiv.parentNode; // td
            parentRow = parentTd.parentNode; // tr

            stopEdit(parentRow);
            hideShowIcon(e.target);
        }
    }

    // описание всех функций
    function textEdit(parent, text){
        var textBox = parent.getElementsByClassName("text")[0],
            p = textBox.getElementsByTagName("p")[0],
			form = parent.getElementsByClassName("form")[0],
			editor = document.createElement("p");
	
        editor.setAttribute("id", "editor"); // !!! обавляем новому параграфу id ="editor"
        
		text = p.innerHTML; // забираем текс в переменную
        textBox.appendChild(editor); // ставляем в td новый параграф
		form.style.display = "block";
 
        editor.contentEditable = "true"; // ожность редактировать содержимое
        editor.innerHTML = text;
        p.style.display = "none"; // скрываем исходный текст

		editStyle(parent); // parent - это row в котором наша форма
    }
	
	function editStyle(parent){
        var	form = parent.getElementsByClassName("form")[0]; // наша форма !!!!!

            form.style.display = "block";
            events(form, "click", changeText);
    }

    function hideShowIcon(target){
        var parentP = target.parentNode,
            parentDiv = parentP.parentNode,// div class="box"
            parentTd = parentDiv.parentNode, // td
            i = parentTd.getElementsByTagName("i"), // массив i
            j, // counter
            regHide = /hide/,
            regShow = /show/,
            className;

        for (j=0; j< i.length; j++){

            if (regHide.test(i[j].className) ){
                className = i[j].className;
                i[j].className = className.replace(regHide, "show");
            } else {
                className = i[j].className;
                i[j].className = className.replace(regShow, "hide");
            }
        }
    }

// сохранение текста
    function saveText(parent){
        var textBox = parent.getElementsByClassName("text")[0], //td class="text"
            p = textBox.getElementsByTagName("p")[0], // p с нашим текстом
			form = parent.getElementsByClassName("form")[0], // !!!!!!!!!!!
            editor = document.getElementById("editor"); // находим наш редактируемый текст

        contentEdit(editor);
		editor.innerHTML = wrapLink(editor.innerHTML);
        editor.style.display = "none"; // скрываем редактируемый текст
        p.innerHTML = editor.innerHTML; // заменяем исходный текст на новый
        p.style.display = "block"; // и показываем
        textBox.removeChild(editor); // удаляем параграф, в котором редактировали
        parent.className = ""; // обнуляем класс у тэга TR
		//прячем форму форматирования
		form.style.display = "none";
    }

// отмена редактирования
    function stopEdit(parent){
        var textBox = parent.getElementsByClassName("text")[0],
            p = textBox.getElementsByTagName("p")[0],
			form = parent.getElementsByClassName("form")[0], 
            editor = document.getElementById("editor");

        textBox.removeChild(editor);
        p.style.display = "block";
        parent.className = ""; // обнуляем класс у тэга TR
		// прячем форму
		form.style.display = "none";
    }

// обнуление класса "active" у всех tr + смена иконок
    function vipe(){
        var row = table.getElementsByTagName("tr"),
            icons, // тут будут храниться тэг <i> и будет использоваться в качесте аргумента в функцию  hideShowIcon
            i;

        for (i=0; i<row.length; i++){
            if (row[i].className == "active"){
                stopEdit(row[i]);
                icons = row[i].getElementsByTagName("i")[0];
                hideShowIcon(icons);
                row[i].className = "";
            }
        }
    }


    function events(target,ev, func, bool){ // ev - event (click, mouse etc), func - function, target - event target, bool = true || false
        if (target.addEventListener) {
            target.addEventListener(ev, func, bool);
        }
        else if (target.attachEvent) {
            target.attachEvent("on"+ev, func);
        }
        else {
            target['on' + ev] = func;
        }
    }


    // !!!!! изменяем текст в зависимости от выбранного режима !!!!
    function changeText(e) {
        var editor = document.getElementById("editor"),
            parent = editor.parentNode,// родительский элемент, по которому найдем формы
            form = parent.getElementsByClassName("form")[0], 
            fonts = form.getElementsByClassName("fonts")[0],
            fontSize = form.getElementsByClassName("font_size")[0],
            font, // обертка
            select,
            val;
		
        if (e.target.type === "button") {
            if (e.target.name == "bold") {
                document.execCommand("bold", false, null);
            } else if (e.target.name == "italic") {
                document.execCommand("italic", false, null);
            } else if (e.target.name == "underline") {
                document.execCommand("underline", false, null);
            }
        }

        events(fontSize, "change", function () {
            var i; // counter

            select = fontSize.selectedIndex;
            val = fontSize.options[select].value;
            font = editor.getElementsByTagName("font");

            document.execCommand("fontsize", false, val);

            for (i = 0; i < font.length; i++) {
                if (font[i].size == "7") {
                    font[i].removeAttribute("size");
                    font[i].style.fontSize = val;
                }
            }
        }); // end function

        events(fonts, "change", function () {
            var select = fonts.selectedIndex,
                val = fonts.options[select].value;

            document.execCommand("fontName", false, val);
        }); // end funtion

    }
	// забираем выделенный текст
	/* function getSelText(){
            setTimeout(function() {
                if (window.getSelection) {
                    var selection = window.getSelection();
                    textSelected = selection.toString();
                    anchorOffset = selection.anchorOffset;
                } else if (document.selection) {
                    var range = document.selection.createRange();
                    textSelected = range.htmlText;
                }
            }, 10);
	} */

    function contentEdit(target){
        if (target.getAttribute("contenteditable") == "true"){
            target.removeAttribute("contenteditable");
        } else {
            target.setAttribute("contenteditable", "true");
        }
    }

    //  !!!! добавление нового текста !!!!!
    function AddToTable(e){
        var cloneTr = table.getElementsByTagName("tr")[0], // первый tr в таблице (будем его копировать)
            newTr = document.createElement("tr"), // создаем новый tr
            text = textBox.innerHTML, // забираем новый текст !!!!!!!
            tdText,
            p, // сюда будем вставлять текст
            form = newTextWrap.getElementsByClassName("form")[0],
            fonts = form.getElementsByClassName("fonts")[0], // !!!
            fontSize = form.getElementsByClassName("font_size")[0],
            font, // обертка
            select,
            val,
            array;

        if (e.target.id == "addText_button"){
            // клонируем из первого tr содержимое в новый tr, заменяем текст на нвоый и вставляем в таблицу
            // сначала проверяем что имменно мы добавляем (текст или координаты)
            if (coordinates.className != "coordinates coord_active"){
                if (text !== ""){
                    // разбиваем текст на подстроки и убираем все лишнее (<div> и </div>)
                    text = clearDiv(text);
                    // проверяем текст на наличие ссылок
                    if (https.test(text)){
                        text = wrapLink(text);
                    }
                    newTr.innerHTML = cloneTr.innerHTML;
                    tdText = newTr.getElementsByClassName("text")[0]; // это td в котором хранится текст
                    p = tdText.getElementsByTagName("p")[0]; // <p></p> в td class="text", сюда вставляем текст
                    p.innerHTML = text;
                    table.appendChild(newTr);
                    // обнуляем текстовое поле
                    textBox.innerHTML = "";
                }
            } else { // если текстовое поле спрятано а показано поле ввода координат
                // делаем проверку на ввод данны
                // по условию поле должно быть обязательно заполнено и только число

                array = checkCoord(e);
                if (array !== undefined){
                    x.innerHTML = x.innerHTML + "<p>"+array[0]+"</p>";
                    y.innerHTML = y.innerHTML + "<p>"+array[1]+"</p>";
                    z.innerHTML = z.innerHTML + "<p>"+array[2]+"</p>";
                }
            }
			
        } else if (e.target.type === "button") {
            if (e.target.name == "bold") {
                document.execCommand("bold", false, null);
            } else if (e.target.name == "italic") {
                document.execCommand("italic", false, null);
            } else if (e.target.name == "underline") {
                document.execCommand("underline", false, null);
            }
        }

        events(fontSize, "change", function () {
            var i; // counter

            select = fontSize.selectedIndex;
            val = fontSize.options[select].value;
            font = textBox.getElementsByTagName("font");

            document.execCommand("fontsize", false, val);

            for (i = 0; i < font.length; i++) {
                if (font[i].size == "7") {
                    font[i].removeAttribute("size");
                    font[i].style.fontSize = val;
                }
            }
        }); // end function

        events(fonts, "change", function (){
            var select = fonts.selectedIndex,
                val = fonts.options[select].value;

            document.execCommand("fontName", false, val);
        });
    }

    // !!!!! парсер ссылок !!!!!!

    function checkLinks(){
        var p = table.getElementsByTagName("p"), // все p в таблице
            i,//counter
            string;

        for (i=0; i<p.length; i++){
            if (https.test(p[i].innerHTML)){ // если в тексте есть совпадения по regExp,вызываем функцию, которая будет обрабатывать этот текст
                string = p[i].innerHTML;
                p[i].innerHTML = wrapLink(string); // получаем обработанную строку и перезаписываем текст
            }
        }
    }

    // фнкция оборачивания ссылки
    function wrapLink(string){
        var array = string.split(" "), // разбиваем строку по пробелам
            text,
            i,
            link,
            newString = "";

        // прогоняем кажыдй элемент массива и проверяем его на соответствие с regExp, если есть то сохраняем в переменную и обрабатываем
        for (i=0; i<array.length; i++){
            text = array[i];
            if (https.test(text)){
                link = text.match(https); // массив
                text = text.replace(https, "<a href='"+link[0]+"' target='blank'>"+link[0]+"</a>"+" ");
            }
            array[i] = text;
            newString += array[i]+" ";
        }
        return newString;
    }

    // функция убирает лишнее из текста после переноса его из iframe
    function clearDiv(text){
        var i; // counter

        for (i=0; i<text.length; i++){
            text = text.replace("<div>"," <br>"); // тут именно " ", что бы он учитывался при разбиении строки на массив
            text = text.replace("</div>", " ");
        }
        return text;
    }

    // !!!!!!! Валидация формы и возврат значений !!!!!!!!

    function checkCoord(){
        var inputs = formCoord.getElementsByTagName("input"),
            valueP = formCoord.getElementsByClassName("value"),
            numberP = formCoord.getElementsByClassName("number"),
            reg = /^\d+$/,
            val,
            i,
            array = []; // массив значений, прошедших валидацию

        for (i=0; i<inputs.length; i++){
            val = inputs[i].value;
            if (val !== ""){
                if (!reg.test(val)){
                    numberP[i].style.display = "block";
                } else {
                    array.push(val);
                }
            } else {
                valueP[i].style.display = "block";
            }
        }

        if (array.length == 3){
            for (i=0; i<inputs.length; i++){
                inputs[i].value = "";
            }
            return array;
        }
    }
	// !!! убираем предупреждающие подсказки при нажатии на input (как placeholder)
	function clearWarning(e){
		var parent, // див 
			val,
			num;

		if (e.target.tagName == "INPUT"){
			if (e.target.type == "text"){
				parent = e.target.parentNode;
				val = parent.getElementsByClassName("value")[0];
				num = parent.getElementsByClassName("number")[0];

               // e.target.value = ""; // обнуляем значение формы
				val.style.display = "none";
				num.style.display = "none";
			}
		}
	}
    // !!! показываем предупреждения об неправильно заполненной форме
    function showWarning(e){
        var parent = e.target.parentNode, // div
            val = parent.getElementsByClassName("value")[0],
            num = parent.getElementsByClassName("number")[0],
            reg = /^\d+$/,
            text = e.target.value;

        if (text !== ""){
            if (!reg.test(text)){
                num.style.display = "block";
            }
        } else {
            val.style.display = "block";
        }
    }


})();