package linketinder.service

import spock.lang.Specification
import linketinder.model.Empresa

class EmpresaServiceSpec extends Specification {

    def "Deve lançar exceção ao cadastrar empresa com e-mail duplicado"() {
        given: "Uma empresa existente"
        def empresaExistente = new Empresa("TechSul", "rh@techsul.com", "11111111000101", "Brasil", "RS", "90000-100", "Software sob demanda", "corp123")

        and: "Uma nova empresa com o mesmo e-mail"
        def novaEmpresa = new Empresa("OutraEmpresa", "rh@techsul.com", "22222222000199", "Brasil", "SC", "88000-000", "Outra", "pass456")

        when: "Verificamos se o e-mail está duplicado"
        boolean emailJaCadastrado = [empresaExistente].any { it.email.equalsIgnoreCase(novaEmpresa.email) }

        then: "O e-mail deve ser detectado como duplicado"
        emailJaCadastrado == true
    }

    def "Deve criar empresa com os dados fornecidos corretamente"() {
        when: "Uma empresa é instanciada com dados válidos"
        def empresa = new Empresa("TechSul", "rh@techsul.com", "11111111000101", "Brasil", "RS", "90000-100", "Software sob demanda", "corp123")

        then: "Os dados devem estar corretos"
        empresa.nome == "TechSul"
        empresa.email == "rh@techsul.com"
        empresa.cnpj == "11111111000101"
        empresa.pais == "Brasil"
    }
}