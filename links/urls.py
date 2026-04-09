from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('visita/<int:projeto_id>/', views.registrar_visita, name='registrar_visita'),
    path('api/projetos/', views.api_projetos, name='api_projetos'),
    path('api/visita/<int:projeto_id>/', views.api_registrar_visita, name='api_registrar_visita'),
]
