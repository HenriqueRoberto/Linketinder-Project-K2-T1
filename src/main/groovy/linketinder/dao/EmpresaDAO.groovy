package linketinder.dao

import linketinder.model.Empresa
import java.sql.Connection
import java.sql.PreparedStatement
import java.sql.ResultSet

class EmpresaDAO {

    static List<Empresa> listar() {
        List<Empresa> empresas = []
        Connection conn = ConexaoBanco.obterConexao()

        PreparedStatement stmt = conn.prepareStatement("SELECT * FROM empresas ORDER BY id")
        ResultSet rs = stmt.executeQuery()

        while (rs.next()) {
            empresas.add(mapearEmpresa(rs))
        }

        rs.close(); stmt.close(); conn.close()
        return empresas
    }

    static int inserir(Empresa empresa) {
        Connection conn = ConexaoBanco.obterConexao()

        String sql = """
            INSERT INTO empresas (nome, email, cnpj, pais, estado, cep, descricao, senha)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """
        PreparedStatement stmt = conn.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS)
        preencherParametrosEmpresa(stmt, empresa)
        stmt.executeUpdate()

        int idGerado = extrairIdGerado(stmt)
        stmt.close(); conn.close()
        return idGerado
    }

    static void atualizar(Empresa empresa) {
        Connection conn = ConexaoBanco.obterConexao()

        String sql = """
            UPDATE empresas
            SET nome=?, email=?, cnpj=?, pais=?, estado=?, cep=?, descricao=?, senha=?
            WHERE id=?
        """
        PreparedStatement stmt = conn.prepareStatement(sql)
        preencherParametrosEmpresa(stmt, empresa)
        stmt.setInt(9, empresa.id)
        stmt.executeUpdate()

        stmt.close(); conn.close()
    }

    static void deletar(int id) {
        Connection conn = ConexaoBanco.obterConexao()
        PreparedStatement stmt = conn.prepareStatement("DELETE FROM empresas WHERE id = ?")
        stmt.setInt(1, id)
        stmt.executeUpdate()
        stmt.close(); conn.close()
    }

    static Empresa buscarPorId(int id) {
        return buscarPorCriterio("SELECT * FROM empresas WHERE id = ?") { stmt -> stmt.setInt(1, id) }
    }

    static Empresa buscarPorEmail(String email) {
        return buscarPorCriterio("SELECT * FROM empresas WHERE LOWER(email) = LOWER(?)") { stmt -> stmt.setString(1, email) }
    }

    private static Empresa buscarPorCriterio(String sql, Closure configurarStmt) {
        Connection conn = ConexaoBanco.obterConexao()
        Empresa empresa = null

        PreparedStatement stmt = conn.prepareStatement(sql)
        configurarStmt(stmt)
        ResultSet rs = stmt.executeQuery()

        if (rs.next()) empresa = mapearEmpresa(rs)

        rs.close(); stmt.close(); conn.close()
        return empresa
    }

    private static Empresa mapearEmpresa(ResultSet rs) {
        Empresa e = new Empresa(
                rs.getString("nome"),
                rs.getString("email"),
                rs.getString("cnpj"),
                rs.getString("pais"),
                rs.getString("estado"),
                rs.getString("cep"),
                rs.getString("descricao"),
                rs.getString("senha")
        )
        e.id = rs.getInt("id")
        return e
    }

    private static void preencherParametrosEmpresa(PreparedStatement stmt, Empresa empresa) {
        stmt.setString(1, empresa.nome)
        stmt.setString(2, empresa.email)
        stmt.setString(3, empresa.cnpj)
        stmt.setString(4, empresa.pais)
        stmt.setString(5, empresa.estado)
        stmt.setString(6, empresa.cep)
        stmt.setString(7, empresa.descricao)
        stmt.setString(8, empresa.senha)
    }

    private static int extrairIdGerado(PreparedStatement stmt) {
        ResultSet chaves = stmt.getGeneratedKeys()
        int id = chaves.next() ? chaves.getInt(1) : 0
        chaves.close()
        return id
    }
}