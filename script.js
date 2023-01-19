const urlApi = 'https://mock-api.driven.com.br/api/v6/uol';
let perguntarNome;
let destinatario = "Todos";
let tipoMsg = "message";
let objMsg;
let objNome;
let mensagem;
let ultimoElemento;

enviarNome();

function enviarNome(){

    perguntarNome = prompt('Qual é o seu nome');

    objNome = {name: perguntarNome};

    setInterval(atualizarStatus, 5000);

    let promise = axios.post(`${urlApi}/participants`, objNome);
    promise.then(sucess);
    promise.catch(fail);

}

function sucess(acerto){
    console.log(acerto.data);

    let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(right);
    /* promise.catch(wrong); */
}

function fail(erro) {
    alert('O nome inserido já esta em uso');

    enviarNome();
    
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


let tempo;

function right(pegarTempo){
    console.log(pegarTempo.data.slice(-1)[0].time);

    tempo = pegarTempo.data.slice(-1)[0].time;

    let ul = document.querySelector('ul');

    ul.innerHTML += `
        <li class="joinChat">
            <span><strong id="time">(${tempo}) </strong> <strong>${perguntarNome} </strong> entrou na sala</span>
        </li>
    `;

}



function enviarMensagem(){
    mensagem = document.querySelector('textarea').value;

    objMsg = {from: perguntarNome, to: destinatario, text: mensagem, type: tipoMsg};

    let promise = axios.post(`${urlApi}/messages`, objMsg);
    promise.then(sucess1);
    promise.catch(fail1);
}

function sucess1(acerto1){
    console.log(acerto1.data);

    pegarMensagem();

}

function fail1(erro1){
    window.location.reload();
}

function pegarMensagem() {
    let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(deuCerto);
    promise.catch(deuErrado);
}

let mensagemNova, tempoNovo;


function deuCerto(resposta){
    /* console.log(resposta.data.slice(-1)); */
    console.log(resposta.data.slice(-1)[0]);

    mensagemNova = resposta.data.slice(-1)[0].text;

    tempoNovo = resposta.data.slice(-1)[0].time;

    toNovo = resposta.data.slice(-1)[0].to;

    criarMensagem();
}

function deuErrado(nao){
    console.log(nao);
}

function criarMensagem(){
    let ul = document.querySelector('ul');

    ul.innerHTML += `
        <li class="defaultlMsg">
            <span><strong id="time">(${tempoNovo}) </strong> <strong>${perguntarNome} </strong> para <strong>${toNovo}</strong> ${mensagemNova}</span>
        </li>
    `;

    ultimoElemento = document.querySelectorAll('li');
    
    ultimoElemento[ultimoElemento.length - 1].scrollIntoView();
    console.log(ultimoElemento);
    

    document.querySelector('textarea').value = '';
}
