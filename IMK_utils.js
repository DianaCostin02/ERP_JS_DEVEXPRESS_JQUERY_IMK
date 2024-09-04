// Funzione che prende il valore di un parametro dell'URL
function getQueryParam(url, name) {
	return new URL(url).searchParams.get(name);
}

// Funzione che fa una chiamata al server 4D e rimane in attesa fino al ricevimento dei dati
async function getData(url, params) {
	try {
		return params ? await axios.get(url, { params: params }) : await axios.get(url);
	} catch (err) {
		throw new Error(err);
	}
}

// Funzione per ricevere il valore dell'oggetto passato come parametro
function getValue(id) {
    return $(id).val();
}

// Funzione per impostare il valore dell'oggetto passato come parametro
function setValue(id, arg) {
    $(id).html(arg);
}

// Funzione per impostare il testo dell'oggetto passato come parametro
function setText(id, arg) {
    $(id).val(arg);
}

// Funzione che serve per impostare un cookie e salvarlo
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// Funzione che serve per prendere il valore di un cookie dato il suo nome (restituisce stringa vuota se non lo trova)
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Funzione che controlla se un cookie esiste o meno
function checkCookie(cookie) {
    var c = getCookie(cookie);
    if (c != "") {
        return true;
    } else {
        return false;
    }
}

