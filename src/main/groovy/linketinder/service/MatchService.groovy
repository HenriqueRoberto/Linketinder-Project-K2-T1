package linketinder.service

import linketinder.model.Candidato
import linketinder.model.Empresa
import linketinder.model.Match
import linketinder.model.Vaga

class MatchService {


    private static Map<Integer, Set<Integer>> likesCandidatos = [:]


    private static Map<Integer, Set<Integer>> likesEmpresas = [:]

    private static List<Match> matches = []

    static void registrarLikeCandidato(int idCandidato, int idVaga) {
        if (!likesCandidatos[idCandidato]) likesCandidatos[idCandidato] = [] as Set
        likesCandidatos[idCandidato].add(idVaga)
    }

    static void registrarLikeEmpresa(int idEmpresa, int idCandidato) {
        if (!likesEmpresas[idEmpresa]) likesEmpresas[idEmpresa] = [] as Set
        likesEmpresas[idEmpresa].add(idCandidato)
    }

    // Verifica match e armazena para todas as vagas curtidas da empresa
    static boolean houveMatch(int idCandidato, int idEmpresa) {
        boolean empresaCurtiu = likesEmpresas[idEmpresa]?.contains(idCandidato) ?: false
        if (!empresaCurtiu) return false

        Empresa empresa = EmpresaService.buscarPorId(idEmpresa)
        if (empresa == null) return false

        Set<Integer> vagasCurtidas = likesCandidatos[idCandidato] ?: ([] as Set)

        // Registra match para cada vaga da empresa que o candidato curtiu
        List<Vaga> vagasComMatch = empresa.vagas.findAll { vaga -> vagasCurtidas.contains(vaga.id) }
        if (vagasComMatch.isEmpty()) return false

        vagasComMatch.each { vaga ->
            boolean jaExiste = matches.any { it.idCandidato == idCandidato && it.idVaga == vaga.id }
            if (!jaExiste) {
                matches.add(new Match(idCandidato, vaga.id))
            }
        }

        return true
    }

    // Retorna lista de maps com [vaga: Vaga, empresa: Empresa]
    // Só inclui vagas que ainda existem
    static List<Map> obterMatchesCandidato(int idCandidato) {
        List<Map> resultado = []

        matches.findAll { it.idCandidato == idCandidato }.each { match ->
            Empresa empresa = EmpresaService.listar().find { e -> e.vagas.any { v -> v.id == match.idVaga } }
            if (empresa == null) return  // Vaga excluída — match some

            Vaga vaga = empresa.vagas.find { v -> v.id == match.idVaga }
            if (vaga == null) return

            resultado << [vaga: vaga, empresa: empresa]
        }

        return resultado
    }

    // Retorna lista de maps com [vaga: Vaga, candidatos: List<Candidato>]
    // Só considera vagas que ainda existem
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
}