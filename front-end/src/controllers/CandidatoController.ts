import { Candidato, Empresa, Vaga } from "../types.js";
import { StorageService } from "../services/StorageService.js";
import { MatchController } from "./MatchController.js";

export class CandidatoController {
  private fotoBase64 = "";
  private competencias: string[] = [];

  constructor(private user: Candidato) {
    this.init();
  }

  private init(): void {
    document.getElementById("menu-candidato")?.classList.remove("hidden");
    document.getElementById("perfil-candidato")?.classList.remove("hidden");

    this.load();
    this.events();
    this.competenciasEvents();
    this.initMatchVagas();
    this.renderMatches();
  }

  private input(id: string): HTMLInputElement {
    return document.getElementById(id) as HTMLInputElement;
  }

  private textarea(id: string): HTMLTextAreaElement {
    return document.getElementById(id) as HTMLTextAreaElement;
  }

  private el<T extends HTMLElement>(id: string): T {
    return document.getElementById(id) as T;
  }

  // ================= PROFILE =================

  private load(): void {
    (
      document.getElementById("perfil-candidato-nome") as HTMLElement
    ).textContent = this.user.nome;

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

    const fotoEl = document.getElementById(
      "perfil-candidato-avatar",
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
      .getElementById("perfil-candidato-btn-salvar")
      ?.addEventListener("click", () => this.save());

    const foto = document.getElementById("perfil-candidato-avatar");
    const inputFoto = document.getElementById(
      "perfil-candidato-avatar-input",
    ) as HTMLInputElement;

    foto?.addEventListener("click", () => inputFoto.click());
    inputFoto?.addEventListener("change", (e) => this.handleFoto(e));

    document
      .getElementById("modal-vaga-btn-fechar")
      ?.addEventListener("click", () => {
        document.getElementById("modal-vaga")?.classList.add("hidden");
        document
          .getElementById("modal-vaga-dados-empresa")
          ?.classList.add("hidden");
      });

    document
      .getElementById("perfil-candidato-btn-excluir")
      ?.addEventListener("click", () => this.deleteAccount());

    this.togglePassword(
      "perfil-candidato-campo-senha-atual",
      "perfil-candidato-toggle-senha-atual",
    );
    this.togglePassword(
      "perfil-candidato-campo-nova-senha",
      "perfil-candidato-toggle-nova-senha",
    );
  }

  private togglePassword(inputId: string, buttonId: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const button = document.getElementById(buttonId);
    if (!input || !button) return;
    button.addEventListener("click", () => {
      input.type = input.type === "password" ? "text" : "password";
    });
  }

  private handleFoto(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      this.fotoBase64 = reader.result as string;

      const foto = document.getElementById(
        "perfil-candidato-avatar",
      ) as HTMLDivElement;
      foto.style.backgroundImage = `url(${this.fotoBase64})`;
      foto.style.backgroundSize = "cover";
      foto.style.backgroundPosition = "center";
      foto.textContent = "";
    };

    reader.readAsDataURL(file);
  }

