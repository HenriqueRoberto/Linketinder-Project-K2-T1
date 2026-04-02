package linketinder.dao

import java.sql.Connection
import java.sql.DriverManager

class ConexaoBanco {

    private static final String URL    = "jdbc:postgresql://localhost:5432/linketinder"
    private static final String USUARIO = "app_user"
    private static final String SENHA   = "1234"

    static Connection obterConexao() {
        return DriverManager.getConnection(URL, USUARIO, SENHA)
    }
}