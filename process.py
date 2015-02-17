import sys
import random
from datetime import datetime as dt
import json

page_id = sys.argv[1]
input_fn = sys.argv[2]
name = sys.argv[3]
r = random.Random()

peeps = [
  "Smith Johnson",
  "Jackson White",
  "Harris Martin",
  "Thompson Garcia",
  "Martinez Robinson Clark",
  "Rodriguez Lewis",
  "Lee Walker",
  "Hall Allen Young"
]

page = {'name': name, 'id': page_id}
page['posts'] = posts = []

with open(input_fn) as fp:
  for idx, line in enumerate(filter(lambda l: l.strip() != '', fp.readlines())):
    ts = int(dt.utcnow().__format__("%s"))
    ts += (-1 if (r.random() > .6) else 1) * r.randint(0, 86400 * 60)
    ts *= 1000

    post = {'id': idx,
            'visits': r.randint(0, 123),
            'creator': r.choice(peeps),
            'date': ts,
            'text': line}
    posts.append(post)

with open('page_{}.json'.format(page_id), 'w') as outfp:
  outfp.write(json.dumps(page, sort_keys=True, indent=4, separators=(',',':')))

