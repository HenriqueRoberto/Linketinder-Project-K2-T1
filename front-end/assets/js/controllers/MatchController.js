import { StorageService } from "../services/StorageService.js";
export class MatchController {
    constructor(items, renderItem, onLike, onEmpty) {
        this.items = items;
        this.renderItem = renderItem;
        this.onLike = onLike;
        this.onEmpty = onEmpty;
        this.index = 0;
        this.init();
    }
    static getMatches() {
        const likes = StorageService.getLikes();
        const likesCandidatoVaga = likes.filter((l) => "vagaId" in l);
        const likesEmpresaCandidato = likes.filter((l) => "empresaId" in l && !("vagaId" in l));
        const matches = [];
        likesCandidatoVaga.forEach((likeCV) => {
            const empresa = StorageService.getEmpresaByVaga(likeCV.vagaId);
            if (!empresa)
                return;
            const empresaCurtiu = likesEmpresaCandidato.some((likeEC) => likeEC.empresaId === empresa.id &&
                likeEC.candidatoId === likeCV.candidatoId);
            if (!empresaCurtiu)
                return;
            const exists = matches.some((m) => m.candidatoId === likeCV.candidatoId && m.vagaId === likeCV.vagaId);
            if (!exists) {
                matches.push({
                    candidatoId: likeCV.candidatoId,
                    vagaId: likeCV.vagaId,
                    empresaId: empresa.id,
                });
            }
        });
        return matches;
    }
    init() {
        var _a, _b, _c;
        if (!this.items.length) {
            this.onEmpty();
            return;
        }
        (_a = document.getElementById("card-for-match")) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
        this.showCurrent();
        (_b = document.getElementById("like-btn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            const current = this.items[this.index];
            if (!current)
                return;
            this.onLike(current);
            this.next();
        });
        (_c = document.getElementById("dislike-btn")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
            const current = this.items[this.index];
            if (!current)
                return;
            this.items.splice(this.index, 1);
            if (!this.items.length) {
                this.onEmpty();
                return;
            }
            if (this.index >= this.items.length) {
                this.onEmpty();
                return;
            }
            this.showCurrent();
        });
    }
    showCurrent() {
        const current = this.items[this.index];
        if (!current) {
            this.onEmpty();
            return;
        }
        this.renderItem(current);
    }
    next() {
        this.index++;
        if (this.index >= this.items.length) {
            this.onEmpty();
            return;
        }
        this.showCurrent();
    }
}
