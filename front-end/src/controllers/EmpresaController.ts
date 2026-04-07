import { Candidato, Empresa, Vaga } from "../types.js";
import { StorageService } from "../services/StorageService.js";
import { MatchController } from "./MatchController.js";

export class EmpresaController {
  private fotoBase64 = "";
  private competenciasVaga: string[] = [];
  private vagaEmEdicaoId: string | null = null;
  private chart: any = null;

  constructor(private user: Empresa) {
    this.init();
  }

  private init(): void {
    document.getElementById("menu-empresa")?.classList.remove("hidden");
    document.getElementById("perfil-empresa")?.classList.remove("hidden");

    this.load();
    this.events();
    this.vagas();
    this.renderVagas();
    this.initMatchCandidatos();
    this.renderMatches();
  }

  private input(id: string): HTMLInputElement {
    return document.getElementById(id) as HTMLInputElement;
  }

  private textarea(id: string): HTMLTextAreaElement {
    return document.getElementById(id) as HTMLTextAreaElement;
  }

  // ================= PROFILE =================

  private load(): void {
    (
      document.getElementById("perfil-empresa-nome") as HTMLElement
    ).textContent = this.user.nome;

    this.input("perfil-empresa-campo-nome").value = this.user.nome;
    this.input("perfil-empresa-campo-email").value = this.user.email;
    this.input("perfil-empresa-campo-cnpj").value = this.user.cnpj;
    this.input("perfil-empresa-campo-pais").value = this.user.pais;
    this.input("perfil-empresa-campo-estado").value = this.user.estado;
    this.input("perfil-empresa-campo-cep").value = this.user.cep;
    this.textarea("perfil-empresa-campo-descricao").value = this.user.descricao;

    const fotoEl = document.getElementById(
      "perfil-empresa-avatar",
    ) as HTMLDivElement;
    if (this.user.foto) {
      this.fotoBase64 = this.user.foto;
      fotoEl.style.backgroundImage = `url(${this.user.foto})`;
      fotoEl.style.backgroundSize = "cover";
      fotoEl.style.backgroundPosition = "center";
      fotoEl.textContent = "";
    } else {
      const iniciais = this.user.nome
        .split(" ")
        .map((n: string) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
      fotoEl.textContent = iniciais;
    }
  }

  private events(): void {
    document.getElementById("btn-logout")?.addEventListener("click", () => {
      StorageService.clearCurrentUser();
      window.location.href = "auth.html";
    });

    document
      .getElementById("perfil-empresa-btn-salvar")
      ?.addEventListener("click", () => this.save());

    const foto = document.getElementById("perfil-empresa-avatar");
    const inputFoto = document.getElementById(
      "perfil-empresa-avatar-input",
    ) as HTMLInputElement;

    foto?.addEventListener("click", () => inputFoto.click());
    inputFoto?.addEventListener("change", (e) => this.handleFoto(e));

    document
      .getElementById("modal-vaga-btn-fechar")
      ?.addEventListener("click", () => {
        document.getElementById("modal-vaga")?.classList.add("hidden");
      });

    document
      .getElementById("modal-candidato-btn-fechar")
      ?.addEventListener("click", () => {
        document.getElementById("modal-candidato")?.classList.add("hidden");
      });

    document
      .getElementById("perfil-empresa-btn-excluir")
      ?.addEventListener("click", () => this.deleteAccount());

    document
      .getElementById("vagas-empresa-btn-excluir")
      ?.addEventListener("click", () => this.deleteCurrentVaga());

    this.togglePassword(
      "perfil-empresa-campo-senha-atual",
      "perfil-empresa-toggle-senha-atual",
    );
    this.togglePassword(
      "perfil-empresa-campo-nova-senha",
      "perfil-empresa-toggle-nova-senha",
    );
  }

  private handleFoto(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      this.fotoBase64 = reader.result as string;

      const foto = document.getElementById(
        "perfil-empresa-avatar",
      ) as HTMLDivElement;
      foto.style.backgroundImage = `url(${this.fotoBase64})`;
      foto.style.backgroundSize = "cover";
      foto.style.backgroundPosition = "center";
      foto.textContent = "";
    };

    reader.readAsDataURL(file);
  }

