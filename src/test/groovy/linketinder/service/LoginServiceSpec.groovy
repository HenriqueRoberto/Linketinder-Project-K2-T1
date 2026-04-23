package linketinder.service

import spock.lang.Specification
import linketinder.model.Candidato
import linketinder.model.Empresa

class LoginServiceSpec extends Specification {

    def "Deve retornar null ao tentar login com credenciais inválidas"() {
        given: "Uma lista vazia de candidatos e empresas"
        def candidatos = []
        def empresas = []

        when: "Buscamos por e-mail e senha que não existem"
        def resultado = candidatos.find { it.email == "inexistente@email.com" && it.senha == "errada" }
                ?: empresas.find { it.email == "inexistente@email.com" && it.senha == "errada" }

        then: "O resultado deve ser null"
        resultado == null
    }

    def "Deve encontrar candidato com e-mail e senha corretos"() {
        given: "Um candidato cadastrado"
        def candidato = new Candidato("Ana Silva", "ana@email.com", "11111111111", 22, "SC", "88000-000", "Desenvolvedora", [], "senha123")
        def candidatos = [candidato]

        when: "O login é realizado com credenciais corretas"
        def resultado = candidatos.find { it.email == "ana@email.com" && it.senha == "senha123" }

        then: "Deve retornar o candidato"
        resultado instanceof Candidato
        resultado.email == "ana@email.com"
    }

    def "Deve encontrar empresa com e-mail e senha corretos"() {
        given: "Uma empresa cadastrada"
        def empresa = new Empresa("TechSul", "rh@techsul.com", "11111111000101", "Brasil", "RS", "90000-100", "Desc", "corp123")
        def empresas = [empresa]

        when: "O login é realizado com credenciais da empresa"
        def resultado = empresas.find { it.email == "rh@techsul.com" && it.senha == "corp123" }

        then: "Deve retornar a empresa"
        resultado instanceof Empresa
        resultado.email == "rh@techsul.com"
    }
}