from django.db import models


class Projeto(models.Model):
    nome = models.CharField(max_length=200)
    descricao = models.TextField()
    tecnologias = models.CharField(max_length=300, blank=True, help_text='Ex: Python, Django, React')
    url_site = models.URLField(blank=True, verbose_name='URL do site')
    visitas = models.PositiveIntegerField(default=0)
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-criado_em']
        verbose_name = 'Projeto'
        verbose_name_plural = 'Projetos'

    def __str__(self):
        return self.nome
