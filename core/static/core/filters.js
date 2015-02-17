function checkForImg(post, needImg) { 
  if(needImg) {
    return $(post).find('img').length > 0 ;
  } 

  return true;
}

function filterPost(post, text, needImg) { 
  if(text == "") {
    if(checkForImg(post, needImg)) { 
      $(post).show();
    } else {
      $(post).hide();
    }
    return;
  }

  text = text.toLowerCase();
  var contentText = $(post).find('.text').text().toLowerCase();
  if(contentText.indexOf(text) < 0) { 
    $(post).hide(); // img doesn't matter - doesn't meet this criteria
  } else {
    if(checkForImg(post, needImg)) { 
      $(post).show();
    } else {
      $(post).hide();
    }
  }
}

function filterAllPosts(postContainer, checkState) {
  var filterText = postContainer.find('.contentfilter').val();
  $.each(postContainer.find('.post-container'),
         function(idx, post) {
           filterPost(post, filterText, checkState); 
         });
}

$(function() { 
  $('#past-posts-container .has-pic').change(function(ev) {
    filterAllPosts($('#past-posts-container'), this.checked); 
  });

  $('#past-posts-container .filter-clear').click(function(ev) {
    $('#past-posts-container .contentfilter').val('');
    filterAllPosts($('#past-posts-container')); 
  });

  $('#past-posts-container .contentfilter').keyup(function(ev) {
    filterAllPosts($('#past-posts-container'));
  });

  $('#pending-posts-container .has-pic').change(function(ev) {
    filterAllPosts($('#pending-posts-container'), this.checked); 
  });

  $('#pending-posts-container .filter-clear').click(function(ev) {
    $('#pending-posts-container .contentfilter').val('');
    filterAllPosts($('#pending-posts-container')); 
  });

  $('#pending-posts-container .contentfilter').keyup(function(ev) {
    filterAllPosts($('#pending-posts-container'));
  });
});

