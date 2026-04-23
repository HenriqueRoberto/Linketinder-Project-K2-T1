package linketinder.view

import linketinder.model.*

class MenuView {

    private static Scanner scanner = new Scanner(System.in)

    // ---- MENUS ----

    static void mostrarMenuInicial() {
        println "\n=== LINKETINDER ==="
        println "1 - Login"
        println "2 - Cadastrar Candidato"
        println "3 - Cadastrar Empresa"
        println "0 - Sair"
        print "Escolha uma opção: "
    }

    static void menuCandidato(String nome) {
        println "\n--- MENU CANDIDATO: ${nome} ---"
        println "1 - Ver Meus Dados"
        println "2 - Editar Meus Dados"
        println "3 - Gerenciar Competências"
        println "4 - Explorar Vagas"
        println "5 - Ver Meus Matches"
        println "0 - Logout"
        print "Escolha uma opção: "
    }

    static void menuCompetencias() {
        println "\n--- COMPETÊNCIAS ---"
        println "1 - Adicionar Competência"
        println "2 - Editar Competência"
        println "3 - Excluir Competência"
        println "4 - Listar Competências"
        println "0 - Voltar"
        print "Escolha uma opção: "
    }

    static void menuCompetenciasVaga() {
        println "\n--- COMPETÊNCIAS DA VAGA ---"
        println "1 - Adicionar Competência"
        println "2 - Excluir Competência"
        println "3 - Listar Competências"
        println "0 - Voltar"
        print "Escolha uma opção: "
    }

    static void menuEmpresa(String nome) {
        println "\n--- MENU EMPRESA: ${nome} ---"
        println "1 - Ver Meus Dados"
        println "2 - Editar Meus Dados"
        println "3 - Explorar Candidatos"
        println "4 - Ver Meus Matches"
        println "5 - Gerenciar Vagas"
        println "0 - Logout"
        print "Escolha uma opção: "
    }

    static void menuGerenciarVagas() {
        println "\n--- GERENCIAR VAGAS ---"
        println "1 - Criar Vaga"
        println "2 - Editar Vaga"
        println "3 - Excluir Vaga"
        println "4 - Listar Minhas Vagas"
        println "0 - Voltar"
        print "Escolha uma opção: "
    }

    // ---- LEITURA DE OPÇÕES ----

    static int lerOpcao() {
        int op = scanner.nextInt()
        scanner.nextLine()
        return op
    }

    // ---- LEITURA DE DADOS ----

    static Map<String, String> lerCredenciaisLogin() {
        println "\n--- LOGIN ---"
        print "Email: "; String email = scanner.nextLine().trim()
        print "Senha: "; String senha = scanner.nextLine().trim()
        return [email: email, senha: senha]
    }

    static Map<String, Object> lerDadosCadastroCandidato() {
        println "\n--- NOVO CANDIDATO ---"
        print "Nome: ";      String nome   = scanner.nextLine().trim()
        print "Email: ";     String email  = scanner.nextLine().trim()
        print "CPF: ";       String cpf    = scanner.nextLine().trim()
        print "Idade: ";     int    idade  = scanner.nextInt(); scanner.nextLine()
        print "Estado: ";    String estado = scanner.nextLine().trim()
        print "CEP: ";       String cep    = scanner.nextLine().trim()
        print "Senha: ";     String senha  = scanner.nextLine().trim()
        print "Descrição: "; String desc   = scanner.nextLine().trim()
        return [nome: nome, email: email, cpf: cpf, idade: idade, estado: estado, cep: cep, senha: senha, descricao: desc]
    }

    static Map<String, String> lerDadosCadastroEmpresa() {
        println "\n--- NOVA EMPRESA ---"
        print "Nome: ";      String nome   = scanner.nextLine().trim()
        print "Email: ";     String email  = scanner.nextLine().trim()
        print "CNPJ: ";      String cnpj   = scanner.nextLine().trim()
        print "País: ";      String pais   = scanner.nextLine().trim()
        print "Estado: ";    String estado = scanner.nextLine().trim()
        print "CEP: ";       String cep    = scanner.nextLine().trim()
        print "Senha: ";     String senha  = scanner.nextLine().trim()
        print "Descrição: "; String desc   = scanner.nextLine().trim()
        return [nome: nome, email: email, cnpj: cnpj, pais: pais, estado: estado, cep: cep, senha: senha, descricao: desc]
    }

    static Map<String, String> lerEdicaoCandidato(Candidato candidato) {
        println "\n--- EDITAR MEUS DADOS ---"
        println "Deixe em branco para manter o valor atual."
        return [
                nome:      lerCampoOpcional("Nome",      candidato.nome),
                cpf:       lerCampoOpcional("CPF",       candidato.cpf),
                idade:     lerCampoOpcional("Idade",     String.valueOf(candidato.idade)),
                estado:    lerCampoOpcional("Estado",    candidato.estado),
                cep:       lerCampoOpcional("CEP",       candidato.cep),
                descricao: lerCampoOpcional("Descrição", candidato.descricao),
                senha:     lerCampoSenhaOpcional()
        ]
    }

    static Map<String, String> lerEdicaoEmpresa(Empresa empresa) {
        println "\n--- EDITAR MEUS DADOS ---"
        println "Deixe em branco para manter o valor atual."
        return [
                nome:      lerCampoOpcional("Nome",      empresa.nome),
                cnpj:      lerCampoOpcional("CNPJ",      empresa.cnpj),
                pais:      lerCampoOpcional("País",      empresa.pais),
                estado:    lerCampoOpcional("Estado",    empresa.estado),
                cep:       lerCampoOpcional("CEP",       empresa.cep),
                descricao: lerCampoOpcional("Descrição", empresa.descricao),
                senha:     lerCampoSenhaOpcional()
        ]
    }

