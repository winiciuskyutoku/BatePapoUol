const urlApi = 'https://mock-api.driven.com.br/api/v6/uol';
let perguntarNome;
let destinatario = "Todos";
let tipoMsg = "message";
let objMsg;
let objNome;
let mensagem;
let ultimoElemento;
let ul;

enviarNome();

function enviarNome(){

    perguntarNome = prompt('Qual é o seu nome');

    objNome = {name: perguntarNome};

    setInterval(atualizarStatus, 5000);

    let promise = axios.post(`${urlApi}/participants`, objNome);
    promise.then(sucess);
    promise.catch(fail);

}

function sucess(){

    if (perguntarNome !== undefined){
        let promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');

        
        
        promise.then(imprimirMsg);
        promise.catch(wrong);
        
    }

}

function fail() {
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
                    <span><strong id="time">(${mensagemDoServer.time}) </strong> <strong>${mensagemDoServer.from} </strong> para <strong>${mensagemDoServer.to}</strong> ${mensagemDoServer.text}</span>
                </li>
            `;
        } else if (mensagemDoServer.type === 'private_message'){
            ul.innerHTML += `
                <li class="privateMsg">
                    <span><strong id="time">(${mensagemDoServer.time}) </strong> <strong>${mensagemDoServer.from} reservadamente</strong> para <strong>${mensagemDoServer.to}</strong> ${mensagemDoServer.text}</span>
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

    

    objMsg = {from: perguntarNome, to: destinatario, text: mensagem, type: tipoMsg};

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

console.log(document.querySelector('textarea').value);