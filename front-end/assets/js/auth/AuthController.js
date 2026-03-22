import { AuthService } from "./AuthService.js";
export class AuthController {
    constructor() {
        this.auth = new AuthService();
        this.login();
        this.candidato();
        this.empresa();
        this.logout();
    }
    input(id) {
        return document.getElementById(id);
    }
    textarea(id) {
        return document.getElementById(id);
    }
    login() {
        const form = document.getElementById("form-login");
        if (!form)
            return;
        form.onsubmit = (e) => {
            e.preventDefault();
            this.auth.login(this.input("email").value, this.input("password").value);
        };
    }
    candidato() {
        const form = document.getElementById("form-candidato");
        if (!form)
            return;
        form.onsubmit = (e) => {
            e.preventDefault();
            const user = {
                id: crypto.randomUUID(),
                tipo: "candidato",
                nome: this.input("nome-candidato").value,
                email: this.input("email-candidato").value,
                senha: this.input("senha-candidato").value,
                cpf: this.input("cpf-candidato").value,
                idade: this.input("idade-candidato").value,
                estado: this.input("estado-candidato").value,
                cep: this.input("cep-candidato").value,
                descricao: this.textarea("descricao-candidato").value,
                competencias: [],
            };
            this.auth.register(user);
        };
    }
    empresa() {
        const form = document.getElementById("form-empresa");
        if (!form)
            return;
        form.onsubmit = (e) => {
            e.preventDefault();
            const user = {
                id: crypto.randomUUID(),
                tipo: "empresa",
                nome: this.input("nome-empresa").value,
                email: this.input("email-empresa").value,
                senha: this.input("senha-empresa").value,
                cnpj: this.input("cnpj").value,
                pais: this.input("pais-empresa").value,
                estado: this.input("estado-empresa").value,
                cep: this.input("cep-empresa").value,
                descricao: this.textarea("descricao-empresa").value,
            };
            this.auth.register(user);
        };
    }
    logout() {
        var _a;
        (_a = document.getElementById("log-out")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            this.auth.logout();
        });
    }
}
document.addEventListener("DOMContentLoaded", () => {
    new AuthController();
});
