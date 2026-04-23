package linketinder.controller

import linketinder.service.*
import linketinder.model.*
import linketinder.view.MenuView

class AppController {

    private static Object usuarioLogado = null

    static void iniciar() {
        while (true) {
            MenuView.mostrarMenuInicial()
            switch (MenuView.lerOpcao()) {
                case 1: fluxoLogin(); break
                case 2: fluxoCadastroCandidato(); break
                case 3: fluxoCadastroEmpresa(); break
                case 0: return
            }
        }
    }

    private static void fluxoLogin() {
        def credenciais = MenuView.lerCredenciaisLogin()
        usuarioLogado = LoginService.realizarLogin(credenciais.email, credenciais.senha)

        if (usuarioLogado instanceof Candidato)  fluxoCandidato()
        else if (usuarioLogado instanceof Empresa) fluxoEmpresa()
        else MenuView.exibirMensagem("Erro: Credenciais inválidas.")
    }

    // ---- FLUXO CANDIDATO ----

    private static void fluxoCandidato() {
        while (usuarioLogado != null) {
            MenuView.menuCandidato(usuarioLogado.nome)
            switch (MenuView.lerOpcao()) {
                case 1: MenuView.exibirPerfilLogado(usuarioLogado); break
                case 2: editarDadosCandidato(); break
                case 3: gerenciarCompetencias(usuarioLogado); break
                case 4: explorarVagas(); break
                case 5: MenuView.exibirMatchesCandidato(MatchService.obterMatchesCandidato(usuarioLogado.id)); break
                case 0: usuarioLogado = null; break
            }
        }
    }

    private static void editarDadosCandidato() {
        def dados = MenuView.lerEdicaoCandidato(usuarioLogado as Candidato)
        CandidatoService.aplicarEdicao(usuarioLogado as Candidato, dados)
        MenuView.exibirMensagem("Sucesso: Dados atualizados!")
    }

    private static void gerenciarCompetencias(Candidato candidato) {
        while (true) {
            MenuView.menuCompetencias()
            switch (MenuView.lerOpcao()) {
                case 1: adicionarCompetencia(candidato); break
                case 2: editarCompetencia(candidato); break
                case 3: excluirCompetencia(candidato); break
                case 4: MenuView.exibirCompetencias(candidato.competencias); break
                case 0: return
            }
        }
    }

    private static void adicionarCompetencia(Candidato candidato) {
        String entrada = MenuView.lerNovaCompetencia()
        if (entrada.isEmpty()) return
        CompetenciaService.adicionarAoCandidato(candidato, entrada)
        MenuView.exibirMensagem("Sucesso: '${entrada}' adicionada!")
    }

    private static void editarCompetencia(Candidato candidato) {
        if (candidato.competencias.isEmpty()) { MenuView.exibirMensagem("Nenhuma competência para editar."); return }
        int indice = MenuView.lerNumeroCompetencia()
        if (indiceInvalido(indice, candidato.competencias.size())) return
        String novoNome = MenuView.lerEdicaoCompetencia(candidato.competencias[indice].nome)
        if (novoNome.isEmpty()) return
        CompetenciaService.editarDoCandidato(candidato, indice, novoNome)
        MenuView.exibirMensagem("Sucesso: competência atualizada!")
    }

    private static void excluirCompetencia(Candidato candidato) {
        if (candidato.competencias.isEmpty()) { MenuView.exibirMensagem("Nenhuma competência para excluir."); return }
        int indice = MenuView.lerNumeroCompetencia()
        if (indiceInvalido(indice, candidato.competencias.size())) return
        String removida = CompetenciaService.removerDoCandidato(candidato, indice)
        MenuView.exibirMensagem("Sucesso: '${removida}' removida!")
    }

    private static void explorarVagas() {
        List<Vaga> vagas = EmpresaService.listarTodasVagas()
        if (vagas.isEmpty()) { MenuView.exibirMensagem("\nNenhuma vaga disponível no momento."); return }

        for (vaga in vagas) {
            MenuView.exibirVaga(vaga)
            MenuView.exibirOpcoesDeCurtir()
            String acao = MenuView.lerAcaoSwipe()

            if (acao == "L") {
                MatchService.registrarLikeCandidato(usuarioLogado.id, vaga.id)
                Empresa empresa = EmpresaService.buscarPorId(vaga.idEmpresa)
                if (empresa && MatchService.houveMatch(usuarioLogado.id, empresa.id)) {
                    MenuView.exibirMensagem("MATCH com a empresa ${empresa.nome}!")
                }
            } else if (acao == "S") break
        }
    }

