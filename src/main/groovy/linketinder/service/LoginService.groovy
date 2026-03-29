package linketinder.service

import linketinder.model.Candidato
import linketinder.model.Empresa

class LoginService {

    static Object realizarLogin(String email, String senha) {


        def candidato = CandidatoService.listar().find { it.email == email && it.senha == senha }
        if (candidato) {
            return candidato
        }

        def empresa = EmpresaService.listar().find { it.email == email && it.senha == senha }
        if (empresa) {
            return empresa
        }

        return null
    }
}