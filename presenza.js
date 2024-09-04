const urlScan = window.location.href;
const idPian = getQueryParam(urlScan, "idP");
const idArt = getQueryParam(urlScan, "idA");
const qtaP = getQueryParam(urlScan, "qta");
const artRett = getQueryParam(urlScan, "art");

const qrcodeScanner = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("outputData");
const btnScanQR = document.getElementById("btn-scan-qr");

var articolo;
var idComm = 0;
let scanning = false;

// Variabile per memorizzare l'ultimo codice inserito o scannerizzato
var ultimoCodice = "";



////////////////////////////////////////////////////////////////ZONA FUNZIONI//////////////////////////////////////////////////////////////////////////////


//Funzione che gestisce gli eventi della pagina, dopo che la pagina è pronta
$(document).ready(function () {




  
  startQRCodeScan();
});

async function getInfoOp(idoperatore,azioneSelezionata) {
  var obj = {};
  obj.IDDipendente = idoperatore;
  obj.IDPulsante = azioneSelezionata;
  const check = (await getData("/4DACTION/www_getInfo", { obj: obj })).data;
  console.log(check);
}


// Funzione che inizia la scansione del QR code
function startQRCodeScan() {
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
      scanning = true;
      qrResult.hidden = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });
}






//Se il bottone è stato cliccato setta tutti i valori come vuoti, nascondendone alcuni
//Dopo richiama le funzioni per la scannerizzazione del qrcode
/*btnScanQR.onclick = () => {
//	window.open(`https://192.168.1.30:8000/scanQR.shtml?art=${codArt}`, '_blank');
  setValue(outputData, "");
	
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function (stream) {
      scanning = true;
      qrResult.hidden = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });
};*/

//Funzione che imposta la larghezza e altezza dell'immagine per poi mostrare l'immagine 
function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

