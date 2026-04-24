import { AuthService } from "./AuthService.js";
export class AuthController {
    constructor() {
        this.authService = new AuthService();
        this.registrarEventos();
    }
    obterInput(id) {
        return document.getElementById(id);
    }
    obterTextarea(id) {
        return document.getElementById(id);
    }
    registrarEventos() {
        this.vincularFormLogin();
        this.vincularFormCandidato();
        this.vincularFormEmpresa();
        document.addEventListener("goToLogin", () => this.mostrarFormulario("login"));
    }
    vincularFormLogin() {
        const form = document.getElementById("form-login");
        if (!form)
            return;
        form.onsubmit = (e) => {
            e.preventDefault();
            this.login(this.obterInput("email").value, this.obterInput("password").value);
        };
    }
    vincularFormCandidato() {
        const form = document.getElementById("form-candidato");
        if (!form)
            return;
        form.onsubmit = (e) => {
            e.preventDefault();
            this.cadastrar({
                id: crypto.randomUUID(),
                tipo: "candidato",
                nome: this.obterInput("nome-candidato").value,
                email: this.obterInput("email-candidato").value,
                senha: this.obterInput("senha-candidato").value,
                cpf: this.obterInput("cpf-candidato").value,
                idade: this.obterInput("idade-candidato").value,
                estado: this.obterInput("estado-candidato").value,
                cep: this.obterInput("cep-candidato").value,
                descricao: this.obterTextarea("descricao-candidato").value,
                competencias: [],
            });
        };
    }
    vincularFormEmpresa() {
        const form = document.getElementById("form-empresa");
        if (!form)
            return;
        form.onsubmit = (e) => {
            e.preventDefault();
            this.cadastrar({
                id: crypto.randomUUID(),
                tipo: "empresa",
                nome: this.obterInput("nome-empresa").value,
                email: this.obterInput("email-empresa").value,
                senha: this.obterInput("senha-empresa").value,
                cnpj: this.obterInput("cnpj").value,
                pais: this.obterInput("pais-empresa").value,
                estado: this.obterInput("estado-empresa").value,
                cep: this.obterInput("cep-empresa").value,
                descricao: this.obterTextarea("descricao-empresa").value,
            });
        };
    }
    login(email, senha) {
        const sucesso = this.authService.login(email, senha);
        if (!sucesso) {
            alert("Email ou senha incorretos.");
            return;
        }
        window.location.href = "app.html";
    }
    cadastrar(usuario) {
        const sucesso = this.authService.registrar(usuario);
        if (!sucesso) {
            alert("Este email já está cadastrado.");
            return;
        }
        alert("Cadastro realizado com sucesso!");
        this.mostrarFormulario("login");
    }
    mostrarFormulario(tipo) {
        var _a;
        ["form-login", "form-candidato", "form-empresa"].forEach((id) => {
            var _a;
            (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
        });
        (_a = document.getElementById(`form-${tipo}`)) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
    }
}
document.addEventListener("DOMContentLoaded", () => {
    new AuthController();
});
