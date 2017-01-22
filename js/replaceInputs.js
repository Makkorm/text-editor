(function(){
    var table = document.getElementById("table"),
        textBox = document.getElementById("newText"), // поле ввода нового текста
        addTextButton = document.getElementById("addText_button"), // кнопка отправки текста в таблицу
		addText = document.getElementById("addText"),
        replBut = document.getElementById("replacement"), // кнопка смены полей ввода
		iframeClassName = textBox.className, // className iframe
		buttonClassName = replBut.className, // className выезжающей кнопки
		replA = document.getElementById("repl_a"), // ссылка-кнопка внутри выезжающего блока
		replAText = document.getElementById("repl_a_text"), // ссылка-кнопка внутри выезжающего блока(замена обратно на текстовое поле)
        coordinates = document.getElementById("coordinates"),
        coordClassName = coordinates.className,
		formCoord = document.getElementById("f_coord");
		
	
	events(window, "click", hideButton, false); 
    events(textBox, "click", showButton, false);
    events(coordinates, "click", showButtonCoord, false);
	events(replBut,"click", showCoordinates, false); // при нажатии на кнопку появляются поля ввода координат вместо текстового поля и наоборот
   
    // при нажатии на основное поле ввода (iframe) сбоку появится кнопка
    function showButton(){
        textBox.className = iframeClassName + " " + "iframe_active";
        replBut.className = buttonClassName + " " + "repl_active";
    }

    function showButtonCoord(){
        replBut.className = buttonClassName + " " + "repl_active";
    }
	
	function hideButton(e){
		if (e.target.id != replA.id && e.target.id != replAText.id && e.target.id != coordinates.id && e.target.tagName != "INPUT" && e.target.id != textBox.id){
			textBox.className = iframeClassName;
			replBut.className = buttonClassName;
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
	
	// !!!Смена текстового полня на поля ввода координат !!!!!
	
	function showCoordinates(e){
		// проверяем на какую именно кнопу нажали
		if (e.target.id == "repl_a"){ // если начали на кнопку "Ввести координаты"
			e.preventDefault();

            replBut.className = buttonClassName; //меняем класс на дефолтный
            textBox.style.display = "none"; // прячем iframe (поле ввода основного текста)
            coordinates.className = coordClassName + " "+"coord_active"; //добавляем блоку с координатами класс для его появления

            setTimeout(function(){ // через 0,2s произойдет смена кнопки на "Ввести текст"
                replBut.className = buttonClassName + " "+"repl_active";
                textBox.className = iframeClassName + " " + "iframe_active";
                e.target.style.display = "none";
                replAText.style.display = "block";
            }, 200);
			
		} else if (e.target.id == "repl_a_text"){ // если нажали на кнопку "ввести текст"
			e.preventDefault();

            replBut.className = buttonClassName; //меняем класс на дефолтный
            textBox.style.display = "block"; // вновь показываем iframe (основное поле ввода текста)
            textBox.className = iframeClassName;
            coordinates.className = coordClassName; // меняем класс у блоко координат за дефолтный, что бы спрятался

            setTimeout(function(){ // через 0,2s произойдет смена кнопки на "Ввести координаты"
                replBut.className = buttonClassName + " "+"repl_active";
                textBox.className = iframeClassName + " " + "iframe_active";
                e.target.style.display = "none";
                replA.style.display = "block";
            }, 200);
		}
	}
})();

