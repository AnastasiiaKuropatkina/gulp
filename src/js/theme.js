(function($){
  $(document).ready(function(){

    // Page animation

    $(".animsition").animsition({
      inClass: 'zoom-in-sm',
      outClass: 'zoom-out-sm',
      inDuration: 1000,
      outDuration: 500,
      linkElement: '.animsition-link',
      // e.g. linkElement: 'a:not([target="_blank"]):not([href^=#])'
      loading: true,
      loadingParentElement: 'body', //animsition wrapper element
      loadingClass: 'animsition-loading',
      loadingInner: '', // e.g '<img src="loading.svg" />'
      timeout: false,
      timeoutCountdown: 5000,
      onLoadEvent: true,
      browser: [ 'animation-duration', '-webkit-animation-duration'],
      // "browser" option allows you to disable the "animsition" in case the css property in the array is not supported by your browser.
      // The default setting is to disable the "animsition" in a browser that does not support "animation-duration".
      overlay : false,
      overlayClass : 'animsition-overlay-slide',
      overlayParentElement : 'body',
      transition: function(url){
        window.location.href = url;
      }
    });

    var $animsition = $('.animsition');
      $animsition.animsition()
        .one('animsition.inStart',function(){
          $('.header').toggleClass('show')
        })
        .one('animsition.outStart',function(){
          $('.header').toggleClass('show')
        });

    // Parallax 

    var $layer_0 = $('.layer-0'),
        $layer_1 = $('.layer-1'),
        $container = $('body'),
        container_w = $container.width(),
        container_h = $container.height();

    $(window).on('mousemove.parallax', function(event) {
      var pos_x = event.pageX,
          pos_y = event.pageY,
          left  = 0,
          top   = 0;

      left = container_w / 2 - pos_x;
      top  = container_h / 2 - pos_y;
      
      TweenMax.to(
        $layer_1, 
        1, 
        { 
          css: { 
            transform: 'translateX(' + left / 60 + 'px) translateY(' + top / 60 + 'px)' 
          }, 
          ease:Expo.easeOut, 
          overwrite: 'all' 
        });

      TweenMax.to(
        $layer_0, 
        1, 
        { 
          css: { 
            transform: 'translateX(' + left / 90 + 'px) translateY(' + top / 90 + 'px)' 
          }, 
          ease:Expo.easeOut, 
          overwrite: 'all' 
        });
      
    });

    // Upload file label 

    var inputs = document.querySelectorAll( '.file' );

    Array.prototype.forEach.call( inputs, function( input )
    {
      var label  = input.nextElementSibling,
        labelVal = label.innerHTML;

      input.addEventListener( 'change', function( e )
      {
        var fileName = '';
        if( this.files && this.files.length > 1 )
          fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
        else
          fileName = e.target.value.split( '\\' ).pop();
        if( fileName )
          label.querySelector( 'span' ).innerHTML = fileName;
        else
          label.innerHTML = labelVal;
      });
    });

    $.validator.addMethod("customemail", 
      function(value, element) {
          return /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i.test(value);
      }, 
      "Please enter a valid email address."
    ); 

    $.validator.addMethod("filesize", function(value, element, param) {
      var isOptional = this.optional(element),
          file;
      if (isOptional) {
          return isOptional;
      }
      
      if (element.files && element.files.length) {
          file = element.files;
          return ( element.value != '' && element.files[0].size <= param.max );
      }

    }, "Maximum file size 20MB" );

    var form = $('.order-form');
    var contactForm = $('.contact-us-form');
    var dbox = $('.dialog');

    form.on('submit', function(e) {
      e.preventDefault();
      form.validate({
        rules: {
          email: {
            required:  {
                    depends:function(){
                        $(this).val($.trim($(this).val()));
                        return true;
                    }   
                },
            customemail: true
          }
        },
      });

      $('#file').rules('add', {
        filesize: {
            max: 20971520
        }
      });

      if (form.valid()) {
        submitForm(form);
      }
    });

    contactForm.on('submit', function(e) {
      e.preventDefault();
      contactForm.validate({
        rules: {
          email: {
            required:  {
                    depends:function(){
                        $(this).val($.trim($(this).val()));
                        return true;
                    }   
                },
            customemail: true
          }
        },
      });
      if (contactForm.valid()) {
        submitForm(contactForm);
      }
    });

    $('input', $('.order-form')).blur(function(){
       form.validate({
        rules: {
          name: 'required',
          email: {
            required:  {
                    depends:function(){
                        $(this).val($.trim($(this).val()));
                        return true;
                    }   
                },
            customemail: true
          }
        },
      });
    });

    $('input', $('.contact-us-form')).blur(function(){
       contactForm.validate({
        rules: {
          name: 'required',
          message: 'required',
          email: {
            required:  {
                    depends:function(){
                        $(this).val($.trim($(this).val()));
                        return true;
                    }   
                },
            customemail: true
          }
        },
      });
    });

    function submitForm(form) {
      $("#contact-submit").prop('disabled', true);
      $.ajax({
        type: 'POST',
        processData: false,
        contentType: false,
        url: form.attr('action'),
        data: new FormData(form[0]),
        success: function(data) {
          if(data.error === false) {
            $('#name').val('');
            $('#email').val('');
            $('#message').val('');
            $("#contact-submit").prop('disabled', false);
            if (form.hasClass('order-form')) {
              $('.dialog .message').html('<h4>Thank you. We have received your order and will get in touch with you soon</h4>');
            } else {
              $('.dialog .message').html('<h4>Your message has been sent! We will contact you soon!</h4>');
            }
            dbox.toggleClass('show');
            showOverlay();
          } else {
            $('.dialog .message').html('<h4>Oops.. Something went wrong. Please try again later or call for us: <a href="tel:+1-855-856-6556" class="tel">1-855-856-6556</a></h4>');
            dbox.toggleClass('show');
            showOverlay();
          }
        }
      })
    };

    $('.pricing-more-info').on('click', function(){
      $('.dialog .message').html('<h4>VAT for EU customers</h4><div class="info"><div class="row"><div class="col-xs-8">Austria</div><div class="col-xs-4">20.00%</div></div><div class="row"><div class="col-xs-8">Belgium</div><div class="col-xs-4">21.00%</div></div><div class="row"><div class="col-xs-8">Bulgaria</div><div class="col-xs-4">20.00%</div></div><div class="row"><div class="col-xs-8">Croatia</div><div class="col-xs-4">25.00%</div></div><div class="row"> <div class="col-xs-8">Cyprus</div><div class="col-xs-4">19.00%</div></div><div class="row"> <div class="col-xs-8">Czech Republic</div><div class="col-xs">21.00%</div></div><div class="row"> <div class="col-xs-8">Denmark</div><div class="col-xs-4">25.00%</div></div><div class="row"> <div class="col-xs-8">Estonia</div><div class="col-xs-4">20.00%</div></div><div class="row"> <div class="col-xs-8">Finland</div><div class="col-xs-4">24.00%</div></div><div class="row"> <div class="col-xs-8">France</div><div class="col-xs-4">20.00%</div></div><div class="row"> <div class="col-xs-8">Germany</div><div class="col-xs-4">19.00%</div></div><div class="row"> <div class="col-xs-8">Greece</div><div class="col-xs-4">23.00%</div></div><div class="row"> <div class="col-xs-8">Hungary</div><div class="col-xs-4">27.00%</div></div><div class="row"> <div class="col-xs-8">Ireland</div><div class="col-xs-4">23.00%</div></div><div class="row"> <div class="col-xs-8">Italy</div><div class="col-xs-4">22.00%</div></div><div class="row"> <div class="col-xs-8">Latvia</div><div class="col-xs-4">21.00%</div></div><div class="row"> <div class="col-xs-8">Lithuania</div><div class="col-xs-4">21.00%</div></div><div class="row"> <div class="col-xs-8">Luxembourg</div><div class="col-xs-4">17.00%</div></div><div class="row"> <div class="col-xs-8">Malta</div><div class="col-xs-4">18.00%</div></div><div class="row"> <div class="col-xs-8">Netherlands</div><div class="col-xs-4">21.00%</div></div><div class="row"> <div class="col-xs-8">Poland</div><div class="col-xs-4">23.00%</div></div><div class="row"> <div class="col-xs-8">Portugal</div><div class="col-xs-4">23.00%</div></div><div class="row"> <div class="col-xs-8">Romania</div><div class="col-xs-4">20.00%</div></div><div class="row"> <div class="col-xs-8">Slovakia</div><div class="col-xs-4">20.00%</div></div><div class="row"> <div class="col-xs-8">Slovenia</div><div class="col-xs-4">22.00%</div></div><div class="row"> <div class="col-xs-8">Spain</div><div class="col-xs-4">21.00%</div></div><div class="row"> <div class="col-xs-8">Sweden</div><div class="col-xs-4">25.00%</div></div><div class="row"> <div class="col-xs-8">United Kingdom</div><div class="col-xs-4">20.00%</div></div></div>');
      dbox.toggleClass('show');
      showOverlay();
    });


    $(function(){
      $('.dialog-message.failed .message').html(' <h4 class="color-failed">Payment failed &#9785;</h4><div class="info"><p>Thank you for using our service.</p></div>');
      dbox.toggleClass('show');
      showOverlay();
    });

    $(function(){
      $('.dialog-message.successful .message').html(' <h4 class="color-successful">Payment successful!</h4><div class="info"><p>Thank you for using our service.</p></div>');
      dbox.toggleClass('show');
      showOverlay();
    });

    // Mobile button
    $('.mobile-button').on('touchstart click', function(e){
      if(e.type == "touchstart") {
        $(this).off('click');
        $(this).toggleClass('open');
      } else if(e.type == "click") {
          $(this).toggleClass('open');
      }
    })

    var pgurl = window.location.href.substr(window.location.href.lastIndexOf("/")+1);

      if (pgurl !== '') {
        $(".menu-list li").siblings().removeClass('active');
      }

      $(".menu-list a").each(function(){
        if($(this).attr("href") == pgurl ) 
          $(this).parent().addClass("active");
    });

    $('#testi-slider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true,
      speed: 200,
      infinite: false,
      prevArrow: '<button type="button" class="slick-prev"></button>',
      nextArrow: '<button type="button" class="slick-next"></button>'
    });

    function showOverlay() {
      $('.overlay').toggleClass('off');
    }

    $('.sample-button').on('click', function(){
      $('.dialog').toggleClass('show');
      showOverlay();
    });

    $('.popup-close').on('click', function(){
      $('.dialog').removeClass('show');
      $('.dialog-message').removeClass('show');
      showOverlay();
    });
    
    //Check to see if the window is top if not then display button

    $(window).scroll(function(){
      if ($(this).scrollTop() > 400) {
        $('.scroll-to-top').fadeIn();

      } else {
        $('.scroll-to-top').fadeOut();
      }
    });

    //Click event to scroll to top

    $('.scroll-to-top').click(function(){
      $('html, body').animate({scrollTop : 0},800);
      return false;
    });

    // Load youtube video on click 

    function youtubeVideoReplace() {
      var v = document.getElementsByClassName("youtube-player");
      for (var n = 0; n < v.length; n++) {
          var p = document.createElement("div");
          p.innerHTML = labnolThumb(v[n].dataset.id);
          p.onclick = labnolIframe;
          v[n].appendChild(p);
      }
    };

    youtubeVideoReplace();
       
    function labnolThumb(id) {
        return '<img class="youtube-thumb" src="//i.ytimg.com/vi/' + id + '/hqdefault.jpg"><div class="play-button"></div>';
    }
       
    function labnolIframe() {
        var iframe = document.createElement("iframe");
        iframe.setAttribute("src", "//www.youtube.com/embed/" + this.parentNode.dataset.id + "?autoplay=1&autohide=2&border=0&wmode=opaque&enablejsapi=1&controls=0&showinfo=0");
        iframe.setAttribute("frameborder", "0");
        iframe.setAttribute("id", "youtube-iframe");
        this.parentNode.replaceChild(iframe, this);
    }
  });
})(jQuery);