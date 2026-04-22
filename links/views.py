from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render

from .models import Projeto


def index(request):
    projetos = Projeto.objects.all().order_by('-criado_em')
    return render(request, 'links/index.html', {'projetos': projetos})


def registrar_visita(request, projeto_id):
    projeto = get_object_or_404(Projeto, pk=projeto_id)
    projeto.visitas += 1
    projeto.save()
    return redirect(projeto.url_site or '/')


def api_projetos(request):
    projetos = list(Projeto.objects.values(
        'id', 'nome', 'descricao', 'tecnologias',
        'url_site', 'url_github', 'imagem_url',
        'destaque', 'visitas', 'criado_em'
    ))
    for p in projetos:
        p['criado_em'] = p['criado_em'].isoformat()
    return JsonResponse({'projetos': projetos})


def api_registrar_visita(request, projeto_id):
    projeto = get_object_or_404(Projeto, pk=projeto_id)
    projeto.visitas += 1
    projeto.save()
    return JsonResponse({'url': projeto.url_site or '/'})
