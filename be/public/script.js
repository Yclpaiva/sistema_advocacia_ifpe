let cadastrar = false;
let tipo_user = 'client';

function login() {
    document.getElementById('auth-section').classList.remove('hidden');
    document.getElementById('client-register-section').classList.add('hidden');
    document.getElementById('lawyer-register-section').classList.add('hidden');
    cadastrar = false;
}

function cadastrarCliente() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('lawyer-register-section').classList.add('hidden');
    document.getElementById('client-register-section').classList.remove('hidden');
    cadastrar = true;
    tipo_user = 'client';
}

function cadastrarAdvogado() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('client-register-section').classList.add('hidden');
    document.getElementById('lawyer-register-section').classList.remove('hidden');
    cadastrar = true;
    tipo_user = 'lawyer';
}

function handleAuth() {
    if (cadastrar) {
        if (tipo_user == 'client') {
            handleSingupClient();
        } else if (tipo_user == 'lawyer') {
            handleSignupLawyer();
        }
    } else {
        handleSignin();
    }
}

function salvarNoLocalStorage(resposta) {
    console.log(resposta);
    if (resposta && resposta.id) {
        localStorage.setItem('usuario_id', resposta.id);
        localStorage.setItem('tipo_usuario', resposta.userType);
        console.log('ID do usuário salvo no localStorage:', resposta.id);
    } else {
        console.log('Erro: resposta inválida.');
    }
}

function handleSignin() {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const userType = document.querySelector('input[name="userType"]:checked').value;

    fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, userType })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na autenticação');
            }
            return response.json();
        })
        .then(data => {
            if (data.message == "Cliente autenticado com sucesso") {
                salvarNoLocalStorage(data);
                location.assign('/usuario.html');
            } else if (data.message == "Advogado autenticado com sucesso") {
                console.log(data);
                salvarNoLocalStorage(data);
                location.assign('/advogado.html');
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

function handleSingupClient() {
    const email = document.getElementById("email_client_register").value;
    const password = document.getElementById("password_client_register").value;
    const password2 = document.getElementById("password2_client_register").value;
    const userType = 'client';

    if (password != password2) {
        alert('Senhas não conferem');
        return;
    }
    if (password.length < 6) {
        alert('Senha deve ter no mínimo 6 caracteres');
        return;
    }
    if (email == '') {
        alert('E-mail é obrigatório');
        return;
    }

    fetch('/api/auth/singup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, userType })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro no cadastro');
            }
            return response.json();
        })
        .then(data => {
            if (data.message == "Cliente criado com sucesso") {
                location.reload();
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

function handleSignupLawyer() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email_lawyer_register").value;
    const password = document.getElementById("password_lawyer_register").value;
    const password2 = document.getElementById("password2_lawyer_register").value;
    const oab = document.getElementById("oab_lawyer_register").value;
    const userType = 'lawyer';

    // Obtendo a especialidade selecionada
    const specialty = document.querySelector('input[name="especialidade"]:checked');
    const specialtyValue = specialty ? specialty.value : null;

    if (!name || !email || !password || !password2 || !oab || !specialtyValue) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    if (password !== password2) {
        alert("As senhas não coincidem.");
        return;
    }

    fetch('/api/auth/singup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password, oab, specialty: specialtyValue, userType })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro no cadastro');
            }
            return response.json();
        })
        .then(data => {
            if (data.message == "Advogado criado com sucesso") {
                location.reload();
            }
        })
        .catch(error => {
            console.error('Erro:', error);
        });

}

