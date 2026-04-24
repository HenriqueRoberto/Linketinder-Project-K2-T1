import { StorageService } from "./services/StorageService.js";
import { CandidatoController } from "./controllers/CandidatoController.js";
import { EmpresaController } from "./controllers/EmpresaController.js";
document.addEventListener("DOMContentLoaded", () => {
    const usuario = StorageService.obterUsuarioAtual();
    document
        .querySelectorAll("main section")
        .forEach((s) => s.classList.add("hidden"));
    if (usuario.tipo === "candidato")
        new CandidatoController(usuario);
    else
        new EmpresaController(usuario);
});
