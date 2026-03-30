CREATE TABLE candidatos (
                            id SERIAL PRIMARY KEY,
                            nome VARCHAR(60) NOT NULL,
                            email VARCHAR(60) NOT NULL UNIQUE,
                            cpf VARCHAR(14) NOT NULL UNIQUE,
                            idade INT NOT NULL,
                            estado VARCHAR(60) NOT NULL,
                            cep VARCHAR(10) NOT NULL,
                            descricao TEXT NOT NULL,
                            senha VARCHAR(255) NOT NULL
);

CREATE TABLE empresas (
                          id SERIAL PRIMARY KEY,
                          nome VARCHAR(60) NOT NULL,
                          email VARCHAR(60) NOT NULL UNIQUE,
                          cnpj VARCHAR(18) NOT NULL UNIQUE,
                          pais VARCHAR(60) NOT NULL,
                          estado VARCHAR(60) NOT NULL,
                          cep VARCHAR(10) NOT NULL,
                          descricao TEXT NOT NULL,
                          senha VARCHAR(255) NOT NULL
);

CREATE TABLE vagas (
                       id SERIAL PRIMARY KEY,
                       nome VARCHAR(60) NOT NULL,
                       descricao TEXT NOT NULL,
                       horario VARCHAR(30) NOT NULL,
                       localizacao VARCHAR(60) NOT NULL,
                       remuneracao VARCHAR(100) NOT NULL,
                       id_empresa INT NOT NULL,
                       CONSTRAINT fk_vaga_empresa
                           FOREIGN KEY (id_empresa)
                               REFERENCES empresas(id)
                               ON DELETE CASCADE
);

CREATE TABLE competencias (
                              id SERIAL PRIMARY KEY,
                              nome VARCHAR(20) NOT NULL UNIQUE
);

CREATE TABLE candidato_competencia (
                                       id_candidato INT NOT NULL,
                                       id_competencia INT NOT NULL,
                                       PRIMARY KEY (id_candidato, id_competencia),
                                       CONSTRAINT fk_candidato_comp
                                           FOREIGN KEY (id_candidato)
                                               REFERENCES candidatos(id)
                                               ON DELETE CASCADE,
                                       CONSTRAINT fk_competencia_candidato
                                           FOREIGN KEY (id_competencia)
                                               REFERENCES competencias(id)
                                               ON DELETE CASCADE
);

CREATE TABLE vaga_competencia (
                                  id_vaga INT NOT NULL,
                                  id_competencia INT NOT NULL,
                                  PRIMARY KEY (id_vaga, id_competencia),
                                  CONSTRAINT fk_vaga_comp
                                      FOREIGN KEY (id_vaga)
                                          REFERENCES vagas(id)
                                          ON DELETE CASCADE,
                                  CONSTRAINT fk_competencia_vaga
                                      FOREIGN KEY (id_competencia)
                                          REFERENCES competencias(id)
                                          ON DELETE CASCADE
);

CREATE TABLE likes_candidato (
                                 id_candidato INT NOT NULL,
                                 id_vaga INT NOT NULL,
                                 PRIMARY KEY (id_candidato, id_vaga),
                                 CONSTRAINT fk_like_candidato
                                     FOREIGN KEY (id_candidato)
                                         REFERENCES candidatos(id)
                                         ON DELETE CASCADE,
                                 CONSTRAINT fk_like_vaga
                                     FOREIGN KEY (id_vaga)
                                         REFERENCES vagas(id)
                                         ON DELETE CASCADE
);

CREATE TABLE likes_empresa (
                               id_empresa INT NOT NULL,
                               id_candidato INT NOT NULL,
                               PRIMARY KEY (id_empresa, id_candidato),
                               CONSTRAINT fk_like_empresa
                                   FOREIGN KEY (id_empresa)
                                       REFERENCES empresas(id)
                                       ON DELETE CASCADE,
                               CONSTRAINT fk_like_empresa_candidato
                                   FOREIGN KEY (id_candidato)
                                       REFERENCES candidatos(id)
                                       ON DELETE CASCADE
);

CREATE TABLE matches (
                         id_candidato INT NOT NULL,
                         id_vaga INT NOT NULL,
                         PRIMARY KEY (id_candidato, id_vaga),
                         CONSTRAINT fk_match_candidato
                             FOREIGN KEY (id_candidato)
                                 REFERENCES candidatos(id)
                                 ON DELETE CASCADE,
                         CONSTRAINT fk_match_vaga
                             FOREIGN KEY (id_vaga)
                                 REFERENCES vagas(id)
                                 ON DELETE CASCADE
);

