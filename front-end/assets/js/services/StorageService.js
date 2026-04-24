export class StorageService {
    static obterUsuarios() {
        return JSON.parse(localStorage.getItem(this.CHAVE_USUARIOS) || "[]");
    }
    static salvarUsuarios(usuarios) {
        localStorage.setItem(this.CHAVE_USUARIOS, JSON.stringify(usuarios));
    }
    static obterUsuarioAtual() {
        const dados = localStorage.getItem(this.CHAVE_USUARIO_ATUAL);
        if (!dados) {
            window.location.href = "auth.html";
            throw new Error("Usuário não autenticado");
        }
        return JSON.parse(dados);
    }
    static salvarUsuarioAtual(usuario) {
        localStorage.setItem(this.CHAVE_USUARIO_ATUAL, JSON.stringify(usuario));
    }
    static removerUsuarioAtual() {
        localStorage.removeItem(this.CHAVE_USUARIO_ATUAL);
    }
    static atualizarUsuario(usuario) {
        const usuarios = this.obterUsuarios();
        const indice = usuarios.findIndex((u) => u.id === usuario.id);
        if (indice === -1)
            return;
        usuarios[indice] = usuario;
        this.salvarUsuarios(usuarios);
        this.salvarUsuarioAtual(usuario);
    }
    static excluirUsuario(usuarioId) {
        const usuariosFiltrados = this.obterUsuarios().filter((u) => u.id !== usuarioId);
        this.salvarUsuarios(usuariosFiltrados);
        this.removerLikesDoUsuario(usuarioId);
        const atual = localStorage.getItem(this.CHAVE_USUARIO_ATUAL);
        if (atual && JSON.parse(atual).id === usuarioId) {
            this.removerUsuarioAtual();
        }
    }
    static obterTodasVagas() {
        return this.obterUsuarios()
            .filter((u) => u.tipo === "empresa")
            .reduce((acc, empresa) => acc.concat(empresa.vagas || []), []);
    }
    static obterEmpresaPorVaga(vagaId) {
        var _a;
        return ((_a = this.obterUsuarios()
            .filter((u) => u.tipo === "empresa")
            .find((empresa) => { var _a; return (_a = empresa.vagas) === null || _a === void 0 ? void 0 : _a.some((v) => v.id === vagaId); })) !== null && _a !== void 0 ? _a : null);
    }
    static getLikes() {
        return JSON.parse(localStorage.getItem(this.CHAVE_LIKES) || "[]");
    }
    static salvarLike(like) {
        const likes = this.getLikes();
        const jaExiste = likes.some((l) => JSON.stringify(l) === JSON.stringify(like));
        if (jaExiste)
            return;
        likes.push(like);
        localStorage.setItem(this.CHAVE_LIKES, JSON.stringify(likes));
    }
    static excluirVaga(vagaId, empresaId) {
        const usuarios = this.obterUsuarios().map((usuario) => {
            if (usuario.tipo !== "empresa" || usuario.id !== empresaId)
                return usuario;
            return Object.assign(Object.assign({}, usuario), { vagas: (usuario.vagas || []).filter((v) => v.id !== vagaId) });
        });
        this.salvarUsuarios(usuarios);
        const atual = this.obterUsuarioAtual();
        if (atual.tipo === "empresa" && atual.id === empresaId) {
            const empresaAtualizada = usuarios.find((u) => u.tipo === "empresa" && u.id === empresaId);
            if (empresaAtualizada)
                this.salvarUsuarioAtual(empresaAtualizada);
        }
        const likesSemVaga = this.getLikes().filter((like) => !("vagaId" in like) || like.vagaId !== vagaId);
        localStorage.setItem(this.CHAVE_LIKES, JSON.stringify(likesSemVaga));
    }
    static removerLikesDoUsuario(usuarioId) {
        const likes = this.getLikes().filter((like) => {
            if ("vagaId" in like)
                return like.candidatoId !== usuarioId;
            return like.candidatoId !== usuarioId && like.empresaId !== usuarioId;
        });
        localStorage.setItem(this.CHAVE_LIKES, JSON.stringify(likes));
    }
}
StorageService.CHAVE_USUARIOS = "users";
StorageService.CHAVE_USUARIO_ATUAL = "currentUser";
StorageService.CHAVE_LIKES = "likes";
