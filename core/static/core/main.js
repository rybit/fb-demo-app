function emptyCheck(selector, defaultVal) {
  var el = $(selector)
  var span = document.createElement('span');
  span.className = 'empty-text';
  span.innerHTML = defaultVal;
  if(el.children().size() == 0) {
    el.append(span);
    el.addClass('empty-list');
  } else {
    el.removeClass('empty-list');
    el.children('.empty-text').remove();
  }
}

function removeFromList(el, id) {
  FB.api(
    id,
    "DELETE",
    function(rsp) {
      $(el).parents('.post-container').remove();
      emptyCheck('#pending-posts', "No Pending Posts");
    }
  );
}

function timeTill(ts) {
  var spandiff = new Date().getTime() - new Date(ts).getTime();
  spandiff = Math.abs(spandiff);
  // ms -> sec
  spandiff /= 1000;

  var secInDay = 86400;
  var secInHour = 24 * 60;
  var secInMin = 60;

  var useSec = spandiff < secInMin * 5;

  var days = Math.floor(spandiff / secInDay);
  spandiff -= days * secInDay;
  var hours  = Math.floor(spandiff / secInHour);
  spandiff -= hours * secInHour;
  var mins = Math.floor(spandiff / secInMin);
  spandiff -= mins * secInMin;

  ret = "";
  if(days > 0) {
    ret += days + " days ";
  }
  if(hours > 0 || (hours == 0 && days > 0)) {
    ret += hours + " hours ";
  }

  if(mins > 0 || (mins == 0 && hours > 0) || (mins == 0 && days > 0)) {
    ret += mins + " minutes ";
  }

  if(useSec) {
    ret += Math.round(spandiff) + " seconds";
  }

  return ret;
}

function movePost(el) {
  post = {
    text : $(el).find('.content').text(),
    date : new Date($(el).find('.original-time').val()).getTime(),
    creator: $('#username').text(),
    visits : 0
  };
  el.remove();
  var newEl = buildPastPost(post);
  $('#past-posts').prepend(newEl);

  // TODO call back end to let them know it isn't pending no mo

}

function showAlert(error) {
  var a = elemAndClass('div', 'alert alert-danger alert-dismissible');
  a.setAttribute('role', 'alert');

  var b = elemAndClass('button', 'close', a);
  b.setAttribute('aria-label', 'Close');
  b.setAttribute('data-dismiss', 'alert');
  elemAndClass('span', '', b).innerHTML = '&times;';
  elemAndClass('span', '', a).innerHTML = 'Error!';
  elemAndClass('div', '', a).innerHTML = error;

  $('body').append(a);
}

function updatePendingTimes() {
  var elems = $('#pending-posts').children().filter(function() {
    return !$(this).hasClass('ignore');
  });

  for(var i = 0; i < elems.length; i++) {
    var el = elems[i];
    var ts = new Date($(el).find('.original-time').text()).getTime();
    if(ts <= new Date().getTime()) {
      movePost(el);
    } else {
      $(el).find('.countdown').text(timeTill(ts));
    }
  }
}

function showChart() {
  var timeseq = [];
  $('#past-posts .post-container').each(function(idx, container) {
    var ts = $(this).find('.date').text();
    var val = $(this).find('.visits').text().replace(/\D+/g, '');
    val = parseInt(val);
    timeseq.push({'date': new Date(ts), 'value': val});
  });

  MG.data_graphic({
    //title: 'Posts',
    description: 'History of your Posts',
    data: timeseq,
    height: 200,
    width: document.getElementById('chart-wrapper').offsetWidth,
    target: '#chart-container',
    x_accessor: 'date',
    y_accessor: 'value',
  });
}

$(function() {
  $('#vizdate').datetimepicker({
    defaultDate: new Date(),
    minDate: 0
  });

  $('#showcal').click(function() {
    $('#vizdate').datetimepicker('show')
  });

  $('#past-search').click(function() {
    $('#past-filter').slideToggle();
  });

  $('#pending-search').click(function() {
    $('#pending-filter').slideToggle();
  });

  $('#chart-wrapper button').click(function() {
    if($(this).hasClass('upChart')) {
      $(this).text('Show Chart');
      $(this).removeClass('upChart');
      $('#chart-container').slideToggle();
    } else {
      $(this).text('Hide Chart');
      $(this).addClass('upChart');
      showChart();
      $('#chart-container').slideToggle();
    }
  });
});
