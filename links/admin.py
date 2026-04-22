from django.contrib import admin
from django.utils.html import format_html

from .models import Projeto


@admin.register(Projeto)
class ProjetoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'tecnologias', 'destaque', 'status_cliques', 'visitas', 'url_site', 'url_github', 'criado_em')
    list_editable = ('url_site', 'url_github', 'destaque')
    list_filter = ('destaque',)
    search_fields = ('nome', 'tecnologias')
    list_per_page = 20
    readonly_fields = ('visitas', 'criado_em')
    ordering = ('-destaque', '-criado_em')
    fieldsets = (
        (None, {'fields': ('nome', 'descricao', 'tecnologias', 'destaque')}),
        ('Links', {'fields': ('url_site', 'url_github', 'imagem_url')}),
        ('Stats', {'fields': ('visitas', 'criado_em')}),
    )

    @admin.display(description='Popularidade')
    def status_cliques(self, obj):
        if obj.visitas >= 500:
            return format_html('<span style="color:#00FF41;font-weight:bold">🚀 VIRAL ({})</span>', obj.visitas)
        if obj.visitas >= 100:
            return format_html('<span style="color:#00FF41">🔥 Popular ({})</span>', obj.visitas)
        if obj.visitas >= 10:
            return format_html('<span style="color:#C0FFC0">📈 Crescendo ({})</span>', obj.visitas)
        return format_html('<span style="color:#555">⬜ Novo ({})</span>', obj.visitas)
