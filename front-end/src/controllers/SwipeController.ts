export class SwipeController<T> {
  private indiceAtual = 0;

  constructor(
    private itens: T[],
    private aoExibir: (item: T) => void,
    private aoLike: (item: T) => void,
    private aoVazio: () => void,
  ) {
    this.init();
  }

  private init(): void {
    if (!this.itens.length) {
      this.aoVazio();
      return;
    }

    document.getElementById("match-swipe-card")?.classList.remove("hidden");
    this.exibirAtual();

    document
      .getElementById("match-swipe-btn-like")
      ?.addEventListener("click", () => {
        const atual = this.itens[this.indiceAtual];
        if (!atual) return;
        this.aoLike(atual);
        this.avancar();
      });

    document
      .getElementById("match-swipe-btn-dislike")
      ?.addEventListener("click", () => {
        const atual = this.itens[this.indiceAtual];
        if (!atual) return;
        this.itens.splice(this.indiceAtual, 1);
        if (!this.itens.length || this.indiceAtual >= this.itens.length) {
          this.aoVazio();
          return;
        }
        this.exibirAtual();
      });
  }

  private exibirAtual(): void {
    const atual = this.itens[this.indiceAtual];
    if (!atual) {
      this.aoVazio();
      return;
    }
    this.aoExibir(atual);
  }

  private avancar(): void {
    this.indiceAtual++;
    if (this.indiceAtual >= this.itens.length) {
      this.aoVazio();
      return;
    }
    this.exibirAtual();
  }
}
