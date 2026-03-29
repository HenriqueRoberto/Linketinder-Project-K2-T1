package linketinder.model

class PessoaFisica implements Pessoa {

    String nome
    String email
    String cpf
    int idade
    String estado
    String cep
    String descricao
    List<String> competencias
    String senha

    PessoaFisica(String nome, String email, String cpf, int idade, String estado, String cep, String descricao, List<String> competencias, String senha) {
        this.nome = nome
        this.email = email
        this.cpf = cpf
        this.idade = idade
        this.estado = estado
        this.cep = cep
        this.descricao = descricao
        this.competencias = competencias
        this.senha = senha
    }

    // Implementação explícita da Interface Pessoa
    @Override String getNome() { return nome }
    @Override String getEmail() { return email }
    @Override String getEstado() { return estado }
    @Override String getCep() { return cep }
    @Override String getDescricao() { return descricao }
    List<String> getCompetencias() { return competencias }

    // Getters específicos de Pessoa Física
    String getCpf() { return cpf }
    int getIdade() { return idade }

    @Override
    String toString() {
        String compTexto = (competencias == null || competencias.isEmpty()) ?
                "sem competências cadastradas" : competencias.join(", ")

        return "Nome: " + nome +
                "\nEmail: " + email +
                "\nCPF: " + cpf +
                "\nIdade: " + idade +
                "\nEstado: " + estado +
                "\nCEP: " + cep +
                "\nDescrição: " + (descricao ?: "Sem descrição") +
                "\nCompetências: " + compTexto
    }
}