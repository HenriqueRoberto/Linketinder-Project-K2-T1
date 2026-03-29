package linketinder.service

import linketinder.model.Candidato
import linketinder.data.DadosMock

class CandidatoService {
    private static List<Candidato> candidatos = DadosMock.candidatos()

    static void cadastrar(Candidato candidato) {
        boolean emailExiste = candidatos.any { it.email.equalsIgnoreCase(candidato.email) }

        if (emailExiste) {
            throw new IllegalArgumentException("Erro: O e-mail " + candidato.email + " já está cadastrado.")
        }

        candidatos.add(candidato)
    }

    static List<Candidato> listar() {
        return candidatos
    }
}