from django.contrib import admin
from django.http import FileResponse
from django.urls import include, path, re_path
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


def spa_view(request):
    index_path = BASE_DIR / 'frontend' / 'dist' / 'index.html'
    return FileResponse(open(index_path, 'rb'))


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('links.urls')),
    re_path(r'^.*$', spa_view),
]