    // ---- FLUXO EMPRESA ----

    private static void fluxoEmpresa() {
        while (usuarioLogado != null) {
            MenuView.menuEmpresa(usuarioLogado.nome)
            switch (MenuView.lerOpcao()) {
                case 1: MenuView.exibirPerfilLogado(usuarioLogado); break
                case 2: editarDadosEmpresa(); break
                case 3: explorarCandidatos(); break
                case 4: MenuView.exibirMatchesEmpresa(MatchService.obterMatchesEmpresa(usuarioLogado.id)); break
                case 5: fluxoGerenciarVagas(); break
                case 0: usuarioLogado = null; break
            }
        }
    }

    private static void editarDadosEmpresa() {
        def dados = MenuView.lerEdicaoEmpresa(usuarioLogado as Empresa)
        EmpresaService.aplicarEdicao(usuarioLogado as Empresa, dados)
        MenuView.exibirMensagem("Sucesso: Dados atualizados!")
    }

    private static void explorarCandidatos() {
        for (candidato in CandidatoService.listar()) {
            MenuView.exibirCandidatoRestrito(candidato)
            MenuView.exibirOpcoesDeCurtir()
            String acao = MenuView.lerAcaoSwipe()

            if (acao == "L") {
                MatchService.registrarLikeEmpresa(usuarioLogado.id, candidato.id)
                if (MatchService.houveMatch(candidato.id, usuarioLogado.id)) {
                    MenuView.exibirMensagem("MATCH!")
                }
            } else if (acao == "S") break
        }
    }

    private static void fluxoGerenciarVagas() {
        while (true) {
            MenuView.menuGerenciarVagas()
            switch (MenuView.lerOpcao()) {
                case 1: criarVaga(); break
                case 2: editarVaga(); break
                case 3: excluirVaga(); break
                case 4: listarVagasDaEmpresa(); break
                case 0: return
            }
        }
    }

    private static void criarVaga() {
        def dados = MenuView.lerDadosNovaVaga()
        if ([dados.nome, dados.descricao, dados.horario, dados.localizacao, dados.remuneracao].any { it.isEmpty() }) {
            MenuView.exibirMensagem("Erro: Todos os campos são obrigatórios.")
            return
        }

        List<Competencia> competencias = []
        gerenciarCompetenciasVaga(competencias)

        try {
            EmpresaService.criarVaga(usuarioLogado.id, new Vaga(dados.nome, dados.descricao, dados.horario, dados.localizacao, dados.remuneracao, competencias, usuarioLogado.id))
            MenuView.exibirMensagem("Sucesso: Vaga criada!")
        } catch (IllegalArgumentException e) {
            MenuView.exibirMensagem("Erro: ${e.message}")
        }
    }

    private static void editarVaga() {
        List<Vaga> vagas = EmpresaService.listarVagasDaEmpresa(usuarioLogado.id)
        if (vagas.isEmpty()) { MenuView.exibirMensagem("\nVocê não possui vagas cadastradas."); return }

        MenuView.exibirListaDeVagas(vagas)
        int indice = MenuView.lerNumeroVaga()
        if (indiceInvalido(indice, vagas.size())) return

        Vaga vaga = vagas[indice]
        def dados = MenuView.lerEdicaoVaga(vaga)

        List<Competencia> competencias = new ArrayList<>(vaga.competencias)
        gerenciarCompetenciasVaga(competencias)

        try {
            Vaga atualizada = new Vaga(
                    dados.nome        ?: vaga.nome,
                    dados.descricao   ?: vaga.descricao,
                    dados.horario     ?: vaga.horario,
                    dados.localizacao ?: vaga.localizacao,
                    dados.remuneracao ?: vaga.remuneracao,
                    competencias,
                    usuarioLogado.id
            )
            EmpresaService.editarVaga(usuarioLogado.id, indice, atualizada)
            MenuView.exibirMensagem("Sucesso: Vaga atualizada!")
        } catch (IllegalArgumentException e) {
            MenuView.exibirMensagem("Erro: ${e.message}")
        }
    }

