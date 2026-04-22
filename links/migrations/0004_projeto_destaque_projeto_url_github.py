from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('links', '0003_projeto_imagem_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='projeto',
            name='destaque',
            field=models.BooleanField(default=False, verbose_name='Projeto em destaque'),
        ),
        migrations.AddField(
            model_name='projeto',
            name='url_github',
            field=models.URLField(blank=True, verbose_name='URL do GitHub'),
        ),
        migrations.AlterModelOptions(
            name='projeto',
            options={'ordering': ['-destaque', '-criado_em'], 'verbose_name': 'Projeto', 'verbose_name_plural': 'Projetos'},
        ),
    ]
