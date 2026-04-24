import { StorageService } from "../services/StorageService.js";
import { MatchService } from "../services/MatchService.js";
import { SwipeController } from "./SwipeController.js";
export class EmpresaController {
    constructor(usuario) {
        this.usuario = usuario;
        this.fotoBase64 = "";
        this.competenciasVagaAtual = [];
        this.vagaEmEdicaoId = null;
        this.chart = null;
        this.init();
    }
    init() {
        var _a, _b;
        (_a = document.getElementById("menu-empresa")) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
        (_b = document.getElementById("perfil-empresa")) === null || _b === void 0 ? void 0 : _b.classList.remove("hidden");
        this.carregarPerfil();
        this.registrarEventos();
        this.registrarEventosVagas();
        this.renderizarVagas();
        this.iniciarSwipeCandidatos();
        this.atualizarListaDeMatches();
    }
    obterInput(id) {
        return document.getElementById(id);
    }
    obterTextarea(id) {
        return document.getElementById(id);
    }
    // ---- PERFIL ----
    carregarPerfil() {
        document.getElementById("perfil-empresa-nome").textContent = this.usuario.nome;
        this.obterInput("perfil-empresa-campo-nome").value = this.usuario.nome;
        this.obterInput("perfil-empresa-campo-email").value = this.usuario.email;
        this.obterInput("perfil-empresa-campo-cnpj").value = this.usuario.cnpj;
        this.obterInput("perfil-empresa-campo-pais").value = this.usuario.pais;
        this.obterInput("perfil-empresa-campo-estado").value = this.usuario.estado;
        this.obterInput("perfil-empresa-campo-cep").value = this.usuario.cep;
        this.obterTextarea("perfil-empresa-campo-descricao").value =
            this.usuario.descricao;
        const avatarEl = document.getElementById("perfil-empresa-avatar");
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
        var _a, _b, _c, _d, _e, _f;
        (_a = document.getElementById("btn-logout")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            StorageService.removerUsuarioAtual();
            window.location.href = "auth.html";
        });
        (_b = document
            .getElementById("perfil-empresa-btn-salvar")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => this.salvarPerfil());
        const avatarEl = document.getElementById("perfil-empresa-avatar");
        const inputFoto = document.getElementById("perfil-empresa-avatar-input");
        avatarEl === null || avatarEl === void 0 ? void 0 : avatarEl.addEventListener("click", () => inputFoto.click());
        inputFoto === null || inputFoto === void 0 ? void 0 : inputFoto.addEventListener("change", (e) => this.processarFoto(e));
        (_c = document
            .getElementById("modal-vaga-btn-fechar")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => { var _a; return (_a = document.getElementById("modal-vaga")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden"); });
        (_d = document
            .getElementById("modal-candidato-btn-fechar")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => { var _a; return (_a = document.getElementById("modal-candidato")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden"); });
        (_e = document
            .getElementById("perfil-empresa-btn-excluir")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", () => this.excluirConta());
        (_f = document
            .getElementById("vagas-empresa-btn-excluir")) === null || _f === void 0 ? void 0 : _f.addEventListener("click", () => this.excluirVagaAtual());
        this.configurarAlternarSenha("perfil-empresa-campo-senha-atual", "perfil-empresa-toggle-senha-atual");
        this.configurarAlternarSenha("perfil-empresa-campo-nova-senha", "perfil-empresa-toggle-nova-senha");
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
            const avatarEl = document.getElementById("perfil-empresa-avatar");
            avatarEl.style.backgroundImage = `url(${this.fotoBase64})`;
            avatarEl.style.backgroundSize = "cover";
            avatarEl.style.backgroundPosition = "center";
            avatarEl.textContent = "";
        };
        reader.readAsDataURL(arquivo);
    }
    salvarPerfil() {
        const senhaAtual = this.obterInput("perfil-empresa-campo-senha-atual").value.trim();
        const novaSenha = this.obterInput("perfil-empresa-campo-nova-senha").value.trim();
        if (senhaAtual && senhaAtual !== this.usuario.senha) {
            alert("Senha atual incorreta.");
            return;
        }
        if (novaSenha && novaSenha.length < 6) {
            alert("A nova senha deve ter pelo menos 6 caracteres.");
            return;
        }
        const atualizado = Object.assign(Object.assign({}, this.usuario), { nome: this.obterInput("perfil-empresa-campo-nome").value, email: this.obterInput("perfil-empresa-campo-email").value, cnpj: this.obterInput("perfil-empresa-campo-cnpj").value, pais: this.obterInput("perfil-empresa-campo-pais").value, estado: this.obterInput("perfil-empresa-campo-estado").value, cep: this.obterInput("perfil-empresa-campo-cep").value, descricao: this.obterTextarea("perfil-empresa-campo-descricao").value, foto: this.fotoBase64 || this.usuario.foto, senha: novaSenha || this.usuario.senha });
        StorageService.atualizarUsuario(atualizado);
        this.usuario = atualizado;
        document.getElementById("perfil-empresa-nome").textContent = atualizado.nome;
        this.obterInput("perfil-empresa-campo-senha-atual").value = "";
        this.obterInput("perfil-empresa-campo-nova-senha").value = "";
        alert("Salvo!");
    }
    excluirConta() {
        if (!confirm("Tem certeza que deseja excluir sua conta?"))
            return;
        StorageService.excluirUsuario(this.usuario.id);
        alert("Conta excluída com sucesso.");
        window.location.href = "auth.html";
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
    // ---- VAGAS ----
    registrarEventosVagas() {
        const btn = document.getElementById("vagas-empresa-btn-add");
        const modal = document.getElementById("vagas-empresa-modal");
        const cancelar = document.getElementById("vagas-empresa-cancelar");
        const cancelarHeader = document.getElementById("vagas-empresa-cancelar-header");
        const form = modal === null || modal === void 0 ? void 0 : modal.querySelector("form");
        btn === null || btn === void 0 ? void 0 : btn.addEventListener("click", () => {
            this.vagaEmEdicaoId = null;
            this.limparModal();
            const tituloModal = document.getElementById("vagas-empresa-modal-titulo");
            if (tituloModal)
                tituloModal.textContent = "Nova vaga";
            modal === null || modal === void 0 ? void 0 : modal.classList.remove("hidden");
        });
        const fecharModal = (e) => {
            e.preventDefault();
            modal === null || modal === void 0 ? void 0 : modal.classList.add("hidden");
            this.limparModal();
        };
        cancelar === null || cancelar === void 0 ? void 0 : cancelar.addEventListener("click", fecharModal);
        cancelarHeader === null || cancelarHeader === void 0 ? void 0 : cancelarHeader.addEventListener("click", fecharModal);
        form === null || form === void 0 ? void 0 : form.addEventListener("submit", (e) => {
            e.preventDefault();
            this.salvarVaga();
            modal === null || modal === void 0 ? void 0 : modal.classList.add("hidden");
            this.limparModal();
        });
        this.registrarEventosCompetenciasVaga();
    }
    salvarVaga() {
        const vaga = {
            id: this.vagaEmEdicaoId || crypto.randomUUID(),
            empresaId: this.usuario.id,
            titulo: this.obterInput("vaga-campo-titulo").value,
            descricao: this.obterTextarea("vaga-campo-descricao").value,
            horario: this.obterInput("vaga-campo-horario").value,
            localizacao: this.obterInput("vaga-campo-localizacao").value,
            remuneracao: this.obterInput("vaga-campo-salario").value,
            requisitos: this.obterTextarea("vaga-campo-requisitos").value,
            competencias: [...this.competenciasVagaAtual],
        };
        const vagas = this.usuario.vagas || [];
        const indice = vagas.findIndex((v) => v.id === vaga.id);
        if (indice >= 0)
            vagas[indice] = vaga;
        else
            vagas.push(vaga);
        const atualizado = Object.assign(Object.assign({}, this.usuario), { vagas });
        StorageService.atualizarUsuario(atualizado);
        this.usuario = atualizado;
        this.renderizarVagas();
        this.atualizarListaDeMatches();
    }
    renderizarVagas() {
        var _a;
        const lista = document.getElementById("vagas-empresa-lista");
        const template = lista === null || lista === void 0 ? void 0 : lista.querySelector(".vagas-empresa__item");
        if (!lista || !template)
            return;
        lista.innerHTML = "";
        lista.appendChild(template);
        template.classList.add("hidden");
        (_a = this.usuario.vagas) === null || _a === void 0 ? void 0 : _a.forEach((vaga) => {
            const item = template.cloneNode(true);
            item.classList.remove("hidden");
            item.querySelector(".vagas-empresa__item-titulo").textContent = vaga.titulo;
            item.addEventListener("click", () => this.abrirEdicaoVaga(vaga));
            lista.appendChild(item);
        });
    }
    abrirEdicaoVaga(vaga) {
        var _a;
        this.vagaEmEdicaoId = vaga.id;
        this.competenciasVagaAtual = [...vaga.competencias];
        this.obterInput("vaga-campo-titulo").value = vaga.titulo;
        this.obterTextarea("vaga-campo-descricao").value = vaga.descricao;
        this.obterInput("vaga-campo-horario").value = vaga.horario;
        this.obterInput("vaga-campo-localizacao").value = vaga.localizacao;
        this.obterInput("vaga-campo-salario").value = vaga.remuneracao;
        this.obterTextarea("vaga-campo-requisitos").value = vaga.requisitos;
        const tituloModal = document.getElementById("vagas-empresa-modal-titulo");
        if (tituloModal)
            tituloModal.textContent = "Editar vaga";
        this.renderizarCompetenciasVaga();
        (_a = document.getElementById("vagas-empresa-modal")) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
    }
    limparModal() {
        this.vagaEmEdicaoId = null;
        this.competenciasVagaAtual = [];
        this.obterInput("vaga-campo-titulo").value = "";
        this.obterTextarea("vaga-campo-descricao").value = "";
        this.obterInput("vaga-campo-horario").value = "";
        this.obterInput("vaga-campo-localizacao").value = "";
        this.obterInput("vaga-campo-salario").value = "";
        this.obterTextarea("vaga-campo-requisitos").value = "";
        document.getElementById("vagas-empresa-competencias-lista").innerHTML = "";
    }
    excluirVagaAtual() {
        var _a;
        if (!this.vagaEmEdicaoId)
            return;
        if (!confirm("Tem certeza que deseja excluir esta vaga?"))
            return;
        StorageService.excluirVaga(this.vagaEmEdicaoId, this.usuario.id);
        this.usuario = StorageService.obterUsuarioAtual();
        (_a = document.getElementById("vagas-empresa-modal")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
        this.limparModal();
        this.renderizarVagas();
        this.atualizarListaDeMatches();
        alert("Vaga excluída com sucesso.");
    }
    // ---- COMPETÊNCIAS DA VAGA ----
    registrarEventosCompetenciasVaga() {
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
                this.competenciasVagaAtual.push(valor);
                this.renderizarCompetenciasVaga();
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
    renderizarCompetenciasVaga() {
        const lista = document.getElementById("vagas-empresa-competencias-lista");
        const template = document.getElementById("vagas-empresa-competencia-template");
        if (!lista || !template)
            return;
        lista.innerHTML = "";
        this.competenciasVagaAtual.forEach((competencia, indice) => {
            const item = template.cloneNode(true);
            item.classList.remove("hidden");
            item.removeAttribute("id");
            item.querySelector(".competencia__texto").textContent = competencia;
            item.addEventListener("click", () => {
                this.competenciasVagaAtual.splice(indice, 1);
                this.renderizarCompetenciasVaga();
            });
            lista.appendChild(item);
        });
    }
    // ---- SWIPE CANDIDATOS ----
    iniciarSwipeCandidatos() {
        new SwipeController(MatchService.obterCandidatosParaSwipe(), (candidato) => this.exibirCardCandidato(candidato), (candidato) => {
            MatchService.registrarLikeEmpresaCandidato(this.usuario.id, candidato.id);
            this.atualizarListaDeMatches();
        }, () => this.exibirSemCandidatos());
    }
    exibirCardCandidato(candidato) {
        var _a, _b, _c, _d, _e;
        (_a = document.getElementById("match-swipe-card")) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
        (_b = document
            .getElementById("match-swipe-sem-candidatos")) === null || _b === void 0 ? void 0 : _b.classList.add("hidden");
        (_c = document.getElementById("match-swipe-sem-vagas")) === null || _c === void 0 ? void 0 : _c.classList.add("hidden");
        (_d = document
            .getElementById("match-swipe-dados-candidato")) === null || _d === void 0 ? void 0 : _d.classList.remove("hidden");
        (_e = document.getElementById("match-swipe-dados-vaga")) === null || _e === void 0 ? void 0 : _e.classList.add("hidden");
        document.getElementById("match-swipe-tipo").textContent =
            "";
        document.getElementById("match-swipe-titulo").textContent =
            "Perfil Anônimo";
        document.getElementById("match-swipe-candidato-descricao").value = candidato.descricao || "";
        document.getElementById("match-swipe-candidato-estado").value = candidato.estado || "";
        const lista = document.getElementById("match-swipe-candidato-competencias");
        const template = document.getElementById("vagas-empresa-competencia-template");
        if (!lista || !template)
            return;
        lista.innerHTML = "";
        candidato.competencias.forEach((competencia) => {
            const item = template.cloneNode(true);
            item.classList.remove("hidden");
            item.querySelector(".competencia__texto").textContent = competencia;
            lista.appendChild(item);
        });
    }
    exibirSemCandidatos() {
        var _a, _b, _c;
        (_a = document.getElementById("match-swipe-card")) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
        (_b = document
            .getElementById("match-swipe-sem-candidatos")) === null || _b === void 0 ? void 0 : _b.classList.remove("hidden");
        (_c = document.getElementById("match-swipe-sem-vagas")) === null || _c === void 0 ? void 0 : _c.classList.add("hidden");
    }
    // ---- MATCHES ----
    atualizarListaDeMatches() {
        const lista = document.getElementById("matches-lista");
        const template = lista === null || lista === void 0 ? void 0 : lista.querySelector(".matches__item");
        const dropdown = document.getElementById("matches-dropdown");
        if (!lista || !template || !dropdown)
            return;
        lista.innerHTML = "";
        lista.appendChild(template);
        template.classList.add("hidden");
        lista.appendChild(dropdown);
        dropdown.classList.add("hidden");
        MatchService.obterMatchesCompletosDaEmpresa(this.usuario.id).forEach(({ vaga, candidatos }) => {
            const item = template.cloneNode(true);
            item.classList.remove("hidden");
            const tituloEl = item.querySelector(".matches__item-titulo");
            const seta = item.querySelector(".arrow");
            if (!tituloEl || !seta)
                return;
            tituloEl.textContent = vaga.titulo;
            seta.addEventListener("click", (e) => {
                e.stopPropagation();
                const mesmoAberto = !dropdown.classList.contains("hidden") &&
                    dropdown.previousElementSibling === item;
                document
                    .querySelectorAll(".arrow")
                    .forEach((a) => a.classList.remove("active"));
                if (mesmoAberto) {
                    dropdown.classList.add("hidden");
                    return;
                }
                const ul = dropdown.querySelector("#matches-dropdown-lista");
                if (!ul)
                    return;
                ul.innerHTML = "";
                candidatos.forEach((candidato, indice) => {
                    const liNome = document.createElement("li");
                    liNome.className = "nome-candidato-list";
                    liNome.textContent = candidato.nome;
                    const liNumero = document.createElement("li");
                    liNumero.className = "numero-candidato-list";
                    liNumero.textContent = `#${indice + 1}`;
                    const itemCandidato = document.createElement("ul");
                    itemCandidato.className = "matches-dropdown-lista";
                    itemCandidato.appendChild(liNome);
                    itemCandidato.appendChild(liNumero);
                    itemCandidato.addEventListener("click", () => {
                        this.abrirDetalhesCandidato(candidato);
                        dropdown.classList.add("hidden");
                        seta.classList.remove("active");
                    });
                    ul.appendChild(itemCandidato);
                });
                item.insertAdjacentElement("afterend", dropdown);
                dropdown.classList.remove("hidden");
                seta.classList.add("active");
            });
            item.addEventListener("click", (e) => {
                if (e.target.classList.contains("arrow"))
                    return;
                dropdown.classList.add("hidden");
                document
                    .querySelectorAll(".arrow")
                    .forEach((a) => a.classList.remove("active"));
                this.abrirDetalhesVaga(vaga);
            });
            lista.appendChild(item);
        });
    }
    abrirDetalhesVaga(vaga) {
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
        this.renderizarGrafico(vaga);
    }
    abrirDetalhesCandidato(candidato) {
        var _a;
        (_a = document.getElementById("modal-candidato")) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
        document.getElementById("modal-candidato-titulo").textContent = candidato.nome;
        document.getElementById("modal-candidato-campo-email").value = candidato.email;
        document.getElementById("modal-candidato-campo-cpf").value = candidato.cpf;
        document.getElementById("modal-candidato-campo-idade").value = candidato.idade;
        document.getElementById("modal-candidato-campo-estado").value = candidato.estado;
        document.getElementById("modal-candidato-campo-cep").value = candidato.cep;
        document.getElementById("modal-candidato-campo-descricao").value = candidato.descricao;
        const lista = document.getElementById("modal-candidato-competencias-lista");
        const template = document.getElementById("modal-candidato-competencia-template");
        if (!lista || !template)
            return;
        lista.innerHTML = "";
        candidato.competencias.forEach((competencia) => {
            const item = template.cloneNode(true);
            item.classList.remove("hidden");
            item.querySelector(".competencia__texto").textContent = competencia;
            lista.appendChild(item);
        });
    }
    // ---- GRÁFICO ----
    calcularPercentuaisCompetencias(vaga) {
        const matches = MatchService.obterMatchesCompletosDaEmpresa(this.usuario.id).filter((m) => m.vaga.id === vaga.id);
        const candidatos = matches.reduce((acc, m) => acc.concat(m.candidatos), []);
        if (!candidatos.length)
            return vaga.competencias.map(() => 0);
        return vaga.competencias.map((competencia) => {
            const total = candidatos.filter((candidato) => candidato.competencias.some((comp) => comp.toLowerCase() === competencia.toLowerCase())).length;
            return Math.round((total / candidatos.length) * 100);
        });
    }
    renderizarGrafico(vaga) {
        const canvas = document.getElementById("modal-vaga-grafico");
        if (!canvas)
            return;
        const ChartClass = window.Chart;
        if (!ChartClass)
            return;
        const dados = this.calcularPercentuaisCompetencias(vaga);
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
}
