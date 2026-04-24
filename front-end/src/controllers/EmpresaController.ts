import { Candidato, Empresa, Vaga } from "../types.js";
import { StorageService } from "../services/StorageService.js";
import { MatchService, MatchDaEmpresa } from "../services/MatchService.js";
import { SwipeController } from "./SwipeController.js";

export class EmpresaController {
  private fotoBase64 = "";
  private competenciasVagaAtual: string[] = [];
  private vagaEmEdicaoId: string | null = null;
  private chart: any = null;

  constructor(private usuario: Empresa) {
    this.init();
  }

  private init(): void {
    document.getElementById("menu-empresa")?.classList.remove("hidden");
    document.getElementById("perfil-empresa")?.classList.remove("hidden");

    this.carregarPerfil();
    this.registrarEventos();
    this.registrarEventosVagas();
    this.renderizarVagas();
    this.iniciarSwipeCandidatos();
    this.atualizarListaDeMatches();
  }

  private obterInput(id: string): HTMLInputElement {
    return document.getElementById(id) as HTMLInputElement;
  }

  private obterTextarea(id: string): HTMLTextAreaElement {
    return document.getElementById(id) as HTMLTextAreaElement;
  }

  // ---- PERFIL ----

  private carregarPerfil(): void {
    (
      document.getElementById("perfil-empresa-nome") as HTMLElement
    ).textContent = this.usuario.nome;

    this.obterInput("perfil-empresa-campo-nome").value = this.usuario.nome;
    this.obterInput("perfil-empresa-campo-email").value = this.usuario.email;
    this.obterInput("perfil-empresa-campo-cnpj").value = this.usuario.cnpj;
    this.obterInput("perfil-empresa-campo-pais").value = this.usuario.pais;
    this.obterInput("perfil-empresa-campo-estado").value = this.usuario.estado;
    this.obterInput("perfil-empresa-campo-cep").value = this.usuario.cep;
    this.obterTextarea("perfil-empresa-campo-descricao").value =
      this.usuario.descricao;

    const avatarEl = document.getElementById(
      "perfil-empresa-avatar",
    ) as HTMLDivElement;
    if (this.usuario.foto) {
      this.fotoBase64 = this.usuario.foto;
      avatarEl.style.backgroundImage = `url(${this.usuario.foto})`;
      avatarEl.style.backgroundSize = "cover";
      avatarEl.style.backgroundPosition = "center";
      avatarEl.textContent = "";
    } else {
      avatarEl.textContent = this.usuario.nome
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    }
  }

  private registrarEventos(): void {
    document.getElementById("btn-logout")?.addEventListener("click", () => {
      StorageService.removerUsuarioAtual();
      window.location.href = "auth.html";
    });

    document
      .getElementById("perfil-empresa-btn-salvar")
      ?.addEventListener("click", () => this.salvarPerfil());

    const avatarEl = document.getElementById("perfil-empresa-avatar");
    const inputFoto = document.getElementById(
      "perfil-empresa-avatar-input",
    ) as HTMLInputElement;
    avatarEl?.addEventListener("click", () => inputFoto.click());
    inputFoto?.addEventListener("change", (e) => this.processarFoto(e));

    document
      .getElementById("modal-vaga-btn-fechar")
      ?.addEventListener("click", () =>
        document.getElementById("modal-vaga")?.classList.add("hidden"),
      );

    document
      .getElementById("modal-candidato-btn-fechar")
      ?.addEventListener("click", () =>
        document.getElementById("modal-candidato")?.classList.add("hidden"),
      );

    document
      .getElementById("perfil-empresa-btn-excluir")
      ?.addEventListener("click", () => this.excluirConta());

    document
      .getElementById("vagas-empresa-btn-excluir")
      ?.addEventListener("click", () => this.excluirVagaAtual());

    this.configurarAlternarSenha(
      "perfil-empresa-campo-senha-atual",
      "perfil-empresa-toggle-senha-atual",
    );
    this.configurarAlternarSenha(
      "perfil-empresa-campo-nova-senha",
      "perfil-empresa-toggle-nova-senha",
    );
  }

