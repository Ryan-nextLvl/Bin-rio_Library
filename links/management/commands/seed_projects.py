"""
Management command para popular o banco com projetos reais.

Uso:
    python manage.py seed_projects
    python manage.py seed_projects --clear   # apaga tudo antes de inserir
"""

from django.core.management.base import BaseCommand
from django.db import transaction

from links.models import Projeto, PLACEHOLDER

# ──────────────────────────────────────────────────────────────
# EDITE AQUI: substitua pelos seus projetos reais
# ──────────────────────────────────────────────────────────────
DATA = [
    {
        'nome': 'Site Institucional',
        'descricao': (
            'Landing page institucional para empresa do setor de serviços. '
            'Inclui seções de apresentação, portfólio de serviços, depoimentos '
            'e formulário de contato integrado ao WhatsApp.'
        ),
        'tecnologias': 'Django, Tailwind CSS, SQLite, JavaScript',
        'url_site': 'https://exemplo.com/site-institucional',
        'imagem_url': 'https://placehold.co/600x400/0A0A0A/00FF41?text=Site+Institucional',
    },
    {
        'nome': 'E-commerce',
        'descricao': (
            'Plataforma de vendas online com carrinho de compras, painel de '
            'administração de pedidos e integração com gateway de pagamento. '
            'Sistema de cupons e controle de estoque em tempo real.'
        ),
        'tecnologias': 'Django, Django REST Framework, React, PostgreSQL, Stripe',
        'url_site': 'https://exemplo.com/ecommerce',
        'imagem_url': 'https://placehold.co/600x400/0A0A0A/00FF41?text=E-commerce',
    },
    {
        'nome': 'Portfólio Pessoal',
        'descricao': (
            'Portfólio interativo com tema Dark Hacker, exibindo projetos, '
            'linha do tempo de experiências e contador de visitas por projeto. '
            'Chuva de binários animada e efeito de digitação no cabeçalho.'
        ),
        'tecnologias': 'Django, Tailwind CSS, JavaScript, SQLite',
        'url_site': 'https://github.com/Ryan-nextLvl/Bin-rio_Library',
        'imagem_url': 'https://placehold.co/600x400/0A0A0A/00FF41?text=Portfolio',
    },
    # ── Adicione mais projetos abaixo neste formato: ──────────
    # {
    #     'nome': 'Meu Projeto',
    #     'descricao': 'Descrição do projeto.',
    #     'tecnologias': 'Python, Django',
    #     'url_site': 'https://meusite.com',
    #     'imagem_url': '',   # deixe vazio para usar o placeholder automático
    # },
]
# ──────────────────────────────────────────────────────────────


class Command(BaseCommand):
    help = 'Popula o banco de dados com projetos de exemplo (usa get_or_create para evitar duplicatas).'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Remove todos os projetos existentes antes de inserir os novos.',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('\n⚡ Bin-rio Library — Data Seed\n'))

        if options['clear']:
            total_deleted, _ = Projeto.objects.all().delete()
            self.stdout.write(
                self.style.WARNING(f'🗑️  {total_deleted} projeto(s) removido(s) do banco.\n')
            )

        created_count  = 0
        existing_count = 0

        with transaction.atomic():
            for item in DATA:
                # Garante placeholder se imagem_url vier vazia
                if not item.get('imagem_url'):
                    label = item['nome'].replace(' ', '+')
                    item['imagem_url'] = (
                        f'https://placehold.co/600x400/0A0A0A/00FF41?text={label}'
                    )

                projeto, created = Projeto.objects.get_or_create(
                    nome=item['nome'],
                    defaults={
                        'descricao':   item['descricao'],
                        'tecnologias': item.get('tecnologias', ''),
                        'url_site':    item.get('url_site', ''),
                        'imagem_url':  item['imagem_url'],
                    },
                )

                if created:
                    created_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(f'  ✅ CRIADO   → {projeto.nome}')
                    )
                else:
                    existing_count += 1
                    self.stdout.write(
                        self.style.NOTICE(f'  ⏭️  JÁ EXISTE → {projeto.nome}')
                    )

        self.stdout.write('')
        self.stdout.write(self.style.SUCCESS(
            f'✔ Seed concluído: {created_count} criado(s), {existing_count} já existia(m).\n'
        ))
