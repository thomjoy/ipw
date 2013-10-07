var jsonData = $.ajax({
      url: '//localhost:3333/api',
      dataType: 'jsonp',
      jsonpCallback: 'results'
    }),
    saveData = function (obj) {
      if( !window.localStorage ) return;

      console.log('Saving: ' + JSON.stringify(obj));
      window.localStorage.setItem('formData', JSON.stringify(obj));
    },
    getData = function(key) {
      if( !window.localStorage ) return;

      var obj = window.localStorage.getItem(key);
      console.log('Retrieving: ' + JSON.stringify(obj));
      return(JSON.parse(obj));
    },
    buildOption = function(data, selector, store) {
      var o = $('<option/>')
        .val(data.id)
        .html(data.label_i18n);
      o.appendTo(selector);
      store.push(o);
    };

// Wait until the data arrives...
$.when( jsonData ).then(function(response) {
  var resp = JSON.parse(response),
      rules = resp.show_regions,
      allRegions = [],
      allShows = [],
      $regionSelect = $('#region'),
      $showSelect = $('#show'),
      savedData = getData('formData'),
      getSelected = function(type) {
        if( type == 'region' ) {
          return $('#region option:selected').val();
        }
        else {
          return $('#show option:selected').val();
        }
      };

  // Build the options, fill with data
  resp.regions.forEach(function(region) {
    buildOption(region, '#region', allRegions);
  });
  resp.shows.forEach(function(show) {
    buildOption(show, '#show', allShows);
  });

  if( savedData ) {
    $showSelect.val(savedData.show_id);
    $regionSelect.val(savedData.region_id);
  }


  // -- Event handlers -- //
  $showSelect.on('change', function(evt) {
    var showId = $("option:selected", this).val();
    var showAvailableInRegions = _.pluck(_.where(rules, {show_id: showId}), 'region_id');

    $("#region")
      .html(allRegions) //reset dropdown list
      .find('option').filter(function(){
        var regionId = $(this).val();
        return (_.indexOf(showAvailableInRegions, regionId) === -1) ? true : false;
      }).remove();  // remove

    saveData({
      show_id: getSelected('show'),
      region_id: getSelected('region')
    });
  });

  // Removed because there are is no intersection of (region, shows) between 
  // the two shows...
  $regionSelect.on('change', function(evt) {
    /*
    var regionId = $("option:selected", this).val();
    var showsForRegion = _.pluck(_.where(rules, {region_id: regionId}), 'show_id');

    $("#show")
      .html(allShows) //reset dropdown list
      .find('option').filter(function(){
        var showId = $(this).val();
        return (_.indexOf(showsForRegion, showId) === -1) ? true : false;
      }).remove();  // remove
    */

    saveData({
      show_id: getSelected('show'),
      region_id: getSelected('region')
    });
  });

  $('button').on('click', function(evt) {
    evt.preventDefault();
    console.log('POST');
    
    $.ajax({
      url: 'http://localhost:3333/save',
      method: 'POST',
      data: {
        show_id:    getSelected('show'),
        region_id:  getSelected('region')
      }
    });

    saveData({
      show_id: getSelected('show'),
      region_id: getSelected('region')
    });
  });
});