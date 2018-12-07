/*!
 * vd-platinum-layout - Вёрстка для сайта VD Platinum
 * @version v1.2.2
 * @author Adorazel
 * @link https://adorazel.online
 * @license MIT
 */
(function() {
  var CalcMaker, DATA, GetActiveTab, GetJsonData, MakeMapData, MapBlock, MapBuilder, MapInit, PayCalc, SelectorMaker, TimeSliderUpdate, ViewChecker, accordion, animateCss, calcForm, firstOption, loansSlider, mainSlider, select, selectTextWrapper, sliderEventsMaker, sumSliderMaker, teamSlider, timeSliderMaker, titleClass, viewSwitcher, whySlider, ymaps_ready;

  console.log("%c" + 'Ваш браузер – ' + navigator.sayswho, "color:forestgreen;font-size:16px;");

  $('#asideTrigger').on('click', function() {
    return $(this).parent().toggleClass('open');
  });

  $('#menuTrigger, #menuCloser').on('click', function() {
    return $('#menuWrap').toggleClass('open');
  });

  $('#addressesListTrigger').on('click', function() {
    $('#hiddenAddressesList').slideDown(250);
    return $(this).hide();
  });

  // Стилизация элементов форм
  selectTextWrapper = function(selectbox) {
    var text;
    text = selectbox.next().find('.jq-selectbox__select-text');
    text.html('<span>' + text.text() + '</span>');
    return true;
  };

  $('select:not(.unstyled)').each(function() {
    var $this;
    $this = $(this);
    return $this.styler({
      selectSearch: true,
      selectPlaceholder: $this.data('placeholder') ? $this.data('placeholder') : '-- Выберите --',
      onFormStyled: function() {
        selectTextWrapper($this);
        return true;
      },
      onSelectClosed: function() {
        selectTextWrapper($this);
        return true;
      }
    });
  });

  $('input[type=number]:not(.unstyled), input[type=checkbox]:not(.unstyled), input[type=radio]:not(.unstyled)').styler();

  $('input[type="file"]').each(function() {
    $(this).styler({
      filePlaceholder: $(this).data('placeholder'),
      fileBrowse: ''
    });
    return true;
  });

  $('input[name="phone"]').mask('+79999999999');

  calcForm = $('#calcForm');

  calcForm.title = $('#calcTitle');

  calcForm.sumInput = $('#sumInput');

  calcForm.sumSlider = $('#sumSlider');

  calcForm.sumSlider.step = 1000;

  calcForm.timeInput = $('#timeInput');

  calcForm.timeSlider = $('#timeSlider');

  calcForm.monthPay = $('#monthPay');

  calcForm.allReturn = $('#allReturn');

  calcForm.allOver = $('#allOver');

  calcForm.allDate = $('#allDate');

  calcForm.data = null;

  $('form [type="number"]').keydown(function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      $(this).trigger('refresh');
      PayCalc();
      return false;
    }
    return true;
  });

  PayCalc = function() {
    var allDate, allOver, allReturn, dd, fee, mm, monthPay, today, yyyy;
    fee = parseFloat(calcForm.data[0].fee) / 100;
    allOver = parseInt(calcForm.timeInput.val()) * (parseInt(calcForm.sumInput.val()) * fee) / 12;
    allReturn = allOver + parseInt(calcForm.sumInput.val());
    monthPay = allReturn / parseInt(calcForm.timeInput.val());
    today = new Date();
    allDate = new Date(today.setMonth(today.getMonth() + parseInt(calcForm.timeInput.val())));
    dd = allDate.getDate();
    mm = allDate.getMonth() + 1;
    if (mm < 10) {
      mm = '0' + mm;
    }
    yyyy = allDate.getFullYear();
    calcForm.monthPay.text(monthPay.toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }));
    calcForm.monthPay.next().val(monthPay);
    calcForm.allReturn.text(allReturn.toLocaleString('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }));
    calcForm.allReturn.next().val(allReturn);
    calcForm.allOver.text(allOver.toLocaleString('ru-RU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }));
    calcForm.allOver.next().val(allOver);
    calcForm.allDate.text(dd + '.' + mm + '.' + yyyy);
    return calcForm.allDate.next().val(dd + '.' + mm + '.' + yyyy);
  };

  TimeSliderUpdate = function(val) {
    var currentName;
    currentName = calcForm.sumSlider.names[0];
    $.each(calcForm.data, function(index, value) {
      if (val >= parseInt(value.sum_0) && val <= parseInt(value.sum_1)) {
        calcForm.timeSlider.slider('setAttribute', 'min', calcForm.timeSlider.ticks[2 * index]);
        calcForm.timeSlider.slider('setAttribute', 'max', calcForm.timeSlider.ticks[2 * index + 1]);
        calcForm.timeSlider.slider('setValue', calcForm.timeSlider.ticks[2 * index]);
        calcForm.timeInput.val(calcForm.timeSlider.ticks[2 * index]).prop('min', calcForm.timeSlider.ticks[2 * index]).prop('max', calcForm.timeSlider.ticks[2 * index + 1]);
        currentName = calcForm.sumSlider.names[index + 1];
        return false;
      }
    });
    calcForm.title.html(currentName);
    PayCalc();
    return true;
  };

  sliderEventsMaker = function() {
    calcForm.sumInput.change(function() {
      var max, min, val;
      val = parseInt($(this).val());
      min = parseInt($(this).prop('min'));
      max = parseInt($(this).prop('max'));
      if (val < min) {
        val = min;
      }
      if (val > max) {
        val = max;
      }
      calcForm.sumInput.val(val);
      calcForm.sumSlider.slider('setValue', val);
      return TimeSliderUpdate(val);
    });
    calcForm.timeInput.change(function() {
      var max, min, val;
      val = parseInt($(this).val());
      min = parseInt($(this).prop('min'));
      max = parseInt($(this).prop('max'));
      if (val < min) {
        val = min;
      }
      if (val > max) {
        val = max;
      }
      calcForm.timeInput.val(val);
      return calcForm.timeSlider.slider('setValue', val);
    });
    calcForm.timeSlider.on('slide', function(event) {
      calcForm.timeInput.val(event.value);
      PayCalc();
      return true;
    });
    calcForm.timeSlider.on('change', function(event) {
      calcForm.timeInput.val(event.value.newValue);
      PayCalc();
      return true;
    });
    calcForm.sumSlider.on('slide', function(event) {
      calcForm.sumInput.val(event.value);
      TimeSliderUpdate(event.value);
      return true;
    });
    return calcForm.sumSlider.on('change', function(event) {
      calcForm.sumInput.val(event.value.newValue);
      TimeSliderUpdate(event.value.newValue);
      return true;
    });
  };

  timeSliderMaker = function() {
    calcForm.timeSlider.ticks = [];
    $.each(calcForm.data, function(index, value) {
      calcForm.timeSlider.ticks.push(parseInt(value.time_0));
      return calcForm.timeSlider.ticks.push(parseInt(value.time_1));
    });
    //  console.log(calcForm.timeSlider.ticks[0],calcForm.timeSlider.ticks[1])
    calcForm.timeSlider.slider({
      min: calcForm.timeSlider.ticks[0],
      max: calcForm.timeSlider.ticks[1],
      value: calcForm.timeSlider.ticks[0],
      step: 1
    });
    calcForm.timeInput.val(calcForm.timeSlider.ticks[0]).prop('min', calcForm.timeSlider.ticks[0]).prop('max', calcForm.timeSlider.ticks[1]).prop('step', 1);
    PayCalc();
    return sliderEventsMaker();
  };

  sumSliderMaker = function() {
    calcForm.sumSlider.ticks = [parseInt(calcForm.data[0].sum_0)];
    calcForm.sumSlider.ticks_positions = [0];
    calcForm.sumSlider.names = [calcForm.title.html().replace(/\n/g, "")];
    $.each(calcForm.data, function(index, value) {
      calcForm.sumSlider.ticks.push(parseInt(value.sum_1));
      calcForm.sumSlider.ticks_positions.push(100 / calcForm.data.length * (index + 1));
      return calcForm.sumSlider.names.push(value.name);
    });
    calcForm.sumSlider.obj = calcForm.sumSlider.slider({
      ticks: calcForm.sumSlider.ticks,
      ticks_positions: calcForm.sumSlider.ticks_positions,
      ticks_snap_bounds: 0,
      value: parseInt(calcForm.data[0].sum_0),
      step: calcForm.sumSlider.step
    });
    calcForm.sumInput.val(parseInt(calcForm.data[0].sum_0)).prop('min', parseInt(calcForm.data[0].sum_0)).prop('max', parseInt(calcForm.data[calcForm.data.length - 1].sum_1)).prop('step', calcForm.sumSlider.step);
    return timeSliderMaker();
  };

  CalcMaker = function(data) {
    if (!calcForm.data) {
      calcForm.data = data;
    }
    return sumSliderMaker();
  };

  GetJsonData = function() {
    return $.ajax({
      url: "js/calcdata.json"
    }).done(function(data) {
      //    console.log(data)
      CalcMaker(data);
      return true;
    }).fail(function(error) {
      console.log(error);
      return null;
    });
  };

  if (calcForm.length > 0) {
    GetJsonData();
  }

  $('.js-calc-scroll-trigger').on('click', function(e) {
    var target;
    e.preventDefault();
    target = 'calcSection';
    $(window).scrollTo('#' + target, {
      axis: 'y',
      offset: 0 - $('.header').innerHeight(),
      duration: 800
    });
    return true;
  });

  animateCss = function(target, animationName, callback) {
    var animationEnd;
    animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    target.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);
      if (callback) {
        return callback();
      }
    });
    return this;
  };

  mainSlider = $('#mainSlider');

  if (mainSlider.length > 0) {
    mainSlider.slick({
      swipe: true,
      draggable: true,
      dots: true,
      dotsClass: 'slick-dots main-slider-dots list-unstyled',
      arrows: false,
      prevArrow: '<button type="button" class="slick-prev"><span></span></button>',
      nextArrow: '<button type="button" class="slick-next"><span></span></button>',
      infinite: true,
      pauseOnHover: false,
      fade: false,
      cssEase: 'ease-in-out',
      vertical: false,
      centerMode: false,
      centerPadding: '0px',
      speed: 750,
      autoplay: typeof mainSlider.data('autoplay') === 'boolean' ? mainSlider.data('autoplay') : true,
      autoplaySpeed: 5000,
      slidesToShow: 1,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 768,
          settings: 'unslick'
        }
      ]
    });
  }

  loansSlider = $('#loansSlider');

  if (loansSlider.length > 0) {
    loansSlider.on('init', function(slick) {
      if (!$('html').hasClass('desktop')) {
        return $('.js-tile').on('click', function() {
          $(this).toggleClass('flip');
          return $(this).parents('.slick-slide').siblings().find('.js-tile').removeClass('flip');
        });
      }
    });
    loansSlider.slick({
      swipe: true,
      draggable: true,
      dots: false,
      dotsClass: 'slick-dots list-unstyled',
      arrows: false,
      prevArrow: '<button type="button" class="slick-prev"><span></span></button>',
      nextArrow: '<button type="button" class="slick-next"><span></span></button>',
      infinite: true,
      pauseOnHover: false,
      fade: false,
      cssEase: 'ease-in-out',
      vertical: false,
      centerMode: false,
      centerPadding: '0px',
      speed: 750,
      autoplay: typeof loansSlider.data('autoplay') === 'boolean' ? loansSlider.data('autoplay') : true,
      autoplaySpeed: 5000,
      slidesToShow: 5,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 3,
            arrows: true
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            arrows: true
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            arrows: true
          }
        }
      ]
    });
  }

  whySlider = $('#whySlider');

  if (whySlider.length > 0) {
    whySlider.slick({
      swipe: true,
      draggable: true,
      dots: false,
      dotsClass: 'slick-dots list-unstyled',
      arrows: false,
      prevArrow: '<button type="button" class="slick-prev"><span></span></button>',
      nextArrow: '<button type="button" class="slick-next"><span></span></button>',
      infinite: true,
      pauseOnHover: false,
      fade: false,
      cssEase: 'ease-in-out',
      vertical: false,
      centerMode: false,
      centerPadding: '0px',
      speed: 750,
      autoplay: typeof whySlider.data('autoplay') === 'boolean' ? whySlider.data('autoplay') : true,
      autoplaySpeed: 5000,
      slidesToShow: 3,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    });
  }

  teamSlider = $('#teamSlider');

  if (teamSlider.length > 0) {
    teamSlider.slick({
      swipe: true,
      draggable: true,
      dots: false,
      dotsClass: 'slick-dots list-unstyled',
      arrows: true,
      prevArrow: '<button type="button" class="slick-prev"><span></span></button>',
      nextArrow: '<button type="button" class="slick-next"><span></span></button>',
      infinite: true,
      pauseOnHover: false,
      fade: false,
      cssEase: 'ease-in-out',
      vertical: false,
      centerMode: false,
      centerPadding: '0px',
      speed: 750,
      autoplay: typeof teamSlider.data('autoplay') === 'boolean' ? teamSlider.data('autoplay') : true,
      autoplaySpeed: 5000,
      slidesToScroll: 1,
      slidesToShow: 4,
      rows: 2,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            rows: 1
          }
        },
        {
          breakpoint: 520,
          settings: {
            slidesToShow: 1,
            rows: 1
          }
        }
      ]
    });
  }

  $('#numberSlider').slider({
    min: 1,
    max: 100,
    value: 85,
    step: 1,
    enabled: false,
    tooltip: 'hide'
  });

  accordion = $('#faqAccordion');

  titleClass = '.accordion-title';

  accordion.find(titleClass).each(function() {
    return $(this).append('<span class="arrow"></span>');
  });

  accordion.find(titleClass).on('click', function(e) {
    e.preventDefault();
    if (!$(this).hasClass('open')) {
      $(this).addClass('open').next().slideDown(250);
      $(this).siblings(titleClass).each(function() {
        return $(this).removeClass('open').next().slideUp(250);
      });
    } else {
      $(this).removeClass('open').next().slideUp(250);
    }
    return true;
  });

  $(accordion.find(titleClass)[0]).trigger('click');

  ymaps_ready = false;

  MapBlock = $('#mapBlock');

  DATA = null;

  firstOption = '<option value="all">Все города</option>';

  select = $('#sitySelector');

  MapBuilder = function(mapData) {
    var Map, center, mapX, mapY, markers, setMarker, zoom;
    if (MapBlock.find('#map').length > 0) {
      MapBlock.find('#map').remove();
    }
    $('<div id="map"></div>').appendTo(MapBlock);
    $('#map').css({
      'height': parseInt(MapBlock.data('height'))
    });
    // Создание карты
    mapX = mapData.longitude;
    mapY = mapData.latitude;
    zoom = mapData.zoom;
    center = [0, 0];
    if (mapX && mapX) {
      center = [mapX, mapY];
    }
    Map = new ymaps.Map('map', {
      center: center,
      zoom: zoom,
      controls: ['zoomControl']
    });
    if ($('html').is('.desktop')) {
      Map.behaviors.disable('scrollZoom');
    }
    // Установка маркера
    setMarker = function(coord, options) {
      var marker;
      marker = new ymaps.Placemark(coord, options, {
        iconLayout: 'default#image',
        hideIconOnBalloonOpen: true,
        iconImageHref: "../img/marker.svg",
        iconImageSize: [61, 78],
        iconImageOffset: [-30, -78]
      });
      //    Map.panTo coord, {flying: true}
      //        Map.geoObjects.removeAll()
      Map.geoObjects.add(marker);
      return true;
    };
    // Обработка маркеров
    markers = mapData.markers;
    return $.each(markers, function(index, value) {
      var address, body, footer, options, title, x, y;
      address = value.address;
      title = value.name;
      body = '';
      footer = address;
      //      link = ''
      //      header = ''
      x = value.longitude;
      y = value.latitude;
      options = {
        hintContent: title,
        balloonContentHeader: title,
        balloonContentBody: body,
        balloonContentFooter: footer
      };
      //    console.log(options, address, title, footer, x, y)
      if (x && y) {
        setMarker([x, y], options);
      }
      return true;
    });
  };

  MapInit = function(mapData) {
    if (MapBlock.length > 0) {
      if (!ymaps_ready) {
        $.getScript('//api-maps.yandex.ru/2.1/?load=package.standard,package.geoObjects&lang=ru-RU', function() {
          return ymaps.ready(function() {
            MapBuilder(mapData);
            return true;
          });
        });
      } else {
        MapBuilder(mapData);
      }
    }
    return true;
  };

  GetActiveTab = function() {
    var activeTab;
    activeTab = null;
    $('.tabs-row input').each(function() {
      if ($(this).prop('checked') === true) {
        activeTab = $(this);
        return false;
      }
    });
    if (!activeTab) {
      $($('.tabs-row input')[0]).prop('checked', true);
      activeTab = $($('.tabs-row input')[0]);
    }
    return activeTab;
  };

  SelectorMaker = function(data) {
    var activeTab, cities, html, mode, options;
    if (!DATA) {
      DATA = data;
    }
    activeTab = GetActiveTab();
    mode = activeTab.val();
    options = DATA[mode];
    cities = options['cities'];
    select.html('');
    html = firstOption;
    $.each(cities, function(index, value) {
      return html += '<option value="' + value['id'] + '">' + value['name'] + '</option>';
    });
    select.html(html);
    select.trigger('refresh');
    return MakeMapData('all');
  };

  GetJsonData = function() {
    return $.ajax({
      url: "js/mapdata.json"
    }).done(function(data) {
      //    console.log(data)
      SelectorMaker(data);
      return true;
    }).fail(function(error) {
      console.log(error);
      return null;
    });
  };

  MakeMapData = function(mapType) {
    var activeTab, city, mapData, markers, mode, options;
    activeTab = GetActiveTab();
    mode = activeTab.val();
    options = DATA[mode];
    markers = new Array();
    if (mapType === 'all') {
      $.each(options.cities, function(index, value) {
        return markers = markers.concat(value.points);
      });
      mapData = {
        "latitude": options.latitude,
        "longitude": options.longitude,
        "zoom": options.zoom,
        "markers": markers
      };
    } else {
      city = null;
      $.each(options.cities, function(index, value) {
        if (value.id === mapType) {
          city = value;
          return false;
        }
      });
      mapData = {
        "latitude": city.latitude,
        "longitude": city.longitude,
        "zoom": city.zoom,
        "markers": city.points
      };
    }
    //  console.log(mapData)
    return MapInit(mapData);
  };

  if (MapBlock.length > 0 && !DATA) {
    GetJsonData();
  }

  $('.tabs-row input').change(function() {
    return SelectorMaker();
  });

  select.change(function(event) {
    //  console.log($(event.target).val())
    return MakeMapData($(event.target).val());
  });

  viewSwitcher = $('#viewSwitcher');

  viewSwitcher.types = viewSwitcher.find('input[type=radio]');

  viewSwitcher.wraps = $('.view-type-wrap');

  ViewChecker = function() {
    $.each(viewSwitcher.wraps, function(index, value) {
      return $(value).hide();
    });
    return $.each(viewSwitcher.types, function(index, value) {
      var id;
      if ($(value).prop('checked')) {
        id = '#' + $(value).prop('id') + '_wrap';
        return $(id).show();
      }
    });
  };

  viewSwitcher.types.on('click', function(event) {
    return ViewChecker();
  });

  $(viewSwitcher.types[1]).prop('checked', true);

  ViewChecker();

}).call(this);

//# sourceMappingURL=script.js.map