//Funzione di scannerizzazione del qrcode che decodifica il codice qr
function scan() {
  try {
    //console.log("x");
    qrcodeScanner.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}



//Controlla che il qrcode sia stato scansionato, cercando l'articolo che corrisponde al qrcode
qrcodeScanner.callback = res => {
  if (res) {
    scanning = false;

    const dipendente = dipendenti.find(d => d.id == res);
    getInfoOp(dipendente.id,dipendente.numeroVolteCodice);

    mostraPulsantiPermesso(res);
    gestisciCodice(res);
    riempiCampoTesto(res);
    cercaNomeDaQRCode(res);

    //CercaArticoloDaQRCode(res);
    /* var x = mostraMessaggioBenvenuto(res);
     console.log(x)
     $("#message").text(x);*/

    video.srcObject.getTracks().forEach(track => {
      track.stop();
    });

    qrResult.hidden = false;
    canvasElement.hidden = true;
    btnScanQR.hidden = false;
  }
};


function riempiCampoTesto(stringa) {
  const campoTesto = document.getElementById('code');
  campoTesto.value = stringa;
}




function cercaNomeDaQRCode() {
  // Ottenere l'ID inserito dall'input
  var id = document.getElementById('code').value;

  // Trovare l'oggetto con l'ID corrispondente
  var dipendente = dipendenti.find(function (oggetto) {
    return oggetto.id == id;
  });
  // Mostrare il nome e il cognome sulla pagina
  var mostraNominativo = document.getElementById('nomeCognome');
  if (dipendente) {
    mostraNominativo.textContent = "Ciao " + dipendente.nome + ' ' + dipendente.cognome + " " + "scegli l'opzione desiderata";
  } else {
    mostraNominativo.textContent = 'Nessun risultato trovato';
  }

  // Nascondere il messaggio dopo 5 secondi
  setTimeout(function () {
    mostraNominativo.textContent = '';
  }, 5000);
}





$("#btn-scan-qr").click(function () {

  startQRCodeScan();

});


$("#btn-scan-qr").click(function () {

  // Svuota campo "code"
  document.getElementById("code").value = "";

  $("#ENTRATA_NORMALE").addClass("blurred-button disabled");
  $("#ENTRATA_IN_RITARDO_CON_PERMESSO").addClass("blurred-button disabled");
  $("#RIENTRO_PAUSA").addClass("blurred-button disabled");

  $("#USCITA_NORMALE").addClass("blurred-button disabled");
  $("#USCITA_ANTICIPATA_CON_PERMESSO").addClass("blurred-button disabled");
  $("#USCITA_IN_PAUSA").addClass("blurred-button disabled");

});




function mostraMessaggioBenvenuto(codice) {
  const dipendente = dipendenti.find(d => d.id == codice);

  if (dipendente) {
    const now = new Date();
    const data = now.toLocaleDateString([], { dateStyle: 'short' });
    const ora = now.toLocaleTimeString([], { timeStyle: 'short' });

    return `Hai timbrato il ${data} alle ore ${ora}.`;
  }
  else {
    return "Codice non valido!";
  }

}

// Controlla se la pagina è stata ricaricata e azzera l'oggetto "codesData"
window.onload = function () {
  if (performance.navigation.type === 1) {
    localStorage.removeItem("codesData");
  }
};




function submitOptionsForm(buttonValue) {
  var code = document.getElementById("code").value;
  // Verifica la lunghezza del codice
 /* if (code.length !== 5 || !/^\d+$/.test(code)) {
    alert("Inserisci un codice valido di 5 cifre!");
    return false;
  }*/

  var message = document.getElementById("message");


  var dipendente = dipendenti.find(d => d.id == code);
  getInfoOp(dipendente.id,dipendente.numeroVolteCodice);

  var messaggio = mostraMessaggioBenvenuto(code);
  if (messaggio) {
    message.innerHTML = messaggio;
    console.log("Codice:", code, "Opzione selezionata:", buttonValue, "Messaggio:", messaggio);
  } else {
    message.innerHTML = "Codice non valido!";
    console.log("Codice:", code, "Opzione selezionata:", buttonValue, "Messaggio: Codice non valido!");
  }

  // Svuota campo "code"
  document.getElementById("code").value = "";

  setTimeout(function () {
    message.innerHTML = "";
    startQRCodeScan();
  }, 4000);

  return false;
}





function mostraPulsantiPermesso(codice) {
  var oggetto = dipendenti.find(d => d.id == codice);

  if (oggetto.permessoEnt === true && oggetto.numeroVolteCodice % 2 !== 0) {
    $("#ENTRATA_IN_RITARDO_CON_PERMESSO").removeClass("blurred-button disabled");
  }
  else {
    $("#ENTRATA_IN_RITARDO_CON_PERMESSO").addClass("blurred-button disabled");
  }

  if (oggetto.permessoUsc === true && oggetto.numeroVolteCodice % 2 == 0) {
    $("#USCITA_ANTICIPATA_CON_PERMESSO").removeClass("blurred-button disabled");
  }
  else {
    $("#USCITA_ANTICIPATA_CON_PERMESSO").addClass("blurred-button disabled");
  }
}








$("#ENTRATA_NORMALE").click(function () {
  var inputCodice = document.getElementById("code").value;
  var fratm = dipendenti.find(d => d.id == inputCodice);
  //console.log(inputCodice);
  gestisciCodice(inputCodice);

  submitOptionsForm('ENTRATA NORMALE');

  $("#ENTRATA_NORMALE").addClass("blurred-button disabled");
  $("#ENTRATA_IN_RITARDO_CON_PERMESSO").addClass("blurred-button disabled");
  $("#RIENTRO_PAUSA").addClass("blurred-button disabled");

  fratm.numeroVolteCodice++;

});

$("#ENTRATA_IN_RITARDO_CON_PERMESSO").click(function () {
  var inputCodice = document.getElementById("code").value;
  var fratm = dipendenti.find(d => d.id == inputCodice);

  gestisciCodice(inputCodice);

  submitOptionsForm('ENTRATA IN RITARDO CON PERMESSO');

  $("#ENTRATA_NORMALE").addClass("blurred-button disabled");
  $("#ENTRATA_IN_RITARDO_CON_PERMESSO").addClass("blurred-button disabled");
  $("#RIENTRO_PAUSA").addClass("blurred-button disabled");
  $("#USCITA_ANTICIPATA_CON_PERMESSO").addClass("blurred-button disabled");

  fratm.numeroVolteCodice++;

});

$("#RIENTRO_PAUSA").click(function () {
  var inputCodice = document.getElementById("code").value;
  var fratm = dipendenti.find(d => d.id == inputCodice);

  gestisciCodice(inputCodice);

  submitOptionsForm('RIENTRO DALLA PAUSA');

  $("#ENTRATA_NORMALE").addClass("blurred-button disabled");
  $("#ENTRATA_IN_RITARDO_CON_PERMESSO").addClass("blurred-button disabled");
  $("#RIENTRO_PAUSA").addClass("blurred-button disabled");

  fratm.numeroVolteCodice++;

});

$("#USCITA_NORMALE").click(function () {
  var inputCodice = document.getElementById("code").value;
  var fratm = dipendenti.find(d => d.id == inputCodice);

  gestisciCodice(inputCodice);

  submitOptionsForm('USCITA NORMALE');

  $("#USCITA_NORMALE").addClass("blurred-button disabled");
  $("#USCITA_ANTICIPATA_CON_PERMESSO").addClass("blurred-button disabled");
  $("#USCITA_IN_PAUSA").addClass("blurred-button disabled");
  $("#ENTRATA_IN_RITARDO_CON_PERMESSO").addClass("blurred-button disabled");

  fratm.numeroVolteCodice--;

});

$("#USCITA_ANTICIPATA_CON_PERMESSO").click(function () {
  var inputCodice = document.getElementById("code").value;
  var fratm = dipendenti.find(d => d.id == inputCodice);

  gestisciCodice(inputCodice);

  submitOptionsForm('USCITA ANTICIPATA CON PERMESSO');

  $("#ENTRATA_NORMALE").addClass("blurred-button disabled");
  $("#ENTRATA_IN_RITARDO_CON_PERMESSO").addClass("blurred-button disabled");
  $("#RIENTRO_PAUSA").addClass("blurred-button disabled");
  $("#USCITA_NORMALE").addClass("blurred-button disabled");
  $("#USCITA_ANTICIPATA_CON_PERMESSO").addClass("blurred-button disabled");
  $("#USCITA_IN_PAUSA").addClass("blurred-button disabled");

  fratm.numeroVolteCodice--;

});

$("#USCITA_IN_PAUSA").click(function () {
  var inputCodice = document.getElementById("code").value;
  var fratm = dipendenti.find(d => d.id == inputCodice);

  gestisciCodice(inputCodice);

  submitOptionsForm('USCITA IN PAUSA');

  $("#USCITA_NORMALE").addClass("blurred-button disabled");
  $("#USCITA_ANTICIPATA_CON_PERMESSO").addClass("blurred-button disabled");
  $("#USCITA_IN_PAUSA").addClass("blurred-button disabled");
  $("#ENTRATA_IN_RITARDO_CON_PERMESSO").addClass("blurred-button disabled");

  fratm.numeroVolteCodice--;

});



/*function verificaCodice() {
  var inputCodice = document.getElementById("code").value;
  var regex = /^\d{5}$/; // Espressione regolare per verificare che il codice sia composto da 5 cifre
  var dipendente = dipendenti.find(d => d.id === inputCodice);

  if (regex.test(inputCodice)) {
    gestisciCodice(inputCodice);
  } else {
    console.log("Codice non valido!");
  }
}*/




function verificaCodice() {
  var inputCodice = document.getElementById("code").value;
  //var regex = /^\d{4}$/; // Espressione regolare per verificare che il codice sia composto da 5 cifre
  
  if (/*regex.test*/(inputCodice)) {
    
    var dipendente = dipendenti.find(d => d.id == inputCodice);
    
    //getInfoOp(dipendente.id,dipendente.numeroVolteCodice);

    if (dipendente) {
     
      if (inputCodice != ultimoCodice && dipendente.numeroVolteCodice % 2 !== 0) {
        // Nuovo codice inserito o scannerizzato
        ultimoCodice = inputCodice;

        // Mostra i pulsanti per l'entrata e nasconde i pulsanti per l'uscita
        $("#ENTRATA_NORMALE").removeClass("blurred-button disabled");
        $("#ENTRATA_IN_RITARDO_CON_PERMESSO").removeClass("blurred-button disabled");
        $("#RIENTRO_PAUSA").removeClass("blurred-button disabled");


      } else {

        // Verifica se il numero di volte è pari o dispari
        if (dipendente.numeroVolteCodice % 2 === 0) {
          // Numero di volte pari
          ultimoCodice = inputCodice;

          $("#USCITA_NORMALE").removeClass("blurred-button disabled");
          $("#USCITA_ANTICIPATA_CON_PERMESSO").removeClass("blurred-button disabled");
          $("#USCITA_IN_PAUSA").removeClass("blurred-button disabled");

        }
        else {

          $("#ENTRATA_NORMALE").removeClass("blurred-button disabled");
          $("#ENTRATA_IN_RITARDO_CON_PERMESSO").removeClass("blurred-button disabled");
          $("#RIENTRO_PAUSA").removeClass("blurred-button disabled");

        }
      }
    } else {
      console.log("Codice non valido!");
      // Nascondi i pulsanti
      $("#ENTRATA_NORMALE").addClass("blurred-button disabled");
      $("#ENTRATA_IN_RITARDO_CON_PERMESSO").addClass("blurred-button disabled");
      $("#RIENTRO_PAUSA").addClass("blurred-button disabled");
      $("#USCITA_NORMALE").addClass("blurred-button disabled");
      $("#USCITA_ANTICIPATA_CON_PERMESSO").addClass("blurred-button disabled");
      $("#USCITA_IN_PAUSA").addClass("blurred-button disabled");
    }
  } else {
    // Non sono state inserite tutte e 5 le cifre
    console.log("Inserisci un codice valido di 5 cifre!");
    // Nascondi i pulsanti
    $("#ENTRATA_NORMALE").addClass("blurred-button disabled");
    $("#ENTRATA_IN_RITARDO_CON_PERMESSO").addClass("blurred-button disabled");
    $("#RIENTRO_PAUSA").addClass("blurred-button disabled");
    $("#USCITA_NORMALE").addClass("blurred-button disabled");
    $("#USCITA_ANTICIPATA_CON_PERMESSO").addClass("blurred-button disabled");
    $("#USCITA_IN_PAUSA").addClass("blurred-button disabled");
  }
}




// Funzione che gestisce l'azione dopo l'inserimento o la scansione del codice
function gestisciCodice(codice) {
  var dipendente = dipendenti.find(d => d.id == codice);
  // Verifica se il codice è diverso dall'ultimo codice inserito o scannerizzato
  if (codice != ultimoCodice && dipendente.numeroVolteCodice % 2 !== 0) {
    // Nuovo codice inserito o scannerizzato
    ultimoCodice = codice;

    // Mostra i pulsanti per l'entrata e nasconde i pulsanti per l'uscita
    $("#ENTRATA_NORMALE").removeClass("blurred-button disabled");
    //$("#ENTRATA_IN_RITARDO_CON_PERMESSO").removeClass("blurred-button disabled");
    $("#RIENTRO_PAUSA").removeClass("blurred-button disabled");

    //dipendentez.numeroVolteCodice++;


  } else {

    // Verifica se il numero di volte è pari o dispari
    if (dipendente.numeroVolteCodice % 2 === 0) {
      // Numero di volte pari
      ultimoCodice = codice;

      $("#USCITA_NORMALE").removeClass("blurred-button disabled");
      //$("#USCITA_ANTICIPATA_CON_PERMESSO").removeClass("blurred-button disabled");
      $("#USCITA_IN_PAUSA").removeClass("blurred-button disabled");

      // Stesso codice inserito o scannerizzato
      //dipendentez.numeroVolteCodice--;

    }
    else {

      $("#ENTRATA_NORMALE").removeClass("blurred-button disabled");
      //$("#ENTRATA_IN_RITARDO_CON_PERMESSO").removeClass("blurred-button disabled");
      $("#RIENTRO_PAUSA").removeClass("blurred-button disabled");

      //dipendentez.numeroVolteCodice++;

    }
  }
}




function redirectToPage() {
  window.location.href = "presenze.shtml";
}






////////////////////////////////////////////////////////////////ZONA HTTP///////////////////////////////////////////////////////////////




async function sendHttpRequest() {
  var code = document.getElementById("code").value;

  if (code.length !== 5 || !/^\d+$/.test(code)) {
    alert("Inserisci un codice valido di 5 cifre!");
    return;
  }



  //axios.post('/4DACTION/www_registraAccesso', { code: code })
  axios.post('/4DACTION/www_registraAccesso', { code: code })
    .then(function (response) {
      console.log("Richiesta inviata con successo");
      //window.location.reload();
      var message = document.getElementById("message");
      message.innerHTML = "Codice inviato correttamente!";

      setTimeout(function () {
        message.innerHTML = "";
      }, 2000);

      //Svuota campo "code"
      document.getElementById("code").value = "";

      startQRCodeScan();

    })

    .catch(function (error) {
      console.log("Errore nella richiesta:", error);
      alert("Si è verificato un errore nella richiesta. Riprova più tardi.");

      //Svuota campo "code"
      document.getElementById("code").value = "";

    });
}


//////////////////////////////////////////////////////////////ZONA OGGETTI//////////////////////////////////////////////////////////////////////////////



var dipendenti = [{
  id: 1234,
  nome: "Matteo",
  cognome: "Filipetto",
  numeroVolteCodice: 1,
  permessoEnt: true,
  permessoUsc: false
},

{
  id: 67891,
  nome: "Massimo",
  cognome: "De Rosa",
  numeroVolteCodice: 1,
  permessoEnt: false,
  permessoUsc: true
},

{
  id: 2299,
  nome: "Matteo",
  cognome: "Nespolo",
  numeroVolteCodice: 1,
  permessoEnt: false,
  permessoUsc: true
},
{
  id: 2406,
  nome: "sos",
  cognome: "sps",
  numeroVolteCodice: 1,
  permessoEnt: false,
  permessoUsc: false
},
]

