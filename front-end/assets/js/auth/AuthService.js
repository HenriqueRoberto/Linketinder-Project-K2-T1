import { StorageService } from "../services/StorageService.js";
export class AuthService {
    registrar(usuario) {
        const emailJaCadastrado = StorageService.obterUsuarios().some((u) => u.email === usuario.email);
        if (emailJaCadastrado)
            return false;
        const usuarios = StorageService.obterUsuarios();
        usuarios.push(usuario);
        StorageService.salvarUsuarios(usuarios);
        return true;
    }
    login(email, senha) {
        const usuario = StorageService.obterUsuarios().find((u) => u.email === email && u.senha === senha);
        if (!usuario)
            return false;
        StorageService.salvarUsuarioAtual(usuario);
        return true;
    }
    logout() {
        StorageService.removerUsuarioAtual();
    }
}
