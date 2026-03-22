## Linketinder – Groovy

**Autor:** Henrique Roberto dos Santos

---

## Descrição

Este é o projeto do sistema **Linketinder**, uma aplicação inspirada na ideia de unir o conceito de perfis profissionais (LinkedIn) com a lógica de visualização interativa de perfis (Tinder).

O objetivo é permitir a interação entre **candidatos** e **empresas** por meio de um menu de terminal. O sistema possibilita que usuários realizem cadastro, login e demonstrem interesse (Like) em outros perfis, gerando um "Match" automático quando a reciprocidade é detectada.

O sistema foi desenvolvido em **Groovy**, utilizando **POO**, **Interfaces** e o padrão **MVC (Model–View–Controller)**.

## Front-end

O front-end do projeto foi desenvolvido utilizando **HTML, CSS e TypeScript**, seguindo uma abordagem simples e organizada baseada em manipulação direta do DOM, sem o uso de frameworks. A interface é composta por páginas dinâmicas que se adaptam ao tipo de usuário (candidato ou empresa), com renderização condicional de conteúdos como perfil, vagas e matches. A navegação e as interações são controladas por controllers (como `CandidatoController` e `EmpresaController`), que centralizam a lógica de exibição e comportamento da interface. O sistema inclui funcionalidades como criação e edição de vagas, gerenciamento de perfil, sistema de likes e matches, além de visualização detalhada de candidatos e vagas. Também foram implementadas melhorias de usabilidade, como compatibilidade com dispositivos móveis (eliminando dependência de `dblclick`), dropdowns dinâmicos e feedback visual para ações do usuário. O estado da aplicação é persistido localmente através do `localStorage`, garantindo uma experiência contínua mesmo após recarregar a página.


---
# Funcionalidades

- **Sistema de Login:** Autenticação de usuários (Candidatos e Empresas) via e-mail e senha.
- **Cadastro Dinâmico:** Fluxo de cadastro com validação de e-mail único, impedindo registros duplicados.
- **Gerenciamento de Competências:** Permite adicionar novas competências ao perfil durante a sessão ativa.
- **Perfil Próprio:** Visualização detalhada dos dados da conta logada.
- **Exploração Interativa:** Navegação de perfis um a um com as ações:
    - **[L] Like:** Demonstrar interesse no perfil.
    - **[P] Próximo:** Pular para o próximo perfil.
    - **[S] Sair:** Retornar ao menu principal.
- **Sistema de Match:** Identificação em tempo real de interesses mútuos.
- **Lista de Matches:** Exibição de todos os perfis onde houve reciprocidade.

---

### Dados do Candidato
- Nome, E-mail, CPF, Idade, Estado, CEP, Descrição pessoal e Competências.

### Dados da Empresa
- Nome, E-mail corporativo, CNPJ, País, Estado, CEP, Descrição da empresa e Competências esperadas.

---

## 🛠️ Tecnologias Utilizadas

- **Groovy 4**
- **Padrão MVC**: Organização em Model, View e Controller.
- **Spock Framework**: Testes de unidade para validação das regras de negócio.
- **Html5
- **Css3
- **TypeScript

---

## 💻 Ambiente de Desenvolvimento

- **SO:** Linux (Pop!_OS)

---

## 🏃 Como Executar

### Passos
1. Clone o repositório:
   ```bash
   git clone [https://github.com/HenriqueRoberto/Linketinder-Project-k1-t5.git](https://github.com/HenriqueRoberto/Linketinder-Project-k1-t5.git)
   ```
2. Acesse a pasta do projeto:
   ```bash
    cd Linketinder-Project
   ```
3. Execute a aplicação:
   ```bash
    # Caso use o terminal direto:
    groovy src/main/groovy/linketinder/Main.groovy
   ```

4. Para rodar testes:
   ```bash
   ./gradlew test
    ```
