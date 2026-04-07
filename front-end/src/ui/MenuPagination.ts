import { StorageService } from "../services/StorageService.js";

document.addEventListener("DOMContentLoaded", () => {
  const user = StorageService.getCurrentUser();

  const hideAll = (selectors: string[]) => {
    selectors.forEach((selector) => {
      document.querySelector(selector)?.classList.add("hidden");
    });
  };

  const setActive = (btnId: string) => {
    document.querySelectorAll(".menu-nav__link").forEach((el) => {
      el.classList.remove("active");
    });
    document.getElementById(btnId)?.classList.add("active");
  };

  const bind = (btnId: string, target: string, sections: string[]) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      hideAll(sections);
      document.querySelector(target)?.classList.remove("hidden");
      setActive(btnId);
    });
  };

  if (user.tipo === "candidato") {
    const sections = ["#perfil-candidato", "#matches", ".match-swipe"];

    bind("nav-candidato-perfil", "#perfil-candidato", sections);
    bind("nav-candidato-matches", "#matches", sections);
    bind("nav-candidato-vagas", ".match-swipe", sections);

    setActive("nav-candidato-perfil");
  } else {
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
