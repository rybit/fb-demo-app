from django.conf.urls import patterns, url
from core import views

urlpatterns = patterns('',
  url(r'^$', views.index, name="index"),

  url(r'^getpage$', views.getpage, name="getpage"),
  url(r'^delpost$', views.delpost, name="delpost"),
  url(r'^newpost$', views.newpost, name="newpost"),
)
