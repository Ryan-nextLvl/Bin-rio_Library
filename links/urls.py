from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('visita/<int:projeto_id>/', views.registrar_visita, name='registrar_visita'),
]
