(function(){
   var ul = document.getElementById("accord_wrap"),
		li = ul.getElementsByTagName("li"),
		a = ul.getElementsByTagName("a"),
		p;

		

	events(document.body, "click", showContent, false);


	// при фокусировке на теге li показываем контент в нем
	function showContent(e){
		var parent,
			div,
			p,
			height,
			content,
			show,
			hide,
			i = 0; // counter



		if (e.target.tagName == "A"){
			if (e.target.className == "click"){
				parent = e.target.parentNode; // li
				// делаем проверку по классу (то есть активынй элемент, или нет )
				if (parent.className == "show"){
					div = parent.getElementsByClassName("content")[0];
					p = div.getElementsByTagName("p")[0];
					height = p.offsetHeight; // высота блока с контентом
					i = height; // counter

					
					e.target.style.background = "#fff";
					e.target.style.color = "#222";

					p.style.display = "none";

					// плавно прячем блок с контентом
					hide = setInterval(function(){
						i = i-5;
						div.style.height = ""+i+"px";

						// когда i <= 0 скрываем наш контейнер (div родитель), и присваиваем ему исхордную высоту, что бы при следующей нажатии обрабатывать ее
						if (i <= 0){
							div.style.display = "none";
							clearInterval(hide);
							div.style.height = height + "px";
						}
					},10);
					// и соответственно убираем класс у родителя, что бы при дальнейшем клике срабатывала проверка ниже
					parent.removeAttribute("class");
				} else {
					// сначала прячем все активные элементы
					for (i=0; i<li.length; i++){
						if (li[i].className == "show"){
							hideContent(li[i]);
						}
					}
					// находим параграф внутри родителя (то есть наш контент который хотим показать)
					div = parent.getElementsByClassName("content")[0];	// div
					p = parent.getElementsByTagName("p")[0];

					// т.к. изначально параграф имеет css свойство display: none, мы не можем определить высоту элемента
					// для этого делаем значение display: block !, записываем высоту элемента в переменную height,и обратно скрываем элемента
					// возможно надо будет переделать
					parent.className = "show"; // добавляем класс li
					div.style.display = "block";
					height = div.offsetHeight;
					div.style.display = "none";
					p.style.display = "none";
					
					e.target.style.background = "#616161";
					e.target.style.color = "#fff";

					// плавно увеличиваем высоту li на высоту htight, которую узнали выше
					show = setInterval(function(){
						i = i + 5;
						div.style.display = "block";
						div.style.height = ""+i+"px";

						if (i >= height){
							clearInterval(show);
							p.style.display = "block";
						}
					},10);
				}
			}
		} else { // если кликнули не на <a class='click'>
			for (i=0; i<li.length; i++){
				if (li[i].className == "show"){
					hideContent(li[i]);
				}
			}
		}
	}
   
   
   function hideContent(target){
	   var div = target.getElementsByClassName("content")[0],
		   p = div.getElementsByTagName("p")[0],
		   a = target.getElementsByClassName("click")[0],
		   height = p.offsetHeight,
		   hide,
		   i = height; // counter
	   // при потере фокуса, скрываем контент и запускаем фунцию hide, которая в свою очередь плавно уменьшает высоту контейнера(div родитель)
	   p.style.display = "none";
	   
		a.style.background = "#fff";
		a.style.color = "#222";

	   hide = setInterval(function () {
		   i = i - 5;
		   div.style.height = "" + i + "px";

		   // когда i <= 0 скрываем наш контейнер (div родитель), и присваиваем ему исхордную высоту, что бы при следующей нажатии обрабатывать ее
		   if (i <= 0) {
			   div.style.display = "none";
			   clearInterval(hide);
			   div.style.height = height + "px";
		   }
	   }, 10);
	   target.removeAttribute("class");
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
   
})();

