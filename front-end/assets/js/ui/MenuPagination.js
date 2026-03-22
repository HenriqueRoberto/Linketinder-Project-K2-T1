import { StorageService } from "../services/StorageService.js";
document.addEventListener("DOMContentLoaded", () => {
    const user = StorageService.getCurrentUser();
    const hideAll = (selectors) => {
        selectors.forEach((selector) => {
            var _a;
            (_a = document.querySelector(selector)) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
        });
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
        });
    };
    if (user.tipo === "candidato") {
        const sections = [
            "#profile-candidato",
            "#match-view-section",
            ".match-vagas",
        ];
        bind("nav-user", "#profile-candidato", sections);
        bind("nav-match", "#match-view-section", sections);
        bind("nav-job", ".match-vagas", sections);
    }
    else {
        const sections = [
            ".match-vagas",
            "#match-view-section",
            "#vagas-empresa",
            "#profile-empresa",
        ];
        bind("nav-job-empresa", ".match-vagas", sections);
        bind("nav-match-empresa", "#match-view-section", sections);
        bind("nav-vagas-empresa", "#vagas-empresa", sections);
        bind("nav-user-empresa", "#profile-empresa", sections);
    }
});
