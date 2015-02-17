function elemAndClass(type, className, parentEl) {
  var ret = document.createElement(type);
  ret.className = className;
  if(parentEl != null) {
    parentEl.appendChild(ret);
  }
  return ret;
}

function buildContent(post) {
  var content = elemAndClass('div', 'content');
  elemAndClass('div', 'post-id', content).innerHTML = post.id;
  if(post.message != undefined) {
    elemAndClass('div', 'text', content).innerHTML = post.message;
  }

  if(post.type == 'photo')  {
    var imgcont = elemAndClass('div', 'img-container', content);
    var img = new Image(450, 450);
    imgcont.appendChild(img);

    FB.api(post.object_id, function(rsp) {
      img.src = rsp.images[0].source;
    });
  }

  return content;
}

function buildLowLine(post) {
  var el =  elemAndClass('div', 'lowline');
  var link = elemAndClass('a', 'fb-link', el);
  link.innerHTML = "See on Facebook";
  link.href = post.link;
  return el;
}

function buildPastPost(idx, post) {
  var wrapper = elemAndClass('div', "post-container past-post");

  var highline = elemAndClass('div', 'post-highline', wrapper);
  elemAndClass('span', 'date', highline).innerHTML = new Date(post.created_time).toLocaleString();

  sp = elemAndClass('span', 'visits', highline);
  var handlersp = function(visits) {
    return function(rsp) {
      if(rsp.data.length == 0) {
        visits.innerHTML = "Visits: 0";
      } else {
        visits.innerHTML = "Visits: " + rsp.data[0].values[0].value;
      }
    };
  }(sp);

  FB.api(post.id + '/insights/post_impressions_unique', handlersp);

  wrapper.appendChild(buildContent(post));
  wrapper.appendChild(buildLowLine(post));

  return wrapper;
}

function buildPendingPost(post) {
  var ts = post.scheduled_publish_time * 1000;
  var wrapper = elemAndClass('div', "post-container pending-post");

  var highline = elemAndClass('div', 'post-highline', wrapper);
  elemAndClass('span', 'countdown', highline).innerHTML = timeTill(ts);

  var cancel = elemAndClass('button', 'cancel', highline);
  $(cancel).click(function(ev) { removeFromList (ev.target, post.id) });
  elemAndClass('span', 'glyphicon glyphicon-align-left glyphicon-remove-circle', cancel)

  elemAndClass('span', 'original-time', highline).innerHTML = new Date(ts).toLocaleString();

  wrapper.appendChild(buildContent(post));

  return wrapper;
}
