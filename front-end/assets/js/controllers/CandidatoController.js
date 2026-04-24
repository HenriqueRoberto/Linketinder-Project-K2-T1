import { StorageService } from "../services/StorageService.js";
import { MatchService } from "../services/MatchService.js";
import { SwipeController } from "../controllers/SwipeController.js";
export class CandidatoController {
    constructor(usuario) {
        this.usuario = usuario;
        this.fotoBase64 = "";
        this.competencias = [];
        this.init();
    }
    init() {
        var _a, _b;
        (_a = document.getElementById("menu-candidato")) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
        (_b = document.getElementById("perfil-candidato")) === null || _b === void 0 ? void 0 : _b.classList.remove("hidden");
        this.carregarPerfil();
        this.registrarEventos();
        this.registrarEventosCompetencias();
        this.iniciarSwipeVagas();
        this.atualizarListaDeMatches();
    }
    obterInput(id) {
        return document.getElementById(id);
    }
    obterTextarea(id) {
        return document.getElementById(id);
    }
    obterElemento(id) {
        return document.getElementById(id);
    }
    // ---- PERFIL ----
    carregarPerfil() {
        document.getElementById("perfil-candidato-nome").textContent = this.usuario.nome;
        this.obterInput("perfil-candidato-campo-nome").value = this.usuario.nome;
        this.obterInput("perfil-candidato-campo-email").value = this.usuario.email;
        this.obterInput("perfil-candidato-campo-cpf").value = this.usuario.cpf;
        this.obterInput("perfil-candidato-campo-idade").value = this.usuario.idade;
        this.obterInput("perfil-candidato-campo-estado").value =
            this.usuario.estado;
        this.obterInput("perfil-candidato-campo-cep").value = this.usuario.cep;
        this.obterTextarea("perfil-candidato-campo-descricao").value =
            this.usuario.descricao;
        this.competencias = [...this.usuario.competencias];
        this.renderizarCompetencias();
        const avatarEl = document.getElementById("perfil-candidato-avatar");
        if (this.usuario.foto) {
            this.fotoBase64 = this.usuario.foto;
            avatarEl.style.backgroundImage = `url(${this.usuario.foto})`;
            avatarEl.style.backgroundSize = "cover";
            avatarEl.style.backgroundPosition = "center";
            avatarEl.textContent = "";
        }
        else {
            avatarEl.textContent = this.usuario.nome
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();
        }
    }
    registrarEventos() {
        var _a, _b, _c, _d;
        (_a = document.getElementById("btn-logout")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            StorageService.removerUsuarioAtual();
            window.location.href = "auth.html";
        });
        (_b = document
            .getElementById("perfil-candidato-btn-salvar")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => this.salvarPerfil());
        (_c = document
            .getElementById("perfil-candidato-btn-excluir")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => this.excluirConta());
        const avatarEl = document.getElementById("perfil-candidato-avatar");
        const inputFoto = document.getElementById("perfil-candidato-avatar-input");
        avatarEl === null || avatarEl === void 0 ? void 0 : avatarEl.addEventListener("click", () => inputFoto.click());
        inputFoto === null || inputFoto === void 0 ? void 0 : inputFoto.addEventListener("change", (e) => this.processarFoto(e));
        (_d = document
            .getElementById("modal-vaga-btn-fechar")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => {
            var _a, _b;
            (_a = document.getElementById("modal-vaga")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
            (_b = document
                .getElementById("modal-vaga-dados-empresa")) === null || _b === void 0 ? void 0 : _b.classList.add("hidden");
        });
        this.configurarAlternarSenha("perfil-candidato-campo-senha-atual", "perfil-candidato-toggle-senha-atual");
        this.configurarAlternarSenha("perfil-candidato-campo-nova-senha", "perfil-candidato-toggle-nova-senha");
    }
    configurarAlternarSenha(inputId, botaoId) {
        const input = document.getElementById(inputId);
        const botao = document.getElementById(botaoId);
        if (!input || !botao)
            return;
        botao.addEventListener("click", () => {
            input.type = input.type === "password" ? "text" : "password";
        });
    }
    processarFoto(evento) {
        var _a;
        const input = evento.target;
        const arquivo = (_a = input.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!arquivo)
            return;
        const reader = new FileReader();
        reader.onload = () => {
            this.fotoBase64 = reader.result;
            const avatarEl = document.getElementById("perfil-candidato-avatar");
            avatarEl.style.backgroundImage = `url(${this.fotoBase64})`;
            avatarEl.style.backgroundSize = "cover";
            avatarEl.style.backgroundPosition = "center";
            avatarEl.textContent = "";
        };
        reader.readAsDataURL(arquivo);
    }
    salvarPerfil() {
        const senhaAtual = this.obterInput("perfil-candidato-campo-senha-atual").value.trim();
        const novaSenha = this.obterInput("perfil-candidato-campo-nova-senha").value.trim();
        if (senhaAtual && senhaAtual !== this.usuario.senha) {
            alert("Senha atual incorreta.");
            return;
        }
        if (novaSenha && novaSenha.length < 6) {
            alert("A nova senha deve ter pelo menos 6 caracteres.");
            return;
        }
        const atualizado = Object.assign(Object.assign({}, this.usuario), { nome: this.obterInput("perfil-candidato-campo-nome").value, email: this.obterInput("perfil-candidato-campo-email").value, cpf: this.obterInput("perfil-candidato-campo-cpf").value, idade: this.obterInput("perfil-candidato-campo-idade").value, estado: this.obterInput("perfil-candidato-campo-estado").value, cep: this.obterInput("perfil-candidato-campo-cep").value, descricao: this.obterTextarea("perfil-candidato-campo-descricao").value, foto: this.fotoBase64 || this.usuario.foto, competencias: this.competencias, senha: novaSenha || this.usuario.senha });
        StorageService.atualizarUsuario(atualizado);
        this.usuario = atualizado;
        document.getElementById("perfil-candidato-nome").textContent = atualizado.nome;
        this.obterInput("perfil-candidato-campo-senha-atual").value = "";
        this.obterInput("perfil-candidato-campo-nova-senha").value = "";
        alert("Salvo!");
    }
    excluirConta() {
        if (!confirm("Tem certeza que deseja excluir sua conta?"))
            return;
        StorageService.excluirUsuario(this.usuario.id);
        alert("Conta excluída com sucesso.");
        window.location.href = "auth.html";
    }
    // ---- COMPETÊNCIAS ----
    renderizarCompetencias() {
        const lista = document.getElementById("perfil-candidato-competencias-lista");
        const template = document.getElementById("perfil-candidato-competencia-template");
        if (!lista || !template)
            return;
        lista.innerHTML = "";
        this.competencias.forEach((competencia, indice) => {
            const item = template.cloneNode(true);
            item.classList.remove("hidden");
            item.querySelector(".competencia__texto").textContent = competencia;
            item.addEventListener("click", () => {
                if (!confirm("Remover competência?"))
                    return;
                this.competencias.splice(indice, 1);
                this.renderizarCompetencias();
            });
            lista.appendChild(item);
        });
    }
    registrarEventosCompetencias() {
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
            this.renderizarCompetencias();
            popup.classList.add("hidden");
            input.value = "";
        };
        cancelar.onclick = () => {
            popup.classList.add("hidden");
            input.value = "";
        };
    }
    // ---- SWIPE VAGAS ----
    iniciarSwipeVagas() {
        const vagasNaoVistas = MatchService.obterVagasNaoVistasPeloCandidato(this.usuario.id);
        new SwipeController(vagasNaoVistas, (vaga) => this.exibirCardVaga(vaga), (vaga) => {
            MatchService.registrarLikeCandidatoVaga(this.usuario.id, vaga.id);
            this.atualizarListaDeMatches();
        }, () => {
            var _a, _b;
            (_a = document.getElementById("match-swipe-card")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
            (_b = document
                .getElementById("match-swipe-sem-vagas")) === null || _b === void 0 ? void 0 : _b.classList.remove("hidden");
        });
    }
    exibirCardVaga(vaga) {
        var _a, _b, _c;
        (_a = document.getElementById("match-swipe-card")) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
        (_b = document
            .getElementById("match-swipe-dados-vaga")) === null || _b === void 0 ? void 0 : _b.classList.remove("hidden");
        (_c = document
            .getElementById("match-swipe-dados-candidato")) === null || _c === void 0 ? void 0 : _c.classList.add("hidden");
        document.getElementById("match-swipe-tipo").textContent =
            "Vaga";
        document.getElementById("match-swipe-titulo").textContent =
            vaga.titulo;
        document.getElementById("match-swipe-vaga-descricao").value = vaga.descricao || "";
        document.getElementById("match-swipe-vaga-horario").value = vaga.horario || "";
        document.getElementById("match-swipe-vaga-localizacao").value = vaga.localizacao || "";
        document.getElementById("match-swipe-vaga-salario").value = vaga.remuneracao || "";
        document.getElementById("match-swipe-vaga-requisitos").value = vaga.requisitos || "";
    }
    // ---- MATCHES ----
    atualizarListaDeMatches() {
        const lista = document.getElementById("matches-lista");
        const template = lista === null || lista === void 0 ? void 0 : lista.querySelector(".matches__item");
        if (!lista || !template)
            return;
        lista.innerHTML = "";
        lista.appendChild(template);
        template.classList.add("hidden");
        MatchService.obterMatchesCompletosDoCandidato(this.usuario.id).forEach(({ vaga, empresa }) => {
            const item = template.cloneNode(true);
            item.classList.remove("hidden");
            item.querySelector(".matches__item-titulo").textContent = vaga.titulo;
            item.addEventListener("click", () => this.abrirDetalhesVaga(vaga, empresa));
            lista.appendChild(item);
        });
    }
    abrirDetalhesVaga(vaga, empresa) {
        this.obterElemento("modal-vaga").classList.remove("hidden");
        this.obterElemento("modal-vaga-dados-empresa").classList.remove("hidden");
        document.getElementById("modal-vaga-titulo").textContent =
            vaga.titulo;
        this.obterElemento("modal-vaga-campo-descricao").value = vaga.descricao || "";
        this.obterElemento("modal-vaga-campo-horario").value =
            vaga.horario || "";
        this.obterElemento("modal-vaga-campo-localizacao").value =
            vaga.localizacao || "";
        this.obterElemento("modal-vaga-campo-salario").value =
            vaga.remuneracao || "";
        this.obterElemento("modal-vaga-campo-requisitos").value = vaga.requisitos || "";
        this.obterElemento("modal-vaga-campo-competencias").value = vaga.competencias.join(", ");
        this.obterElemento("modal-vaga-empresa-nome").value =
            empresa.nome;
        this.obterElemento("modal-vaga-empresa-email").value =
            empresa.email;
        this.obterElemento("modal-vaga-empresa-cnpj").value =
            empresa.cnpj;
        this.obterElemento("modal-vaga-empresa-descricao").value = empresa.descricao;
        this.obterElemento("modal-vaga-empresa-pais").value =
            empresa.pais;
        this.obterElemento("modal-vaga-empresa-estado").value =
            empresa.estado;
        this.obterElemento("modal-vaga-empresa-cep").value =
            empresa.cep;
    }
}
