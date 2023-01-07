(function() {
	var _mainArt = abc.object.createNestedObject(window,"abc.main.art");
	var mainSwiper, mainAllBannerSwiper;
	// s : 硫붿씤 �쇰뱶 由ъ뒪��
	var feedList, feedDummy, feedListMasonry, feedListResizeSensor;

	_mainArt.benefitIssueRunning = false;
	_mainArt.liveBannerId;

	/**
	 * 珥덇린��
	 */
	_mainArt.init = function() {
		_mainArt.mainSwiper();
		_mainArt.feed();
		_mainArt.event();

		_mainArt.setLiveBannerCountDown();
		feedListBtnViewMore();
		snsListBtnViewMore();
		_mainArt.getLiveInfo(); 
	}

	/**
	 * �대깽��
	 */
	_mainArt.event = function() {

		//��궧  tab
		$(document).on('click', '.btn-ranking-toggle', function(param) {

			var tabGbn;
			var searchType;

			if ($(this).hasClass('real-time')) {//�ㅼ떆媛�
				$('#real-time').addClass('active');
				$('#week').removeClass('active');

				tabGbn = 'R';
				searchType = 'V';

			} else {//二쇨컙
				$('#real-time').removeClass('active');
				$('#week').addClass('active');

				tabGbn = 'W';
				searchType = 'P';
			}

			$.ajax({
				type :"get",
				url : "/display/main/ranking",
				data :  {
					'tabGbn' : tabGbn,
					'searchType' : searchType
				}
			})
			.done(function(data){
				$('.a-rt-ranking-wrap').empty();
				$('.a-rt-ranking-wrap').append(data);

				var swiperRanking = new Swiper('.a-rt-ranking-wrap .ranking-prod-list-wrap', {
					slidesPerView: 5,
					slidesPerGroup: 5,
					spaceBetween: 30,
					speed: 750,
					allowTouchMove: false,
					navigation: {
						prevEl: '.ranking-prod-list-wrap + .btn-wrap .btn-ranking-swiper.prev',
						nextEl: '.ranking-prod-list-wrap + .btn-wrap .btn-ranking-swiper.next',
					},
				});
			})
			.fail(function(e){
				 console.log(e);
			});

		});

		//sns 異붽�
		$(document).on('click', '#sns-btn-view-more', function(param) {
			var snsListCnt = $('.insta-img-list');
			var snsCnt = $('#snsCnt').val() ;
			$.ajax({
				type :"get",
				url : "/display/sns",
				data :  {
					'startYn' : 'N',
					'snsCnt' : snsCnt,
					'snsListCnt' : snsListCnt.find('li').length
				}
			})
			.done(function(data){
				$('.insta-img-list').append(data);
				abc.namespace.front.frontOffice.setUIDialog('.ui-dialog-contents', '');

				// s : A-RT 硫붿씤 SNS �앹뾽  �ㅼ��댄띁
				$('.sns-detail-img-wrap:not(.init)').each(function(index) {
					var imgWrap;
					imgWrap = $(this);
					// s : A-RT 硫붿씤 SNS �앹뾽 �� �대�吏� �ㅼ��댄띁
					if(imgWrap.find('.swiper-slide').length > 1){
						var artSnsImgSwiper = new Swiper(imgWrap.find('.swiper-container'), {
							init: false,
							slidePerView: 1,
							allowTouchMove: false,
							navigation: {
								nextEl: imgWrap.find('.btn-sns-detail-img.next'),
								prevEl: imgWrap.find('.btn-sns-detail-img.prev'),
							},
							pagination: {
								el: imgWrap.find('.sns-detail-img-nav .sns-detail-img-pagination'),
								type: 'fraction',
								formatFractionCurrent: function (number) {
									return abc.namespace.front.frontOffice.setPrependZero(number, 2);
								},
								formatFractionTotal: function (number) {
									return abc.namespace.front.frontOffice.setPrependZero(number, 2);
								},
								renderFraction: function (currentClass, totalClass) {
									return '<span class="' + currentClass + '"></span>' +
										' - ' +
										'<span class="' + totalClass + '"></span>';
								},
							},
						});
						artSnsImgSwiper.on('init', function () {
							this.$el.closest('.sns-detail-img-wrap').addClass('init');
						});
						artSnsImgSwiper.on("slideChangeTransitionEnd", function () {
								var prevSlide, prevSlidevideo, btnVideoPlay;
								prevSlide = this.slides[artSnsImgSwiper.previousIndex];

								if ($(prevSlide).find('video').length > 0) {
									prevSlidevideo = $(prevSlide).find('video')[0];
									btnVideoPlay = $(prevSlide).find('.btn-video-cover');

									btnVideoPlay.removeClass('is-play');
									prevSlidevideo.pause();
									prevSlidevideo.currentTime = 0;
								}
							}
						).on("slideChange", function () {
							var pagination;
							pagination = $(this.pagination.el).parent();

							pagination.removeClass('is-play');
						});
						artSnsImgSwiper.init();

						// �대�吏� �곸뿭 留덉슦�� �ㅻ쾭 �� �щ씪�대뱶 prev/next 踰꾪듉 �몄텧
						$('.sns-detail-img-wrap').on('mouseenter', function(){
							$(this).addClass('is-hover');
						}).on('mouseleave', function(){
							$(this).removeClass('is-hover');
						});
					}
					imgWrap.find('.swiper-slide').each(function () {
						// �숈쁺�� ���낆씪 寃쎌슦 pagination, play btn �쒖뼱 (play-誘몃끂異� / pause-�몄텧)
						var btnVideoPlay, pagination;
						btnVideoPlay = $(this).find('.btn-video-cover');
						pagination = $(this).closest('.sns-detail-img-wrap').find('.sns-detail-img-nav');

						if ($(this).find('video').length > 0) {
							var video = this.querySelector('video');

							btnVideoPlay.off('click').on('click', function (event) {
								event.preventDefault();
								$(this).toggleClass('is-play');

								if (!$(this).hasClass('is-play')) {
									pagination.removeClass('is-play');
									video.pause();
								} else {
									pagination.addClass('is-play');
									video.play();
								}
							});
						}
					});
					// e : A-RT 硫붿씤 SNS �앹뾽 �� �대�吏� �ㅼ��댄띁

					// s :  A-RT 硫붿씤 SNS �앹뾽 �� 愿��� �곹뭹 �ㅼ��댄띁
					if (imgWrap.siblings('.sns-detail-info-wrap').find('.sns-related-prd-box .swiper-container').length > 0) {
						var swiperSnsRelatedPrd = new Swiper(imgWrap.siblings('.sns-detail-info-wrap').find('.sns-related-prd-box .swiper-container'), {
							slidesPerView: 'auto',
							speed: 500,
							slideClass: 'prod-item',
							navigation: {
								prevEl: '.sns-related-prd-box .nav-box .btn-swiper.prev',
								nextEl: '.sns-related-prd-box .nav-box .btn-swiper.next',
							},
						});
					}

					snsListBtnViewMore();
				});
				// e :  A-RT 硫붿씤 SNS �앹뾽  �ㅼ��댄띁

			})
			.fail(function(e){
				 console.log(e);
			});

		});

		$('.contents-wrap.main-a-rt-adv .banner-feed-wrap .btn-view-more').on('click', function(event) {
			feedListAddBox();
		});
		
		$("#benefitIssue").click(function(){
			
			if(!window.abc.loginCheck()) {
				alert('濡쒓렇�� �댁＜�쒓린 諛붾엻�덈떎.');
				location.href = '/login';
			} else {
				//_mainArt.getLiveInfo();
				$('#dialogLiveAlarmBtn').trigger('click');
			}
		});
		
		//�쇱씠釉� �뚮┝ �좎껌
		$("#liveAlarmRequest").click(function(){
			var nightSmsRecvYn, hdphnNoText ;
			if(!window.abc.loginCheck()) {
				alert('濡쒓렇�� �댁＜�쒓린 諛붾엻�덈떎.');
				location.href = '/login';
			} else {

				if (abc.text.allNull($('#hdphnNoText').val())) {
					alert('�꾪솕踰덊샇 �낅젰 �댁＜�몄슂.')
					return false;
				}
				if(!abc.text.isPhoneNum($('#hdphnNoText').val())){
					alert("�뺥솗�� �대��곕쾲�몃� �낅젰�섏꽭��")
					return false;
				}
				//�좏깮�ы빆�쇰줈 二쇱꽍
				/*if(!$('#chkAgree01').is(":checked")){
					alert('�뚮┝ 諛쏄린 �숈쓽 �댁＜�몄슂.')
					return false;
				}*/


				var parameter = {
						"liveBannerId" : _mainArt.liveBannerId,
						"hdphnNoText" : $('#hdphnNoText').val(),
						"alertBenefitYn" : $('#alertBenefitYn').val(),
						"nightSmsRecvYn" : 'Y'
						};
				_mainArt.benefitIssue(parameter);
			}
		});
		
		//�쇱씠釉� �뚮┝ �좎껌�� �뺤씤 蹂�寃쎌쑝濡� reload 蹂�寃� 泥섎━
		$(".artLiveCloseBtn").click(function(){
			$("#benefitIssue").hide();// �뚮┝諛쏄린
			$("#benefitIssueActive").show(); // �뚮┝�꾨즺
			
			var source = "#"+$(this).data("source");
			$(source).dialog("close");
		});
		
	}


	_mainArt.mainSwiper = function() {
		try{
			if ($('.main-banner-list-wrap ul li').length > 1) {
				mainSwiper = new Swiper('.main-banner-list-wrap', {
					init: false,
					slidesPerView: 1,
					spaceBetween: 0,
					speed: 500,
					loop: true,
					allowTouchMove: false,
					navigation: {
						prevEl: '.main-banner-list-wrap + .btn-wrap .btn-main-banner.prev',
						nextEl: '.main-banner-list-wrap + .btn-wrap .btn-main-banner.next',
					},
					autoplay: {//20210813 add
						/*
						 * 硫붿씤諛곕꼫諛곕꼫 �먮룞 濡ㅻ쭅 �쒓컙�ㅼ젙(湲곕낯 �대�吏� �몃옖吏��� �쒓컙 4000(pc)/3000(mo)
						 * �곸긽�ㅼ뼱媛덈븣 �뱀젙 �щ씪�대뱶�� �쒓컙 吏��뺤씠 媛��ν븿
						 * "swiper-slide" �� data-swiper-autoplay="12000" << attr 異붽��꾩슂(�섎떒 留덊겕�낆뿉 二쇱꽍 援щЦ �ъ븘�볦쓬)
						 * �곸긽 �쒓컙 ms + 4000ms 異붽� �꾩슂 (�대�吏� �몃옖吏��� �쒓컙�� 3.4珥� �뺣룄)
						 * Warring : �먮룞 濡ㅻ쭅 諛� �쒕갑�μ쑝濡� 吏��띿쟻�쇰줈 �섍만�� swiper 醫뚰몴媛� �쒕쾲�� 寃뱀퀜吏��� �몃뜳�ㅻ줈 �먰봽�섍쾶��
						 * 洹명쁽�곸쑝濡� �쒓컙�곸쑝濡� �ㅼ��댄띁媛� 源쒕묀 �좊븣媛� �덉쓬 (�쒕괌�μ쑝濡� �쒕컮�� �댁긽 �뚮븣 �뺤씤 媛��ν븿)
						 * */
						delay: 4000,
					},
				});
				
				mainSwiper.on('init', function () {
					if (mainSwiper.slides[0].querySelector('video')) {
						mainSwiper.slides[0].querySelector('video').play();
					}
					
					//20210813 params add
					Array.from(mainSwiper.slides).forEach(function (slide, index) {
						slide.setAttribute( 'data-idx', index );//20210813 add 珥덇린�� �� 蹂듭궗�щ씪�대뱶 �ы븿�섏뿬 elements �쒖꽌 湲곗��쇰줈 index 遺���
						
						var video;
						video = slide.querySelector('video');
						
						if (video) {
							video.addEventListener('ended', function() {
								$(video).closest('.swiper-slide').addClass('video-ended transition');
							});
						}
					});
				});
				
				mainSwiper.on('beforeTransitionStart', function () {
					var video;
					video = mainSwiper.slides[mainSwiper.previousIndex].querySelector('video');
					
					if (video) {
						video.pause();
					}
				});
				
				//S:20210813 update
				mainSwiper.on('slideChangeTransitionEnd', function () {
					// �댁쟾 �ъ깮以묒씠�� �щ씪�대뱶 紐⑥뀡 由ъ뀑
					var elActiveIdx = mainSwiper.slides[mainSwiper.activeIndex].getAttribute('data-idx');//蹂듭궗蹂명룷�⑦븳 get el idx
					$(mainSwiper.slides).each(function( index ) {
						//loop �묒뾽�섎㈃�� 蹂듭궗�� 而⑦뀗痢좎씪�� �몃뜳�� �섎せ媛��몄샂 - �쒖꽦�붾맂 而⑦뀗痢� 鍮쇨퀬 �꾩껜 由ъ뀑�쒗궡 210810 by han
						var video2 = mainSwiper.slides[index].querySelector('video');
						
						if( index != elActiveIdx ){
							if ( video2 ){
								//鍮꾨뵒�ㅺ� �덉쓣�� 紐⑥뀡 ��젣
								mainSwiper.slides[index].classList.remove('video-ended', 'transition');
								video2.pause();
								/*S:20210823-2 update*/
								if(!$(mainSwiper.slides[index]).hasClass('swiper-slide-duplicate')){
									video2.load();//20210823 �섏젙;
									video2.pause();
								}
								/*E:20210823-2 update*/
							}else{
								mainSwiper.slides[index].classList.remove('transition');
							}
						}
					});
					
					var activeslide, video;
					activeslide = mainSwiper.slides[mainSwiper.activeIndex];
					video = activeslide.querySelector('video');
					
					if (video) {
						//console.log("play", $(activeslide).hasClass('swiper-slide-duplicate'));
						
						//video && 蹂듭궗蹂몄씪�뚮뒗 由ъ뼹�몃뜳�ㅻ줈 �꾩튂 蹂�寃쏀빐以���
						if($(activeslide).hasClass('swiper-slide-duplicate')){
							mainSwiper.slideToLoop(mainSwiper.realIndex, 1, false);
							video = mainSwiper.slides[mainSwiper.activeIndex].querySelector('video');
						}
						video.play();
					}
					else if (!video) {
						mainSwiper.slides[mainSwiper.activeIndex].classList.add('transition');
					}
					//realindex濡� 媛덈븣 �먮룞濡ㅻ쭅 false 泥섎━�섎�濡� �ㅼ떆 �ъ깮�꾩슂
					if ( !mainSwiper.autoplay.running ) mainSwiper.autoplay.start();
				});
				//E:20210813 update
				
				mainSwiper.init();
				
				mainAllBannerSwiper = new Swiper('.all-banner-list-wrap', {
					slidesPerView: 4,
					slidesPerColumn: 2,
					spaceBetween: 20,
					scrollbar: {
						el: '.all-banner-list-wrap + .swiper-scrollbar',
						// type: 'progressbar',
					},
				});
			}
		}catch(e){
			console.log("_mainArt.mainSwiper : " + e);
		}
	}

	_mainArt.feed = function() {
		feedList = $('.contents-wrap.main-a-rt-adv .banner-feed-wrap .feed-list-wrap .feed-list');
		feedDummy = $('.contents-wrap.main-a-rt-adv .banner-feed-wrap .feed-list-wrap .feed-dummy-box');
		feedListMasonry = feedList.masonry({
			itemSelector: '.feed-item',
			transitionDuration: 0,
		});

		feedList.find('.feed-item').imagesLoaded().progress(function (instance, image) {
			feedListMasonry.masonry();
		})

		feedListMasonry.on( 'layoutComplete', function() {
			var feedLastBottom, feedLastItem;
			feedLastBottom = -1;
			feedList.find('.feed-item').removeClass('feed-last');
			feedList.find('.feed-item').each(function (index) {
				if (parseInt($(this).css('top')) + $(this).outerHeight() >= feedLastBottom) {
					feedLastBottom = parseInt($(this).css('top')) + $(this).outerHeight();
					feedLastItem = $(this);
				}

				if (parseInt($(this).css('left')) === 0) {
					$(this).addClass('feed-left');
				}
				else {
					$(this).removeClass('feed-left');
				}
			});

			if (feedLastItem) {
				var feedLastPrevItem;
				feedLastPrevItem = feedLastItem.prev();
				feedLastItem.addClass('feed-last');
				if (parseInt(feedLastPrevItem.css('top')) + feedLastPrevItem.outerHeight() === feedLastBottom) {
					feedLastPrevItem.addClass('feed-last');
				}
			}

			if (feedList.find('.feed-item:not(.feed-left)').length > 0) {
				$('.feed-item.type-live .live-on-fixed').css('left', feedList.find('.feed-item:not(.feed-left)').eq(0).offset().left - 65);
				$('.feed-item.type-live .live-on-fixed').css('right', '');
			}
			else {
				$('.feed-item.type-live .live-on-fixed').css('left', '');
			}
			// 210512 怨좊룄�� 異붽� : Live on offset 怨꾩궛 �⑥닔 �ㅽ뻾 肄붾뱶 異붽�
			setLiveOnSpsOffset();
		});

		setFeedBannerSwiper(feedList[0].querySelectorAll('.feed-item .banner-box.swiper-container'));
		setFeedReachedEndObserver();
		setLiveOnSpsOffset();

		// 210602 怨좊룄�� �섏젙 : A-RT 硫붿씤�� Marquee �ㅽ겕由쏀듃 怨듯넻 肄붾뱶濡� 蹂�寃�
		abc.namespace.front.frontOffice.setMarquee('.contents-wrap.main-a-rt-adv .marquee-wrap');

		var swiperRanking = new Swiper('.a-rt-ranking-wrap .ranking-prod-list-wrap', {
			slidesPerView: 5,
			slidesPerGroup: 5,
			spaceBetween: 30,
			speed: 750,
			allowTouchMove: false,
			navigation: {
				prevEl: '.ranking-prod-list-wrap + .btn-wrap .btn-ranking-swiper.prev',
				nextEl: '.ranking-prod-list-wrap + .btn-wrap .btn-ranking-swiper.next',
			},
		});
	}
	// DESC : �쇰뱶 由ъ뒪�몄뿉 View More �대┃�섏뿬 �쇰뱶 異붽��� masonry瑜� �듯빐 異붽�/ �덉씠�꾩썐 �ъ꽕�뺤쓣 �댁쨾�� ��

	//�쇱씠釉뚮같�� �쒖옉�� �쒓컙 移댁슫�� 
	_mainArt.setLiveBannerCountDown = function(){

		setInterval(function() {
			$('.play-time.liveAfter').each(function(i, v) {
				var data = $(this).data();

				var now = new Date();
				var eDay = data.endTime.split(" ");
				var eYmd = eDay[0].split(".");
				var eHis = eDay[1].split(":");
				var end = new Date(eYmd[0], eYmd[1]-1, eYmd[2], eHis[0], eHis[1], eHis[2]);

				var _second = 1000;
				var _minute = _second * 60;
				var _hour = _minute * 60;
				var _day = _hour * 24;

				var distance = now - end ;

				var hours = Math.floor(distance / _hour);
				var minutes = Math.floor((distance % _hour) / _minute);
				var seconds = Math.floor((distance % _minute) / _second);

				hours = hours.toString().length < 2 ? "0" + hours : hours;
				minutes = minutes.toString().length < 2 ? "0" + minutes : minutes;
				seconds = seconds.toString().length < 2 ? "0" + seconds : seconds;

				$(this).text(hours+':'+minutes+':'+seconds);
			});
		}, 1000);
	}
	
	
	/**
	 * �쇱씠釉� 諛곕꼫 �뺣낫 議고쉶 
	 */
	_mainArt.getLiveInfo = function() {
		
		$.ajax({
			type :"post",
			url : "/display/live/info",
			dataType : "json"
		}).done(function(data){
			// 諛곕꼫 �뺣낫 議고쉶 
			// �뚮┝ 諛쏄린 �쒖뼱 
			if(abc.text.allNull(data.liveInfo) || data.liveInfo == undefined ){
				//�뚮┝ 諛쏄린 踰꾪듉 
				$("#benefitIssue").hide();
				$("#benefitIssueActive").hide(); // �뚮┝�꾨즺
			}else{
				_mainArt.liveBannerId = data.liveInfo.liveBannerId;
				var alertYn = data.liveInfo.alertYn;
				if(alertYn =="Y") {
					$("#benefitIssue").hide();// �뚮┝諛쏄린
					$("#benefitIssueActive").show(); // �뚮┝�꾨즺
				}else{
					$("#benefitIssue").show();// �뚮┝諛쏄린
					$("#benefitIssueActive").hide(); // �뚮┝�꾨즺
				}
			}
		})
		.fail(function(e){
			console.log("�쇱씠釉� �뺣낫 議고쉶 �ㅻ쪟 ");
		});
	}
	
	_mainArt.benefitIssue = function(parameter) {

		if(_mainArt.benefitIssueRunning){
			console.log("荑좏룿�� 諛쒓툒�섎뒗 以묒엯�덈떎.");
		}
		// �쇱씠釉� 踰덊샇
		//var liveBannerId = $("#liveBannerId").val();

		$.ajax({
			type :"post",
			url : "/display/live/liveInform",
			dataType : "json",
			async : false ,
			data : parameter,
			beforeSend : function(xhr, opts) {
				_mainArt.benefitIssueRunning = true;
			}
		}).done(function(d){
			_mainArt.benefitIssueResult(d);

		})
		.fail(function(e){
			console.log("e : " + JSON.stringify(e));
			alert("諛쒓툒以� �먮윭媛� 諛쒖깮�섏��듬땲��.")
		})
		.always(function(e) {
			_mainArt.benefitIssueRunning = false;	// �ㅽ듃�뚰겕 �ъ슜 �꾨즺泥섎━
		});
	}


	_mainArt.benefitIssueResult = function(data) {

		switch(data.benefitType) {
		case 'C':

			var ul = $("#dialogLiveAlarmCouponMultiUl");
			ul.find("li").remove();
			data.couponList.forEach(function(value){
				var couponDayText = value.limitDay == '0' ? 'D-'+ value.limitDay : 'D' + value.limitDay;
				var html;
					html += "<li class='swiper-slide'>";
					html += "<div class='coupon-item-large'>";
					if(value.usePlaceGbnType == 'O') {
						html += "<span class='coupon-use-channel'>ONLINE</span>";
					} else if(value.usePlaceGbnType == 'F') {
						html += "<span class='coupon-use-channel'>OFFLINE</span>";
					} else {
						html += "<span class='coupon-use-channel'>ONLINE,OFFLINE</span>";
					}
					html += "<span class='coupon-name'>"+ value.cpnName +"</span>";
					if(value.dscntValue != 0 && value.dscntValue != '') {
						html += "<span class='coupon-info'><span class='num black'>"+abc.text.isMakeComma(value.dscntValue) + (value.dscntType == 'R' ? '%' : '')+"</span> <span class='unit'>"+(value.dscntType == 'R' ? '�좎씤' : '��')+"</span></span>";
					} else {
						$('#numberSpan').text(value.cpnTypeCodeName.replace('荑좏룿', ''));
						html += "<span class='coupon-info'><span class='num black'>5%</span> <span class='unit'>�좎씤</span></span>";
					}
					if(value.minLimitSellAmt != ''){
						html += "<span class='coupon-condition'>"+abc.text.isMakeComma(value.minLimitSellAmt) + ' �� �댁긽 援щℓ �� (�쇰� �곹뭹 �쒖쇅)'+"</span>";
					}
					var couponDayText = value.limitDay == '0' ? 'D-'+ value.limitDay : 'D' + value.limitDay;
					html += "<span class='coupon-day-text'>"+couponDayText+"</span>";
					html += "</div>";
					html += "</li>";

					ul.append(html);


			});
			if ($('#dialogLiveAlarmCouponMulti .swiper-container').find('.swiper-slide').length > 1) {
				var swiper = new Swiper('#dialogLiveAlarmCouponMulti .swiper-container', {
					slidesPerView: 'auto',
					scrollbar: {
						el: document.querySelector('#dialogLiveAlarmCouponMulti .swiper-container .swiper-scrollbar'),
					},
				});
			}
			$(".ui-icon-closethick").trigger('click');
			$('#dialogLiveAlarmCouponMultiBtn').trigger('click');
			break;
		case 'P':

			var ul = $("#dialogLiveAlarmCouponMultiUl");
			ul.find("li").remove();
			var html;
				html += "<li class='swiper-slide'>";
				html += "	<div class='coupon-item-large'>";
				html += "		<span class='coupon-name'>�꾧툑泥섎읆 �ъ슜 媛��ν븳</span>";
				html += "		<span class='coupon-info'><span class='num black'>"+abc.text.isMakeComma(data.pointIssue)+"</span> <span class='unit'>P</span></span>";
				html += "	</div>";
				html += "</li>";
				ul.append(html);
			if ($('#dialogLiveAlarmCouponMulti .swiper-container').find('.swiper-slide').length > 1) {
				var swiper = new Swiper('#dialogLiveAlarmCouponMulti .swiper-container', {
					slidesPerView: 'auto',
					scrollbar: {
						el: document.querySelector('#dialogLiveAlarmCouponMulti .swiper-container .swiper-scrollbar'),
					},
				});
			}
			$(".ui-icon-closethick").trigger('click');
			$('#dialogLiveAlarmCouponMultiBtn').trigger('click');
			break;
		default:
			$(".ui-icon-closethick").trigger('click');
			$('#dialogLiveAlarmCompleteBtn').trigger('click');
			break;
		}

		$('.btn-roulette-start').prop('disabled', false);
	}
	
	
	$(function() {
		_mainArt.init();
	});

	//btn-view-more �몄텧 �щ�
	function feedListBtnViewMore() {
		var feedListCnt = $('.feed-list');
		var feedCnt = $('#feedCnt').val() ;
		if(feedListCnt.find('.feed-item').length >= 50){ //feed諛곕꼫媛� 50 �댁긽�쇨꼍�� 異붽� 踰꾪듉 hide
			$('#feedBtn').hide();
		}else if(feedListCnt.find('.feed-item').length >= feedCnt){ //feed諛곕꼫媛� 珥� 媛쒖닔 �댁긽�쇨꼍�� 異붽� 踰꾪듉 hide
			$('#feedBtn').hide();
		}
	}
	//btn-view-more �몄텧 �щ�
	function snsListBtnViewMore() {
		//�몄뒪�� 珥앷갗�섏� �몄텧 媛�닔媛� 媛숇떎硫� �붾낫湲� 誘몃끂異�
		var snsListCnt = $('.insta-img-list');
		var snsCnt = $('#snsCnt').val() ;

		if(snsListCnt.find('li').length >= 30){
			$('#sns-btn-view-more').hide();
		}else if(snsListCnt.find('li').length >= snsCnt){ //sns媛� 珥� 媛쒖닔 �댁긽�쇨꼍�� 異붽� 踰꾪듉 hide
			$('#sns-btn-view-more').hide();
		}
	}

//feed�� 異붽�
	function feedListAddBox() {
		var originScrollY, boxes;
		var feedListCnt = $('.feed-list');
		var feedCnt = $('#feedCnt').val() ;
		originScrollY = window.pageYOffset;

		if(feedListCnt.find('.feed-item').length >= 50){ //feed諛곕꼫媛� 50 �댁긽�쇨꼍�� 異붽� 踰꾪듉 hide
			$('#feedBtn').hide();
			return false;
		}else if(feedListCnt.find('.feed-item').length >= feedCnt){ //feed諛곕꼫媛� 珥� 媛쒖닔 �댁긽�쇨꼍�� 異붽� 踰꾪듉 hide
			$('#feedBtn').hide();
			return false;
		}

		$.ajax({
			type :"post",
			url : "/display/feed",
			data :  {
				'startYn' : 'N',
				'feedCnt' : feedCnt,
				'feedListCnt' : feedListCnt.find('.feed-item').length,
				'feedPageCnt' : $("input[name='view-more-feed']").length + 1
			}
		})
		.done(function(data){
			feedListMasonry.masonry().append($(data));
			setTimeout(function(){
				feedListMasonry.masonry( 'reloadItems');
				feedListMasonry.masonry('layout');

				setFeedBannerSwiper(feedList[0].querySelectorAll('.feed-item .banner-box.swiper-container'));
				window.scroll(window.pageXOffset, originScrollY);
				$(window).trigger('scroll');
			}, 90);

			feedListBtnViewMore();
		})
		.fail(function(e){
			 console.log(e);
		});

	}


	function setFeedBannerSwiper(newBannerBoxes) {

		newBannerBoxes.forEach(function(item, index) {
			var options;
			options = {
				init: false,
				slidesPerView: 1,
				speed: 750,
				allowTouchMove: false,
			};

			if (item.querySelector('.feed-swiper-handle-box')) {
				options.navigation = {
					prevEl: item.querySelector('.btn-feed-navi.prev'),
					nextEl: item.querySelector('.btn-feed-navi.next'),
				};
				options.pagination = {
					el: item.querySelector('.feed-pagination'),
				};
			}
			else {
				options.loop = true;
				options.autoplay = {
					delay: 3000,
					waitForTransition: true,
				};
			}

			if (item.querySelectorAll('.swiper-slide').length > 1) {
				item.swiper = new Swiper(item, options);
				item.swiper.on('init', function (event) {
					if (!item.querySelector('.feed-swiper-handle-box')) {
						item.swiper.autoplay.stop();
						setTimeout(function () {
							item.swiper.autoplay.start();
						}, 1000 * index);
						item.style.width = item.querySelector('.swiper-slide').style.width;//20210813 add
					}
				});
				/*S:20210813 add :: 媛�蹂�泥섎━濡� �뚯닔�먯씪�� �댁쟾 slider 1px �먯졇�섏샂*/
				item.swiper.on('beforeResize', function(){
					$(this.wrapperEl).parent().css('width', 'auto');
				});
				item.swiper.on('resize', function(){
					//$(this.wrapperEl).parent().css('width', $(this)[0].width);

					item.style.width = item.querySelector('.swiper-slide').style.width;
				});
				/*E:20210813 add :: 媛�蹂�泥섎━濡� �뚯닔�먯씪�� �댁쟾 slider 1px �먯졇�섏샂*/
				item.swiper.init();
			}
		});
	}


	// 210726 �섏젙 : 硫붿씤 諛곕꼫 fixed 怨꾩궛 �ㅽ겕由쏀듃 intersectionObserver�먯꽌 scroll濡� �섏젙
	function setFeedReachedEndObserver() {
		var feedEndObserver, interSectionObserver;

		feedEndObserver = document.querySelector('.contents-wrap.main-a-rt-adv .banner-feed-wrap .feed-list-wrap .feed-end-observer');

		/*
		interSectionObserver = new IntersectionObserver(function (entries, observer) {
			entries.forEach(function (entry) {
				var isIntersecting;
				// console.log('interSectionObserver', entry.isIntersecting, entry.boundingClientRect.y);

				isIntersecting = entry.isIntersecting || !entry.isIntersecting && entry.boundingClientRect.y < 0;
				toggleFeedIntersectingHandler(isIntersecting);
			});
		}, {
			threshold: [0, 1],
		});

		interSectionObserver.observe(feedEndObserver);
		*/

		$(window).on('scroll resize', function() {
			// console.log(feedEndObserver, feedEndObserver.getBoundingClientRect().top);
			if ((feedEndObserver.getBoundingClientRect().top - window.innerHeight) < 0) {
				toggleFeedIntersectingHandler(true);
			}
			else {
				toggleFeedIntersectingHandler(false);

			}
		});
	}

	function toggleFeedIntersectingHandler(isIntersecting) {
		var bannerFeedWrap;
		bannerFeedWrap = $('.contents-wrap.main-a-rt-adv .banner-feed-wrap')
		if (isIntersecting) {
			bannerFeedWrap.addClass('reached-end');
		}
		else {
			bannerFeedWrap.removeClass('reached-end');
		}
	}

	// 210512 怨좊룄�� �섏젙 : �ㅽ겕濡ㅼ떆 �쇱씠釉� �쇰뱶 �몄텧�� �꾪븳 offset 怨꾩궛�� �⑥닔�� 諛� 肄붾뱶 �섏젙
	function setLiveOnSpsOffset() {
		var feedLiveItem;
		feedLiveItem = $('.feed-list .type-live');
		if (feedLiveItem && feedLiveItem.hasClass('live-on')) {
			feedLiveItem.attr('data-sps-offset', parseInt(feedLiveItem.find('.live-img-wrap').outerHeight() + feedLiveItem.find('.live-img-wrap').offset().top - 100));
		}
	}

	// e : 硫붿씤 �쇰뱶 由ъ뒪
})();