// Funzione che imposta la scadenza di un cookie a una data passata in modo da eliminarlo quando la sessione viene chiusa
function deleteCookie(cname, exdays) {
    var d = new Date();
    d.setTime(d.getTime() - (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=;" + expires + ";path=/";
}

// Funzione per formattare un numero in valuta (€) da utilizzare sui form modello per i documenti da stampare
function formatNumber(number){
	var formatter = new Intl.NumberFormat(undefined, {
		style: 'currency',
		currency: 'EUR',
	});

	return formatter.format(number);
}

// Funzione per formattare una data da utilizzare sui form modello per i documenti da stampare
function formatData(d){
	var dataS;
	var timestamp = Date.parse(d);
	if(!(isNaN(timestamp))){
		var data = new Date(d);

		var anno = data.getFullYear();
		var mese = data.getMonth() + 1; 
		var giorno = data.getDate();
	
		if(mese < 10){
			if(giorno < 10){
				dataS = "0" + giorno + "-0" + mese + "-" + anno;
			} else {
				dataS = giorno + "-0" + mese + "-" + anno;
			}
		} else {
			if(giorno < 10){
				dataS = "0" + giorno + "-" + mese + "-" + anno;
			} else {
				dataS = giorno + "-" + mese + "-" + anno;
			}
		}
	} else {
		dataS = "00-00-0000";
	}
	return dataS;
}

// Funzione per formattare la data
function showDate(d) {
	return d instanceof Date && !isNaN(d)
		? d.toLocaleDateString("it-IT", {
				month: "2-digit",
				day: "2-digit",
				year: "numeric",
		  })
		: "-";

		//console.log(type of d); 
}

// Funzione che gestisce l'ordinamento quando viene fatto un click su un determinato campo
function sortClick(th, tbody){
	document.querySelectorAll("i").forEach(i=>i.textContent = "unfold_more");
	const index = Array.prototype.indexOf.call(th.parentNode.children, th);
	const icon = th.querySelector("i");
	icon.textContent = th.dataset.asc === "1" ? "arrow_drop_up" : "arrow_drop_down";
	sortTable(tbody, index, th.dataset.type, th.dataset.asc);
	th.dataset.asc*= -1;
}

// Funzione che ordina una tabella in base a un campo scelto dall'utente
function sortTable(tbody, colIndex, type, asc){
	const rows = Array.from(tbody.childNodes);
	tbody.innerHTML = "";
	rows.sort((a,b)=>{
		let result = 0;
		switch(type){
			case "text":
				result = asc * (a.children[colIndex].textContent.trim().localeCompare(b.children[colIndex].textContent.trim()));
			break;
			case "date":
				result = asc * (italianDate(a.children[colIndex].textContent).getTime() -  italianDate(b.children[colIndex].textContent).getTime());
			break;
		}
		return result;
	}).forEach(row=> tbody.appendChild(row));
}

// Funzione che resetta eventuali filtri applicati alla tabella
function resetTable(tbody){
	tbody.childNodes.forEach(tr=>{
		if(tr.classList.contains("d-none")) tr.classList.remove("d-none")
		filterInput.value = ""
	})
}

// Funzione richiamata dalla sortTable (teoricamente converte una data per avere il formato italiano)
function italianDate(datestring){
	const p = datestring.split("/");
	return new Date(+p[2], p[1]-1,+p[0]);
}

// Funzione per filtrare gli elementi partendo dalla stringa richiesta dall'utente
function filter(tbody, search){
	tbody.childNodes.forEach(tr=>{
		if (Array.from(tr.children).some(e=>{
			return e.textContent.toLowerCase().includes(search.toLowerCase());
		})) {
			if(tr.classList.contains("d-none")){
				tr.classList.remove("d-none");
			}
		} else {
			tr.classList.add("d-none");
		}
	});
}

// Funzione per controllare se l'oggetto passato come parametro è vuoto o no
function isObjEmpty(obj) {
	return Object.keys(obj).length === 0;
}

// Funzione che prende la classe o l'id dell'oggetto e lo visualizza (. per la classe e # per l'id)
function showElement (element) {
	$(element).removeClass("d-none");
}

// Funzione che prende la classe o l'id dell'oggetto e lo nasconde (. per la classe e # per l'id)
function hideElement (element) {
	$(element).addClass("d-none");
}

// Funzione che ritorna il valore del tasto premuto
function TastoPremuto (event) {
	var x = event.keyCode;
	return x;
}

// Funzione che prende come parametro il numero dei secondi e restituisce la data relativa (solo ore e minuti)
function getTimeFromSeconds(seconds) {
	if(seconds < (-100000000)){
		console.log("tempo: " + seconds);
		console.log("errore");
		return "errore";
	} else {
		/*
		let d = new Date(seconds * 1000).toISOString().substr(11, 5)
		return d === "00:00" ? "-" : d
		*/
		var tempoMin = (seconds) / 60;
		var tempoOre = parseInt((seconds) / 60 / 60);
		var tempo = "";

		tempoMin = tempoMin - (tempoOre * 60);
		tempoMin = parseInt(tempoMin);
		
		if(tempoOre < 10 && tempoOre >= 0){
			tempoOre = "0" + tempoOre;
		}
		if(tempoMin < 10 && tempoMin > -10){
			tempoMin = "0" + Math.abs(tempoMin);
		} else if(tempoMin <= -10){
			tempoMin = Math.abs(tempoMin);
		}
		if((tempoOre < 0 && tempoOre > -10)){
			tempo += "-";
			tempoOre = "0" + Math.abs(tempoOre);
		} else if(tempoOre <= -10){
			tempo += "-";
			tempoOre = Math.abs(tempoOre);
		}

		tempo += tempoOre + ":" + tempoMin;
		return tempo;
	}
}

function getSecondsFromTime(time) {
	var seconds;
	
	if(!(time.includes("-"))){
		if(time.includes(':')){
			var ttp = (time).split(":");
			/*console.log(parseInt(ttp[0]));
			console.log(parseInt(ttp[1]));*/
			if(parseInt(ttp[1]) < 60 && parseInt(ttp[1]) >= 0 && parseInt(ttp[0]) >= 0){
				if(ttp[1].length == 1){
					if(ttp[1] < 6){			
						ttp[1] = ttp[1] * 10;
						seconds = (parseInt(ttp[1]) * 60) + parseInt(ttp[0] * 3600);
					} else {
						ttp[1] = "0" + ttp[1];
						seconds = (parseInt(ttp[1]) * 60) + parseInt(ttp[0] * 3600);
					}
				} else {
					seconds = (parseInt(ttp[1]) * 60) + parseInt(ttp[0] * 3600);
				}
			} else {
				seconds = -1;
			}
		} else {
			seconds = time * 3600;
		}
	} else {
		seconds = -1;
	}

	return seconds;
}

function roundToInt(num) {
	return Math.round(num);
}

// Funzione che prende un numero decimale e restituisce lo stesso numero arrotondato a due cifre dopo la virgola
function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

// Funzione che prende un numero decimale e restituisce lo stesso numero arrotondato a tre cifre dopo la virgola
function roundToThree(num) {    
    return +(Math.round(num + "e+3")  + "e-3");
}

// Funzione che prende una data e assegna un colore in base al tipo di data
// Rosso = prima della data odierna
// Verde = da tre a più giorni dopo la data odierna
// Bianco = da data odierna fino a 3 giorni dopo
function returnColorDate(d){
	var data = new Date(d);
	var today = new Date();
	var todayPlus3 = new Date();
	todayPlus3.setDate(today.getDate() + 3);
	var bgColorDat;

	if(data < today) {
		bgColorDat = "#F68383";
	} else if (data >= todayPlus3) {
		bgColorDat = "#76FF6C";
	} else {
		bgColorDat = "#FFFFFF";
	}

	return bgColorDat;
}

function dateDiffInDays(a, b) {//CALCOLA LA DIFFERENZA TRA DUE GIORNI
	const _MS_PER_DAY = 1000 * 60 * 60 * 24;
	
	var arr = (a).split("-");
	var brr = (b).split("-");
	const utc1 = Date.UTC(arr[0], arr[1], arr[2]);
	const utc2 = Date.UTC(brr[0], brr[1], brr[2]);
  
	return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  function calcolaWeek(data)//CALCOLA LA WEEK DI UNA DATA
  {
	
		var protagonista=new Date(data);//DATA PASSATA (SOGGETTO)
		currentDate = new Date(); //DATA CORRENTE
			
		startDate = new Date(protagonista.getFullYear(), 0, 1);
		//console.log(startDate);
		var days = Math.floor(( protagonista - startDate ) /(24 * 60 * 60 * 1000));
		//console.log(days);
		var weekNumber = Math.ceil(days / 7);
		
	
		//console.log("Week number of " + data +	" is : " + weekNumber);
		return weekNumber;
  }