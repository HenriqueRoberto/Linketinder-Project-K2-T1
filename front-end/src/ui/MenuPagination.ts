import { StorageService } from "../services/StorageService.js";

document.addEventListener("DOMContentLoaded", () => {
  const user = StorageService.getCurrentUser();

  const hideAll = (selectors: string[]) => {
    selectors.forEach((selector) => {
      document.querySelector(selector)?.classList.add("hidden");
    });
  };

  const bind = (btnId: string, target: string, sections: string[]) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      hideAll(sections);
      document.querySelector(target)?.classList.remove("hidden");
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
  } else {
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
