import { AuthService } from "./AuthService.js";
import { Candidato, Empresa } from "../types.js";

export class AuthController {
  private authService = new AuthService();

  constructor() {
    this.registrarEventos();
  }

  private obterInput(id: string): HTMLInputElement {
    return document.getElementById(id) as HTMLInputElement;
  }

  private obterTextarea(id: string): HTMLTextAreaElement {
    return document.getElementById(id) as HTMLTextAreaElement;
  }

  private registrarEventos(): void {
    this.vincularFormLogin();
    this.vincularFormCandidato();
    this.vincularFormEmpresa();
    document.addEventListener("goToLogin", () =>
      this.mostrarFormulario("login"),
    );
  }

  private vincularFormLogin(): void {
    const form = document.getElementById("form-login") as HTMLFormElement;
    if (!form) return;

    form.onsubmit = (e) => {
      e.preventDefault();
      this.login(
        this.obterInput("email").value,
        this.obterInput("password").value,
      );
    };
  }

  private vincularFormCandidato(): void {
    const form = document.getElementById("form-candidato") as HTMLFormElement;
    if (!form) return;

    form.onsubmit = (e) => {
      e.preventDefault();
      this.cadastrar({
        id: crypto.randomUUID(),
        tipo: "candidato",
        nome: this.obterInput("nome-candidato").value,
        email: this.obterInput("email-candidato").value,
        senha: this.obterInput("senha-candidato").value,
        cpf: this.obterInput("cpf-candidato").value,
        idade: this.obterInput("idade-candidato").value,
        estado: this.obterInput("estado-candidato").value,
        cep: this.obterInput("cep-candidato").value,
        descricao: this.obterTextarea("descricao-candidato").value,
        competencias: [],
      } as Candidato);
    };
  }

  private vincularFormEmpresa(): void {
    const form = document.getElementById("form-empresa") as HTMLFormElement;
    if (!form) return;

    form.onsubmit = (e) => {
      e.preventDefault();
      this.cadastrar({
        id: crypto.randomUUID(),
        tipo: "empresa",
        nome: this.obterInput("nome-empresa").value,
        email: this.obterInput("email-empresa").value,
        senha: this.obterInput("senha-empresa").value,
        cnpj: this.obterInput("cnpj").value,
        pais: this.obterInput("pais-empresa").value,
        estado: this.obterInput("estado-empresa").value,
        cep: this.obterInput("cep-empresa").value,
        descricao: this.obterTextarea("descricao-empresa").value,
      } as Empresa);
    };
  }

  private login(email: string, senha: string): void {
    const sucesso = this.authService.login(email, senha);
    if (!sucesso) {
      alert("Email ou senha incorretos.");
      return;
    }
    window.location.href = "app.html";
  }

  private cadastrar(usuario: Candidato | Empresa): void {
    const sucesso = this.authService.registrar(usuario);
    if (!sucesso) {
      alert("Este email já está cadastrado.");
      return;
    }
    alert("Cadastro realizado com sucesso!");
    this.mostrarFormulario("login");
  }

  private mostrarFormulario(tipo: "login" | "candidato" | "empresa"): void {
    ["form-login", "form-candidato", "form-empresa"].forEach((id) => {
      document.getElementById(id)?.classList.add("hidden");
    });
    document.getElementById(`form-${tipo}`)?.classList.remove("hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new AuthController();
});