  private save(): void {
    const current = StorageService.getCurrentUser() as Candidato;

    const senhaAtualDigitada = this.input(
      "perfil-candidato-campo-senha-atual",
    ).value.trim();
    const novaSenha = this.input(
      "perfil-candidato-campo-nova-senha",
    ).value.trim();

    if (senhaAtualDigitada && senhaAtualDigitada !== current.senha) {
      alert("Senha atual incorreta.");
      return;
    }

    if (novaSenha && novaSenha.length < 6) {
      alert("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    const updated: Candidato = {
      ...current,
      nome: this.input("perfil-candidato-campo-nome").value,
      email: this.input("perfil-candidato-campo-email").value,
      cpf: this.input("perfil-candidato-campo-cpf").value,
      idade: this.input("perfil-candidato-campo-idade").value,
      estado: this.input("perfil-candidato-campo-estado").value,
      cep: this.input("perfil-candidato-campo-cep").value,
      descricao: this.textarea("perfil-candidato-campo-descricao").value,
      foto: this.fotoBase64 || current.foto,
      competencias: this.competencias,
      senha: novaSenha || current.senha,
    };

    StorageService.updateUser(updated);
    this.user = updated;

    (
      document.getElementById("perfil-candidato-nome") as HTMLElement
    ).textContent = updated.nome;

    this.input("perfil-candidato-campo-senha-atual").value = "";
    this.input("perfil-candidato-campo-nova-senha").value = "";

    alert("Salvo!");
  }

  private deleteAccount(): void {
    if (!confirm("Tem certeza que deseja excluir sua conta?")) return;

    StorageService.deleteUser(this.user.id);
    alert("Conta excluída com sucesso.");
    window.location.href = "auth.html";
  }

  // ================= COMPETENCIAS =================

  private renderCompetencias(): void {
    const lista = document.getElementById(
      "perfil-candidato-competencias-lista",
    );
    const template = document.getElementById(
      "perfil-candidato-competencia-template",
    ) as HTMLDivElement;

    if (!lista || !template) return;

    lista.innerHTML = "";

    this.competencias.forEach((c, index) => {
      const item = template.cloneNode(true) as HTMLDivElement;
      item.classList.remove("hidden");

      item.querySelector(".competencia__texto")!.textContent = c;

      item.addEventListener("click", () => {
        if (!confirm("Remover competência?")) return;

        this.competencias.splice(index, 1);
        this.renderCompetencias();
      });

      lista.appendChild(item);
    });
  }

  private competenciasEvents(): void {
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

  private initMatchVagas(): void {
    const likes = StorageService.getLikes();

    const vagas = StorageService.getAllVagas().filter(
      (vaga) =>
        !likes.some(
          (like) =>
            "vagaId" in like &&
            like.candidatoId === this.user.id &&
            like.vagaId === vaga.id,
        ),
    );

    new MatchController<Vaga>(
      vagas,
      (vaga) => this.renderCardVaga(vaga),
      (vaga) => {
        StorageService.saveLike({
          candidatoId: this.user.id,
          vagaId: vaga.id,
        });

        this.renderMatches();
      },
      () => {
        document.getElementById("match-swipe-card")?.classList.add("hidden");
        document
          .getElementById("match-swipe-sem-vagas")
          ?.classList.remove("hidden");
      },
    );
  }

  private renderCardVaga(vaga: Vaga): void {
    document.getElementById("match-swipe-card")?.classList.remove("hidden");

    // mostra vaga e esconde candidato
    document
      .getElementById("match-swipe-dados-vaga")
      ?.classList.remove("hidden");
    document
      .getElementById("match-swipe-dados-candidato")
      ?.classList.add("hidden");

    // tipo + título
    const tipoEl = document.getElementById("match-swipe-tipo") as HTMLElement;
    if (tipoEl) tipoEl.textContent = "Vaga";
    (document.getElementById("match-swipe-titulo") as HTMLElement).textContent =
      vaga.titulo;

    // dados
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

  // ================= MATCH LIST =================

  private renderMatches(): void {
    const lista = document.getElementById("matches-lista");
    const template = lista?.querySelector(".matches__item") as HTMLElement;

    if (!lista || !template) return;

    lista.innerHTML = "";
    lista.appendChild(template);
    template.classList.add("hidden");

    const matches = MatchController.getMatches().filter(
      (m) => m.candidatoId === this.user.id,
    );

    matches.forEach((match) => {
      const vaga = StorageService.getAllVagas().find(
        (v) => v.id === match.vagaId,
      );

      if (!vaga) return;

      const item = template.cloneNode(true) as HTMLElement;
      item.classList.remove("hidden");

      item.querySelector(".matches__item-titulo")!.textContent = vaga.titulo;

      item.addEventListener("click", () => this.openVagaView(vaga));

      lista.appendChild(item);
    });
  }

  private openVagaView(vaga: Vaga): void {
    this.el("modal-vaga").classList.remove("hidden");
    this.el("modal-vaga-dados-empresa").classList.remove("hidden");

    (this.el("modal-vaga-titulo") as HTMLElement).textContent = vaga.titulo;
    this.el<HTMLTextAreaElement>("modal-vaga-campo-descricao").value =
      vaga.descricao || "";
    this.el<HTMLInputElement>("modal-vaga-campo-horario").value =
      vaga.horario || "";
    this.el<HTMLInputElement>("modal-vaga-campo-localizacao").value =
      vaga.localizacao || "";
    this.el<HTMLInputElement>("modal-vaga-campo-salario").value =
      vaga.remuneracao || "";
    this.el<HTMLTextAreaElement>("modal-vaga-campo-requisitos").value =
      vaga.requisitos || "";
    this.el<HTMLTextAreaElement>("modal-vaga-campo-competencias").value =
      vaga.competencias.join(", ");

    const empresa = StorageService.getUsers().find(
      (u): u is Empresa => u.tipo === "empresa" && u.id === vaga.empresaId,
    );

    if (!empresa) return;

    this.el<HTMLInputElement>("modal-vaga-empresa-nome").value = empresa.nome;
    this.el<HTMLInputElement>("modal-vaga-empresa-email").value = empresa.email;
    this.el<HTMLInputElement>("modal-vaga-empresa-cnpj").value = empresa.cnpj;
    this.el<HTMLTextAreaElement>("modal-vaga-empresa-descricao").value =
      empresa.descricao;
    this.el<HTMLInputElement>("modal-vaga-empresa-pais").value = empresa.pais;
    this.el<HTMLInputElement>("modal-vaga-empresa-estado").value =
      empresa.estado;
    this.el<HTMLInputElement>("modal-vaga-empresa-cep").value = empresa.cep;
  }
}
