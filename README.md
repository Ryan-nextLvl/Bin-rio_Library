# 🖥️ Bin-rio Library

> Portfólio de projetos com tema **Dark Hacker** — construído com Django + Tailwind CSS.

```
>_ BIN-RIO LIBRARY // v2.0
$ status: online
$ theme: dark-hacker
$ stack: django · tailwind · sqlite
```

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Instalação e Execução](#instalação-e-execução)
- [Modelos](#modelos)
- [Rotas](#rotas)
- [Admin](#admin)
- [Template e Design](#template-e-design)
- [Tailwind Config](#tailwind-config)

---

## Visão Geral

O **Bin-rio Library** é uma aplicação web de portfólio pessoal que exibe projetos em um grid estilo terminal hacker. Cada projeto pode ser visitado através de um botão neon, e o sistema registra automaticamente o número de visitas de cada um.

A interface conta com:
- Chuva de binários animada no fundo (Matrix style)
- Efeito de digitação no cabeçalho
- Linha do tempo de experiências profissionais
- Botão de download de currículo com pulso neon

---

## Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| Python | 3.14+ | Linguagem principal |
| Django | 4.2+ | Framework web |
| Tailwind CSS | CDN v3 | Estilização |
| SQLite | built-in | Banco de dados |
| Fira Code | Google Fonts | Fonte monoespaçada |

---

## Estrutura do Projeto

```
Bin-rio_Library/
│
├── core/                        # Configurações do projeto Django
│   ├── settings.py              # Settings: apps, templates, banco de dados
│   ├── urls.py                  # URLs raiz (inclui links.urls)
│   ├── wsgi.py
│   └── asgi.py
│
├── links/                       # App principal
│   ├── migrations/              # Histórico de migrações do banco
│   ├── admin.py                 # Config do Django Admin com status visual
│   ├── apps.py
│   ├── models.py                # Modelo Projeto
│   ├── urls.py                  # Rotas da app
│   └── views.py                 # Views: index + registrar_visita
│
├── templates/
│   └── links/
│       └── index.html           # Template principal (Dark Hacker Theme)
│
├── tailwind.config.js           # Paleta de cores customizada
├── requirements.txt             # Dependências Python
├── manage.py
└── README.md
```

---

## Funcionalidades

### 🗂️ Grid de Projetos
- Exibe todos os projetos cadastrados ordenados pelos mais recentes
- Layout responsivo: 1 coluna (mobile) → 2 colunas (tablet) → 3 colunas (desktop)
- Cada card mostra: nome, tecnologias, descrição, contador de visitas e botão de acesso
- Hover com borda e sombra neon animada

### 👁️ Contador de Visitas
- Ao clicar em **ACESSAR**, a view `registrar_visita` incrementa o campo `visitas` do projeto e redireciona para a URL cadastrada

### 🎨 Efeito Terminal (JS)
- **Typing Effect:** o título do site rotaciona entre frases com efeito de digitação e cursor piscante
- **Binary Rain:** canvas `<canvas>` com gotas de `0` e `1` descendo em velocidades aleatórias, com a cabeça brilhando em neon verde `#00FF41`

### 📄 Seção de Currículo
- Timeline vertical com experiências profissionais
- Linha neon com marcadores circulares luminosos
- Botão **Download CV** com animação `animate-pulse` em `#00FF41`

### 🔒 Django Admin
- Listagem visual com popularidade por ícones (🔥 📈 🚀 ⬜)
- Busca por nome do projeto e tecnologias
- Edição rápida de `url_site` diretamente na listagem

---

## Instalação e Execução

### Pré-requisitos
- Python 3.10+
- pip

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/Ryan-nextLvl/Bin-rio_Library.git
cd Bin-rio_Library

# 2. (Opcional) Crie um ambiente virtual
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac

# 3. Instale as dependências
pip install -r requirements.txt

# 4. Aplique as migrações
python manage.py migrate

# 5. Crie um superusuário para acessar o Admin
python manage.py createsuperuser

# 6. Inicie o servidor
python manage.py runserver
```

Acesse em: [http://127.0.0.1:8000](http://127.0.0.1:8000)  
Admin em: [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)

---

## Modelos

### `Projeto` — `links/models.py`

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | AutoField | Chave primária |
| `nome` | CharField(200) | Nome do projeto |
| `descricao` | TextField | Descrição do projeto |
| `tecnologias` | CharField(300) | Tecnologias usadas (ex: Python, React) |
| `url_site` | URLField | URL do site/repositório |
| `visitas` | PositiveIntegerField | Contador de cliques no botão ACESSAR |
| `criado_em` | DateTimeField | Data de criação (auto) |

> **Ordenação padrão:** `-criado_em` (mais recentes primeiro)

---

## Rotas

| Método | URL | Nome | Descrição |
|---|---|---|---|
| GET | `/` | `index` | Lista todos os projetos |
| GET | `/visita/<id>/` | `registrar_visita` | Incrementa visitas e redireciona |
| GET/POST | `/admin/` | — | Django Admin |

---

## Admin

`links/admin.py` — configurações do painel administrativo:

```python
list_display  = ('nome', 'tecnologias', 'status_cliques', 'visitas', 'url_site', 'criado_em')
list_editable = ('url_site',)          # edite links sem abrir cada projeto
search_fields = ('nome', 'tecnologias')
```

### Indicador de popularidade `status_cliques`

| Visitas | Ícone | Cor |
|---|---|---|
| 0 – 9 | ⬜ Novo | Cinza |
| 10 – 99 | 📈 Crescendo | Verde claro |
| 100 – 499 | 🔥 Popular | Neon verde |
| 500+ | 🚀 VIRAL | Neon verde bold |

---

## Template e Design

### Paleta de Cores (Dark Hacker)

| Variável Tailwind | Hex | Uso |
|---|---|---|
| `hacker-black` | `#0A0A0A` | Fundo principal da página |
| `hacker-card` | `#0F0F0F` | Fundo dos cards de projeto |
| `hacker-border` | `#1F1F1F` | Bordas padrão |
| `hacker-green-light` | `#C0FFC0` | Texto principal |
| `hacker-neon` | `#00FF41` | Destaques, botões, hover |
| `hacker-binary` | `#00CC33` | Textos secundários, binários decorativos |

### Sombra customizada

```css
shadow-neon: 0 0 8px #00FF41, 0 0 20px #00FF4166
```

Aplicada nos cards e botões no estado `:hover`.

---

## Tailwind Config

O arquivo `tailwind.config.js` estende o tema padrão com as cores, fonte e sombra do projeto. Para uso com **build local** (sem CDN):

```bash
npm install -D tailwindcss
npx tailwindcss -i ./static/css/input.css -o ./static/css/output.css --watch
```

> ⚠️ A versão atual usa o **CDN do Tailwind** com `tailwind.config` inline no `<head>` — ideal para desenvolvimento. Para produção, recomenda-se o build local com purge de classes.

---

## Licença

Projeto pessoal — livre para uso e adaptação.

```
>_ session encerrada.
$ logout
```
