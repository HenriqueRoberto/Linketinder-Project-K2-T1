export class SwipeController {
    constructor(itens, aoExibir, aoLike, aoVazio) {
        this.itens = itens;
        this.aoExibir = aoExibir;
        this.aoLike = aoLike;
        this.aoVazio = aoVazio;
        this.indiceAtual = 0;
        this.init();
    }
    init() {
        var _a, _b, _c;
        if (!this.itens.length) {
            this.aoVazio();
            return;
        }
        (_a = document.getElementById("match-swipe-card")) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
        this.exibirAtual();
        (_b = document
            .getElementById("match-swipe-btn-like")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            const atual = this.itens[this.indiceAtual];
            if (!atual)
                return;
            this.aoLike(atual);
            this.avancar();
        });
        (_c = document
            .getElementById("match-swipe-btn-dislike")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
            const atual = this.itens[this.indiceAtual];
            if (!atual)
                return;
            this.itens.splice(this.indiceAtual, 1);
            if (!this.itens.length || this.indiceAtual >= this.itens.length) {
                this.aoVazio();
                return;
            }
            this.exibirAtual();
        });
    }
    exibirAtual() {
        const atual = this.itens[this.indiceAtual];
        if (!atual) {
            this.aoVazio();
            return;
        }
        this.aoExibir(atual);
    }
    avancar() {
        this.indiceAtual++;
        if (this.indiceAtual >= this.itens.length) {
            this.aoVazio();
            return;
        }
        this.exibirAtual();
    }
}
