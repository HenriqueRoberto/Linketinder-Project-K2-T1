package linketinder.dao

import linketinder.model.Competencia
import linketinder.model.Vaga
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet

class VagaDAO {

    static List<Vaga> listarPorEmpresa(int idEmpresa) {
        Connection conn = ConexaoBanco.obterConexao()
        List<Vaga> vagas = consultarVagas(conn, "SELECT * FROM vagas WHERE id_empresa = ? ORDER BY id") { stmt ->
            stmt.setInt(1, idEmpresa)
        }
        conn.close()
        return vagas
    }

    static List<Vaga> listarTodas() {
        Connection conn = ConexaoBanco.obterConexao()
        List<Vaga> vagas = consultarVagas(conn, "SELECT * FROM vagas ORDER BY id") { stmt -> }
        conn.close()
        return vagas
    }

    static int inserir(Vaga vaga) {
        Connection conn = ConexaoBanco.obterConexao()

        String sql = """
            INSERT INTO vagas (nome, descricao, horario, localizacao, remuneracao, id_empresa)
            VALUES (?, ?, ?, ?, ?, ?)
        """
        PreparedStatement stmt = conn.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS)
        preencherParametrosVaga(stmt, vaga)
        stmt.executeUpdate()

        int idGerado = extrairIdGerado(stmt)
        stmt.close(); conn.close()
        return idGerado
    }

    static void atualizar(Vaga vaga) {
        Connection conn = ConexaoBanco.obterConexao()

        String sql = """
            UPDATE vagas
            SET nome=?, descricao=?, horario=?, localizacao=?, remuneracao=?
            WHERE id=?
        """
        PreparedStatement stmt = conn.prepareStatement(sql)
        stmt.setString(1, vaga.nome)
        stmt.setString(2, vaga.descricao)
        stmt.setString(3, vaga.horario)
        stmt.setString(4, vaga.localizacao)
        stmt.setString(5, vaga.remuneracao)
        stmt.setInt   (6, vaga.id)
        stmt.executeUpdate()

        stmt.close(); conn.close()
    }

    static void deletar(int id) {
        Connection conn = ConexaoBanco.obterConexao()
        PreparedStatement stmt = conn.prepareStatement("DELETE FROM vagas WHERE id = ?")
        stmt.setInt(1, id)
        stmt.executeUpdate()
        stmt.close(); conn.close()
    }

    static List<Competencia> buscarCompetenciasDaVaga(Connection conn, int idVaga) {
        List<Competencia> competencias = []

        String sql = """
            SELECT c.id, c.nome
            FROM competencias c
            JOIN vaga_competencia vc ON vc.id_competencia = c.id
            WHERE vc.id_vaga = ?
        """
        PreparedStatement stmt = conn.prepareStatement(sql)
        stmt.setInt(1, idVaga)
        ResultSet rs = stmt.executeQuery()

        while (rs.next()) {
            Competencia comp = new Competencia(rs.getString("nome"))
            comp.id = rs.getInt("id")
            competencias.add(comp)
        }

        rs.close(); stmt.close()
        return competencias
    }

    private static List<Vaga> consultarVagas(Connection conn, String sql, Closure configurarStmt) {
        List<Vaga> vagas = []
        PreparedStatement stmt = conn.prepareStatement(sql)
        configurarStmt(stmt)
        ResultSet rs = stmt.executeQuery()

        while (rs.next()) {
            Vaga v = mapearVaga(rs)
            v.competencias = buscarCompetenciasDaVaga(conn, v.id)
            vagas.add(v)
        }

        rs.close(); stmt.close()
        return vagas
    }

    private static Vaga mapearVaga(ResultSet rs) {
        Vaga v = new Vaga(
                rs.getString("nome"),
                rs.getString("descricao"),
                rs.getString("horario"),
                rs.getString("localizacao"),
                rs.getString("remuneracao"),
                [],
                rs.getInt("id_empresa")
        )
        v.id = rs.getInt("id")
        return v
    }

    private static void preencherParametrosVaga(PreparedStatement stmt, Vaga vaga) {
        stmt.setString(1, vaga.nome)
        stmt.setString(2, vaga.descricao)
        stmt.setString(3, vaga.horario)
        stmt.setString(4, vaga.localizacao)
        stmt.setString(5, vaga.remuneracao)
        stmt.setInt   (6, vaga.idEmpresa)
    }

    private static int extrairIdGerado(PreparedStatement stmt) {
        ResultSet chaves = stmt.getGeneratedKeys()
        int id = chaves.next() ? chaves.getInt(1) : 0
        chaves.close()
        return id
    }
}