    private static void gerenciarCompetenciasVaga(List<Competencia> competencias) {
        while (true) {
            MenuView.menuCompetenciasVaga()
            switch (MenuView.lerOpcao()) {
                case 1:
                    String entrada = MenuView.lerNovaCompetencia()
                    if (!entrada.isEmpty()) {
                        competencias.add(new Competencia(entrada))
                        MenuView.exibirMensagem("Sucesso: '${entrada}' adicionada!")
                    }
                    break
                case 2:
                    if (competencias.isEmpty()) { MenuView.exibirMensagem("Nenhuma competência para excluir."); break }
                    int indice = MenuView.lerNumeroCompetencia()
                    if (!indiceInvalido(indice, competencias.size())) {
                        MenuView.exibirMensagem("Sucesso: '${competencias.remove(indice).nome}' removida!")
                    }
                    break
                case 3:
                    MenuView.exibirCompetencias(competencias)
                    break
                case 0: return
            }
        }
    }

    private static void excluirVaga() {
        List<Vaga> vagas = EmpresaService.listarVagasDaEmpresa(usuarioLogado.id)
        if (vagas.isEmpty()) { MenuView.exibirMensagem("\nVocê não possui vagas cadastradas."); return }

        MenuView.exibirListaDeVagas(vagas)
        int indice = MenuView.lerNumeroVaga()

        try {
            EmpresaService.excluirVaga(usuarioLogado.id, indice)
            MenuView.exibirMensagem("Sucesso: Vaga excluída!")
        } catch (IllegalArgumentException e) {
            MenuView.exibirMensagem("Erro: ${e.message}")
        }
    }

    private static void listarVagasDaEmpresa() {
        List<Vaga> vagas = EmpresaService.listarVagasDaEmpresa(usuarioLogado.id)
        MenuView.exibirMensagem("\n--- SUAS VAGAS ---")
        if (vagas.isEmpty()) { MenuView.exibirMensagem("Nenhuma vaga cadastrada."); return }
        vagas.eachWithIndex { v, i -> MenuView.exibirMensagem("\n[${i + 1}]\n${v}") }
    }

    private static void fluxoCadastroCandidato() {
        def dados = MenuView.lerDadosCadastroCandidato()
        if ([dados.nome, dados.email, dados.cpf, dados.estado, dados.cep, dados.senha, dados.descricao].any { it.toString().isEmpty() }) {
            MenuView.exibirMensagem("Erro: Todos os campos são obrigatórios.")
            return
        }
        try {
            Candidato novo = new Candidato(dados.nome, dados.email, dados.cpf, dados.idade as int, dados.estado, dados.cep, dados.descricao, [], dados.senha)
            CandidatoService.cadastrar(novo)
            gerenciarCompetencias(novo)
            MenuView.exibirMensagem("Sucesso: Cadastrado com sucesso!")
        } catch (IllegalArgumentException e) {
            MenuView.exibirMensagem("Erro: ${e.message}")
        }
    }

    private static void fluxoCadastroEmpresa() {
        def dados = MenuView.lerDadosCadastroEmpresa()
        if ([dados.nome, dados.email, dados.cnpj, dados.pais, dados.estado, dados.cep, dados.senha, dados.descricao].any { it.isEmpty() }) {
            MenuView.exibirMensagem("Erro: Todos os campos são obrigatórios.")
            return
        }
        try {
            EmpresaService.cadastrar(new Empresa(dados.nome, dados.email, dados.cnpj, dados.pais, dados.estado, dados.cep, dados.descricao, dados.senha))
            MenuView.exibirMensagem("Sucesso: Cadastrada com sucesso!")
        } catch (IllegalArgumentException e) {
            MenuView.exibirMensagem("Erro: ${e.message}")
        }
    }

    private static boolean indiceInvalido(int indice, int tamanho) {
        if (indice < 0 || indice >= tamanho) {
            MenuView.exibirMensagem("Erro: Número inválido.")
            return true
        }
        return false
    }
}