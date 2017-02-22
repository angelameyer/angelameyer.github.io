var applicationID = 'EJBF3TQN1P'
var apiKey = 'f339172ac84679e583152bb72db1a72a'
var indexName = 'restaurant_data'

var client = algoliasearch(applicationID, apiKey);
var helper = algoliasearchHelper(client, indexName, {
  facets: ['food_type', 'stars_count', 'payment_options']
});

var start = new Date().getTime();

helper.on('result', function(content) {
	renderCusineList(content);
	renderPaymentList(content);
	renderStarsList(content);
	renderHits(content, start);
});

function renderHits(content, startTime) {
  $('#results-returned').html(function() {
    return content.hits.length + " results returned" 
    });

  $('#result-text').html(function() {
  	var duration = new Date().getTime() - startTime
  	return "in " + duration + " seconds "
  });

  $('#results').html(function() {
    return $.map(content.hits, function(hit) {

    var neighborhood = hit.neighborhood.substring(0, hit.neighborhood.indexOf(';'));
    var priceRange = hit.neighborhood.substring(hit.neighborhood.lastIndexOf(";") + 1);

    return '<tr><td><img id="logo" src=' + hit.image_url + '></td><td><div><p id="restaurant-name">' + hit.name + '<p id="stars-count">' + hit.stars_count + ' Stars</p><p id="reviews-count">(' + hit.reviews_count + ') Reviews' +
    '</p><p id="cuisine">' + hit.food_type + ' | ' + '</p><p id="neighborhood">' + neighborhood + " | " + priceRange +'</p></div></td></tr>'

    });
  });
}

$('#cuisine-list').on('click', 'input[type=checkbox]', function(e) {
  var facetValue = $(this).data('facet');  
  helper.toggleRefinement('food_type', facetValue)
        .search();
});

function renderCusineList(content) {
  $('#cuisine-list').html(function() {
    return $.map(content.getFacetValues('food_type'), function(facet) {
      var checkbox = $('<input type=checkbox style="opacity: 0.0; position: absolute; left: -9999px">')
        .data('facet', facet.name)
        .attr('id', 'fl-' + facet.name);
      if(facet.isRefined) checkbox.attr('checked', 'checked');
      var label = $('<label>').html(facet.name + ' (' + facet.count + ')')
                              .attr('for', 'fl-' + facet.name);
      return $('<p>').append(checkbox).append(label);
    });
  });
}

$('#stars-list').on('click', 'input[type=checkbox]', function(e) {
  var facetValue = $(this).data('facet');  
  helper.toggleRefinement('stars_count', facetValue)
        .search();
});

function renderStarsList(content) {
  $('#stars-list').html(function() {
    return $.map(content.getFacetValues('stars_count'), function(facet) {
      var checkbox = $('<input type=checkbox style="opacity: 0.0; position: absolute; left: -9999px">')
        .data('facet', facet.name)
        .attr('id', 'fl-' + facet.name);
      if(facet.isRefined) checkbox.attr('checked', 'checked');
      var label = $('<label>').html(facet.name + ' (' + facet.count + ')')
                              .attr('for', 'fl-' + facet.name);
      return $('<p>').append(checkbox).append(label);
    });
  });
}


$('#payment-list').on('click', 'input[type=checkbox]', function(e) {
  var facetValue = $(this).data('facet');  
  helper.toggleRefinement('payment_options', facetValue)
        .search();
});

function renderPaymentList(content) {
  $('#payment-list').html(function() {

    return $.map(content.getFacetValues('payment_options'), function(facet) {

      // if (facet.name == "Diners Club" || facet.name == "JCB" || facet.name == "Carte Blanche") {
      // }

      var checkbox = $('<input type=checkbox style="opacity: 0.0; position: absolute; left: -9999px">')
        .data('facet', facet.name)
        .attr('id', 'fl-' + facet.name);


      if(facet.isRefined) checkbox.attr('checked', 'checked');
      var label = $('<label>').html(facet.name + ' (' + facet.count + ')')
                              .attr('for', 'fl-' + facet.name);
      return $('<p>').append(checkbox).append(label);
    });
  });
}

$(".show-button a").on("click", function() {
    var $this = $(this); 
    var $content = $this.parent().prev("div.hideContent");
    $content.addClass('showContent').removeClass('hideContent');
    $this.hide()
    $this.parent().hide()
});

$('#search-window').on('keyup', function() {
  helper.setQuery($(this).val())
        .search();
});

helper.search();

// navigator.geolocation.watchPosition(function(position) {
//   helper.setQueryParameter('aroundLatLngViaIP', true).search();
// },
// function (error) { 
//   if (error.code == error.PERMISSION_DENIED)
//   		// default NYC
//       helper.setQueryParameter('aroundLatLng', '40.71, -74.01').search();
// });
