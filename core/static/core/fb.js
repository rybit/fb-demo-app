function dopost() {
  var id = $('#page-list option:selected').val();
  var token = page_ids[id].access_token;

  var data = {
      'access_token': token,
      'message': $('#message').val()
  };
  var when = $('#vizdate').val();
  if(when != "") {
    data['scheduled_publish_time'] = new Date(when).getTime() / 1000;
    data['published'] = false;
  }

  FB.api(
    id + '/feed',
    'POST',
    data,
    function(rsp) {
      if(rsp.error) {
        showAlert(rsp.error.message);
      }
      popPosts($('#page-list option:selected').val());
    }
  );

  $('#vizdate').val('');
  $('#message').val('');
}

function showLogin(rsp) {
  $('#login').show();
  $('#chart-wrapper').hide();
  $('#content-wrapper').hide();
  $('#post-button').prop('disabled', true);
}

function popPosts(pageid) {
  $('.post-container').remove();

  FB.api(pageid + "/feed",
    function(rsp){
      $.each(rsp.data, function(idx, post) {
        $('#past-posts').append(buildPastPost(idx,post));

        updatePendingTimes();
        window.setInterval(updatePendingTimes, 1000);
      });
      emptyCheck('#past-posts', "No Past Posts");
    }
  );

  FB.api(pageid + "/promotable_posts",
    {'is_published': 0},
    function(rsp) {
      $.each(rsp.data, function(idx, post) {
        $('#pending-posts').append(buildPendingPost(post));
      });
      emptyCheck('#pending-posts', "No Pending Posts");
    }
  );
}

function popPageList(rsp) {
  if(rsp.error) {
    showAlert(rsp.error.message);
  } else if (rsp.data.length == 0) {
    showAlert("Didn't find any pages for you to administrate");
  } else {
    $.each(rsp.data,
      function(idx, datum) {
        if(datum.perms.indexOf("CREATE_CONTENT") > 0) {
          page_ids[datum.id] = datum;

          FB.api(datum.id, function(rsp) {
            if(rsp && !rsp.error) {
              var el = elemAndClass('option', '');
              $(el).val(rsp.id).text(rsp.name);
              $('#page-list').append(el);
              popPosts(rsp.id);
            }
          });
        }
      }
    );
  }
}

function popPage() {
  $('#login').hide();
  $('#chart-wrapper').show();
  $('#content-wrapper').show();
  $('#post-button').prop('disabled', false);

  FB.api('me/accounts', popPageList);

  // popPosts(page_id);
}

function statusChangeCallback(rsp) {
  if (rsp.status === 'connected') {
      // Logged into your app and Facebook.
      popPage();
    } else if (rsp.status === 'not_authorized') {
      showLogin();
    } else {
      showAlert('Please log into Facebook');
    }
}

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
};

// load the SDK
(function(d, s, id){
   var js, fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) {return;}
   js = d.createElement(s); js.id = id;
   js.src = "//connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function initFB(callback) {

  FB.init({
    appId      : '1387232788256569',
    xfbml      : true,
    version    : 'v2.2'
  });

  FB.getLoginStatus(function(response) {
    callback(response);
  });
};

window.fbAsyncInit = function () {initFB(statusChangeCallback); };
$(function() {
  $('#logout').click(function() {
    FB.logout(showLogin);
  });

  $('#do-post').click(dopost);
});
