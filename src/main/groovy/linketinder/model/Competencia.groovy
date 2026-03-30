package linketinder.model

class Competencia {

    private static int proximoId = 1

    int id
    String nome

    Competencia(String nome) {
        this.id = proximoId++
        this.nome = nome
    }

    @Override
    String toString() {
        return nome
    }
}