  private save(): void {
    const current = StorageService.getCurrentUser() as Empresa;

    const senhaAtualDigitada = this.input(
      "perfil-empresa-campo-senha-atual",
    ).value.trim();
    const novaSenha = this.input(
      "perfil-empresa-campo-nova-senha",
    ).value.trim();

    if (senhaAtualDigitada && senhaAtualDigitada !== current.senha) {
      alert("Senha atual incorreta.");
      return;
    }

    if (novaSenha && novaSenha.length < 6) {
      alert("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    const updated: Empresa = {
      ...current,
      nome: this.input("perfil-empresa-campo-nome").value,
      email: this.input("perfil-empresa-campo-email").value,
      cnpj: this.input("perfil-empresa-campo-cnpj").value,
      pais: this.input("perfil-empresa-campo-pais").value,
      estado: this.input("perfil-empresa-campo-estado").value,
      cep: this.input("perfil-empresa-campo-cep").value,
      descricao: this.textarea("perfil-empresa-campo-descricao").value,
      foto: this.fotoBase64 || current.foto,
      senha: novaSenha || current.senha,
    };

    StorageService.updateUser(updated);
    this.user = updated;

    (
      document.getElementById("perfil-empresa-nome") as HTMLElement
    ).textContent = updated.nome;

    this.input("perfil-empresa-campo-senha-atual").value = "";
    this.input("perfil-empresa-campo-nova-senha").value = "";

    alert("Salvo!");
  }

  private deleteAccount(): void {
    if (!confirm("Tem certeza que deseja excluir sua conta?")) return;

    StorageService.deleteUser(this.user.id);
    alert("Conta excluída com sucesso.");
    window.location.href = "auth.html";
  }

  private togglePassword(inputId: string, buttonId: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const button = document.getElementById(buttonId);

    if (!input || !button) return;

    button.addEventListener("click", () => {
      input.type = input.type === "password" ? "text" : "password";
    });
  }

  // ================= VAGAS =================

  private vagas(): void {
    const btn = document.getElementById("vagas-empresa-btn-add");
    const modal = document.getElementById("vagas-empresa-modal");
    const cancelar = document.getElementById("vagas-empresa-cancelar");
    const cancelarHeader = document.getElementById(
      "vagas-empresa-cancelar-header",
    );
    const form = modal?.querySelector("form");

    btn?.addEventListener("click", () => {
      this.vagaEmEdicaoId = null;
      this.resetModal();
      const tituloModal = document.getElementById("vagas-empresa-modal-titulo");
      if (tituloModal) tituloModal.textContent = "Nova vaga";
      modal?.classList.remove("hidden");
    });

    const fecharModal = (e: Event) => {
      e.preventDefault();
      modal?.classList.add("hidden");
      this.resetModal();
    };

    cancelar?.addEventListener("click", fecharModal);
    cancelarHeader?.addEventListener("click", fecharModal);

    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      this.submitVaga();
      modal?.classList.add("hidden");
      this.resetModal();
    });

