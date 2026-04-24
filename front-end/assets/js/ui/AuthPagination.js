"use strict";
class AlternadorDeFormularios {
    constructor() {
        this.formLogin = this.obterElemento("form-login");
        this.formEmpresa = this.obterElemento("form-empresa");
        this.formCandidato = this.obterElemento("form-candidato");
    }
    exibir(tipo) {
        this.ocultarTodos();
        if (tipo === "login")
            this.formLogin.classList.remove("hidden");
        if (tipo === "empresa")
            this.formEmpresa.classList.remove("hidden");
        if (tipo === "candidato")
            this.formCandidato.classList.remove("hidden");
    }
    ocultarTodos() {
        this.formLogin.classList.add("hidden");
        this.formEmpresa.classList.add("hidden");
        this.formCandidato.classList.add("hidden");
    }
    obterElemento(id) {
        const elemento = document.getElementById(id);
        if (!elemento)
            throw new Error(`Elemento #${id} não encontrado`);
        return elemento;
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const alternador = new AlternadorDeFormularios();
    const linkEmpresa = document.getElementById("link-empresa");
    const linkCandidato = document.getElementById("link-candidato");
    const voltarEmpresa = document.getElementById("back-login-empresa");
    const voltarCandidato = document.getElementById("back-login-candidato");
    if (!linkEmpresa || !linkCandidato || !voltarEmpresa || !voltarCandidato) {
        throw new Error("Elementos de navegação não encontrados");
    }
    linkEmpresa.addEventListener("click", (e) => {
        e.preventDefault();
        alternador.exibir("empresa");
    });
    linkCandidato.addEventListener("click", (e) => {
        e.preventDefault();
        alternador.exibir("candidato");
    });
    voltarEmpresa.addEventListener("click", () => alternador.exibir("login"));
    voltarCandidato.addEventListener("click", () => alternador.exibir("login"));
    document.addEventListener("goToLogin", () => alternador.exibir("login"));
});