  private processarFoto(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const arquivo = input.files?.[0];
    if (!arquivo) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.fotoBase64 = reader.result as string;
      const avatarEl = document.getElementById(
        "perfil-empresa-avatar",
      ) as HTMLDivElement;
      avatarEl.style.backgroundImage = `url(${this.fotoBase64})`;
      avatarEl.style.backgroundSize = "cover";
      avatarEl.style.backgroundPosition = "center";
      avatarEl.textContent = "";
    };
    reader.readAsDataURL(arquivo);
  }

  private salvarPerfil(): void {
    const senhaAtual = this.obterInput(
      "perfil-empresa-campo-senha-atual",
    ).value.trim();
    const novaSenha = this.obterInput(
      "perfil-empresa-campo-nova-senha",
    ).value.trim();

    if (senhaAtual && senhaAtual !== this.usuario.senha) {
      alert("Senha atual incorreta.");
      return;
    }
    if (novaSenha && novaSenha.length < 6) {
      alert("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    const atualizado: Empresa = {
      ...this.usuario,
      nome: this.obterInput("perfil-empresa-campo-nome").value,
      email: this.obterInput("perfil-empresa-campo-email").value,
      cnpj: this.obterInput("perfil-empresa-campo-cnpj").value,
      pais: this.obterInput("perfil-empresa-campo-pais").value,
      estado: this.obterInput("perfil-empresa-campo-estado").value,
      cep: this.obterInput("perfil-empresa-campo-cep").value,
      descricao: this.obterTextarea("perfil-empresa-campo-descricao").value,
      foto: this.fotoBase64 || this.usuario.foto,
      senha: novaSenha || this.usuario.senha,
    };

    StorageService.atualizarUsuario(atualizado);
    this.usuario = atualizado;
    (
      document.getElementById("perfil-empresa-nome") as HTMLElement
    ).textContent = atualizado.nome;
    this.obterInput("perfil-empresa-campo-senha-atual").value = "";
    this.obterInput("perfil-empresa-campo-nova-senha").value = "";
    alert("Salvo!");
  }

  private excluirConta(): void {
    if (!confirm("Tem certeza que deseja excluir sua conta?")) return;
    StorageService.excluirUsuario(this.usuario.id);
    alert("Conta excluída com sucesso.");
    window.location.href = "auth.html";
  }

  private configurarAlternarSenha(inputId: string, botaoId: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const botao = document.getElementById(botaoId);
    if (!input || !botao) return;
    botao.addEventListener("click", () => {
      input.type = input.type === "password" ? "text" : "password";
    });
  }

  // ---- VAGAS ----

  private registrarEventosVagas(): void {
    const btn = document.getElementById("vagas-empresa-btn-add");
    const modal = document.getElementById("vagas-empresa-modal");
    const cancelar = document.getElementById("vagas-empresa-cancelar");
    const cancelarHeader = document.getElementById(
      "vagas-empresa-cancelar-header",
    );
    const form = modal?.querySelector("form");

    btn?.addEventListener("click", () => {
      this.vagaEmEdicaoId = null;
      this.limparModal();
      const tituloModal = document.getElementById("vagas-empresa-modal-titulo");
      if (tituloModal) tituloModal.textContent = "Nova vaga";
      modal?.classList.remove("hidden");
    });

    const fecharModal = (e: Event) => {
      e.preventDefault();
      modal?.classList.add("hidden");
      this.limparModal();
    };

    cancelar?.addEventListener("click", fecharModal);
    cancelarHeader?.addEventListener("click", fecharModal);

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.salvarVaga();
      modal?.classList.add("hidden");
      this.limparModal();
    });

    this.registrarEventosCompetenciasVaga();
  }

  private salvarVaga(): void {
    const vaga: Vaga = {
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
    if (indice >= 0) vagas[indice] = vaga;
    else vagas.push(vaga);

    const atualizado: Empresa = { ...this.usuario, vagas };
    StorageService.atualizarUsuario(atualizado);
    this.usuario = atualizado;

    this.renderizarVagas();
    this.atualizarListaDeMatches();
  }

  private renderizarVagas(): void {
    const lista = document.getElementById("vagas-empresa-lista");
    const template = lista?.querySelector(
      ".vagas-empresa__item",
    ) as HTMLElement;
    if (!lista || !template) return;

    lista.innerHTML = "";
    lista.appendChild(template);
    template.classList.add("hidden");

    this.usuario.vagas?.forEach((vaga) => {
      const item = template.cloneNode(true) as HTMLElement;
      item.classList.remove("hidden");
      (
        item.querySelector(".vagas-empresa__item-titulo") as HTMLElement
      ).textContent = vaga.titulo;
      item.addEventListener("click", () => this.abrirEdicaoVaga(vaga));
      lista.appendChild(item);
    });
  }

  private abrirEdicaoVaga(vaga: Vaga): void {
    this.vagaEmEdicaoId = vaga.id;
    this.competenciasVagaAtual = [...vaga.competencias];

    this.obterInput("vaga-campo-titulo").value = vaga.titulo;
    this.obterTextarea("vaga-campo-descricao").value = vaga.descricao;
    this.obterInput("vaga-campo-horario").value = vaga.horario;
    this.obterInput("vaga-campo-localizacao").value = vaga.localizacao;
    this.obterInput("vaga-campo-salario").value = vaga.remuneracao;
    this.obterTextarea("vaga-campo-requisitos").value = vaga.requisitos;

    const tituloModal = document.getElementById("vagas-empresa-modal-titulo");
    if (tituloModal) tituloModal.textContent = "Editar vaga";

    this.renderizarCompetenciasVaga();
    document.getElementById("vagas-empresa-modal")?.classList.remove("hidden");
  }

  private limparModal(): void {
    this.vagaEmEdicaoId = null;
    this.competenciasVagaAtual = [];

    this.obterInput("vaga-campo-titulo").value = "";
    this.obterTextarea("vaga-campo-descricao").value = "";
    this.obterInput("vaga-campo-horario").value = "";
    this.obterInput("vaga-campo-localizacao").value = "";
    this.obterInput("vaga-campo-salario").value = "";
    this.obterTextarea("vaga-campo-requisitos").value = "";
    document.getElementById("vagas-empresa-competencias-lista")!.innerHTML = "";
  }

  private excluirVagaAtual(): void {
    if (!this.vagaEmEdicaoId) return;
    if (!confirm("Tem certeza que deseja excluir esta vaga?")) return;

    StorageService.excluirVaga(this.vagaEmEdicaoId, this.usuario.id);
    this.usuario = StorageService.obterUsuarioAtual() as Empresa;

    document.getElementById("vagas-empresa-modal")?.classList.add("hidden");
    this.limparModal();
    this.renderizarVagas();
    this.atualizarListaDeMatches();
    alert("Vaga excluída com sucesso.");
  }

  // ---- COMPETÊNCIAS DA VAGA ----

  private registrarEventosCompetenciasVaga(): void {
    const btn = document.getElementById("vagas-empresa-btn-add-competencia");
    const popup = document.getElementById("vagas-empresa-popup");
    const input = document.getElementById(
      "vagas-empresa-popup-input",
    ) as HTMLInputElement;
    const confirmar = document.getElementById("vagas-empresa-popup-confirmar");
    const cancelar = document.getElementById("vagas-empresa-popup-cancelar");
    const regex = /^[A-Za-zÀ-ÿ0-9.+#-]{2,30}(?:\s[A-Za-zÀ-ÿ0-9.+#-]{2,30})*$/;

    if (confirmar) {
      (confirmar as HTMLButtonElement).onclick = (e) => {
        e.preventDefault();
        const valor = input.value.trim();
        if (!valor) {
          alert("Digite uma competência");
          return;
        }
        if (!regex.test(valor)) {
          alert(
            "Digite uma competência válida, como Java, React, Node.js ou C#",
          );
          return;
        }
        this.competenciasVagaAtual.push(valor);
        this.renderizarCompetenciasVaga();
        popup?.classList.add("hidden");
        input.value = "";
      };
    }

    btn?.addEventListener("click", (e) => {
      e.preventDefault();
      popup?.classList.remove("hidden");
      input.focus();
    });

    cancelar?.addEventListener("click", () => {
      popup?.classList.add("hidden");
      input.value = "";
    });
  }

  private renderizarCompetenciasVaga(): void {
    const lista = document.getElementById("vagas-empresa-competencias-lista");
    const template = document.getElementById(
      "vagas-empresa-competencia-template",
    ) as HTMLElement;
    if (!lista || !template) return;

    lista.innerHTML = "";
    this.competenciasVagaAtual.forEach((competencia, indice) => {
      const item = template.cloneNode(true) as HTMLElement;
      item.classList.remove("hidden");
      item.removeAttribute("id");
      item.querySelector(".competencia__texto")!.textContent = competencia;
      item.addEventListener("click", () => {
        this.competenciasVagaAtual.splice(indice, 1);
        this.renderizarCompetenciasVaga();
      });
      lista.appendChild(item);
    });
  }

  // ---- SWIPE CANDIDATOS ----

  private iniciarSwipeCandidatos(): void {
    new SwipeController<Candidato>(
      MatchService.obterCandidatosParaSwipe(),
      (candidato) => this.exibirCardCandidato(candidato),
      (candidato) => {
        MatchService.registrarLikeEmpresaCandidato(
          this.usuario.id,
          candidato.id,
        );
        this.atualizarListaDeMatches();
      },
      () => this.exibirSemCandidatos(),
    );
  }

  private exibirCardCandidato(candidato: Candidato): void {
    document.getElementById("match-swipe-card")?.classList.remove("hidden");
    document
      .getElementById("match-swipe-sem-candidatos")
      ?.classList.add("hidden");
    document.getElementById("match-swipe-sem-vagas")?.classList.add("hidden");
    document
      .getElementById("match-swipe-dados-candidato")
      ?.classList.remove("hidden");
    document.getElementById("match-swipe-dados-vaga")?.classList.add("hidden");

    (document.getElementById("match-swipe-tipo") as HTMLElement).textContent =
      "";
    (document.getElementById("match-swipe-titulo") as HTMLElement).textContent =
      "Perfil Anônimo";

    (
      document.getElementById(
        "match-swipe-candidato-descricao",
      ) as HTMLTextAreaElement
    ).value = candidato.descricao || "";
    (
      document.getElementById(
        "match-swipe-candidato-estado",
      ) as HTMLInputElement
    ).value = candidato.estado || "";

    const lista = document.getElementById("match-swipe-candidato-competencias");
    const template = document.getElementById(
      "vagas-empresa-competencia-template",
    ) as HTMLElement;
    if (!lista || !template) return;

    lista.innerHTML = "";
    candidato.competencias.forEach((competencia) => {
      const item = template.cloneNode(true) as HTMLElement;
      item.classList.remove("hidden");
      item.querySelector(".competencia__texto")!.textContent = competencia;
      lista.appendChild(item);
    });
  }

  private exibirSemCandidatos(): void {
    document.getElementById("match-swipe-card")?.classList.add("hidden");
    document
      .getElementById("match-swipe-sem-candidatos")
      ?.classList.remove("hidden");
    document.getElementById("match-swipe-sem-vagas")?.classList.add("hidden");
  }

  // ---- MATCHES ----

  private atualizarListaDeMatches(): void {
    const lista = document.getElementById("matches-lista");
    const template = lista?.querySelector(".matches__item") as HTMLElement;
    const dropdown = document.getElementById("matches-dropdown");
    if (!lista || !template || !dropdown) return;

    lista.innerHTML = "";
    lista.appendChild(template);
    template.classList.add("hidden");
    lista.appendChild(dropdown);
    dropdown.classList.add("hidden");

    MatchService.obterMatchesCompletosDaEmpresa(this.usuario.id).forEach(
      ({ vaga, candidatos }) => {
        const item = template.cloneNode(true) as HTMLElement;
        item.classList.remove("hidden");

        const tituloEl = item.querySelector(
          ".matches__item-titulo",
        ) as HTMLElement;
        const seta = item.querySelector(".arrow") as HTMLElement | null;
        if (!tituloEl || !seta) return;

        tituloEl.textContent = vaga.titulo;

        seta.addEventListener("click", (e) => {
          e.stopPropagation();
          const mesmoAberto =
            !dropdown.classList.contains("hidden") &&
            dropdown.previousElementSibling === item;
          document
            .querySelectorAll(".arrow")
            .forEach((a) => a.classList.remove("active"));

          if (mesmoAberto) {
            dropdown.classList.add("hidden");
            return;
          }

          const ul = dropdown.querySelector(
            "#matches-dropdown-lista",
          ) as HTMLUListElement | null;
          if (!ul) return;

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
          if ((e.target as HTMLElement).classList.contains("arrow")) return;
          dropdown.classList.add("hidden");
          document
            .querySelectorAll(".arrow")
            .forEach((a) => a.classList.remove("active"));
          this.abrirDetalhesVaga(vaga);
        });

        lista.appendChild(item);
      },
    );
  }

  private abrirDetalhesVaga(vaga: Vaga): void {
    document.getElementById("modal-vaga")?.classList.remove("hidden");
    document
      .getElementById("modal-vaga-dados-empresa")
      ?.classList.add("hidden");

    (document.getElementById("modal-vaga-titulo") as HTMLElement).textContent =
      vaga.titulo;

    (
      document.getElementById(
        "modal-vaga-campo-descricao",
      ) as HTMLTextAreaElement
    ).value = vaga.descricao || "";
    (
      document.getElementById("modal-vaga-campo-horario") as HTMLInputElement
    ).value = vaga.horario || "";
    (
      document.getElementById(
        "modal-vaga-campo-localizacao",
      ) as HTMLInputElement
    ).value = vaga.localizacao || "";
    (
      document.getElementById("modal-vaga-campo-salario") as HTMLInputElement
    ).value = vaga.remuneracao || "";
    (
      document.getElementById(
        "modal-vaga-campo-requisitos",
      ) as HTMLTextAreaElement
    ).value = vaga.requisitos || "";
    (
      document.getElementById(
        "modal-vaga-campo-competencias",
      ) as HTMLTextAreaElement
    ).value = vaga.competencias.join(", ");

    this.renderizarGrafico(vaga);
  }

  private abrirDetalhesCandidato(candidato: Candidato): void {
    document.getElementById("modal-candidato")?.classList.remove("hidden");

    (
      document.getElementById("modal-candidato-titulo") as HTMLElement
    ).textContent = candidato.nome;
    (
      document.getElementById("modal-candidato-campo-email") as HTMLInputElement
    ).value = candidato.email;
    (
      document.getElementById("modal-candidato-campo-cpf") as HTMLInputElement
    ).value = candidato.cpf;
    (
      document.getElementById("modal-candidato-campo-idade") as HTMLInputElement
    ).value = candidato.idade;
    (
      document.getElementById(
        "modal-candidato-campo-estado",
      ) as HTMLInputElement
    ).value = candidato.estado;
    (
      document.getElementById("modal-candidato-campo-cep") as HTMLInputElement
    ).value = candidato.cep;
    (
      document.getElementById(
        "modal-candidato-campo-descricao",
      ) as HTMLTextAreaElement
    ).value = candidato.descricao;

    const lista = document.getElementById("modal-candidato-competencias-lista");
    const template = document.getElementById(
      "modal-candidato-competencia-template",
    ) as HTMLElement;
    if (!lista || !template) return;

    lista.innerHTML = "";
    candidato.competencias.forEach((competencia) => {
      const item = template.cloneNode(true) as HTMLElement;
      item.classList.remove("hidden");
      item.querySelector(".competencia__texto")!.textContent = competencia;
      lista.appendChild(item);
    });
  }

  // ---- GRÁFICO ----

  private calcularPercentuaisCompetencias(vaga: Vaga): number[] {
    const matches = MatchService.obterMatchesCompletosDaEmpresa(
      this.usuario.id,
    ).filter((m: MatchDaEmpresa) => m.vaga.id === vaga.id);
    const candidatos = matches.reduce(
      (acc: Candidato[], m: MatchDaEmpresa) => acc.concat(m.candidatos),
      [],
    );

    if (!candidatos.length) return vaga.competencias.map(() => 0);

    return vaga.competencias.map((competencia) => {
      const total = candidatos.filter((candidato: Candidato) =>
        candidato.competencias.some(
          (comp: string) => comp.toLowerCase() === competencia.toLowerCase(),
        ),
      ).length;
      return Math.round((total / candidatos.length) * 100);
    });
  }

  private renderizarGrafico(vaga: Vaga): void {
    const canvas = document.getElementById(
      "modal-vaga-grafico",
    ) as HTMLCanvasElement | null;
    if (!canvas) return;

    const ChartClass = (window as any).Chart;
    if (!ChartClass) return;

    const dados = this.calcularPercentuaisCompetencias(vaga);

    if (this.chart) {
      (this.chart as any).destroy();
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
              label: (context: any) => `${context.raw}%`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: (value: number | string) => `${value}%`,
            },
          },
        },
      },
    });
  }
}
