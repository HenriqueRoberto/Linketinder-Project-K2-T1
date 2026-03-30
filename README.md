## Linketinder – Groovy

**Autor:** Henrique Roberto dos Santos

---
## Descrição

Este é o projeto do sistema **Linketinder**, uma aplicação inspirada na ideia de unir o conceito de perfis profissionais (LinkedIn) com a lógica de visualização interativa de perfis (Tinder).

O objetivo é permitir a interação entre **candidatos** e **empresas** por meio de um menu de terminal. O sistema possibilita que usuários realizem cadastro, login e demonstrem interesse (Like) em vagas ou candidatos, gerando um "Match" automático quando a reciprocidade é detectada entre candidato e vaga.

O sistema foi desenvolvido em **Groovy**, utilizando **POO**, **Interfaces** e o padrão **MVC (Model–View–Controller)**.

## Front-end

O front-end do projeto foi desenvolvido utilizando **HTML, CSS e TypeScript**, seguindo uma abordagem simples e organizada baseada em manipulação direta do DOM, sem o uso de frameworks. A interface é composta por páginas dinâmicas que se adaptam ao tipo de usuário (candidato ou empresa), com renderização condicional de conteúdos como perfil, vagas e matches. A navegação e as interações são controladas por controllers (como `CandidatoController` e `EmpresaController`), que centralizam a lógica de exibição e comportamento da interface. O sistema inclui funcionalidades como criação e edição de vagas, gerenciamento de perfil, sistema de likes e matches, além de visualização detalhada de candidatos e vagas. Também foram implementadas melhorias de usabilidade, como compatibilidade com dispositivos móveis (eliminando dependência de `dblclick`), dropdowns dinâmicos e feedback visual para ações do usuário. O estado da aplicação é persistido localmente através do `localStorage`, garantindo uma experiência contínua mesmo após recarregar a página.

---

# Funcionalidades

### Candidato
- **Login e Cadastro:** Autenticação via e-mail e senha, com validação de e-mail único.
- **Perfil Próprio:** Visualização e edição dos dados da conta logada.
- **Gerenciamento de Competências:** CRUD completo de competências do perfil (adicionar, editar, excluir, listar).
- **Exploração de Vagas:** Navegação por vagas disponíveis uma a uma, com as ações:
    - **[L] Like:** Demonstrar interesse na vaga.
    - **[P] Próximo:** Pular para a próxima vaga.
    - **[S] Sair:** Retornar ao menu principal.
- **Sistema de Match:** Identificação em tempo real de match entre candidato e vaga.
- **Lista de Matches:** Exibição das vagas com match, incluindo os dados completos da empresa responsável.

### Empresa
- **Login e Cadastro:** Autenticação via e-mail e senha, com validação de e-mail único.
- **Perfil Próprio:** Visualização e edição dos dados da conta logada.
- **Gerenciamento de Vagas:** CRUD completo de vagas (criar, editar, excluir, listar).
- **Competências por Vaga:** Gerenciamento de competências dentro de cada vaga (adicionar, excluir, listar).
- **Exploração de Candidatos:** Visualização de candidatos um a um com dados restritos (descrição, competências, estado e CEP — sem nome, CPF, idade ou e-mail), com as ações:
    - **[L] Like:** Demonstrar interesse no candidato.
    - **[P] Próximo:** Pular para o próximo candidato.
    - **[S] Sair:** Retornar ao menu principal.
- **Sistema de Match:** Identificação em tempo real de match ao curtir um candidato.
- **Lista de Matches por Vaga:** Exibição das vagas com match e os candidatos correspondentes, com dados completos.

### Regra de Match
O match ocorre quando:
1. A empresa dá like no candidato.
2. O candidato dá like em uma vaga dessa mesma empresa.

O match é vinculado ao **id único da vaga**. Se a vaga for excluída, o match some automaticamente.

---

### Dados do Candidato
- Nome, E-mail, CPF, Idade, Estado, CEP, Descrição pessoal e Competências.

### Dados da Empresa
- Nome, E-mail corporativo, CNPJ, País, Estado, CEP e Descrição da empresa.

### Dados da Vaga
- Nome, Descrição, Horário, Localização, Remuneração e Competências exigidas.

---

## 🗄️ Banco de Dados

O banco de dados foi modelado utilizando **PostgreSQL**. A modelagem foi criada com o **draw.io**.

### Modelo Entidade-Relacionamento (DER)

![DER Linketinder](DER-linketinder.png)

### Tabelas
- `candidatos` — dados dos candidatos
- `empresas` — dados das empresas
- `vagas` — vagas criadas pelas empresas
- `competencias` — catálogo único de competências compartilhado entre candidatos e vagas
- `candidato_competencia` — relação N:N entre candidatos e competências
- `vaga_competencia` — relação N:N entre vagas e competências
- `likes_candidato` — likes dados por candidatos em vagas
- `likes_empresa` — likes dados por empresas em candidatos
- `matches` — matches gerados quando há reciprocidade

O script completo de criação e inserts está em [`linketinder.sql`](linketinder.sql).

---

## 🛠️ Tecnologias Utilizadas

- **Groovy 4**
- **PostgreSQL**
- **draw.io** — modelagem do banco de dados
- **Padrão MVC** — organização em Model, View e Controller
- **Spock Framework** — testes unitários para validação das regras de negócio
- **HTML5**
- **CSS3**
- **TypeScript**

---

## 💻 Ambiente de Desenvolvimento

- **SO:** Linux (Pop!_OS)

---

## 🏃 Como Executar

### Passos
1. Clone o repositório:
```bash
   git clone https://github.com/HenriqueRoberto/Linketinder-Project-k1-t5.git
```
2. Acesse a pasta do projeto:
```bash
   cd Linketinder-Project
```
3. Execute a aplicação:
```bash
   groovy src/main/groovy/linketinder/Main.groovy
```
4. Para rodar os testes:
```bash
   ./gradlew test
```
5. Para criar o banco de dados:
```bash
   psql -U seu_usuario -d seu_banco -f linketinder.sql
```