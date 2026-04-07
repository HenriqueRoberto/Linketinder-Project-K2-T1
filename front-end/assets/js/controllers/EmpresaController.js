import { StorageService } from "../services/StorageService.js";
import { MatchController } from "./MatchController.js";
export class EmpresaController {
    constructor(user) {
        this.user = user;
        this.fotoBase64 = "";
        this.competenciasVaga = [];
        this.vagaEmEdicaoId = null;
        this.chart = null;
        this.init();
    }
    init() {
        var _a, _b;
        (_a = document.getElementById("menu-empresa")) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
        (_b = document.getElementById("perfil-empresa")) === null || _b === void 0 ? void 0 : _b.classList.remove("hidden");
        this.load();
        this.events();
        this.vagas();
        this.renderVagas();
        this.initMatchCandidatos();
        this.renderMatches();
    }
    input(id) {
        return document.getElementById(id);
    }
    textarea(id) {
        return document.getElementById(id);
    }
    // ================= PROFILE =================
    load() {
        document.getElementById("perfil-empresa-nome").textContent = this.user.nome;
        this.input("perfil-empresa-campo-nome").value = this.user.nome;
        this.input("perfil-empresa-campo-email").value = this.user.email;
        this.input("perfil-empresa-campo-cnpj").value = this.user.cnpj;
        this.input("perfil-empresa-campo-pais").value = this.user.pais;
        this.input("perfil-empresa-campo-estado").value = this.user.estado;
        this.input("perfil-empresa-campo-cep").value = this.user.cep;
        this.textarea("perfil-empresa-campo-descricao").value = this.user.descricao;
        const fotoEl = document.getElementById("perfil-empresa-avatar");
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
        var _a, _b, _c, _d, _e, _f;
        (_a = document.getElementById("btn-logout")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            StorageService.clearCurrentUser();
            window.location.href = "auth.html";
        });
        (_b = document
            .getElementById("perfil-empresa-btn-salvar")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => this.save());
        const foto = document.getElementById("perfil-empresa-avatar");
        const inputFoto = document.getElementById("perfil-empresa-avatar-input");
        foto === null || foto === void 0 ? void 0 : foto.addEventListener("click", () => inputFoto.click());
        inputFoto === null || inputFoto === void 0 ? void 0 : inputFoto.addEventListener("change", (e) => this.handleFoto(e));
        (_c = document
            .getElementById("modal-vaga-btn-fechar")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
            var _a;
            (_a = document.getElementById("modal-vaga")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
        });
        (_d = document
            .getElementById("modal-candidato-btn-fechar")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => {
            var _a;
            (_a = document.getElementById("modal-candidato")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
        });
        (_e = document
            .getElementById("perfil-empresa-btn-excluir")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => this.deleteAccount());
        (_f = document
            .getElementById("vagas-empresa-btn-excluir")) === null || _f === void 0 ? void 0 : _f.addEventListener("click", () => this.deleteCurrentVaga());
        this.togglePassword("perfil-empresa-campo-senha-atual", "perfil-empresa-toggle-senha-atual");
        this.togglePassword("perfil-empresa-campo-nova-senha", "perfil-empresa-toggle-nova-senha");
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
            const foto = document.getElementById("perfil-empresa-avatar");
            foto.style.backgroundImage = `url(${this.fotoBase64})`;
            foto.style.backgroundSize = "cover";
            foto.style.backgroundPosition = "center";
            foto.textContent = "";
        };
        reader.readAsDataURL(file);
    }
    save() {
        const current = StorageService.getCurrentUser();
        const senhaAtualDigitada = this.input("perfil-empresa-campo-senha-atual").value.trim();
        const novaSenha = this.input("perfil-empresa-campo-nova-senha").value.trim();
        if (senhaAtualDigitada && senhaAtualDigitada !== current.senha) {
            alert("Senha atual incorreta.");
            return;
        }
        if (novaSenha && novaSenha.length < 6) {
            alert("A nova senha deve ter pelo menos 6 caracteres.");
            return;
        }
        const updated = Object.assign(Object.assign({}, current), { nome: this.input("perfil-empresa-campo-nome").value, email: this.input("perfil-empresa-campo-email").value, cnpj: this.input("perfil-empresa-campo-cnpj").value, pais: this.input("perfil-empresa-campo-pais").value, estado: this.input("perfil-empresa-campo-estado").value, cep: this.input("perfil-empresa-campo-cep").value, descricao: this.textarea("perfil-empresa-campo-descricao").value, foto: this.fotoBase64 || current.foto, senha: novaSenha || current.senha });
        StorageService.updateUser(updated);
        this.user = updated;
        document.getElementById("perfil-empresa-nome").textContent = updated.nome;
        this.input("perfil-empresa-campo-senha-atual").value = "";
        this.input("perfil-empresa-campo-nova-senha").value = "";
        alert("Salvo!");
    }
    deleteAccount() {
        if (!confirm("Tem certeza que deseja excluir sua conta?"))
            return;
        StorageService.deleteUser(this.user.id);
        alert("Conta excluída com sucesso.");
        window.location.href = "auth.html";
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
    // ================= VAGAS =================
    vagas() {
        const btn = document.getElementById("vagas-empresa-btn-add");
        const modal = document.getElementById("vagas-empresa-modal");
        const cancelar = document.getElementById("vagas-empresa-cancelar");
        const cancelarHeader = document.getElementById("vagas-empresa-cancelar-header");
        const form = modal === null || modal === void 0 ? void 0 : modal.querySelector("form");
        btn === null || btn === void 0 ? void 0 : btn.addEventListener("click", () => {
            this.vagaEmEdicaoId = null;
            this.resetModal();
            const tituloModal = document.getElementById("vagas-empresa-modal-titulo");
            if (tituloModal)
                tituloModal.textContent = "Nova vaga";
            modal === null || modal === void 0 ? void 0 : modal.classList.remove("hidden");
        });
        const fecharModal = (e) => {
            e.preventDefault();
            modal === null || modal === void 0 ? void 0 : modal.classList.add("hidden");
            this.resetModal();
        };
        cancelar === null || cancelar === void 0 ? void 0 : cancelar.addEventListener("click", fecharModal);
        cancelarHeader === null || cancelarHeader === void 0 ? void 0 : cancelarHeader.addEventListener("click", fecharModal);
        form === null || form === void 0 ? void 0 : form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.submitVaga();
            modal === null || modal === void 0 ? void 0 : modal.classList.add("hidden");
            this.resetModal();
        });
        this.competenciasModal();
    }
    submitVaga() {
        const vaga = {
            id: this.vagaEmEdicaoId || crypto.randomUUID(),
            empresaId: this.user.id,
            titulo: this.input("vaga-campo-titulo").value,
            descricao: this.textarea("vaga-campo-descricao").value,
            horario: this.input("vaga-campo-horario").value,
            localizacao: this.input("vaga-campo-localizacao").value,
            remuneracao: this.input("vaga-campo-salario").value,
            requisitos: this.textarea("vaga-campo-requisitos").value,
            competencias: [...this.competenciasVaga],
        };
        const vagas = this.user.vagas || [];
        const index = vagas.findIndex((v) => v.id === vaga.id);
        if (index >= 0)
            vagas[index] = vaga;
        else
            vagas.push(vaga);
        const updated = Object.assign(Object.assign({}, this.user), { vagas });
        StorageService.updateUser(updated);
        this.user = updated;
        this.renderVagas();
        this.renderMatches();
    }
    renderVagas() {
        var _a;
        const lista = document.getElementById("vagas-empresa-lista");
        const template = lista === null || lista === void 0 ? void 0 : lista.querySelector(".vagas-empresa__item");
        if (!lista || !template)
            return;
        lista.innerHTML = "";
        lista.appendChild(template);
        template.classList.add("hidden");
        (_a = this.user.vagas) === null || _a === void 0 ? void 0 : _a.forEach((vaga) => {
            const item = template.cloneNode(true);
            item.classList.remove("hidden");
            const titulo = item.querySelector(".vagas-empresa__item-titulo");
            titulo.textContent = vaga.titulo;
            item.addEventListener("click", () => this.openEditVaga(vaga));
            lista.appendChild(item);
        });
    }
    openEditVaga(vaga) {
        var _a;
        this.vagaEmEdicaoId = vaga.id;
        this.competenciasVaga = [...vaga.competencias];
        this.input("vaga-campo-titulo").value = vaga.titulo;
        this.textarea("vaga-campo-descricao").value = vaga.descricao;
        this.input("vaga-campo-horario").value = vaga.horario;
        this.input("vaga-campo-localizacao").value = vaga.localizacao;
        this.input("vaga-campo-salario").value = vaga.remuneracao;
        this.textarea("vaga-campo-requisitos").value = vaga.requisitos;
        const tituloModal = document.getElementById("vagas-empresa-modal-titulo");
        if (tituloModal)
            tituloModal.textContent = "Editar vaga";
        this.renderCompetenciasModal();
        (_a = document.getElementById("vagas-empresa-modal")) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
    }
    resetModal() {
        this.vagaEmEdicaoId = null;
        this.competenciasVaga = [];
        this.input("vaga-campo-titulo").value = "";
        this.textarea("vaga-campo-descricao").value = "";
        this.input("vaga-campo-horario").value = "";
        this.input("vaga-campo-localizacao").value = "";
        this.input("vaga-campo-salario").value = "";
        this.textarea("vaga-campo-requisitos").value = "";
        document.getElementById("vagas-empresa-competencias-lista").innerHTML = "";
    }
    deleteCurrentVaga() {
        var _a;
        if (!this.vagaEmEdicaoId)
            return;
        if (!confirm("Tem certeza que deseja excluir esta vaga?"))
            return;
        StorageService.deleteVaga(this.vagaEmEdicaoId, this.user.id);
        const updated = StorageService.getCurrentUser();
        this.user = updated;
        (_a = document.getElementById("vagas-empresa-modal")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
        this.resetModal();
        this.renderVagas();
        this.renderMatches();
        alert("Vaga excluída com sucesso.");
    }
    // ================= COMPETENCIAS =================
    competenciasModal() {
        const btn = document.getElementById("vagas-empresa-btn-add-competencia");
        const popup = document.getElementById("vagas-empresa-popup");
        const input = document.getElementById("vagas-empresa-popup-input");
        const confirmar = document.getElementById("vagas-empresa-popup-confirmar");
        const cancelar = document.getElementById("vagas-empresa-popup-cancelar");
        const regex = /^[A-Za-zÀ-ÿ0-9.+#-]{2,30}(?:\s[A-Za-zÀ-ÿ0-9.+#-]{2,30})*$/;
        if (confirmar) {
            confirmar.onclick = (e) => {
                e.preventDefault();
                const valor = input.value.trim();
                if (!valor) {
                    alert("Digite uma competência");
                    return;
                }
                if (!regex.test(valor)) {
                    alert("Digite uma competência válida, como Java, React, Node.js ou C#");
                    return;
                }
                this.competenciasVaga.push(valor);
                this.renderCompetenciasModal();
                popup === null || popup === void 0 ? void 0 : popup.classList.add("hidden");
                input.value = "";
            };
        }
        btn === null || btn === void 0 ? void 0 : btn.addEventListener("click", (e) => {
            e.preventDefault();
            popup === null || popup === void 0 ? void 0 : popup.classList.remove("hidden");
            input.focus();
        });
        cancelar === null || cancelar === void 0 ? void 0 : cancelar.addEventListener("click", () => {
            popup === null || popup === void 0 ? void 0 : popup.classList.add("hidden");
            input.value = "";
        });
    }
    renderCompetenciasModal() {
        const lista = document.getElementById("vagas-empresa-competencias-lista");
        const template = document.getElementById("vagas-empresa-competencia-template");
        if (!lista || !template)
            return;
        lista.innerHTML = "";
        this.competenciasVaga.forEach((competencia, index) => {
            const item = template.cloneNode(true);
            item.classList.remove("hidden");
            item.removeAttribute("id");
            const texto = item.querySelector(".competencia__texto");
            if (texto)
                texto.textContent = competencia;
            item.addEventListener("click", () => {
                this.competenciasVaga.splice(index, 1);
                this.renderCompetenciasModal();
            });
            lista.appendChild(item);
        });
    }
    // ================= MATCH =================
    initMatchCandidatos() {
        const candidatos = StorageService.getUsers().filter((u) => u.tipo === "candidato");
        new MatchController(candidatos, (c) => this.renderCardCandidato(c), (c) => {
            StorageService.saveLike({
                empresaId: this.user.id,
                candidatoId: c.id,
            });
            this.renderMatches();
        }, () => this.showSemCandidatos());
    }
    renderCardCandidato(c) {
        var _a, _b, _c, _d, _e;
        (_a = document.getElementById("match-swipe-card")) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
        (_b = document
            .getElementById("match-swipe-sem-candidatos")) === null || _b === void 0 ? void 0 : _b.classList.add("hidden");
        (_c = document.getElementById("match-swipe-sem-vagas")) === null || _c === void 0 ? void 0 : _c.classList.add("hidden");
        (_d = document
            .getElementById("match-swipe-dados-candidato")) === null || _d === void 0 ? void 0 : _d.classList.remove("hidden");
        (_e = document.getElementById("match-swipe-dados-vaga")) === null || _e === void 0 ? void 0 : _e.classList.add("hidden");
        const tipoEl = document.getElementById("match-swipe-tipo");
        if (tipoEl)
            tipoEl.textContent = "";
        document.getElementById("match-swipe-titulo").textContent =
            "Perfil Anônimo";
        document.getElementById("match-swipe-candidato-descricao").value = c.descricao || "";
        document.getElementById("match-swipe-candidato-estado").value = c.estado || "";
        const lista = document.getElementById("match-swipe-candidato-competencias");
        const template = document.getElementById("vagas-empresa-competencia-template");
        if (!lista || !template)
            return;
        lista.innerHTML = "";
        c.competencias.forEach((competencia) => {
            const item = template.cloneNode(true);
            item.classList.remove("hidden");
            item.querySelector(".competencia__texto").textContent = competencia;
            lista.appendChild(item);
        });
    }
    showSemCandidatos() {
        var _a, _b, _c;
        (_a = document.getElementById("match-swipe-card")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
        (_b = document
            .getElementById("match-swipe-sem-candidatos")) === null || _b === void 0 ? void 0 : _b.classList.remove("hidden");
        (_c = document.getElementById("match-swipe-sem-vagas")) === null || _c === void 0 ? void 0 : _c.classList.add("hidden");
    }
    // ================= MATCH LIST =================
    renderMatches() {
        const lista = document.getElementById("matches-lista");
        const template = lista === null || lista === void 0 ? void 0 : lista.querySelector(".matches__item");
        const drop = document.getElementById("matches-dropdown");
        if (!lista || !template || !drop)
            return;
        lista.innerHTML = "";
        lista.appendChild(template);
        template.classList.add("hidden");
        lista.appendChild(drop);
        drop.classList.add("hidden");
        const matches = MatchController.getMatches().filter((m) => m.empresaId === this.user.id);
        const vagasComMatch = [...new Set(matches.map((m) => m.vagaId))];
        vagasComMatch.forEach((vagaId) => {
            var _a;
            const vaga = (_a = this.user.vagas) === null || _a === void 0 ? void 0 : _a.find((v) => v.id === vagaId);
            if (!vaga)
                return;
            const candidatosDaVaga = matches.filter((m) => m.vagaId === vagaId);
            const item = template.cloneNode(true);
            item.classList.remove("hidden");
            const titulo = item.querySelector(".matches__item-titulo");
            const arrow = item.querySelector(".arrow");
            if (!titulo || !arrow)
                return;
            titulo.textContent = vaga.titulo;
            arrow.addEventListener("click", (e) => {
                e.stopPropagation();
                const mesmoItemAberto = !drop.classList.contains("hidden") &&
                    drop.previousElementSibling === item;
                document
                    .querySelectorAll(".arrow")
                    .forEach((a) => a.classList.remove("active"));
                if (mesmoItemAberto) {
                    drop.classList.add("hidden");
                    return;
                }
                const ul = drop.querySelector("#matches-dropdown-lista");
                if (!ul)
                    return;
                ul.innerHTML = "";
                candidatosDaVaga.forEach((match, index) => {
                    const candidato = StorageService.getUsers().find((u) => u.tipo === "candidato" && u.id === match.candidatoId);
                    if (!candidato)
                        return;
                    const liNome = document.createElement("li");
                    liNome.className = "nome-candidato-list";
                    liNome.textContent = candidato.nome;
                    const liNumero = document.createElement("li");
                    liNumero.className = "numero-candidato-list";
                    liNumero.textContent = `#${index + 1}`;
                    const candidatoItem = document.createElement("ul");
                    candidatoItem.className = "matches-dropdown-lista";
                    candidatoItem.appendChild(liNome);
                    candidatoItem.appendChild(liNumero);
                    candidatoItem.addEventListener("click", () => {
                        this.openCandidatoView(candidato);
                        drop.classList.add("hidden");
                        arrow.classList.remove("active");
                    });
                    ul.appendChild(candidatoItem);
                });
                item.insertAdjacentElement("afterend", drop);
                drop.classList.remove("hidden");
                arrow.classList.add("active");
            });
            item.addEventListener("click", (e) => {
                const target = e.target;
                if (target.classList.contains("arrow"))
                    return;
                drop.classList.add("hidden");
                document
                    .querySelectorAll(".arrow")
                    .forEach((a) => a.classList.remove("active"));
                this.openVagaView(vaga);
            });
            lista.appendChild(item);
        });
    }
    // ================= CANDIDATO VIEW =================
    openCandidatoView(c) {
        var _a;
        (_a = document.getElementById("modal-candidato")) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
        document.getElementById("modal-candidato-titulo").textContent = c.nome;
        const emailInput = document.getElementById("modal-candidato-campo-email");
        const emailInputComEspaco = document.getElementById("modal-candidato-campo-email");
        const email = emailInput || emailInputComEspaco;
        if (email)
            email.value = c.email;
        document.getElementById("modal-candidato-campo-cpf").value = c.cpf;
        document.getElementById("modal-candidato-campo-idade").value = c.idade;
        document.getElementById("modal-candidato-campo-estado").value = c.estado;
        document.getElementById("modal-candidato-campo-cep").value = c.cep;
        document.getElementById("modal-candidato-campo-descricao").value = c.descricao;
        const lista = document.getElementById("modal-candidato-competencias-lista");
        const template = document.getElementById("modal-candidato-competencia-template");
        if (!lista || !template)
            return;
        lista.innerHTML = "";
        c.competencias.forEach((competencia) => {
            const item = template.cloneNode(true);
            item.classList.remove("hidden");
            item.querySelector(".competencia__texto").textContent = competencia;
            lista.appendChild(item);
        });
    }
    // ================= GRAFICO =================
    gerarDadosGrafico(vaga) {
        const matches = MatchController.getMatches().filter((m) => m.empresaId === this.user.id && m.vagaId === vaga.id);
        const candidatos = StorageService.getUsers().filter((u) => u.tipo === "candidato" && matches.some((m) => m.candidatoId === u.id));
        if (!candidatos.length) {
            return vaga.competencias.map(() => 0);
        }
        return vaga.competencias.map((competencia) => {
            const totalComCompetencia = candidatos.filter((candidato) => candidato.competencias.some((c) => c.toLowerCase() === competencia.toLowerCase())).length;
            return Math.round((totalComCompetencia / candidatos.length) * 100);
        });
    }
    renderGrafico(vaga) {
        const canvas = document.getElementById("modal-vaga-grafico");
        if (!canvas)
            return;
        const ChartClass = window.Chart;
        if (!ChartClass)
            return;
        const dados = this.gerarDadosGrafico(vaga);
        if (this.chart) {
            this.chart.destroy();
        }
        this.chart = new ChartClass(canvas, {
            type: "bar",
            data: {
                labels: vaga.competencias,
                datasets: [
                    {
                        label: "% de candidatos",
                        data: dados,
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: "x",
                plugins: {
                    legend: {
                        display: true,
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `${context.raw}%`,
                        },
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: (value) => `${value}%`,
                        },
                    },
                },
            },
        });
    }
    // ================= VAGA VIEW =================
    openVagaView(vaga) {
        var _a, _b;
        (_a = document.getElementById("modal-vaga")) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
        (_b = document
            .getElementById("modal-vaga-dados-empresa")) === null || _b === void 0 ? void 0 : _b.classList.add("hidden");
        document.getElementById("modal-vaga-titulo").textContent =
            vaga.titulo;
        document.getElementById("modal-vaga-campo-descricao").value = vaga.descricao || "";
        document.getElementById("modal-vaga-campo-horario").value = vaga.horario || "";
        document.getElementById("modal-vaga-campo-localizacao").value = vaga.localizacao || "";
        document.getElementById("modal-vaga-campo-salario").value = vaga.remuneracao || "";
        document.getElementById("modal-vaga-campo-requisitos").value = vaga.requisitos || "";
        document.getElementById("modal-vaga-campo-competencias").value = vaga.competencias.join(", ");
        this.renderGrafico(vaga);
    }
}
