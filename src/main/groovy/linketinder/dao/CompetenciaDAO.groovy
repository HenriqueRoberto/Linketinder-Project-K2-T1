package linketinder.dao

import linketinder.model.Competencia
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet

class CompetenciaDAO {

    static List<Competencia> listar() {
        List<Competencia> competencias = []
        Connection conn = ConexaoBanco.obterConexao()

        String sql = "SELECT * FROM competencias ORDER BY nome"
        PreparedStatement stmt = conn.prepareStatement(sql)
        ResultSet rs = stmt.executeQuery()

        while (rs.next()) {
            Competencia c = new Competencia(rs.getString("nome"))
            c.id = rs.getInt("id")
            competencias.add(c)
        }

        rs.close()
        stmt.close()
        conn.close()
        return competencias
    }

    static int buscarOuInserir(String nome) {
        Connection conn = ConexaoBanco.obterConexao()
        int id = 0

        String sqlBusca = "SELECT id FROM competencias WHERE LOWER(nome) = LOWER(?)"
        PreparedStatement stmtBusca = conn.prepareStatement(sqlBusca)
        stmtBusca.setString(1, nome)
        ResultSet rs = stmtBusca.executeQuery()

        if (rs.next()) {
            id = rs.getInt("id")
        } else {
            String sqlInsert = "INSERT INTO competencias (nome) VALUES (?)"
            PreparedStatement stmtInsert = conn.prepareStatement(sqlInsert, PreparedStatement.RETURN_GENERATED_KEYS)
            stmtInsert.setString(1, nome)
            stmtInsert.executeUpdate()

            ResultSet chaves = stmtInsert.getGeneratedKeys()
            if (chaves.next()) {
                id = chaves.getInt(1)
            }
            chaves.close()
            stmtInsert.close()
        }

        rs.close()
        stmtBusca.close()
        conn.close()
        return id
    }


    static void vincularCandidato(int idCandidato, int idCompetencia) {
        Connection conn = ConexaoBanco.obterConexao()

        String sql = """
            INSERT INTO candidato_competencia (id_candidato, id_competencia)
            VALUES (?, ?)
            ON CONFLICT DO NOTHING
        """
        PreparedStatement stmt = conn.prepareStatement(sql)
        stmt.setInt(1, idCandidato)
        stmt.setInt(2, idCompetencia)
        stmt.executeUpdate()

        stmt.close()
        conn.close()
    }

    static void desvincularCandidato(int idCandidato, int idCompetencia) {
        Connection conn = ConexaoBanco.obterConexao()

        String sql = """
            DELETE FROM candidato_competencia
            WHERE id_candidato = ? AND id_competencia = ?
        """
        PreparedStatement stmt = conn.prepareStatement(sql)
        stmt.setInt(1, idCandidato)
        stmt.setInt(2, idCompetencia)
        stmt.executeUpdate()

        stmt.close()
        conn.close()
    }

    static void desvincularTodasDoCandidato(int idCandidato) {
        Connection conn = ConexaoBanco.obterConexao()

        String sql = "DELETE FROM candidato_competencia WHERE id_candidato = ?"
        PreparedStatement stmt = conn.prepareStatement(sql)
        stmt.setInt(1, idCandidato)
        stmt.executeUpdate()

        stmt.close()
        conn.close()
    }


    static void vincularVaga(int idVaga, int idCompetencia) {
        Connection conn = ConexaoBanco.obterConexao()

        String sql = """
            INSERT INTO vaga_competencia (id_vaga, id_competencia)
            VALUES (?, ?)
            ON CONFLICT DO NOTHING
        """
        PreparedStatement stmt = conn.prepareStatement(sql)
        stmt.setInt(1, idVaga)
        stmt.setInt(2, idCompetencia)
        stmt.executeUpdate()

        stmt.close()
        conn.close()
    }

    static void desvincularVaga(int idVaga, int idCompetencia) {
        Connection conn = ConexaoBanco.obterConexao()

        String sql = """
            DELETE FROM vaga_competencia
            WHERE id_vaga = ? AND id_competencia = ?
        """
        PreparedStatement stmt = conn.prepareStatement(sql)
        stmt.setInt(1, idVaga)
        stmt.setInt(2, idCompetencia)
        stmt.executeUpdate()

        stmt.close()
        conn.close()
    }

    static void desvincularTodasDaVaga(int idVaga) {
        Connection conn = ConexaoBanco.obterConexao()

        String sql = "DELETE FROM vaga_competencia WHERE id_vaga = ?"
        PreparedStatement stmt = conn.prepareStatement(sql)
        stmt.setInt(1, idVaga)
        stmt.executeUpdate()

        stmt.close()
        conn.close()
    }
}