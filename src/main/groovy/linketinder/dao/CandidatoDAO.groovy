package linketinder.dao

import linketinder.model.Candidato
import linketinder.model.Competencia
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet

class CandidatoDAO {

    static List<Candidato> listar() {
        List<Candidato> candidatos = []
        Connection conn = ConexaoBanco.obterConexao()

        PreparedStatement stmt = conn.prepareStatement("SELECT * FROM candidatos ORDER BY id")
        ResultSet rs = stmt.executeQuery()

        while (rs.next()) {
            Candidato c = mapearCandidato(rs)
            c.competencias = buscarCompetenciasDoCandidato(conn, c.id)
            candidatos.add(c)
        }

        rs.close(); stmt.close(); conn.close()
        return candidatos
    }

    static int inserir(Candidato candidato) {
        Connection conn = ConexaoBanco.obterConexao()

        String sql = """
            INSERT INTO candidatos (nome, email, cpf, idade, estado, cep, descricao, senha)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """
        PreparedStatement stmt = conn.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS)
        preencherParametrosCandidato(stmt, candidato)
        stmt.executeUpdate()

        int idGerado = extrairIdGerado(stmt)
        stmt.close(); conn.close()
        return idGerado
    }

    static void atualizar(Candidato candidato) {
        Connection conn = ConexaoBanco.obterConexao()

        String sql = """
            UPDATE candidatos
            SET nome=?, email=?, cpf=?, idade=?, estado=?, cep=?, descricao=?, senha=?
            WHERE id=?
        """
        PreparedStatement stmt = conn.prepareStatement(sql)
        preencherParametrosCandidato(stmt, candidato)
        stmt.setInt(9, candidato.id)
        stmt.executeUpdate()

        stmt.close(); conn.close()
    }

    static void deletar(int id) {
        Connection conn = ConexaoBanco.obterConexao()
        PreparedStatement stmt = conn.prepareStatement("DELETE FROM candidatos WHERE id = ?")
        stmt.setInt(1, id)
        stmt.executeUpdate()
        stmt.close(); conn.close()
    }

    static List<Competencia> buscarCompetenciasDoCandidato(Connection conn, int idCandidato) {
        List<Competencia> competencias = []

        String sql = """
            SELECT c.id, c.nome
            FROM competencias c
            JOIN candidato_competencia cc ON cc.id_competencia = c.id
            WHERE cc.id_candidato = ?
        """
        PreparedStatement stmt = conn.prepareStatement(sql)
        stmt.setInt(1, idCandidato)
        ResultSet rs = stmt.executeQuery()

        while (rs.next()) {
            Competencia comp = new Competencia(rs.getString("nome"))
            comp.id = rs.getInt("id")
            competencias.add(comp)
        }

        rs.close(); stmt.close()
        return competencias
    }

    private static Candidato mapearCandidato(ResultSet rs) {
        Candidato c = new Candidato(
                rs.getString("nome"),
                rs.getString("email"),
                rs.getString("cpf"),
                rs.getInt("idade"),
                rs.getString("estado"),
                rs.getString("cep"),
                rs.getString("descricao"),
                [],
                rs.getString("senha")
        )
        c.id = rs.getInt("id")
        return c
    }

    private static void preencherParametrosCandidato(PreparedStatement stmt, Candidato candidato) {
        stmt.setString(1, candidato.nome)
        stmt.setString(2, candidato.email)
        stmt.setString(3, candidato.cpf)
        stmt.setInt   (4, candidato.idade)
        stmt.setString(5, candidato.estado)
        stmt.setString(6, candidato.cep)
        stmt.setString(7, candidato.descricao)
        stmt.setString(8, candidato.senha)
    }

    private static int extrairIdGerado(PreparedStatement stmt) {
        ResultSet chaves = stmt.getGeneratedKeys()
        int id = chaves.next() ? chaves.getInt(1) : 0
        chaves.close()
        return id
    }
}