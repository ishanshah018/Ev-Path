"""
URL configuration for evproxy project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from ocm.views import ev_stations, route_chargers, plan_trip, chatbot



urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/ev-stations/", ev_stations),
    path("api/route-chargers/", route_chargers),
    path("api/plan-trip", plan_trip),
    path("api/chatbot/", chatbot),
]
