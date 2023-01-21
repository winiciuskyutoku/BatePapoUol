const urlApi = 'https://mock-api.driven.com.br/api/v6/uol';
let perguntarNome;
let destinatario = "Todos";
let tipoMsg = "message";
let objMsg;
let objNome;
let mensagem;
let ultimoElemento;
let ul;
let inputLogin;


function enviarNome(){

    /* perguntarNome = prompt('Qual é o seu nome'); */
    

    objNome = {name: inputLogin};

    setInterval(atualizarStatus, 5000);

    let promise = axios.post(`${urlApi}/participants`, objNome);
    promise.then(sucess);
    promise.catch(fail);

}

function sucess(){

    if (inputLogin !== undefined){
        let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');

        
        
        promise.then(imprimirMsg);
        promise.catch(wrong);
        
    }

}

function fail() {

    alert('Esse nome de usuário já está sendo utilizado!');

    window.location.reload();
    
}

function atualizarStatus() {
    let promise = axios.post(`${urlApi}/status`, objNome);

    promise.then(attStatusCerto);
    promise.catch(attStatusErro);
}

function attStatusCerto(){
    console.log('envio certo');
}

function attStatusErro(){
    console.log('envio errado');
}

function imprimirMsg(response){
    ul = document.querySelector('ul');

    let mensagemDoServer;

    ul.innerHTML = ''

    for(let i = 0; i < response.data.length; i++){
        mensagemDoServer = response.data[i];


        if(mensagemDoServer.type === 'status'){
            ul.innerHTML += `
                <li class="joinChat">
                    <span><strong id="time">(${mensagemDoServer.time})</strong> <strong>${mensagemDoServer.from} </strong> ${mensagemDoServer.text}</span>
                </li>
            `;
        } else if (mensagemDoServer.type === 'message') {
            ul.innerHTML += `
                <li class="defaultlMsg">
                    <span><strong id="time">(${mensagemDoServer.time}) </strong> <strong>${mensagemDoServer.from} </strong> para <strong>${mensagemDoServer.to}:</strong> ${mensagemDoServer.text}</span>
                </li>
            `;
        } else if (mensagemDoServer.type === 'private_message'){
            ul.innerHTML += `
                <li class="privateMsg">
                    <span><strong id="time">(${mensagemDoServer.time}) </strong> <strong>${mensagemDoServer.from} </strong>reservadamente para <strong>${mensagemDoServer.to}:</strong> ${mensagemDoServer.text}</span>
                </li>
            `;
        }
    }

    console.log(response.data.length);


    const ultimoLi = document.querySelector('ul li:last-child');

    ultimoLi.scrollIntoView();

}


function wrong(){
    alert('Erro no servidor');

    window.location.reload();
}


function enviarMensagem(){
    
    mensagem = document.querySelector('textarea').value;

    if (mensagem === ""){
        return
    } else {
        const textArea = document.querySelector('textarea');
        textArea.removeAttribute("disabled");
        document.querySelector('textarea').value = '';
    }

    
    objMsg = {from: inputLogin, to: destinatario, text: mensagem, type: tipoMsg};

    let promise = axios.post(`${urlApi}/messages`, objMsg);
    promise.then(sucess);
    promise.catch(fail);
}

let text = document.querySelector('textarea');

text.addEventListener('keyup', (e) => {
    if(e.keyCode === 13 ) {
        console.log(e.target.value);
        enviarMensagem();
    } 
})

setInterval(sucess, 3000);

function mostrarListaDePessoas(){
    document.querySelector('section').classList.remove('escondido');

    pegarParticipantes();
}

function mostrarChat(){
    document.querySelector('section').classList.add('escondido');
}


function pegarParticipantes(){
    let promise = axios.get(`${urlApi}/participants`);

    promise.then(participantesCerto);
    promise.catch(participantesErrado);
}

const participantesErrado = () => console.log("Erro no servidor");

function participantesCerto(participantes){
    console.log(participantes);

    let part = document.querySelector('.pessoas');

    part.innerHTML = '';

    part.innerHTML = `
        <div class="pessoasAtt">
            <div onclick="selecionarOParticipante(this)">
                 <ion-icon name="person-circle"></ion-icon>
                 <span>Todos</span>
            </div>
            <div class="icone">
        
            </div>
        </div> 
    `;
    
    for (let i = 0; i < participantes.data.length; i++){
        part.innerHTML += `
        <div class="pessoasAtt">
            <div onclick="selecionarOParticipante(this)">
                <ion-icon name="person-circle"></ion-icon>
                <span>${participantes.data[i].name}</span>
            </div>
            <div class="icone">
                
            </div>
        </div> 
        `;
    }


}

let array = [];

function selecionarOParticipante(clicado){
    let divIcone = document.querySelectorAll(".icone");
    
    for(let i = 0; i < divIcone.length; i++ ){
        divIcone[i].innerHTML = "";
    }


    let paiClicado = clicado.parentNode;
    let filhoClicado = paiClicado.childNodes[3];

   filhoClicado.innerHTML = `
    <ion-icon name="checkmark"></ion-icon>
   `;

   let teste = clicado.childNodes;
   array.shift();
   array.push(teste[3].innerHTML); 
   
   console.log(array);
    
    let para = document.querySelector(".enviando");
    para.innerHTML = `
        Enviando para ${array[0]}
    `;

    if(array[0] === "Todos"){
        destinatario = "Todos"
    } else {
        destinatario = array[0];
    }

    if(array[0] === 'Todos'){
        tipoMsg = "message";
        bambu.classList.add('escondido2');
    } else {
        bambu.classList.remove('escondido2');
    }


}

let tipo = [];

let bambu = document.querySelector(".tipoAtt2");

function escolherTipoDaMensagem(selected){
    let divIcone = document.querySelectorAll(".icone2");
    
    
    for(let i = 0; i < divIcone.length; i++ ){
        divIcone[i].innerHTML = "";
    }


    let paiClicado = selected.parentNode;
    let filhoClicado = paiClicado.childNodes[3];

   filhoClicado.innerHTML = `
    <ion-icon name="checkmark"></ion-icon>
   `;

   let teste = selected.childNodes;
   tipo.shift();
   tipo.push(teste[3].innerHTML); 
   
    
    let para = document.querySelector(".enviandoTipo");
    para.innerHTML = `
        (${tipo[0]})
    `;


    if(tipo[0] === "Reservadamente"){
        tipoMsg = "private_message";
    }

    if(tipo[0] === "Público"){
        tipoMsg = "message";
    }

    
}

function fazerLogin() {
    inputLogin = document.querySelector(".enviarLogin input").value;

    enviarNome();

    setInterval(tirarTelaLoading, 2000);

    let telaInicial = document.querySelector('.login');
    telaInicial.classList.add('escondido2');

    document.querySelector(".enviarLogin input").value = "";
    
}

let loading;


function tirarTelaLoading(){
    loading = document.querySelector(".login2");
    loading.classList.add('escondido2');
}

setInterval(pegarParticipantes, 10000);