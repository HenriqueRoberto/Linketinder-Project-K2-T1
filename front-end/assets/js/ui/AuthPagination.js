"use strict";
class FormController {
    constructor() {
        this.login = this.getElement("form-login");
        this.empresa = this.getElement("form-empresa");
        this.candidato = this.getElement("form-candidato");
    }
    getElement(id) {
        const element = document.getElementById(id);
        if (!element) {
            throw new Error(`Elemento #${id} não encontrado`);
        }
        return element;
    }
    show(type) {
        this.hideAll();
        if (type === "login")
            this.login.classList.remove("hidden");
        if (type === "empresa")
            this.empresa.classList.remove("hidden");
        if (type === "candidato")
            this.candidato.classList.remove("hidden");
    }
    hideAll() {
        this.login.classList.add("hidden");
        this.empresa.classList.add("hidden");
        this.candidato.classList.add("hidden");
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const controller = new FormController();
    const linkEmpresa = document.getElementById("link-empresa");
    const linkCandidato = document.getElementById("link-candidato");
    const backEmpresa = document.getElementById("back-login-empresa");
    const backCandidato = document.getElementById("back-login-candidato");
    if (!linkEmpresa || !linkCandidato || !backEmpresa || !backCandidato) {
        throw new Error("Elementos não encontrados");
    }
    linkEmpresa.addEventListener("click", (e) => {
        e.preventDefault();
        controller.show("empresa");
    });
    linkCandidato.addEventListener("click", (e) => {
        e.preventDefault();
        controller.show("candidato");
    });
    backEmpresa.addEventListener("click", () => {
        controller.show("login");
    });
    backCandidato.addEventListener("click", () => {
        controller.show("login");
    });
    document.addEventListener("goToLogin", () => {
        controller.show("login");
    });
});
