package linketinder.service

import spock.lang.Specification
import linketinder.model.Candidato

class LoginServiceSpec extends Specification {

    def setup() {
        CandidatoService.candidatos = []
        EmpresaService.empresas = []
    }

    def "Deve realizar login com sucesso"() {
        given: "Um candidato cadastrado"
        def candidato = new Candidato("Ana Silva", "ana@email.com", "11111111111", 22, "SC", "88000-000", "Desenvolvedora", ["Java", "SQL"], "senha123")
        CandidatoService.candidatos = [candidato]

        when: "O login é realizado com as credenciais corretas"
        def resultado = LoginService.realizarLogin("ana@email.com", "senha123")

        then: "Deve retornar o objeto do candidato"
        resultado instanceof Candidato
        resultado.email == "ana@email.com"
    }
}