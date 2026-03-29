package linketinder.model

class Vaga {

    String descricao
    String horario
    String localizacao
    String remuneracao
    List<String> competencias


    int idEmpresa

    Vaga(String descricao, String horario, String localizacao, String remuneracao, List<String> competencias, int idEmpresa) {
        this.descricao = descricao
        this.horario = horario
        this.localizacao = localizacao
        this.remuneracao = remuneracao
        this.competencias = competencias
        this.idEmpresa = idEmpresa
    }

    @Override
    String toString() {
        String compTexto = (competencias == null || competencias.isEmpty()) ?
                "sem competências cadastradas" : competencias.join(", ")

        return "Descrição: " + descricao +
                "\nHorário: " + horario +
                "\nLocalização: " + localizacao +
                "\nRemuneração: " + remuneracao +
                "\nCompetências: " + compTexto
    }
}