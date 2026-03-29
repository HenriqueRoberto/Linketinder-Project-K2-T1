package linketinder.service

import spock.lang.Specification
import linketinder.model.Empresa

class EmpresaServiceSpec extends Specification {

    def setup() {
        EmpresaService.empresas = []
    }

    def "Deve cadastrar uma nova empresa com sucesso"() {
        given: "Uma nova empresa"
        def empresa = new Empresa("TechSul", "rh@techsul.com", "11111111000101", "Brasil", "RS", "90000-100", "Software sob demanda", "corp123")

        when: "A empresa é cadastrada"
        EmpresaService.cadastrar(empresa)

        then: "A empresa deve estar na lista"
        EmpresaService.listar().size() == 1
        EmpresaService.listar().first().email == "rh@techsul.com"
    }
}