    static Map<String, String> lerEdicaoVaga(Vaga vaga) {
        println "\n--- EDITANDO: ${vaga.nome} ---"
        println "Deixe em branco para manter o valor atual."
        return [
                nome:        lerCampoOpcional("Nome",        vaga.nome),
                descricao:   lerCampoOpcional("Descrição",   vaga.descricao),
                horario:     lerCampoOpcional("Horário",     vaga.horario),
                localizacao: lerCampoOpcional("Localização", vaga.localizacao),
                remuneracao: lerCampoOpcional("Remuneração", vaga.remuneracao)
        ]
    }

    static Map<String, String> lerDadosNovaVaga() {
        println "\n--- NOVA VAGA ---"
        print "Nome: ";        String nome    = scanner.nextLine().trim()
        print "Descrição: ";   String desc    = scanner.nextLine().trim()
        print "Horário: ";     String horario = scanner.nextLine().trim()
        print "Localização: "; String local   = scanner.nextLine().trim()
        print "Remuneração: "; String remun   = scanner.nextLine().trim()
        return [nome: nome, descricao: desc, horario: horario, localizacao: local, remuneracao: remun]
    }

    static String lerNovaCompetencia() {
        print "Nova competência: "
        return scanner.nextLine().trim()
    }

    static int lerNumeroCompetencia() {
        print "Número da competência: "
        int num = scanner.nextInt()
        scanner.nextLine()
        return num - 1
    }

    static String lerEdicaoCompetencia(String nomeAtual) {
        print "Novo valor [${nomeAtual}]: "
        return scanner.nextLine().trim()
    }

    static String lerAcaoSwipe() {
        return scanner.nextLine().toUpperCase()
    }

    static int lerNumeroVaga() {
        int num = scanner.nextInt()
        scanner.nextLine()
        return num - 1
    }

    // ---- EXIBIÇÃO ----

    static void exibirPerfilLogado(Object usuario) {
        println "\n--- SEU PERFIL ---"
        println usuario.toString()
    }

    static void exibirOpcoesDeCurtir() {
        print "\n[L] Curtir | [P] Próximo | [S] Sair: "
    }

    static void exibirVaga(Vaga vaga) {
        println "\n------------------------"
        println vaga.toString()
    }

    static void exibirListaDeVagas(List<Vaga> vagas) {
        println "\n--- SUAS VAGAS ---"
        vagas.eachWithIndex { v, i -> println "${i + 1}. ${v.nome} | ${v.localizacao}" }
    }

    static void exibirCompetencias(List<Competencia> competencias) {
        println "\n--- COMPETÊNCIAS ---"
        if (competencias.isEmpty()) {
            println "Nenhuma competência cadastrada."
        } else {
            competencias.eachWithIndex { comp, i -> println "${i + 1}. ${comp.nome}" }
        }
    }

    static void exibirCandidatoRestrito(Candidato candidato) {
        println "\n------------------------"
        println "Descrição: ${candidato.descricao ?: 'Sem descrição'}"
        println "Competências: ${formatarCompetencias(candidato.competencias)}"
        println "Estado: ${candidato.estado}"
        println "CEP: ${candidato.cep}"
    }

    static void exibirMatchesCandidato(List<Map> matches) {
        println "\n--- SEUS MATCHES ---"
        if (matches.isEmpty()) { println "Nenhum match encontrado até o momento."; return }

        matches.each { m ->
            Vaga vaga = m.vaga
            Empresa empresa = m.empresa
            println "\n============================"
            println "[ VAGA ]"
            println vaga.toString()
            println "\n[ EMPRESA ]"
            println "Nome: ${empresa.nome}"
            println "Email: ${empresa.email}"
            println "CNPJ: ${empresa.cnpj}"
            println "Descrição: ${empresa.descricao ?: 'Sem descrição'}"
            println "País: ${empresa.pais}"
            println "Estado: ${empresa.estado}"
            println "CEP: ${empresa.cep}"
        }
    }

    static void exibirMatchesEmpresa(List<Map> matches) {
        println "\n--- SEUS MATCHES ---"
        if (matches.isEmpty()) { println "Nenhum match encontrado até o momento."; return }

        matches.each { m ->
            println "\n============================"
            println "[ VAGA ] ${m.vaga.descricao}"
            println "Candidatos com match:"
            (m.candidatos as List<Candidato>).each { c ->
                println "---"
                exibirCandidatoCompleto(c)
            }
        }
    }

    static void exibirMensagem(String mensagem) {
        println mensagem
    }

    // ---- HELPERS PRIVADOS ----

    private static void exibirCandidatoCompleto(Candidato candidato) {
        println "\n  Nome: ${candidato.nome}"
        println "  CPF: ${candidato.cpf}"
        println "  Idade: ${candidato.idade}"
        println "  Estado: ${candidato.estado}"
        println "  CEP: ${candidato.cep}"
        println "  Descrição: ${candidato.descricao ?: 'Sem descrição'}"
        println "  Competências: ${formatarCompetencias(candidato.competencias)}"
    }

    private static String formatarCompetencias(List<Competencia> competencias) {
        if (!competencias) return "sem competências cadastradas"
        return competencias.collect { it.nome }.join(", ")
    }

    private static String lerCampoOpcional(String label, String valorAtual) {
        print "${label} [${valorAtual}]: "
        return scanner.nextLine().trim()
    }

    private static String lerCampoSenhaOpcional() {
        print "Senha [****]: "
        return scanner.nextLine().trim()
    }
}