package linketinder.service

import linketinder.dao.CandidatoDAO
import linketinder.model.Candidato

class CandidatoService {

    static void cadastrar(Candidato candidato) {
        boolean emailExiste = CandidatoDAO.listar().any { it.email.equalsIgnoreCase(candidato.email) }

        if (emailExiste) {
            throw new IllegalArgumentException("Erro: O e-mail " + candidato.email + " já está cadastrado.")
        }

        int idGerado = CandidatoDAO.inserir(candidato)
        candidato.id = idGerado
    }

    static List<Candidato> listar() {
        return CandidatoDAO.listar()
    }

    static void atualizar(Candidato candidato) {
        CandidatoDAO.atualizar(candidato)
    }

    static void deletar(int id) {
        CandidatoDAO.deletar(id)
    }
    static void aplicarEdicao(Candidato candidato, Map<String, String> dados) {
        if (!dados.nome.isEmpty())      candidato.nome      = dados.nome
        if (!dados.cpf.isEmpty())       candidato.cpf       = dados.cpf
        if (!dados.idade.isEmpty())     candidato.idade     = dados.idade.toInteger()
        if (!dados.estado.isEmpty())    candidato.estado    = dados.estado
        if (!dados.cep.isEmpty())       candidato.cep       = dados.cep
        if (!dados.descricao.isEmpty()) candidato.descricao = dados.descricao
        if (!dados.senha.isEmpty())     candidato.senha     = dados.senha
        CandidatoDAO.atualizar(candidato)
    }
}

