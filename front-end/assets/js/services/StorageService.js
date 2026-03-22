export class StorageService {
    static getUsers() {
        return JSON.parse(localStorage.getItem(this.usersKey) || "[]");
    }
    static saveUsers(users) {
        localStorage.setItem(this.usersKey, JSON.stringify(users));
    }
    static getCurrentUser() {
        const data = localStorage.getItem(this.currentUserKey);
        if (!data) {
            window.location.href = "auth.html";
            throw new Error("Não logado");
        }
        return JSON.parse(data);
    }
    static saveCurrentUser(user) {
        localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    }
    static clearCurrentUser() {
        localStorage.removeItem(this.currentUserKey);
    }
    static updateUser(user) {
        const users = this.getUsers();
        const index = users.findIndex((u) => u.id === user.id);
        if (index === -1)
            return;
        users[index] = user;
        this.saveUsers(users);
        this.saveCurrentUser(user);
    }
    static getAllVagas() {
        return this.getUsers()
            .filter((u) => u.tipo === "empresa")
            .reduce((acc, empresa) => acc.concat(empresa.vagas || []), []);
    }
    static getEmpresaByVaga(vagaId) {
        var _a;
        const empresas = this.getUsers().filter((u) => u.tipo === "empresa");
        for (const empresa of empresas) {
            const vaga = (_a = empresa.vagas) === null || _a === void 0 ? void 0 : _a.find((v) => v.id === vagaId);
            if (vaga)
                return empresa;
        }
        return null;
    }
    static getLikes() {
        return JSON.parse(localStorage.getItem(this.likesKey) || "[]");
    }
    static saveLike(like) {
        const likes = this.getLikes();
        const exists = likes.some((item) => JSON.stringify(item) === JSON.stringify(like));
        if (exists)
            return;
        likes.push(like);
        localStorage.setItem(this.likesKey, JSON.stringify(likes));
    }
    static saveLikes(likes) {
        localStorage.setItem(this.likesKey, JSON.stringify(likes));
    }
    static deleteVaga(vagaId, empresaId) {
        const users = this.getUsers().map((user) => {
            if (user.tipo !== "empresa" || user.id !== empresaId)
                return user;
            return Object.assign(Object.assign({}, user), { vagas: (user.vagas || []).filter((vaga) => vaga.id !== vagaId) });
        });
        this.saveUsers(users);
        const current = this.getCurrentUser();
        if (current.tipo === "empresa" && current.id === empresaId) {
            const updated = users.find((u) => u.tipo === "empresa" && u.id === empresaId);
            if (updated)
                this.saveCurrentUser(updated);
        }
        const likes = this.getLikes().filter((like) => {
            if ("vagaId" in like) {
                return like.vagaId !== vagaId;
            }
            return true;
        });
        this.saveLikes(likes);
    }
    static deleteUser(userId) {
        const users = this.getUsers().filter((user) => user.id !== userId);
        this.saveUsers(users);
        const likes = this.getLikes().filter((like) => {
            if ("vagaId" in like) {
                const vaga = this.getAllVagas().find((v) => v.id === like.vagaId);
                return like.candidatoId !== userId && vaga;
            }
            return like.candidatoId !== userId && like.empresaId !== userId;
        });
        this.saveLikes(likes);
        const current = localStorage.getItem(this.currentUserKey);
        if (current) {
            const parsed = JSON.parse(current);
            if (parsed.id === userId) {
                this.clearCurrentUser();
            }
        }
    }
}
StorageService.usersKey = "users";
StorageService.currentUserKey = "currentUser";
StorageService.likesKey = "likes";
