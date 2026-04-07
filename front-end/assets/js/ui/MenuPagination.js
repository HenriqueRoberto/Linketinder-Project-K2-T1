import { StorageService } from "../services/StorageService.js";
document.addEventListener("DOMContentLoaded", () => {
    const user = StorageService.getCurrentUser();
    const hideAll = (selectors) => {
        selectors.forEach((selector) => {
            var _a;
            (_a = document.querySelector(selector)) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
        });
    };
    const setActive = (btnId) => {
        var _a;
        document.querySelectorAll(".menu-nav__link").forEach((el) => {
            el.classList.remove("active");
        });
        (_a = document.getElementById(btnId)) === null || _a === void 0 ? void 0 : _a.classList.add("active");
    };
    const bind = (btnId, target, sections) => {
        const btn = document.getElementById(btnId);
        if (!btn)
            return;
        btn.addEventListener("click", (e) => {
            var _a;
            e.preventDefault();
            hideAll(sections);
            (_a = document.querySelector(target)) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
            setActive(btnId);
        });
    };
    if (user.tipo === "candidato") {
        const sections = ["#perfil-candidato", "#matches", ".match-swipe"];
        bind("nav-candidato-perfil", "#perfil-candidato", sections);
        bind("nav-candidato-matches", "#matches", sections);
        bind("nav-candidato-vagas", ".match-swipe", sections);
        setActive("nav-candidato-perfil");
    }
    else {
        const sections = [
            ".match-swipe",
            "#matches",
            "#vagas-empresa",
            "#perfil-empresa",
        ];
        bind("nav-empresa-vagas-match", ".match-swipe", sections);
        bind("nav-empresa-matches", "#matches", sections);
        bind("nav-empresa-vagas", "#vagas-empresa", sections);
        bind("nav-empresa-perfil", "#perfil-empresa", sections);
        setActive("nav-empresa-perfil");
    }
});
