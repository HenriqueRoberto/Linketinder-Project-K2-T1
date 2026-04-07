import { StorageService } from "../services/StorageService.js";
import { MatchController } from "./MatchController.js";
export class CandidatoController {
    constructor(user) {
        this.user = user;
        this.fotoBase64 = "";
        this.competencias = [];
        this.init();
    }
    init() {
        var _a, _b;
        (_a = document.getElementById("menu-candidato")) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
        (_b = document.getElementById("perfil-candidato")) === null || _b === void 0 ? void 0 : _b.classList.remove("hidden");
        this.load();
        this.events();
        this.competenciasEvents();
        this.initMatchVagas();
        this.renderMatches();
    }
    input(id) {
        return document.getElementById(id);
    }
    textarea(id) {
        return document.getElementById(id);
    }
    el(id) {
        return document.getElementById(id);
    }
    // ================= PROFILE =================
    load() {
        document.getElementById("perfil-candidato-nome").textContent = this.user.nome;
        this.input("perfil-candidato-campo-nome").value = this.user.nome;
        this.input("perfil-candidato-campo-email").value = this.user.email;
        this.input("perfil-candidato-campo-cpf").value = this.user.cpf;
        this.input("perfil-candidato-campo-idade").value = this.user.idade;
        this.input("perfil-candidato-campo-estado").value = this.user.estado;
        this.input("perfil-candidato-campo-cep").value = this.user.cep;
        this.textarea("perfil-candidato-campo-descricao").value =
            this.user.descricao;
        this.competencias = [...this.user.competencias];
        this.renderCompetencias();
        const fotoEl = document.getElementById("perfil-candidato-avatar");
        if (this.user.foto) {
            this.fotoBase64 = this.user.foto;
            fotoEl.style.backgroundImage = `url(${this.user.foto})`;
            fotoEl.style.backgroundSize = "cover";
            fotoEl.style.backgroundPosition = "center";
            fotoEl.textContent = "";
        }
        else {
            const iniciais = this.user.nome
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();
            fotoEl.textContent = iniciais;
        }
    }
    events() {
        var _a, _b, _c, _d;
        (_a = document.getElementById("btn-logout")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            StorageService.clearCurrentUser();
            window.location.href = "auth.html";
        });
        (_b = document
            .getElementById("perfil-candidato-btn-salvar")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => this.save());
        const foto = document.getElementById("perfil-candidato-avatar");
        const inputFoto = document.getElementById("perfil-candidato-avatar-input");
        foto === null || foto === void 0 ? void 0 : foto.addEventListener("click", () => inputFoto.click());
        inputFoto === null || inputFoto === void 0 ? void 0 : inputFoto.addEventListener("change", (e) => this.handleFoto(e));
        (_c = document
            .getElementById("modal-vaga-btn-fechar")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
            var _a, _b;
            (_a = document.getElementById("modal-vaga")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
            (_b = document
                .getElementById("modal-vaga-dados-empresa")) === null || _b === void 0 ? void 0 : _b.classList.add("hidden");
        });
        (_d = document
            .getElementById("perfil-candidato-btn-excluir")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => this.deleteAccount());
        this.togglePassword("perfil-candidato-campo-senha-atual", "perfil-candidato-toggle-senha-atual");
        this.togglePassword("perfil-candidato-campo-nova-senha", "perfil-candidato-toggle-nova-senha");
    }
    togglePassword(inputId, buttonId) {
        const input = document.getElementById(inputId);
        const button = document.getElementById(buttonId);
        if (!input || !button)
            return;
        button.addEventListener("click", () => {
            input.type = input.type === "password" ? "text" : "password";
        });
    }
    handleFoto(e) {
        var _a;
        const input = e.target;
        const file = (_a = input.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = () => {
            this.fotoBase64 = reader.result;
            const foto = document.getElementById("perfil-candidato-avatar");
            foto.style.backgroundImage = `url(${this.fotoBase64})`;
            foto.style.backgroundSize = "cover";
            foto.style.backgroundPosition = "center";
            foto.textContent = "";
        };
        reader.readAsDataURL(file);
    }
    save() {
        const current = StorageService.getCurrentUser();
        const senhaAtualDigitada = this.input("perfil-candidato-campo-senha-atual").value.trim();
        const novaSenha = this.input("perfil-candidato-campo-nova-senha").value.trim();
        if (senhaAtualDigitada && senhaAtualDigitada !== current.senha) {
            alert("Senha atual incorreta.");
            return;
        }
        if (novaSenha && novaSenha.length < 6) {
            alert("A nova senha deve ter pelo menos 6 caracteres.");
            return;
        }
        const updated = Object.assign(Object.assign({}, current), { nome: this.input("perfil-candidato-campo-nome").value, email: this.input("perfil-candidato-campo-email").value, cpf: this.input("perfil-candidato-campo-cpf").value, idade: this.input("perfil-candidato-campo-idade").value, estado: this.input("perfil-candidato-campo-estado").value, cep: this.input("perfil-candidato-campo-cep").value, descricao: this.textarea("perfil-candidato-campo-descricao").value, foto: this.fotoBase64 || current.foto, competencias: this.competencias, senha: novaSenha || current.senha });
        StorageService.updateUser(updated);
        this.user = updated;
        document.getElementById("perfil-candidato-nome").textContent = updated.nome;
        this.input("perfil-candidato-campo-senha-atual").value = "";
        this.input("perfil-candidato-campo-nova-senha").value = "";
        alert("Salvo!");
    }
    deleteAccount() {
        if (!confirm("Tem certeza que deseja excluir sua conta?"))
            return;
        StorageService.deleteUser(this.user.id);
        alert("Conta excluída com sucesso.");
        window.location.href = "auth.html";
    }
    // ================= COMPETENCIAS =================
    renderCompetencias() {
        const lista = document.getElementById("perfil-candidato-competencias-lista");
        const template = document.getElementById("perfil-candidato-competencia-template");
        if (!lista || !template)
            return;
        lista.innerHTML = "";
        this.competencias.forEach((c, index) => {
            const item = template.cloneNode(true);
            item.classList.remove("hidden");
            item.querySelector(".competencia__texto").textContent = c;
            item.addEventListener("click", () => {
                if (!confirm("Remover competência?"))
                    return;
                this.competencias.splice(index, 1);
                this.renderCompetencias();
            });
            lista.appendChild(item);
        });
    }
    competenciasEvents() {
        const btn = document.getElementById("perfil-candidato-btn-add-competencia");
        const popup = document.getElementById("perfil-candidato-popup-competencia");
        const input = document.getElementById("perfil-candidato-popup-input");
        const confirmar = document.getElementById("perfil-candidato-popup-confirmar");
        const cancelar = document.getElementById("perfil-candidato-popup-cancelar");
        if (!btn || !popup || !input || !confirmar || !cancelar)
            return;
        const regex = /^[A-Za-zÀ-ÿ0-9.+#-]{2,30}(?:\s[A-Za-zÀ-ÿ0-9.+#-]{2,30})*$/;
        btn.onclick = () => {
            popup.classList.remove("hidden");
            input.value = "";
            input.focus();
        };
        confirmar.onclick = () => {
            const valor = input.value.trim();
            if (!valor) {
                alert("Digite uma competência");
                return;
            }
            if (!regex.test(valor)) {
                alert("Digite uma competência válida (ex: Java, React, Node.js)");
                return;
            }
            this.competencias.push(valor);
            this.renderCompetencias();
            popup.classList.add("hidden");
            input.value = "";
        };
        cancelar.onclick = () => {
            popup.classList.add("hidden");
            input.value = "";
        };
    }
    // ================= MATCH =================
    initMatchVagas() {
        const likes = StorageService.getLikes();
        const vagas = StorageService.getAllVagas().filter((vaga) => !likes.some((like) => "vagaId" in like &&
            like.candidatoId === this.user.id &&
            like.vagaId === vaga.id));
        new MatchController(vagas, (vaga) => this.renderCardVaga(vaga), (vaga) => {
            StorageService.saveLike({
                candidatoId: this.user.id,
                vagaId: vaga.id,
            });
            this.renderMatches();
        }, () => {
            var _a, _b;
            (_a = document.getElementById("match-swipe-card")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
            (_b = document
                .getElementById("match-swipe-sem-vagas")) === null || _b === void 0 ? void 0 : _b.classList.remove("hidden");
        });
    }
    renderCardVaga(vaga) {
        var _a, _b, _c;
        (_a = document.getElementById("match-swipe-card")) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
        // mostra vaga e esconde candidato
        (_b = document
            .getElementById("match-swipe-dados-vaga")) === null || _b === void 0 ? void 0 : _b.classList.remove("hidden");
        (_c = document
            .getElementById("match-swipe-dados-candidato")) === null || _c === void 0 ? void 0 : _c.classList.add("hidden");
        // tipo + título
        const tipoEl = document.getElementById("match-swipe-tipo");
        if (tipoEl)
            tipoEl.textContent = "Vaga";
        document.getElementById("match-swipe-titulo").textContent =
            vaga.titulo;
        // dados
        document.getElementById("match-swipe-vaga-descricao").value = vaga.descricao || "";
        document.getElementById("match-swipe-vaga-horario").value = vaga.horario || "";
        document.getElementById("match-swipe-vaga-localizacao").value = vaga.localizacao || "";
        document.getElementById("match-swipe-vaga-salario").value = vaga.remuneracao || "";
        document.getElementById("match-swipe-vaga-requisitos").value = vaga.requisitos || "";
    }
    // ================= MATCH LIST =================
    renderMatches() {
        const lista = document.getElementById("matches-lista");
        const template = lista === null || lista === void 0 ? void 0 : lista.querySelector(".matches__item");
        if (!lista || !template)
            return;
        lista.innerHTML = "";
        lista.appendChild(template);
        template.classList.add("hidden");
        const matches = MatchController.getMatches().filter((m) => m.candidatoId === this.user.id);
        matches.forEach((match) => {
            const vaga = StorageService.getAllVagas().find((v) => v.id === match.vagaId);
            if (!vaga)
                return;
            const item = template.cloneNode(true);
            item.classList.remove("hidden");
            item.querySelector(".matches__item-titulo").textContent = vaga.titulo;
            item.addEventListener("click", () => this.openVagaView(vaga));
            lista.appendChild(item);
        });
    }
    openVagaView(vaga) {
        this.el("modal-vaga").classList.remove("hidden");
        this.el("modal-vaga-dados-empresa").classList.remove("hidden");
        this.el("modal-vaga-titulo").textContent = vaga.titulo;
        this.el("modal-vaga-campo-descricao").value =
            vaga.descricao || "";
        this.el("modal-vaga-campo-horario").value =
            vaga.horario || "";
        this.el("modal-vaga-campo-localizacao").value =
            vaga.localizacao || "";
        this.el("modal-vaga-campo-salario").value =
            vaga.remuneracao || "";
        this.el("modal-vaga-campo-requisitos").value =
            vaga.requisitos || "";
        this.el("modal-vaga-campo-competencias").value =
            vaga.competencias.join(", ");
        const empresa = StorageService.getUsers().find((u) => u.tipo === "empresa" && u.id === vaga.empresaId);
        if (!empresa)
            return;
        this.el("modal-vaga-empresa-nome").value = empresa.nome;
        this.el("modal-vaga-empresa-email").value = empresa.email;
        this.el("modal-vaga-empresa-cnpj").value = empresa.cnpj;
        this.el("modal-vaga-empresa-descricao").value =
            empresa.descricao;
        this.el("modal-vaga-empresa-pais").value = empresa.pais;
        this.el("modal-vaga-empresa-estado").value =
            empresa.estado;
        this.el("modal-vaga-empresa-cep").value = empresa.cep;
    }
}
