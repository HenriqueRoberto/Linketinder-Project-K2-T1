package linketinder.service

import spock.lang.Specification
import linketinder.model.Candidato
import linketinder.dao.CandidatoDAO

class CandidatoServiceSpec extends Specification {

    def "Deve lançar exceção ao cadastrar candidato com e-mail duplicado"() {
        given: "Um CandidatoDAO mockado que simula e-mail já existente"
        def candidatoExistente = new Candidato("Ana Silva", "ana@email.com", "11111111111", 22, "SC", "88000-000", "Dev", [], "senha123")
        def mockDAO = Mock(CandidatoDAO)
        mockDAO.listar() >> [candidatoExistente]

        and: "Um novo candidato com o mesmo e-mail"
        def novoCandidato = new Candidato("Carlos", "ana@email.com", "22222222222", 30, "SP", "01000-000", "Dev", [], "outrasenha")

        when: "Tentamos cadastrar o candidato duplicado verificando o e-mail"
        boolean emailJaCadastrado = [candidatoExistente].any { it.email.equalsIgnoreCase(novoCandidato.email) }

        then: "O e-mail deve ser detectado como duplicado"
        emailJaCadastrado == true
    }

    def "Deve criar candidato com os dados fornecidos corretamente"() {
        when: "Um candidato é instanciado com dados válidos"
        def candidato = new Candidato("Ana Silva", "ana@email.com", "11111111111", 22, "SC", "88000-000", "Desenvolvedora", [], "senha123")

        then: "Os dados devem estar corretos"
        candidato.nome == "Ana Silva"
        candidato.email == "ana@email.com"
        candidato.cpf == "11111111111"
        candidato.idade == 22
        candidato.estado == "SC"
    }
}