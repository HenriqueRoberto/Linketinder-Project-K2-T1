import { Candidato, Empresa, Vaga } from "../types.js";
import { StorageService } from "../services/StorageService.js";
import { MatchService } from "../services/MatchService.js";
import { SwipeController } from "../controllers/SwipeController.js";

export class CandidatoController {
  private fotoBase64 = "";
  private competencias: string[] = [];

  constructor(private usuario: Candidato) {
    this.init();
  }

  private init(): void {
    document.getElementById("menu-candidato")?.classList.remove("hidden");
    document.getElementById("perfil-candidato")?.classList.remove("hidden");

    this.carregarPerfil();
    this.registrarEventos();
    this.registrarEventosCompetencias();
    this.iniciarSwipeVagas();
    this.atualizarListaDeMatches();
  }

  private obterInput(id: string): HTMLInputElement {
    return document.getElementById(id) as HTMLInputElement;
  }

  private obterTextarea(id: string): HTMLTextAreaElement {
    return document.getElementById(id) as HTMLTextAreaElement;
  }

  private obterElemento<T extends HTMLElement>(id: string): T {
    return document.getElementById(id) as T;
  }

  // ---- PERFIL ----

  private carregarPerfil(): void {
    (
      document.getElementById("perfil-candidato-nome") as HTMLElement
    ).textContent = this.usuario.nome;

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

    const avatarEl = document.getElementById(
      "perfil-candidato-avatar",
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
      .getElementById("perfil-candidato-btn-salvar")
      ?.addEventListener("click", () => this.salvarPerfil());

    document
      .getElementById("perfil-candidato-btn-excluir")
      ?.addEventListener("click", () => this.excluirConta());

    const avatarEl = document.getElementById("perfil-candidato-avatar");
    const inputFoto = document.getElementById(
      "perfil-candidato-avatar-input",
    ) as HTMLInputElement;
    avatarEl?.addEventListener("click", () => inputFoto.click());
    inputFoto?.addEventListener("change", (e) => this.processarFoto(e));

    document
      .getElementById("modal-vaga-btn-fechar")
      ?.addEventListener("click", () => {
        document.getElementById("modal-vaga")?.classList.add("hidden");
        document
          .getElementById("modal-vaga-dados-empresa")
          ?.classList.add("hidden");
      });

    this.configurarAlternarSenha(
      "perfil-candidato-campo-senha-atual",
      "perfil-candidato-toggle-senha-atual",
    );
    this.configurarAlternarSenha(
      "perfil-candidato-campo-nova-senha",
      "perfil-candidato-toggle-nova-senha",
    );
  }

  private configurarAlternarSenha(inputId: string, botaoId: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const botao = document.getElementById(botaoId);
    if (!input || !botao) return;
    botao.addEventListener("click", () => {
      input.type = input.type === "password" ? "text" : "password";
    });
  }

  private processarFoto(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    const arquivo = input.files?.[0];
    if (!arquivo) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.fotoBase64 = reader.result as string;
      const avatarEl = document.getElementById(
        "perfil-candidato-avatar",
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
      "perfil-candidato-campo-senha-atual",
    ).value.trim();
    const novaSenha = this.obterInput(
      "perfil-candidato-campo-nova-senha",
    ).value.trim();

    if (senhaAtual && senhaAtual !== this.usuario.senha) {
      alert("Senha atual incorreta.");
      return;
    }
    if (novaSenha && novaSenha.length < 6) {
      alert("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    const atualizado: Candidato = {
      ...this.usuario,
      nome: this.obterInput("perfil-candidato-campo-nome").value,
      email: this.obterInput("perfil-candidato-campo-email").value,
      cpf: this.obterInput("perfil-candidato-campo-cpf").value,
      idade: this.obterInput("perfil-candidato-campo-idade").value,
      estado: this.obterInput("perfil-candidato-campo-estado").value,
      cep: this.obterInput("perfil-candidato-campo-cep").value,
      descricao: this.obterTextarea("perfil-candidato-campo-descricao").value,
      foto: this.fotoBase64 || this.usuario.foto,
      competencias: this.competencias,
      senha: novaSenha || this.usuario.senha,
    };

    StorageService.atualizarUsuario(atualizado);
    this.usuario = atualizado;
    (
      document.getElementById("perfil-candidato-nome") as HTMLElement
    ).textContent = atualizado.nome;
    this.obterInput("perfil-candidato-campo-senha-atual").value = "";
    this.obterInput("perfil-candidato-campo-nova-senha").value = "";
    alert("Salvo!");
  }

  private excluirConta(): void {
    if (!confirm("Tem certeza que deseja excluir sua conta?")) return;
    StorageService.excluirUsuario(this.usuario.id);
    alert("Conta excluída com sucesso.");
    window.location.href = "auth.html";
  }

  // ---- COMPETÊNCIAS ----

  private renderizarCompetencias(): void {
    const lista = document.getElementById(
      "perfil-candidato-competencias-lista",
    );
    const template = document.getElementById(
      "perfil-candidato-competencia-template",
    ) as HTMLDivElement;
    if (!lista || !template) return;

    lista.innerHTML = "";
    this.competencias.forEach((competencia, indice) => {
      const item = template.cloneNode(true) as HTMLDivElement;
      item.classList.remove("hidden");
      item.querySelector(".competencia__texto")!.textContent = competencia;
      item.addEventListener("click", () => {
        if (!confirm("Remover competência?")) return;
        this.competencias.splice(indice, 1);
        this.renderizarCompetencias();
      });
      lista.appendChild(item);
    });
  }

  private registrarEventosCompetencias(): void {
    const btn = document.getElementById("perfil-candidato-btn-add-competencia");
    const popup = document.getElementById("perfil-candidato-popup-competencia");
    const input = document.getElementById(
      "perfil-candidato-popup-input",
    ) as HTMLInputElement;
    const confirmar = document.getElementById(
      "perfil-candidato-popup-confirmar",
    ) as HTMLButtonElement;
    const cancelar = document.getElementById("perfil-candidato-popup-cancelar");
    if (!btn || !popup || !input || !confirmar || !cancelar) return;

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

  private iniciarSwipeVagas(): void {
    const vagasNaoVistas = MatchService.obterVagasNaoVistasPeloCandidato(
      this.usuario.id,
    );

    new SwipeController<Vaga>(
      vagasNaoVistas,
      (vaga) => this.exibirCardVaga(vaga),
      (vaga) => {
        MatchService.registrarLikeCandidatoVaga(this.usuario.id, vaga.id);
        this.atualizarListaDeMatches();
      },
      () => {
        document.getElementById("match-swipe-card")?.classList.add("hidden");
        document
          .getElementById("match-swipe-sem-vagas")
          ?.classList.remove("hidden");
      },
    );
  }

  private exibirCardVaga(vaga: Vaga): void {
    document.getElementById("match-swipe-card")?.classList.remove("hidden");
    document
      .getElementById("match-swipe-dados-vaga")
      ?.classList.remove("hidden");
    document
      .getElementById("match-swipe-dados-candidato")
      ?.classList.add("hidden");

    (document.getElementById("match-swipe-tipo") as HTMLElement).textContent =
      "Vaga";
    (document.getElementById("match-swipe-titulo") as HTMLElement).textContent =
      vaga.titulo;

    (
      document.getElementById(
        "match-swipe-vaga-descricao",
      ) as HTMLTextAreaElement
    ).value = vaga.descricao || "";
    (
      document.getElementById("match-swipe-vaga-horario") as HTMLInputElement
    ).value = vaga.horario || "";
    (
      document.getElementById(
        "match-swipe-vaga-localizacao",
      ) as HTMLInputElement
    ).value = vaga.localizacao || "";
    (
      document.getElementById("match-swipe-vaga-salario") as HTMLInputElement
    ).value = vaga.remuneracao || "";
    (
      document.getElementById(
        "match-swipe-vaga-requisitos",
      ) as HTMLTextAreaElement
    ).value = vaga.requisitos || "";
  }

  // ---- MATCHES ----

  private atualizarListaDeMatches(): void {
    const lista = document.getElementById("matches-lista");
    const template = lista?.querySelector(".matches__item") as HTMLElement;
    if (!lista || !template) return;

    lista.innerHTML = "";
    lista.appendChild(template);
    template.classList.add("hidden");

    MatchService.obterMatchesCompletosDoCandidato(this.usuario.id).forEach(
      ({ vaga, empresa }) => {
        const item = template.cloneNode(true) as HTMLElement;
        item.classList.remove("hidden");
        item.querySelector(".matches__item-titulo")!.textContent = vaga.titulo;
        item.addEventListener("click", () =>
          this.abrirDetalhesVaga(vaga, empresa),
        );
        lista.appendChild(item);
      },
    );
  }

  private abrirDetalhesVaga(vaga: Vaga, empresa: Empresa): void {
    this.obterElemento("modal-vaga").classList.remove("hidden");
    this.obterElemento("modal-vaga-dados-empresa").classList.remove("hidden");

    (document.getElementById("modal-vaga-titulo") as HTMLElement).textContent =
      vaga.titulo;

    this.obterElemento<HTMLTextAreaElement>(
      "modal-vaga-campo-descricao",
    ).value = vaga.descricao || "";
    this.obterElemento<HTMLInputElement>("modal-vaga-campo-horario").value =
      vaga.horario || "";
    this.obterElemento<HTMLInputElement>("modal-vaga-campo-localizacao").value =
      vaga.localizacao || "";
    this.obterElemento<HTMLInputElement>("modal-vaga-campo-salario").value =
      vaga.remuneracao || "";
    this.obterElemento<HTMLTextAreaElement>(
      "modal-vaga-campo-requisitos",
    ).value = vaga.requisitos || "";
    this.obterElemento<HTMLTextAreaElement>(
      "modal-vaga-campo-competencias",
    ).value = vaga.competencias.join(", ");

    this.obterElemento<HTMLInputElement>("modal-vaga-empresa-nome").value =
      empresa.nome;
    this.obterElemento<HTMLInputElement>("modal-vaga-empresa-email").value =
      empresa.email;
    this.obterElemento<HTMLInputElement>("modal-vaga-empresa-cnpj").value =
      empresa.cnpj;
    this.obterElemento<HTMLTextAreaElement>(
      "modal-vaga-empresa-descricao",
    ).value = empresa.descricao;
    this.obterElemento<HTMLInputElement>("modal-vaga-empresa-pais").value =
      empresa.pais;
    this.obterElemento<HTMLInputElement>("modal-vaga-empresa-estado").value =
      empresa.estado;
    this.obterElemento<HTMLInputElement>("modal-vaga-empresa-cep").value =
      empresa.cep;
  }
}
