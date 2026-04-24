import { Empresa, Like, User, Vaga } from "../types.js";

export class StorageService {
  private static readonly CHAVE_USUARIOS = "users";
  private static readonly CHAVE_USUARIO_ATUAL = "currentUser";
  private static readonly CHAVE_LIKES = "likes";

  static obterUsuarios(): User[] {
    return JSON.parse(localStorage.getItem(this.CHAVE_USUARIOS) || "[]");
  }

  static salvarUsuarios(usuarios: User[]): void {
    localStorage.setItem(this.CHAVE_USUARIOS, JSON.stringify(usuarios));
  }

  static obterUsuarioAtual(): User {
    const dados = localStorage.getItem(this.CHAVE_USUARIO_ATUAL);
    if (!dados) {
      window.location.href = "auth.html";
      throw new Error("Usuário não autenticado");
    }
    return JSON.parse(dados);
  }

  static salvarUsuarioAtual(usuario: User): void {
    localStorage.setItem(this.CHAVE_USUARIO_ATUAL, JSON.stringify(usuario));
  }

  static removerUsuarioAtual(): void {
    localStorage.removeItem(this.CHAVE_USUARIO_ATUAL);
  }

  static atualizarUsuario(usuario: User): void {
    const usuarios = this.obterUsuarios();
    const indice = usuarios.findIndex((u) => u.id === usuario.id);
    if (indice === -1) return;
    usuarios[indice] = usuario;
    this.salvarUsuarios(usuarios);
    this.salvarUsuarioAtual(usuario);
  }

  static excluirUsuario(usuarioId: string): void {
    const usuariosFiltrados = this.obterUsuarios().filter(
      (u) => u.id !== usuarioId,
    );
    this.salvarUsuarios(usuariosFiltrados);
    this.removerLikesDoUsuario(usuarioId);

    const atual = localStorage.getItem(this.CHAVE_USUARIO_ATUAL);
    if (atual && JSON.parse(atual).id === usuarioId) {
      this.removerUsuarioAtual();
    }
  }

  static obterTodasVagas(): Vaga[] {
    return this.obterUsuarios()
      .filter((u): u is Empresa => u.tipo === "empresa")
      .reduce(
        (acc: Vaga[], empresa: Empresa) => acc.concat(empresa.vagas || []),
        [],
      );
  }

  static obterEmpresaPorVaga(vagaId: string): Empresa | null {
    return (
      this.obterUsuarios()
        .filter((u): u is Empresa => u.tipo === "empresa")
        .find((empresa: Empresa) =>
          empresa.vagas?.some((v) => v.id === vagaId),
        ) ?? null
    );
  }

  static getLikes(): Like[] {
    return JSON.parse(localStorage.getItem(this.CHAVE_LIKES) || "[]");
  }

  static salvarLike(like: Like): void {
    const likes = this.getLikes();
    const jaExiste = likes.some(
      (l) => JSON.stringify(l) === JSON.stringify(like),
    );
    if (jaExiste) return;
    likes.push(like);
    localStorage.setItem(this.CHAVE_LIKES, JSON.stringify(likes));
  }

  static excluirVaga(vagaId: string, empresaId: string): void {
    const usuarios = this.obterUsuarios().map((usuario) => {
      if (usuario.tipo !== "empresa" || usuario.id !== empresaId)
        return usuario;
      return {
        ...usuario,
        vagas: (usuario.vagas || []).filter((v) => v.id !== vagaId),
      };
    });
    this.salvarUsuarios(usuarios);

    const atual = this.obterUsuarioAtual();
    if (atual.tipo === "empresa" && atual.id === empresaId) {
      const empresaAtualizada = usuarios.find(
        (u): u is Empresa => u.tipo === "empresa" && u.id === empresaId,
      );
      if (empresaAtualizada) this.salvarUsuarioAtual(empresaAtualizada);
    }

    const likesSemVaga = this.getLikes().filter(
      (like) => !("vagaId" in like) || like.vagaId !== vagaId,
    );
    localStorage.setItem(this.CHAVE_LIKES, JSON.stringify(likesSemVaga));
  }

  private static removerLikesDoUsuario(usuarioId: string): void {
    const likes = this.getLikes().filter((like) => {
      if ("vagaId" in like) return like.candidatoId !== usuarioId;
      return like.candidatoId !== usuarioId && like.empresaId !== usuarioId;
    });
    localStorage.setItem(this.CHAVE_LIKES, JSON.stringify(likes));
  }
}
