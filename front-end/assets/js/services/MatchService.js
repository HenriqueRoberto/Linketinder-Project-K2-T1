import { StorageService } from "./StorageService.js";
export class MatchService {
    static registrarLikeCandidatoVaga(candidatoId, vagaId) {
        StorageService.salvarLike({ candidatoId, vagaId });
    }
    static registrarLikeEmpresaCandidato(empresaId, candidatoId) {
        StorageService.salvarLike({ empresaId, candidatoId });
    }
    static obterMatchesCompletosDoCandidato(candidatoId) {
        return this.calcularMatches()
            .filter((m) => m.candidatoId === candidatoId)
            .reduce((acc, match) => {
            const empresa = StorageService.obterEmpresaPorVaga(match.vagaId);
            const vaga = StorageService.obterTodasVagas().find((v) => v.id === match.vagaId);
            if (empresa && vaga)
                acc.push({ vaga, empresa });
            return acc;
        }, []);
    }
    static obterMatchesCompletosDaEmpresa(empresaId) {
        const matchesDaEmpresa = this.calcularMatches().filter((m) => m.empresaId === empresaId);
        const vagasUnicas = matchesDaEmpresa
            .map((m) => m.vagaId)
            .filter((id, indice, arr) => arr.indexOf(id) === indice);
        return vagasUnicas.reduce((acc, vagaId) => {
            var _a;
            const empresa = StorageService.obterEmpresaPorVaga(vagaId);
            const vaga = (_a = empresa === null || empresa === void 0 ? void 0 : empresa.vagas) === null || _a === void 0 ? void 0 : _a.find((v) => v.id === vagaId);
            if (!vaga)
                return acc;
            const candidatos = matchesDaEmpresa
                .filter((m) => m.vagaId === vagaId)
                .reduce((lista, m) => {
                const candidato = StorageService.obterUsuarios().find((u) => u.tipo === "candidato" && u.id === m.candidatoId);
                if (candidato)
                    lista.push(candidato);
                return lista;
            }, []);
            acc.push({ vaga, candidatos });
            return acc;
        }, []);
    }
    static obterVagasNaoVistasPeloCandidato(candidatoId) {
        const likes = StorageService.getLikes();
        return StorageService.obterTodasVagas().filter((vaga) => !likes.some((like) => "vagaId" in like &&
            like.candidatoId === candidatoId &&
            like.vagaId === vaga.id));
    }
    static obterCandidatosParaSwipe() {
        return StorageService.obterUsuarios().filter((u) => u.tipo === "candidato");
    }
    static calcularMatches() {
        const likes = StorageService.getLikes();
        const likesCandidatoVaga = likes.filter((l) => "vagaId" in l);
        const likesEmpresaCandidato = likes.filter((l) => "empresaId" in l && !("vagaId" in l));
        const matches = [];
        likesCandidatoVaga.forEach((likeCV) => {
            const empresa = StorageService.obterEmpresaPorVaga(likeCV.vagaId);
            if (!empresa)
                return;
            const empresaCurtiuCandidato = likesEmpresaCandidato.some((likeEC) => likeEC.empresaId === empresa.id &&
                likeEC.candidatoId === likeCV.candidatoId);
            if (!empresaCurtiuCandidato)
                return;
            const matchJaRegistrado = matches.some((m) => m.candidatoId === likeCV.candidatoId && m.vagaId === likeCV.vagaId);
            if (!matchJaRegistrado) {
                matches.push({
                    candidatoId: likeCV.candidatoId,
                    vagaId: likeCV.vagaId,
                    empresaId: empresa.id,
                });
            }
        });
        return matches;
    }
}
