package linketinder.service

import linketinder.model.Candidato
import linketinder.model.Empresa
import linketinder.model.Match
import linketinder.model.Vaga

class MatchService {

    private static Map<Integer, Set<Integer>> likesPorCandidato = [:]
    private static Map<Integer, Set<Integer>> likesPorEmpresa   = [:]
    private static List<Match> matches = []

    static void registrarLikeCandidato(int idCandidato, int idVaga) {
        adicionarLike(likesPorCandidato, idCandidato, idVaga)
    }

    static void registrarLikeEmpresa(int idEmpresa, int idCandidato) {
        adicionarLike(likesPorEmpresa, idEmpresa, idCandidato)
    }

    static boolean houveMatch(int idCandidato, int idEmpresa) {
        boolean empresaCurtiuCandidato = likesPorEmpresa[idEmpresa]?.contains(idCandidato) ?: false
        if (!empresaCurtiuCandidato) return false

        Empresa empresa = EmpresaService.buscarPorId(idEmpresa)
        if (empresa == null) return false

        Set<Integer> vagasCurtidasPeloCandidato = likesPorCandidato[idCandidato] ?: ([] as Set)
        List<Vaga> vagasEmComum = empresa.vagas.findAll { vaga -> vagasCurtidasPeloCandidato.contains(vaga.id) }

        if (vagasEmComum.isEmpty()) return false

        vagasEmComum.each { vaga ->
            boolean matchJaRegistrado = matches.any { it.idCandidato == idCandidato && it.idVaga == vaga.id }
            if (!matchJaRegistrado) matches.add(new Match(idCandidato, vaga.id))
        }

        return true
    }

    static List<Map> obterMatchesCandidato(int idCandidato) {
        List<Map> resultado = []

        matches.findAll { it.idCandidato == idCandidato }.each { match ->
            Empresa empresa = EmpresaService.listar().find { e -> e.vagas.any { v -> v.id == match.idVaga } }
            if (empresa == null) return

            Vaga vaga = empresa.vagas.find { v -> v.id == match.idVaga }
            if (vaga == null) return

            resultado << [vaga: vaga, empresa: empresa]
        }

        return resultado
    }

    static List<Map> obterMatchesEmpresa(int idEmpresa) {
        List<Map> resultado = []

        Empresa empresa = EmpresaService.buscarPorId(idEmpresa)
        if (empresa == null) return resultado

        empresa.vagas.each { vaga ->
            List<Candidato> candidatosComMatch = matches
                    .findAll { it.idVaga == vaga.id }
                    .collect { match -> CandidatoService.listar().find { c -> c.id == match.idCandidato } }
                    .findAll { it != null }

            if (!candidatosComMatch.isEmpty()) {
                resultado << [vaga: vaga, candidatos: candidatosComMatch]
            }
        }

        return resultado
    }

    private static void adicionarLike(Map<Integer, Set<Integer>> mapa, int chave, int valor) {
        if (!mapa[chave]) mapa[chave] = [] as Set
        mapa[chave].add(valor)
    }
}