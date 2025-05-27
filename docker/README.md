# 🚀 Como rodar este projeto com Docker

Este projeto agora pode ser executado facilmente utilizando **Docker** e **Docker Compose**. Siga as instruções abaixo para subir o e-commerce localmente, sem precisar instalar nada além do Docker.

---

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado

---

## Passo a passo

### 1. Clone o projeto

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

### 2. Confirme que os arquivos `Dockerfile` e `docker-compose.yml` estão na raiz do projeto.

---

### 3. Suba o projeto com Docker Compose

```bash
docker-compose up --build
```

O site estará disponível em: [http://localhost:8080](http://localhost:8080)

---

### 4. Para rodar em segundo plano (background)

```bash
docker-compose up -d --build
```

---

### 5. Para parar e remover os containers

```bash
docker-compose down
```

---

## Observações

- Sempre que alterar algum arquivo HTML, CSS ou JS, execute novamente `docker-compose up --build` para aplicar as mudanças.
- O conteúdo estático do projeto será servido automaticamente pelo Nginx (conforme configurado no Dockerfile).

---

> Dúvidas ou sugestões? Abra uma issue ou envie um pull request!