-- Candidatos
INSERT INTO candidatos (nome, email, cpf, idade, estado, cep, descricao, senha) VALUES
                                                                                    ('Ana Silva', 'ana@email.com', '11111111111', 22, 'SC', '88000-000', 'Desenvolvedora iniciante', 'senha123'),
                                                                                    ('Bruno Costa', 'bruno@email.com', '22222222222', 25, 'SP', '01000-000', 'Back-end Node', 'senha123'),
                                                                                    ('Carla Souza', 'carla@email.com', '33333333333', 24, 'RS', '90000-000', 'Front-end', 'senha123'),
                                                                                    ('Diego Alves', 'diego@email.com', '44444444444', 28, 'PR', '80000-000', 'Fullstack', 'senha123'),
                                                                                    ('Elisa Rocha', 'elisa@email.com', '55555555555', 21, 'RJ', '20000-000', 'Estudante de TI', 'senha123');

-- Empresas
INSERT INTO empresas (nome, email, cnpj, pais, estado, cep, descricao, senha) VALUES
                                                                                  ('TechSul', 'rh@techsul.com', '11111111000101', 'Brasil', 'RS', '90000-100', 'Software sob demanda', 'corp123'),
                                                                                  ('DataWave', 'jobs@datawave.com', '22222222000102', 'Brasil', 'SP', '01000-100', 'Dados e analytics', 'corp123'),
                                                                                  ('CloudNova', 'vagas@cloudnova.com', '33333333000103', 'Brasil', 'SC', '88000-100', 'Infraestrutura cloud', 'corp123'),
                                                                                  ('WebPrime', 'contato@webprime.com', '44444444000104', 'Brasil', 'PR', '80000-100', 'Desenvolvimento web', 'corp123'),
                                                                                  ('InovaTech', 'talentos@inovatech.com', '55555555000105', 'Brasil', 'RJ', '20000-100', 'Soluções digitais', 'corp123');

-- Competencias
INSERT INTO competencias (nome) VALUES
                                    ('Java'), ('SQL'), ('Node'), ('MongoDB'), ('Angular'),
                                    ('CSS'), ('React'), ('Python'), ('Pandas'), ('Spring'),
                                    ('Docker'), ('Linux'), ('TypeScript');

-- Candidato_competencia
INSERT INTO candidato_competencia (id_candidato, id_competencia) VALUES
                                                                     (1, 1), (1, 2),
                                                                     (2, 3), (2, 4),
                                                                     (3, 5), (3, 6),
                                                                     (4, 7), (4, 3),
                                                                     (5, 8), (5, 9);

-- Vagas
INSERT INTO vagas (nome, descricao, horario, localizacao, remuneracao, id_empresa) VALUES
                                                                                       ('Dev Java Pleno', 'Vaga para desenvolvedor Java pleno', '08h-17h', 'Porto Alegre - RS', 'R$ 6.000', 1),
                                                                                       ('Analista de Sistemas', 'Análise e modelagem de sistemas', '09h-18h', 'Remoto', 'R$ 7.500', 1),
                                                                                       ('Engenheiro de Dados', 'Pipelines e modelagem de dados', 'Flexível', 'São Paulo - SP', 'R$ 9.000', 2),
                                                                                       ('DevOps Junior', 'Suporte à infraestrutura em nuvem', '08h-17h', 'Florianópolis - SC', 'R$ 5.500', 3),
                                                                                       ('Dev Front-end', 'Desenvolvimento de interfaces web', '09h-18h', 'Curitiba - PR', 'R$ 5.000', 4),
                                                                                       ('Dev Back-end Node', 'Desenvolvimento de APIs REST', 'Flexível', 'Remoto', 'R$ 6.500', 4),
                                                                                       ('Dev Angular Sênior', 'Desenvolvimento de SPAs com Angular', '08h-17h', 'Rio de Janeiro - RJ', 'R$ 10.000', 5);

-- Vaga_competencia
INSERT INTO vaga_competencia (id_vaga, id_competencia) VALUES
                                                           (1, 1), (1, 10),
                                                           (2, 1), (2, 2),
                                                           (3, 8), (3, 2),
                                                           (4, 11), (4, 12),
                                                           (5, 7), (5, 6),
                                                           (6, 3), (6, 4),
                                                           (7, 5), (7, 13);