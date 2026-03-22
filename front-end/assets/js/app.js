import { StorageService } from "./services/StorageService.js";
import { CandidatoController } from "./controllers/CandidatoController.js";
import { EmpresaController } from "./controllers/EmpresaController.js";
document.addEventListener("DOMContentLoaded", () => {
    const user = StorageService.getCurrentUser();
    document.querySelectorAll("main section").forEach((s) => {
        s.classList.add("hidden");
    });
    if (user.tipo === "candidato") {
        new CandidatoController(user);
    }
    else {
        new EmpresaController(user);
    }
});
