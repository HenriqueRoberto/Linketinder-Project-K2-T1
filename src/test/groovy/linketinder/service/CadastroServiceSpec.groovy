package linketinder.service

import spock.lang.Specification
import linketinder.model.Candidato

class CandidatoServiceSpec extends Specification {

    def setup() {
        CandidatoService.candidatos = []
    }

    def "Deve cadastrar um novo candidato com sucesso"() {
        given: "Um novo candidato"
        def candidato = new Candidato("Ana Silva", "ana@email.com", "11111111111", 22, "SC", "88000-000", "Desenvolvedora", ["Java", "SQL"], "senha123")

        when: "O candidato é cadastrado"
        CandidatoService.cadastrar(candidato)

        then: "O candidato deve estar na lista"
        CandidatoService.listar().size() == 1
        CandidatoService.listar().first().email == "ana@email.com"
    }
}