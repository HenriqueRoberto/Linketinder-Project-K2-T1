package linketinder.service

import linketinder.dao.CompetenciaDAO
import linketinder.model.Candidato
import linketinder.model.Competencia

class CompetenciaService {

    static void adicionarAoCandidato(Candidato candidato, String nomeCompetencia) {
        int idComp = CompetenciaDAO.buscarOuInserir(nomeCompetencia)
        CompetenciaDAO.vincularCandidato(candidato.id, idComp)
        Competencia nova = new Competencia(nomeCompetencia)
        nova.id = idComp
        candidato.competencias.add(nova)
    }

    static void editarDoCandidato(Candidato candidato, int indice, String novoNome) {
        Competencia antiga = candidato.competencias[indice]
        CompetenciaDAO.desvincularCandidato(candidato.id, antiga.id)
        int idNova = CompetenciaDAO.buscarOuInserir(novoNome)
        CompetenciaDAO.vincularCandidato(candidato.id, idNova)
        candidato.competencias[indice].nome = novoNome
        candidato.competencias[indice].id   = idNova
    }

    static String removerDoCandidato(Candidato candidato, int indice) {
        CompetenciaDAO.desvincularCandidato(candidato.id, candidato.competencias[indice].id)
        return candidato.competencias.remove(indice).nome
    }
}