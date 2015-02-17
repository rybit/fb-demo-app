from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.core.urlresolvers import reverse

from core.models import *

import json
import os

DEMO_DATA_DIR = 'demo-data'
IMG_DIR = 'core/static/imgs'

def fn(page_id):
  return 'page_{}.json'.format(page_id)

def getPages():
  files = os.listdir(DEMO_DATA_DIR)
  return {os.path.splitext(fn)[0].split('_')[1]:fn for fn in files}

def getPage(page_id):
  path = os.path.join(DEMO_DATA_DIR, fn(page_id))
  with open(path) as fp:
    data = json.load(fp)
  return data

def getAllData():
  return {page_id:getPage(page_id) for page_id in getPages().keys()}

def writePage(curpage, page):
  with open(os.path.join(DEMO_DATA_DIR, fn(curpage)),'w') as fp:
    fp.write(json.dumps(page, sort_keys=True, indent=4, separators=(',', ':')))

def getimg(curpage, curpost):
  poss = os.path.join(IMG_DIR, 'page_{}'.format(curpage), "{}.jpg".format(curpost))
  print poss
  if os.path.exists(poss):
    return os.path.join('imgs', 'page_{}'.format(curpage), "{}.jpg".format(curpost))
  return ""

###############################################################################
# request handlers
###############################################################################

def index(request):
  context = {'pageids' : [p.val for p in PageId.objects.all()]}
  return render(request, 'core/index.html', context)

def getContext(curpage):
  all_data = getAllData()
  context = {}
  context['pages'] = pages = []
  for page_id, p in all_data.iteritems():
    page = {'id': page_id, 'name': p['name']}
    if curpage == str(page_id):
      context['curpage'] = page
    else:
      pages.append(page)
  return context

def withuser(request, username, curpage):
  context = getContext(curpage)
  context['username'] = username
  return render(request, 'core/main.html', context)

def nouser(request, curpage):
  context = getContext(curpage)
  return render(request, 'core/main.html', context)

def getpage(request):
  curpage = request.GET['curpage']
  page = getPage(curpage)
  page['nextpostid'] = len(page['posts'])
  page['posts'].sort(key=lambda p: p['date'])

  for post in page['posts']:
    poss = getimg(curpage, post['id'])
    if poss:
      post['img_path'] = poss

  return HttpResponse(json.dumps(page), content_type='application/json')

def newpost(request, curpage):
  if request.POST.get('text') == None and request.POST.get('img_path') == None:
    return

  page = getPage(curpage)
  username = request.POST['creator']

  post = {
    'id': int(request.POST['id']),
    'date': int(request.POST['date']),
    'creator': username,
    'text': request.POST.get('text'),
    'visits': 0,
    'img_path': request.POST.get('img_page'),
  }

  page['posts'].append(post)
  writePage(curpage, page)
  return HttpResponseRedirect(reverse('withuser', args=(username, curpage,)))

def delpost(request):
  toremove = request.GET['toremove']
  curpage = request.GET['curpage']
  page = getPage(curpage)
  page['posts'] = filter(lambda p: str(p['id']) != toremove, page['posts'])
  writePage(curpage, page)
  return HttpResponse(status=200)

