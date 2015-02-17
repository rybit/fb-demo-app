from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.core.urlresolvers import reverse

from core.models import *

import json
import os

def index(request):
  return render(request, 'core/index.html', {})
