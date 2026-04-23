package linketinder.service

import linketinder.dao.CompetenciaDAO
import linketinder.dao.EmpresaDAO
import linketinder.dao.VagaDAO
import linketinder.model.Competencia
import linketinder.model.Empresa
import linketinder.model.Vaga

class EmpresaService {

    static void cadastrar(Empresa empresa) {
        boolean emailExiste = EmpresaDAO.listar().any { it.email.equalsIgnoreCase(empresa.email) }

        if (emailExiste) {
            throw new IllegalArgumentException("Erro: O e-mail " + empresa.email + " já está cadastrado.")
        }

        int idGerado = EmpresaDAO.inserir(empresa)
        empresa.id = idGerado
    }

    static List<Empresa> listar() {
        return EmpresaDAO.listar()
    }

    static Empresa buscarPorEmail(String email) {
        return EmpresaDAO.buscarPorEmail(email)
    }

    static Empresa buscarPorId(int id) {
        return EmpresaDAO.buscarPorId(id)
    }

    static void atualizar(Empresa empresa) {
        EmpresaDAO.atualizar(empresa)
    }

    static List<Vaga> listarTodasVagas() {
        return VagaDAO.listarTodas()
    }


    static void criarVaga(int idEmpresa, Vaga vaga) {
        Empresa empresa = EmpresaDAO.buscarPorId(idEmpresa)
        if (empresa == null) throw new IllegalArgumentException("Empresa não encontrada.")

        int idVaga = VagaDAO.inserir(vaga)
        vaga.id = idVaga

        for (Competencia comp : vaga.competencias) {
            int idComp = CompetenciaDAO.buscarOuInserir(comp.nome)
            CompetenciaDAO.vincularVaga(idVaga, idComp)
        }
    }

    static List<Vaga> listarVagasDaEmpresa(int idEmpresa) {
        return VagaDAO.listarPorEmpresa(idEmpresa)
    }

    static void editarVaga(int idEmpresa, int indice, Vaga vagaAtualizada) {
        List<Vaga> vagas = VagaDAO.listarPorEmpresa(idEmpresa)

        if (indice < 0 || indice >= vagas.size()) {
            throw new IllegalArgumentException("Índice de vaga inválido.")
        }

        vagaAtualizada.id = vagas[indice].id
        VagaDAO.atualizar(vagaAtualizada)

        CompetenciaDAO.desvincularTodasDaVaga(vagaAtualizada.id)
        for (Competencia comp : vagaAtualizada.competencias) {
            int idComp = CompetenciaDAO.buscarOuInserir(comp.nome)
            CompetenciaDAO.vincularVaga(vagaAtualizada.id, idComp)
        }
    }

    static void excluirVaga(int idEmpresa, int indice) {
        List<Vaga> vagas = VagaDAO.listarPorEmpresa(idEmpresa)

        if (indice < 0 || indice >= vagas.size()) {
            throw new IllegalArgumentException("Índice de vaga inválido.")
        }

        VagaDAO.deletar(vagas[indice].id)
    }

    static void aplicarEdicao(Empresa empresa, Map<String, String> dados) {
        if (!dados.nome.isEmpty())      empresa.nome      = dados.nome
        if (!dados.cnpj.isEmpty())      empresa.cnpj      = dados.cnpj
        if (!dados.pais.isEmpty())      empresa.pais      = dados.pais
        if (!dados.estado.isEmpty())    empresa.estado    = dados.estado
        if (!dados.cep.isEmpty())       empresa.cep       = dados.cep
        if (!dados.descricao.isEmpty()) empresa.descricao = dados.descricao
        if (!dados.senha.isEmpty())     empresa.senha     = dados.senha
        EmpresaDAO.atualizar(empresa)
    }
}

