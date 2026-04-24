import { StorageService } from "../services/StorageService.js";
document.addEventListener("DOMContentLoaded", () => {
    const usuario = StorageService.obterUsuarioAtual();
    const ocultarTodas = (seletores) => {
        seletores.forEach((seletor) => {
            var _a;
            (_a = document.querySelector(seletor)) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
        });
    };
    const ativarBotao = (btnId) => {
        var _a;
        document.querySelectorAll(".menu-nav__link").forEach((el) => {
            el.classList.remove("active");
        });
        (_a = document.getElementById(btnId)) === null || _a === void 0 ? void 0 : _a.classList.add("active");
    };
    const vincularNavegacao = (btnId, alvo, secoes) => {
        const btn = document.getElementById(btnId);
        if (!btn)
            return;
        btn.addEventListener("click", (e) => {
            var _a;
            e.preventDefault();
            ocultarTodas(secoes);
            (_a = document.querySelector(alvo)) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
            ativarBotao(btnId);
        });
    };
    if (usuario.tipo === "candidato") {
        const secoes = ["#perfil-candidato", "#matches", ".match-swipe"];
        vincularNavegacao("nav-candidato-perfil", "#perfil-candidato", secoes);
        vincularNavegacao("nav-candidato-matches", "#matches", secoes);
        vincularNavegacao("nav-candidato-vagas", ".match-swipe", secoes);
        ativarBotao("nav-candidato-perfil");
    }
    else {
        const secoes = [
            ".match-swipe",
            "#matches",
            "#vagas-empresa",
            "#perfil-empresa",
        ];
        vincularNavegacao("nav-empresa-vagas-match", ".match-swipe", secoes);
        vincularNavegacao("nav-empresa-matches", "#matches", secoes);
        vincularNavegacao("nav-empresa-vagas", "#vagas-empresa", secoes);
        vincularNavegacao("nav-empresa-perfil", "#perfil-empresa", secoes);
        ativarBotao("nav-empresa-perfil");
    }
});