    this.competenciasModal();
  }

  private submitVaga(): void {
    const vaga: Vaga = {
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

    if (index >= 0) vagas[index] = vaga;
    else vagas.push(vaga);

    const updated: Empresa = { ...this.user, vagas };

    StorageService.updateUser(updated);
    this.user = updated;

    this.renderVagas();
    this.renderMatches();
  }

  private renderVagas(): void {
    const lista = document.getElementById("vagas-empresa-lista");
    const template = lista?.querySelector(
      ".vagas-empresa__item",
    ) as HTMLElement;

    if (!lista || !template) return;

    lista.innerHTML = "";
    lista.appendChild(template);
    template.classList.add("hidden");

    this.user.vagas?.forEach((vaga) => {
      const item = template.cloneNode(true) as HTMLElement;
      item.classList.remove("hidden");

      const titulo = item.querySelector(
        ".vagas-empresa__item-titulo",
      ) as HTMLElement;
      titulo.textContent = vaga.titulo;

      item.addEventListener("click", () => this.openEditVaga(vaga));

      lista.appendChild(item);
    });
  }

  private openEditVaga(vaga: Vaga): void {
    this.vagaEmEdicaoId = vaga.id;
    this.competenciasVaga = [...vaga.competencias];

    this.input("vaga-campo-titulo").value = vaga.titulo;
    this.textarea("vaga-campo-descricao").value = vaga.descricao;
    this.input("vaga-campo-horario").value = vaga.horario;
    this.input("vaga-campo-localizacao").value = vaga.localizacao;
    this.input("vaga-campo-salario").value = vaga.remuneracao;
    this.textarea("vaga-campo-requisitos").value = vaga.requisitos;

    const tituloModal = document.getElementById("vagas-empresa-modal-titulo");
    if (tituloModal) tituloModal.textContent = "Editar vaga";

    this.renderCompetenciasModal();
    document.getElementById("vagas-empresa-modal")?.classList.remove("hidden");
  }

  private resetModal(): void {
    this.vagaEmEdicaoId = null;
    this.competenciasVaga = [];

    this.input("vaga-campo-titulo").value = "";
    this.textarea("vaga-campo-descricao").value = "";
    this.input("vaga-campo-horario").value = "";
    this.input("vaga-campo-localizacao").value = "";
    this.input("vaga-campo-salario").value = "";
    this.textarea("vaga-campo-requisitos").value = "";

    document.getElementById("vagas-empresa-competencias-lista")!.innerHTML = "";
  }

  private deleteCurrentVaga(): void {
    if (!this.vagaEmEdicaoId) return;
    if (!confirm("Tem certeza que deseja excluir esta vaga?")) return;

    StorageService.deleteVaga(this.vagaEmEdicaoId, this.user.id);

    const updated = StorageService.getCurrentUser() as Empresa;
    this.user = updated;

    document.getElementById("vagas-empresa-modal")?.classList.add("hidden");
    this.resetModal();
    this.renderVagas();
    this.renderMatches();
    alert("Vaga excluída com sucesso.");
  }

  // ================= COMPETENCIAS =================

  private competenciasModal(): void {
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

        this.competenciasVaga.push(valor);
        this.renderCompetenciasModal();

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
  private renderCompetenciasModal(): void {
    const lista = document.getElementById("vagas-empresa-competencias-lista");
    const template = document.getElementById(
      "vagas-empresa-competencia-template",
    ) as HTMLElement;

    if (!lista || !template) return;

    lista.innerHTML = "";

    this.competenciasVaga.forEach((competencia, index) => {
      const item = template.cloneNode(true) as HTMLElement;

      item.classList.remove("hidden");
      item.removeAttribute("id");

      const texto = item.querySelector(".competencia__texto");
      if (texto) texto.textContent = competencia;

      item.addEventListener("click", () => {
        this.competenciasVaga.splice(index, 1);
        this.renderCompetenciasModal();
      });

      lista.appendChild(item);
    });
  }

  // ================= MATCH =================

  private initMatchCandidatos(): void {
    const candidatos = StorageService.getUsers().filter(
      (u): u is Candidato => u.tipo === "candidato",
    );

    new MatchController<Candidato>(
      candidatos,
      (c) => this.renderCardCandidato(c),
      (c) => {
        StorageService.saveLike({
          empresaId: this.user.id,
          candidatoId: c.id,
        });
        this.renderMatches();
      },
      () => this.showSemCandidatos(),
    );
  }

  private renderCardCandidato(c: Candidato): void {
    document.getElementById("match-swipe-card")?.classList.remove("hidden");
    document
      .getElementById("match-swipe-sem-candidatos")
      ?.classList.add("hidden");
    document.getElementById("match-swipe-sem-vagas")?.classList.add("hidden");

    document
      .getElementById("match-swipe-dados-candidato")
      ?.classList.remove("hidden");
    document.getElementById("match-swipe-dados-vaga")?.classList.add("hidden");

    const tipoEl = document.getElementById("match-swipe-tipo") as HTMLElement;
    if (tipoEl) tipoEl.textContent = "";
    (document.getElementById("match-swipe-titulo") as HTMLElement).textContent =
      "Perfil Anônimo";

    (
      document.getElementById(
        "match-swipe-candidato-descricao",
      ) as HTMLTextAreaElement
    ).value = c.descricao || "";

    (
      document.getElementById(
        "match-swipe-candidato-estado",
      ) as HTMLInputElement
    ).value = c.estado || "";

    const lista = document.getElementById("match-swipe-candidato-competencias");
    const template = document.getElementById(
      "vagas-empresa-competencia-template",
    ) as HTMLElement;

    if (!lista || !template) return;

    lista.innerHTML = "";

    c.competencias.forEach((competencia) => {
      const item = template.cloneNode(true) as HTMLElement;
      item.classList.remove("hidden");
      item.querySelector(".competencia__texto")!.textContent = competencia;
      lista.appendChild(item);
    });
  }

  private showSemCandidatos(): void {
    document.getElementById("match-swipe-card")?.classList.add("hidden");
    document
      .getElementById("match-swipe-sem-candidatos")
      ?.classList.remove("hidden");
    document.getElementById("match-swipe-sem-vagas")?.classList.add("hidden");
  }

  // ================= MATCH LIST =================

  private renderMatches(): void {
    const lista = document.getElementById("matches-lista");
    const template = lista?.querySelector(".matches__item") as HTMLElement;
    const drop = document.getElementById("matches-dropdown");

    if (!lista || !template || !drop) return;

    lista.innerHTML = "";
    lista.appendChild(template);
    template.classList.add("hidden");
    lista.appendChild(drop);
    drop.classList.add("hidden");

    const matches = MatchController.getMatches().filter(
      (m) => m.empresaId === this.user.id,
    );

    const vagasComMatch = [...new Set(matches.map((m) => m.vagaId))];

    vagasComMatch.forEach((vagaId) => {
      const vaga = this.user.vagas?.find((v) => v.id === vagaId);
      if (!vaga) return;

      const candidatosDaVaga = matches.filter((m) => m.vagaId === vagaId);

      const item = template.cloneNode(true) as HTMLElement;
      item.classList.remove("hidden");

      const titulo = item.querySelector(".matches__item-titulo") as HTMLElement;
      const arrow = item.querySelector(".arrow") as HTMLElement | null;

      if (!titulo || !arrow) return;

      titulo.textContent = vaga.titulo;

      arrow.addEventListener("click", (e) => {
        e.stopPropagation();

        const mesmoItemAberto =
          !drop.classList.contains("hidden") &&
          drop.previousElementSibling === item;

        document
          .querySelectorAll(".arrow")
          .forEach((a) => a.classList.remove("active"));

        if (mesmoItemAberto) {
          drop.classList.add("hidden");
          return;
        }

        const ul = drop.querySelector(
          "#matches-dropdown-lista",
        ) as HTMLUListElement | null;
        if (!ul) return;

        ul.innerHTML = "";

        candidatosDaVaga.forEach((match, index) => {
          const candidato = StorageService.getUsers().find(
            (u): u is Candidato =>
              u.tipo === "candidato" && u.id === match.candidatoId,
          );

          if (!candidato) return;

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
        const target = e.target as HTMLElement;

        if (target.classList.contains("arrow")) return;

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

  private openCandidatoView(c: Candidato): void {
    document.getElementById("modal-candidato")?.classList.remove("hidden");

    (
      document.getElementById("modal-candidato-titulo") as HTMLElement
    ).textContent = c.nome;

    const emailInput = document.getElementById(
      "modal-candidato-campo-email",
    ) as HTMLInputElement | null;
    const emailInputComEspaco = document.getElementById(
      "modal-candidato-campo-email",
    ) as HTMLInputElement | null;
    const email = emailInput || emailInputComEspaco;
    if (email) email.value = c.email;

    (
      document.getElementById("modal-candidato-campo-cpf") as HTMLInputElement
    ).value = c.cpf;

    (
      document.getElementById("modal-candidato-campo-idade") as HTMLInputElement
    ).value = c.idade;

    (
      document.getElementById(
        "modal-candidato-campo-estado",
      ) as HTMLInputElement
    ).value = c.estado;

    (
      document.getElementById("modal-candidato-campo-cep") as HTMLInputElement
    ).value = c.cep;

    (
      document.getElementById(
        "modal-candidato-campo-descricao",
      ) as HTMLTextAreaElement
    ).value = c.descricao;

    const lista = document.getElementById("modal-candidato-competencias-lista");
    const template = document.getElementById(
      "modal-candidato-competencia-template",
    ) as HTMLElement;

    if (!lista || !template) return;

    lista.innerHTML = "";

    c.competencias.forEach((competencia) => {
      const item = template.cloneNode(true) as HTMLElement;
      item.classList.remove("hidden");
      item.querySelector(".competencia__texto")!.textContent = competencia;
      lista.appendChild(item);
    });
  }

  // ================= GRAFICO =================

  private gerarDadosGrafico(vaga: Vaga): number[] {
    const matches = MatchController.getMatches().filter(
      (m) => m.empresaId === this.user.id && m.vagaId === vaga.id,
    );

    const candidatos = StorageService.getUsers().filter(
      (u): u is Candidato =>
        u.tipo === "candidato" && matches.some((m) => m.candidatoId === u.id),
    );

    if (!candidatos.length) {
      return vaga.competencias.map(() => 0);
    }

    return vaga.competencias.map((competencia) => {
      const totalComCompetencia = candidatos.filter((candidato) =>
        candidato.competencias.some(
          (c) => c.toLowerCase() === competencia.toLowerCase(),
        ),
      ).length;

      return Math.round((totalComCompetencia / candidatos.length) * 100);
    });
  }

  private renderGrafico(vaga: Vaga): void {
    const canvas = document.getElementById(
      "modal-vaga-grafico",
    ) as HTMLCanvasElement | null;

    if (!canvas) return;

    const ChartClass = (window as any).Chart;
    if (!ChartClass) return;

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

  // ================= VAGA VIEW =================

  private openVagaView(vaga: Vaga): void {
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

    this.renderGrafico(vaga);
  }
}
