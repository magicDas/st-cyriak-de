/**
 * Javascript code that is associated with the front end of the calendar
 * version: 2.6.16
 */

jQuery(document).ready(function($){
	
	init();

	/**
	 * run these on page load
	 * @return void 
	 */
	function init(){
		init_run_gmap_openevc();
		fullheight_img_reset();	
	}

	// LIGHTBOX		
		// close popup
			$('body').on('click','.evolbclose', function(){	
				LIGHTBOX = 	$(this).closest('.evo_lightbox');
				closing_lightbox( LIGHTBOX );				
			});

		// close with click outside popup box when pop is shown	
			$(document).on('click', function(event) {
				//event.stopPropagation(); 
				//console.log($(event.target));
			    if( 
			    	$(event.target).hasClass('evo_content_inin')
			    ){
			    	closing_lightbox( $(event.target).closest('.evo_lightbox') );
			       	//console.log('5');
			    }
			});		
			function closing_lightbox( lightboxELM){
				
				if(! lightboxELM.hasClass('show')) return false;
				Close = (lightboxELM.parent().find('.evo_lightbox.show').length == 1)? true: false;
				lightboxELM.removeClass('show');

				setTimeout( function(){ 
					lightboxELM.find('.evo_lightbox_body').html('');
					
					if(Close){
						$('body').removeClass('evo_overflow');
						$('html').removeClass('evo_overflow');
					}
					
					// trigger action to hook in at this stage
						$('body').trigger('lightbox_event_closing',lightboxELM);
				}, 500);
			}

		// when lightbox open triggered
		$('body').on('evolightbox_show',function(){
			$('.evo_lightboxes').show();
			$('body').addClass('evo_overflow');
			$('html').addClass('evo_overflow');
		});
		
	// OPENING event card -- USER INTREACTION and loading google maps
		//event full description\		
		$('body').on('click','.eventon_events_list .desc_trig', function(event){
			
			var obj = $(this);
			var attr = obj.closest('.evo_lightbox').attr('data-cal_id');
			if(typeof attr !== typeof undefined && attr !== false){
				var cal_id = attr;
				var cal = $('#'+cal_id);
			}else{
				var cal = obj.closest('.ajde_evcal_calendar');
			}

			event_id = obj.closest('.eventon_list_event').data('event_id');
						
			var evodata = cal.find('.evo-data');

			// whole calendar specific values
			var cal_ux_val = evodata.data('ux_val');
			var accord__ = evodata.data('accord');
			
			// event specific values
			var ux_val = obj.data('ux_val');
			var exlk = obj.data('exlk');			
			
			// override overall calendar user intereaction OVER individual event UX
			if(cal_ux_val!='' && cal_ux_val!== undefined && cal_ux_val!='0'){
				ux_val = cal_ux_val;
			}

			//console.log(cal_ux_val+' '+ux_val);
			// open as lightbox
			if(ux_val=='3'){
				event.preventDefault();

				// set elements
				EVO_LIGHTBOX = $('.evo_lightbox.eventcard');
				LIGHTBOX_body = EVO_LIGHTBOX.find('.evo_lightbox_body');

				repeat_interval = parseInt(obj.closest('.eventon_list_event').data('ri'));
				repeat_interval = (repeat_interval)? repeat_interval: '0';
				
				// resets
					EVO_LIGHTBOX.find('.evo_pop_body').show();
					fullheight_img_reset();
					LIGHTBOX_body.html('');

				var event_list = obj.closest('.eventon_events_list');
				var content = obj.closest('.eventon_list_event').find('.event_description').html();
				var content_front = obj.html();
				
				var _content = $(content).not('.evcal_close');
				
				// RTL
				if(event_list.hasClass('evortl')){	
					EVO_LIGHTBOX.find('.evo_popin').addClass('evortl');	
					EVO_LIGHTBOX.addClass('evortl');
				}
			
				LIGHTBOX_body.append('<div class="evopop_top">'+content_front+'</div>').append(_content);
				LIGHTBOX_body.attr('class','evo_lightbox_body eventon_list_event evo_pop_body evcal_eventcard event_'+event_id +'_'+ repeat_interval);
				
				var this_map = LIGHTBOX_body.find('.evcal_gmaps');
				var idd = this_map.attr('id');
				this_map.attr({'id':idd+'_evop'});
				
				EVO_LIGHTBOX.addClass('show');
				$('body').trigger('evolightbox_show');

				obj.evoGenmaps({	
					'_action':'lightbox',
					'cal':cal,
					'mapSpotId':idd+'_evop'
				});

				
				fullheight_img_reset();    // added second reset

				// update border color
					bgcolor = $('.evo_pop_body').find('.evcal_cblock').attr('data-bgcolor');
					$('.evo_pop_body').find('.evopop_top').css({'border-left':'3px solid '+bgcolor});

				// trigger 
				$('body').trigger('evo_load_single_event_content',[ event_id, obj]);
				
				return false;

			// open in single events page -- require single event addon
			}else if(ux_val=='4'){
				
				if( obj.attr('href')!='' &&  obj.attr('href')!== undefined){
					return;
				}else{
					var url = obj.parent().siblings('.evo_event_schema').find('a').attr('href');
					if(obj.attr('target') == '_blank'){  window.open(url);}else{ window.open(url, '_self');}
					return false;
				}

			// open as external link
			}else if(ux_val=='2'){
				var url = obj.parent().siblings('.evo_event_schema').find('a').attr('href');
				//console.log(url);
				if(url !== undefined && url != ''){
					if(obj.attr('target') == '_blank'){  window.open(url);}else{ window.open(url, '_self');}					
				}
				return false;

			// do not do anything
			}else if(ux_val=='X'){
				return false;
			}else if(ux_val=='none'){
				return false;
			}else{
				
				// redirecting to external link
				if(exlk=='1' && ux_val!='1'){
					// if there is no href
					if( obj.attr('href')!='' &&  obj.attr('href')!== undefined){
						return;
					}else{
						var url = obj.siblings('.evo_event_schema').find('a').attr('href');
						if(obj.attr('target') == '_blank'){  window.open(url);}else{ window.open(url, '_self');}						
						return false;
					}
				// SLIDE DOWN eventcard
				}else{
					var click_item = obj.closest('.eventon_list_event').find('.event_description');
					if(click_item.hasClass('open')){
						click_item.slideUp().removeClass('open');
					}else{
						// accordion
						if(accord__=='1'){
							cal.find('.event_description').slideUp().removeClass('open');
						}
						click_item.slideDown().addClass('open');						
					}
					
					// This will make sure markers and gmaps run once and not multiples			
					if( obj.attr('data-gmstat')!= '1'){				
						obj.attr({'data-gmstat':'1'});							
						obj.evoGenmaps({'fnt':2});
					}	

					// trigger 
					$('body').trigger('evo_load_single_event_content',[ event_id, obj]);

					return false;
				}
			}
		});		

		// call to run google maps on load
			function init_run_gmap_openevc(delay){
				$('.ajde_evcal_calendar').each(function(){
					if($(this).find('.evo-data').data('evc_open')=='1'){
						$(this).find('.desc_trig').each(function(){
							if(delay!='' && delay !== undefined){							
								$(this).evoGenmaps({'fnt':2, 'delay':delay});
							}else{
								$(this).evoGenmaps({'fnt':2});							
							}
						});
					}
				});
			}
	
	// Click on event top items
		$('body').on('click','.evocmd_button', function(event){
			event.preventDefault();
			event.stopPropagation();

			href = $(this).data('href');			
			if( $(this).data('target')=='yes'){
				window.open(href,'_blank');
			}else{
				window.location = href;
			}

		});

	// GO TO TODAY
	// @since 2.3
		$('body').on('click','.evo-gototoday-btn', function(){
			var obj = $(this);
			var calid = obj.closest('.ajde_evcal_calendar').attr('id');
			var evo_data = $('#'+calid).find('.evo-data');

			evo_data.attr({
				'data-cmonth':obj.data('mo'),
				'data-cyear':obj.data('yr'),
			});

			$('body').trigger('evo_goto_today',[calid, evo_data]);

			ajax_post_content(evo_data.attr('data-sort_by'),calid,'none','today');
			obj.fadeOut();
		});

		$('body').on('evo_main_ajax', function(event, calendar, evodata, ajaxtype){

			if(ajaxtype != 'sorting' &&  ajaxtype != 'filering')
				calendar.find('.evo-gototoday-btn').fadeIn();
		});
		$('body').on('evo_main_ajax_complete', function(event, calendar, evodata){
			var today = calendar.find('.evo-gototoday-btn');
			// if focused month and year are same as current month and year hide the current month button
			if(evodata.attr('data-cmonth') == today.attr('data-mo') && evodata.attr('data-cyear') == today.attr('data-yr')){
				calendar.find('.evo-gototoday-btn').fadeOut();
			}			
		});

	// MONTH jumper
		$('.ajde_evcal_calendar').on('click','.evo-jumper-btn', function(){
			$(this).parent().siblings().find('.evo_j_container').slideToggle();
		});

		// select a new time from jumper
		$('.evo_j_dates').on('click','a',function(){
			var val = $(this).attr('data-val'),
				type = $(this).parent().parent().attr('data-val'),
				container = $(this).closest('.evo_j_container'),
				calOBJ = $(this).closest('.ajde_evcal_calendar');

			// resets 
				cal_resets(calOBJ);

			if(type=='m'){
				container.attr({'data-m':val});
			}else{
				container.attr({'data-y':$(this).html() });
			}

			// update set class
				$(this).parent().find('a').removeClass('set');
				$(this).addClass('set');

			if(container.attr('data-m')!==undefined && container.attr('data-y')!==undefined){
				
				var calid = calOBJ.attr('id');
				var evo_data = $('#'+calid).find('.evo-data');
				evo_data.attr({
					'data-cmonth':container.attr('data-m'),
					'data-cyear':container.attr('data-y'),
				});

				ajax_post_content(evo_data.attr('data-sort_by'),calid,'none','jumper');

				// hide month jumper if not set to leave expanded
				if(container.data('expj')=='no')
					container.delay(2000).slideUp();
			}
		});

		// change jumper values
		function change_jumper_set_values(cal_id){
			var evodata = $('#'+cal_id).find('.evo-data');
			var ej_container = $('#'+cal_id).find('.evo_j_container');
			var new_month = evodata.attr('data-cmonth');
			var new_year = evodata.attr('data-cyear');

			ej_container.attr({'data-m':new_month});

			// correct month
			ej_container.find('.evo_j_months p.legend a').removeClass('set').parent().find('a[data-val='+new_month+']').addClass('set');
			ej_container.find('.evo_j_years p.legend a').removeClass('set').parent().find('a[data-val='+new_year+']').addClass('set');
		}


	// RESET general calendar
		function cal_resets(calOBJ){
			calargs = $(calOBJ).find('.cal_arguments');
			calargs.attr('data-show_limit_paged', 1 );
		}
	
	// close event card
		$('.eventon_events_list').on('click','.evcal_close',function(){
			$(this).parent().parent().slideUp();
		});		
		
	// change IDs for map section for eventon widgets
		if( $('.ajde_evcal_calendar').hasClass('evcal_widget')){
			cal.find('.evcal_gmaps').each(function(){
				var gmap_id = obj.attr('id');
				var new_gmal_id =gmap_id+'_widget'; 
				obj.attr({'id':new_gmal_id})
			});
		}

	// show more events on the list
		$('body').on('click','.evoShow_more_events',  function(){
			OBJ = $(this);
			var ReDir = OBJ.data('dir');

			// redirect to an external link 
			if(ReDir != '0'){
				window.location = ReDir;
				return false;
			}

			// Initials
			var evCal = OBJ.closest('.ajde_evcal_calendar');
			var evoData = evCal.find('.evo-data');

			// ajax pagination
			if(OBJ.data('ajax')=='yes'){
				calargs = evCal.find('.cal_arguments');
				CURRENT_PAGED = parseInt(calargs.attr('data-show_limit_paged'));
				calargs.attr('data-show_limit_paged', CURRENT_PAGED+1 );

				var sort_by = evoData.attr('data-sort_by');		
				cal_id = evCal.attr('id');

				ajax_post_content(sort_by, cal_id, 'none','paged');

			}else{
				var event_count = parseInt(evoData.data('ev_cnt'));
				var show_limit = evoData.data('show_limit');
				
				var eventList = OBJ.parent();
				var allEvents = eventList.find('.eventon_list_event').length;


				var currentShowing = eventList.find('.eventon_list_event:visible').length;

				for(x=1; x<=event_count ; x++ ){
					var inde = currentShowing+x-1;
					eventList.find('.eventon_list_event:eq('+ inde+')').slideDown();
				}

				// hide view more button
				if(allEvents > currentShowing && allEvents<=  (currentShowing+event_count)){
					$(this).fadeOut();
				}
			}		

		});
	
	// Tab view switcher
		$('body').find('.evo_tab_container').each(function(){
			$(this).find('.evo_tab_section').each(function(){
				if(!$(this).hasClass('visible')){
					$(this).addClass('hidden');
				}
			});
		});
		$('body').on('click','ul.evo_tabs li',function(){
			tab = $(this).data('tab');
			tabsection = $(this).closest('.evo_tab_view').find('.evo_tab_container');
			tabsection.find('.evo_tab_section').addClass('hidden').removeClass('visible');
			tabsection.find('.'+tab).addClass('visible').removeClass('hidden');

			$(this).parent().find('li').removeClass('selected');
			$(this).addClass('selected');
		});
	// layout view changer
		if($('body').find('.evo_layout_changer').length>0){
			$('body').find('.evo_layout_changer').each(function(item){
				if($(this).parent().hasClass('boxy')){
					$(this).find('.fa-th-large').addClass('on');
				}else{
					$(this).find('.fa-reorder').addClass('on');
				}
			});

			$('.evo_layout_changer').on('click','i',function(){

				TYPE = $(this).data('type');
				$(this).parent().find('i').removeClass('on');
				$(this).addClass('on');

				//console.log(TYPE);
				
				if(TYPE=='row'){
					$(this).closest('.ajde_evcal_calendar').removeClass('boxy');
				}else{
					$(this).closest('.ajde_evcal_calendar').addClass('boxy');
				}				
			});
		}
	
	//===============================
	// SORT BAR SECTION
	// ==============================	
		// display sort section
		$('.evo_sort_btn').click(function(){
			$(this).siblings('.eventon_sorting_section').slideToggle('fast');
		});	
		
		// sorting section	
		$('.evo_srt_sel p.fa').click(function(){
			if($(this).hasClass('onlyone')) return;	
			$(this).siblings('.evo_srt_options').fadeToggle();

			// close sorting
				filterSelect = $(this).closest('.eventon_sorting_section').find('.eventon_filter_dropdown');
				if(filterSelect.is(':visible') == true) filterSelect.fadeToggle();
		});
		
		// update calendar based on the sorting selection
			$('.evo_srt_options').on('click','p',function(){

				var evodata = $(this).closest('.eventon_sorting_section').siblings('.evo-data');
				var cmonth = parseInt( evodata.attr('data-cmonth'));
				var cyear = parseInt( evodata.attr('data-cyear'));	
				var sort_by = $(this).attr('data-val');
				var new_sorting_name = $(this).html();
				var cal_id = evodata.parent().attr('id');	
							
				ajax_post_content(sort_by,cal_id,'none','sorting');

				// update new values everywhere
				evodata.attr({'data-sort_by':sort_by});
				$(this).parent().find('p').removeClass('evs_hide');
				$(this).addClass('evs_hide');		
				$(this).parent().siblings('p.fa').html(new_sorting_name);
				$(this).parent().hide();

				// fix display of available options for sorting
				sort_options = $(this).closest('.evo_srt_options');
				hidden_options = sort_options.find('.evs_hide').length;
				all_options = sort_options.find('.evs_btn').length;

				if(all_options == hidden_options){
					$(this).parent().siblings('p.fa').addClass('onlyone');
				}
			});		
		
		// filtering section open and close menu
			$('.filtering_set_val').click(function(){
				// close sorting
					sortSelect = $(this).closest('.eventon_sorting_section').find('.evo_srt_options');
					if(sortSelect.is(':visible') == true) sortSelect.fadeToggle();

				var obj = $(this);
				var current_Drop = obj.siblings('.eventon_filter_dropdown');
				var current_drop_pare = obj.closest('.eventon_filter');

				current_drop_pare.siblings('.eventon_filter').find('.eventon_filter_dropdown').each(function(){
					if($(this).is(':visible')== true ){
						$(this).hide();
					}				
				});

				if(current_Drop.is(':visible')== true){
					obj.siblings('.eventon_filter_dropdown').fadeOut('fast');		
				}else{
					obj.siblings('.eventon_filter_dropdown').fadeIn('fast');
				}			
			});	
		
		// selection on filter dropdown list
			$('.eventon_filter_dropdown').on('click','p',function(){
				var new_filter_val = $(this).attr('data-filter_val'),
					filter_section = $(this).closest('.eventon_filter_line');
				var filter = $(this).closest('.eventon_filter');
				var filter_current_set_val = filter.attr('data-filter_val');
				FILTER_DROPDOWN = $(this).parent();

				// for filter values with checkboxes
				if(filter_section.hasClass('selecttype')){				

					val = '';
					filter.find('input').each(function(){
						val = ($(this).is(':checked'))? val+$(this).attr('data-filter_val')+',': val;
					});
					val = val==''? 'all':val;
					filter.attr('data-filter_val',val);
				}
				if(filter_section.hasClass('selecttype')) return;
				

				// For non checkbox select options
				if(filter_current_set_val == new_filter_val){
					$(this).parent().fadeOut();
				}else{
					// set new filtering changes	
					CAL = $(this).closest('.ajde_evcal_calendar');	
					var evodata = CAL.find('.evo-data');
					CAL_ARG = CAL.find('.cal_arguments');

					PAGED = parseInt(CAL_ARG.attr('data-show_limit_paged'));
					PAGED = PAGED>1? 1: PAGED;
					CAL_ARG.attr('data-show_limit_paged',  PAGED);
					var cmonth = parseInt( evodata.attr('data-cmonth'));
					var cyear = parseInt( evodata.attr('data-cyear'));	
					var sort_by = evodata.attr('data-sort_by');
					var cal_id = evodata.parent().attr('id');				
					
					// make changes
					filter.attr({'data-filter_val':new_filter_val});	
					evodata.attr({'data-filters_on':'true'});
					

					ajax_post_content(sort_by,cal_id,'none','filering');
					
					
					// reset the new values				
					var new_filter_name = $(this).html();
					$(this).parent().find('p').removeClass('evf_hide');
					$(this).addClass('evf_hide');
					$(this).parent().fadeOut();
					$(this).parent().siblings('.filtering_set_val').html(new_filter_name);
				}
			});
			
			// apply filters via button to the calendar
				$('.eventon_filter_dropdown').on('change','input',function(event){
					FILTER = $(this).closest('.eventon_filter');

					val = '';
					FILTER.find('input').each(function(){
						val = ($(this).is(':checked'))? val+$(this).attr('data-filter_val')+',': val;
					});
					val = val==''? '':val; // v2.5.2
					FILTER.attr('data-filter_val',val);
				});
			// apply filters
				$('body').on('click','.evo_filter_submit',function(){
					// fadeout any open filter dropdowns
						$(this).closest('.eventon_filter_line').find('.eventon_filter_dropdown').fadeOut();
						
					// set new filtering changes				
					var evodata = $(this).closest('.eventon_sorting_section').siblings('.evo-data');
					var cmonth = parseInt( evodata.attr('data-cmonth'));
					var cyear = parseInt( evodata.attr('data-cyear'));	
					var sort_by = evodata.attr('data-sort_by');
					var cal_id = evodata.parent().attr('id');
					evodata.attr({'data-filters_on':'true'});				
					
					ajax_post_content(sort_by,cal_id,'none','filering');
				});
				
			
				// fadeout dropdown menus
				/*
				$(document).mouseup(function (e){
					var item=$('.eventon_filter_dropdown');
					var container=$('.eventon_filter_selection');
					
					if (!container.is(e.target) // if the target of the click isn't the container...
						&& e.pageX < ($(window).width() - 30)
					&& container.has(e.target).length === 0) // ... nor a descendant of the container
					{
						item.fadeOut('fast');
					}
					
					});
				*/
		
	// MONTH SWITCHING
		// previous month
		$('body').on('click','.evcal_btn_prev', function(){
			var evodata = $(this).parent().siblings('.evo-data');				
			var sort_by=evodata.attr('data-sort_by');		
			cal_id = $(this).closest('.ajde_evcal_calendar').attr('id');

			ajax_post_content(sort_by,cal_id,'prev','switchmonth');
		});
		
		// next month
		$('body').on('click','.evcal_btn_next',function(){	
			
			var evodata = $(this).parent().siblings('.evo-data');				
			var sort_by=evodata.attr('data-sort_by');		
			cal_id = $(this).closest('.ajde_evcal_calendar').attr('id');
			
			ajax_post_content(sort_by, cal_id,'next','switchmonth');
		});
			
	/*	PRIMARY hook to get content	*/
		function ajax_post_content(sort_by, cal_id, direction, ajaxtype){
			
			// identify the calendar and its elements.
			var ev_cal = $('#'+cal_id); 
			var cal_head = ev_cal.find('.calendar_header');	
			var evodata = ev_cal.find('.evo-data');	

			// check if ajax post content should run for this calendar or not
			
			if(ev_cal.attr('data-runajax')!='0'){

				$('body').trigger('evo_main_ajax', [ev_cal, evodata, ajaxtype]);

				// category filtering for the calendar
				var cat = ev_cal.find('.evcal_sort').attr('cat');

				// reset paged values for switching months
				if(ajaxtype=='switchmonth'){
					cal_head.find('.cal_arguments').attr('data-show_limit_paged',1);
				}
				
				var data_arg = {
					action: 		'the_ajax_hook',
					direction: 		direction,
					sort_by: 		sort_by, 
					filters: 		ev_cal.evoGetFilters(),
					shortcode: 		ev_cal.evo_shortcodes(),
					evodata: 		ev_cal.evo_getevodata(),
					ajaxtype: 		ajaxtype
				};	

				data_arg = cal_head.evo_otherVals({'data_arg':data_arg});

				$.ajax({
					beforeSend: function(){
						ev_cal.addClass('evo_loading');
						if(ajaxtype != 'paged') ev_cal.find('.eventon_events_list').slideUp('fast');
						ev_cal.evo_loader_animation();					
					},
					type: 'POST',
					url:the_ajax_script.ajaxurl,
					data: data_arg,
					dataType:'json',
					success:function(data){
						if(!data) return false;
						if(ajaxtype == 'paged'){
							
							EVENTS_LIST = ev_cal.find('.eventon_events_list');
							ev_cal.find('.eventon_events_list .evoShow_more_events').remove();
							EVENTS_LIST.find('.clear').remove();
							EVENTS_LIST.append( data.content + "<div class='clear'></div>");
							
							
						}else{
							ev_cal.find('.eventon_events_list').html(data.content);
						}
						
						animate_month_switch(data.cal_month_title, ev_cal.find('#evcal_cur'));
						
						evodata.attr({'data-cmonth':data.month,'data-cyear':data.year});
						change_jumper_set_values(cal_id);

						// jump month update
							if(ev_cal.find('.evo_j_container').length>0){
								JUMPER = ev_cal.find('.evo_j_container');
								JUMPERmo = JUMPER.find('.evo_jumper_months');								
								JUMPERmo.find('a').removeClass('set');
								JUMPERmo.find('a[data-val="'+data.month+'"]').addClass('set');

								JUMPERyr = JUMPER.find('.evo_j_years');
								JUMPERyr.find('a').removeClass('set');
								JUMPERyr.find('a[data-val="'+data.year+'"]').addClass('set');
							}

						$('body').trigger('evo_main_ajax_success', [ev_cal, evodata, ajaxtype, data.eventList]);
															
					},complete:function(data){
						ev_cal.evo_loader_animation({direction:'end'});

						ev_cal.find('.eventon_events_list').delay(300).slideDown('slow');
						ev_cal.evoGenmaps({'delay':400});
						init_run_gmap_openevc(600);
						fullheight_img_reset(cal_id);

						// pluggable
						$('body').trigger('evo_main_ajax_complete', [ev_cal, evodata, ajaxtype, data.eventList ]);
						ev_cal.removeClass('evo_loading');
					}
				});
			}
			
		}
	
	// subtle animation when switching months
		function animate_month_switch(new_data, title_element){			
			var current_text = title_element.html();
			var hei = title_element.height();
			var wid= title_element.width();
			
			title_element.html("<span style='position:absolute; width:"+wid+"; height:"+hei+" ;'>"+current_text+"</span><span style='position:absolute; display:none;'>"+new_data+"</span>").width(wid);
						
			title_element.find('span:first-child').fadeOut(800); 
			title_element.find('span:last-child').fadeIn(800, function(){
				title_element.html(new_data).width('');
			});
		}

	// show more and less of event details				
		$('body').on('click','.eventon_shad_p',function(){		
			control_more_less( $(this));		
		});	
	
	// actual animation/function for more/less button
		function control_more_less(obj){
			var content = obj.attr('content');
			var current_text = obj.find('.ev_more_text').html();
			var changeTo_text = obj.find('.ev_more_text').attr('data-txt');
			
			if(content =='less'){			
				
				var hei = obj.parent().siblings('.eventon_full_description').height();
				var orhei = obj.closest('.evcal_evdata_cell').height();
				
				obj.closest('.evcal_evdata_cell').attr({'orhei':orhei}).animate({height: (parseInt(hei)+40) });
				
				obj.attr({'content':'more'});
				obj.find('.ev_more_arrow').addClass('less');
				obj.find('.ev_more_text').attr({'data-txt':current_text}).html(changeTo_text);
				
			}else{
				var orhei = parseInt(obj.closest('.evcal_evdata_cell').attr('orhei'));
				
				obj.closest('.evcal_evdata_cell').animate({height: orhei });
				
				obj.attr({'content':'less'});
				obj.find('.ev_more_arrow').removeClass('less');
				obj.find('.ev_more_text').attr({'data-txt':current_text}).html(changeTo_text);
			}
		}
		
	// expand and shrink featured image		
		$('body').on('click','.evcal_evdata_img',function(){
			if(!$(this).hasClass('evo_noclick')){				
				feature_image_expansion($(this), 'click');
			}
		});		

	
	// featured image height processing
		function feature_image_expansion(image, type){
			img = image;
			
			var img_status = img.attr('data-status');
			var img_style = img.attr('data-imgstyle');
			
			// if image already expanded
			if(img_status=='open' ){
				img.attr({'data-status':'close'}).css({'height':''});			
			}else{	
				var img_full_height = parseInt(img.attr('data-imgheight'));
				var cal_width = parseInt(img.closest('.ajde_evcal_calendar').width());
					cal_width = (cal_width)? cal_width: img.width();
				var img_full_width = parseInt(img.attr('data-imgwidth'));


				// show at minimized height
				if(img_style=='100per'){
					relative_height = img_full_height;
				}else if(img_style=='full'){
					relative_height = parseInt(img_full_height * (cal_width/img_full_width)) ;
				}else{
					// minimized version
					if(type=='click'){
						relative_height = parseInt(img_full_height * (cal_width/img_full_width));
						relative_height = (relative_height)? relative_height: img_full_height;
						
						relative_height = parseInt((cal_width * img_full_height) /img_full_width);
						
						//console.log(relative_height+ ' '+img_full_height+' '+cal_width);

					}else{
						relative_height = img.attr('data-minheight');
					}					
				}
				
				// when to set the status as open for images
				if(img_status=='' && img_style=='minmized'){
					img.attr({'data-status':'close'}).removeClass('expanded');
				}else{
					img.attr({'data-status':'open'}).addClass('expanded');
				}
				img.css({'height':relative_height});
			}			
		}

	// reset featured images based on settings
		function fullheight_img_reset(calid){
			if(calid){
				$('#'+calid).find('.eventon_list_event .evo_metarow_fimg').each(function(){
					feature_image_expansion($(this));
				});
			}else{
				$('.evo_metarow_fimg').each(function(){					
					feature_image_expansion($(this));					
				});
			}
		}
			
	// treatments for calendar events upon load
		function treat_events(calid){
			if(calid!=''){
				if(is_mobile()){
					$('#'+calid).find('.evo_metarow_getDr form').attr({'target':'_self'});
				}
			}
		}

		// if mobile check
		function is_mobile(){
			return ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) )? true: false;
		}

	// edit event button redirect
		$('body').on('click','.editEventBtnET', function(event){
			event.stopPropagation();

			href = $(this).attr('href');
			//console.log(href);
			window.open(href);
		});

	// repeat events series
	// @u 2.6.9
		$('body').on('click','.evo_repeat_series_date',function(){
			if( $(this).parent().data('click') ){
				URL =  $(this).data('l');
				window.location = URL;
			}
		});

	// event location archive card page
	// @u 2.6.11
		$('body').find('.evo_location_map').each(function(){
			THIS = $(this);
			MAPID = THIS.attr('id');

			var location_type = THIS.attr('data-location_type');
			if(location_type=='add'){
				var address = THIS.attr('data-address');
				var location_type = 'add';
			}else{			
				var address = THIS.attr('data-latlng');
				var location_type = 'latlng';				
			}

			// zoomlevel
				zoom = parseInt(THIS.data('zoom'));
				scrollwheel = THIS.data('scroll') == 'yes'? true: false;

			initialize(
				MAPID, 
				address, 
				THIS.data('mty'), 
				zoom, 
				location_type, 
				scrollwheel
			);
		});
		
	// SINGLE EVENTS	
		
		// Loading single event json based content
			$('body').on('evo_load_single_event_content', function(event, eid, obj){
				var ajaxdataa = {};
				ajaxdataa['action']='eventon_load_event_content';
				ajaxdataa['eid'] = eid;
				ajaxdataa['nonce'] = the_ajax_script.postnonce;	

				// pass on other event values
				if(obj.data('j')){
					$.each(obj.data('j'), function(index,val){
						ajaxdataa[ index] = val;
					});
				}			
				
				$.ajax({
					beforeSend: function(){ 	},	
					url:	the_ajax_script.ajaxurl,
					data: 	ajaxdataa,	dataType:'json', type: 	'POST',
					success:function(data){
						$('body').trigger('evo_single_event_content_loaded', [data, obj]);
					},complete:function(){ 	}
				});
			});

		

		if(is_mobile()){
			if($('body').find('.fb.evo_ss').length != 0){
				$('body').find('.fb.evo_ss').each(function(){
					obj = $(this);
					obj.attr({'href':'http://m.facebook.com/sharer.php?u='+obj.attr('data-url')});
				});
			}
		}

		if($('body').find('.evo_sin_page').length>0){
			$('.evo_sin_page').each(function(){
				$('body').trigger('evo_load_single_event_content',[ $(this).data('eid'), $(this)]);
				$(this).find('.desc_trig ').attr({'data-ux_val':'none'});
			});
		}
		
	
		// redirect only if not set to open as popup
			$('.eventon_single_event').on('click', '.evcal_list_a',function(e){
				var obj = $(this),
					evodata = obj.closest('.ajde_evcal_calendar').find('.evo-data'),
					ux_val = evodata.data('ux_val');

				e.preventDefault();

				// open in event page
				if(ux_val == 4){ 
					var url = obj.parent().siblings('.evo_event_schema').find('[itemprop=url]').attr('href');
					window.location.href= url;
				}else if(ux_val == '2'){ // External Link
					var url = evodata.attr('data-exturl');
					window.location.href= url;
				}else if(ux_val == 'X'){ // do not do anything
					return false;
				}
			})

		
		// click on the single event box
			$('.eventon_single_event').find('.evcal_list_a').each(function(){			
				var obj = $(this),
					evObj = obj.parent(),
					evodata = obj.closest('.ajde_evcal_calendar').find('.evo-data');
				
				var ev_link = evObj.siblings('.evo_event_schema').find('a[itemprop=url]').attr('href');
				
				//console.log(ev_link);
				if(ev_link!=''){
					obj.attr({'href':ev_link, 'data-exlk':'1'});
				}
				
				// show event excerpt
				var ev_excerpt = evObj.siblings('.evcal_eventcard').find('.event_excerpt').html();
				
				if(ev_excerpt!='' && ev_excerpt!== undefined && evodata.data('excerpt')=='1' ){
					var appendation = '<div class="event_excerpt_in">'+ev_excerpt+'</div>'
					evObj.append(appendation);
				}
			
			});

		// each single event box
			$('body').find('.eventon_single_event').each(function(){

				var _this = $(this);

				/*
				osmap = _this.find('.evo_metarow_osmap');
				osmapid = osmap.attr('id');

				var ev_location = _this.find('.evcal_desc');

				var address = ev_location.attr('data-latlng');

				st = address.split(',');
				console.log(address);

				var osmap = L.map(osmapid).setView([ 51.505, -0.09 ],13);
				*/

				// show expanded eventCard
				if( _this.find('.evo-data').data('expanded')=='1'){
					_this.find('.evcal_eventcard').show();

					var idd = _this.find('.evcal_gmaps');

					

					// close button
					_this.find('.evcal_close').parent().css({'padding-right':0});
					_this.find('.evcal_close').hide();

					//console.log(idd);
					var obj = _this.find('.desc_trig');

					obj.evoGenmaps({'fnt':2});

				// open eventBox and lightbox	
				}else if( _this.data('uxval')=='3'){

					var obj = _this.find('.desc_trig');

					// remove other attr - that cause to redirect
					obj.removeAttr('data-exlk').attr({'data-ux_val':'3'});
				}
			})

	// HELPER items script
		// yes no button		
			$('body').on('click','.ajde_yn_btn ', function(){
				var obj = $(this);
				var afterstatement = obj.attr('afterstatement');
					afterstatement = (afterstatement === undefined)? obj.attr('data-afterstatement'): afterstatement;		
				// yes
				if(obj.hasClass('NO')){					
					obj.removeClass('NO');
					obj.siblings('input').val('yes');

					// afterstatment
					if(afterstatement!=''){
						var type = (obj.attr('as_type')=='class')? '.':'#';
						$(type+ afterstatement).addClass('tt').slideDown('fast');						
					}

				}else{//no
					obj.addClass('NO');
					obj.siblings('input').val('no');
					
					if(afterstatement!=''){
						var type = (obj.attr('as_type')=='class')? '.':'#';
						$(type+ afterstatement ).slideUp('fast');
					}
				}
			});

// Search Scripts
	// Enter key detection for pc
		$.fn.evo_enterKey = function (fnc) {
		    return this.each(function () {
		        $(this).keypress(function (ev) {
		            var keycode = (ev.keyCode ? ev.keyCode : ev.which);
		            if (keycode == '13') {
		                fnc.call(this, ev);
		            }
		        })
		    })
		}
		
	$('.evo-search').on('click',function(){
		var section = $(this).closest('.calendar_header');
		var item = section.find('.evo_search_bar');

		item.slideToggle('2000', function(){
			if(item.is(':visible'))  item.find('input').focus();
		});
	});

	// Submit search from search box
		$('body').on('click','.evo_do_search',function(){
			do_search_box( $(this) );
		});

		$(".evosr_search_box input").evo_enterKey(function () {
			do_search_box( $(this).siblings('.evo_do_search') );
		});

		function do_search_box(OBJ){
			SearchVal = OBJ.closest('.evosr_search_box').find('input').val();
			Evosearch = OBJ.closest('.EVOSR_section');
			OBJ.closest('.evo_search_entry').find('.evosr_msg').hide();
			//console.log(SearchVal);

			if( SearchVal === undefined || SearchVal == ''){
				OBJ.closest('.evo_search_entry').find('.evosr_msg').show();
				return false;
			}
			SC = Evosearch.find('span.data').evo_item_shortcodes();
			
			var data_arg = {
				action: 		'eventon_search_evo_events',
				search: 		SearchVal,
				shortcode: SC
			};
			$.ajax({
				beforeSend: function(){
					Evosearch.find('.evo_search_results_count').hide();
					Evosearch.addClass('searching');
				},
				type: 'POST',
				url:the_ajax_script.ajaxurl,
				data: data_arg,
				dataType:'json',
				success:function(data){
					Evosearch.find('.evo_search_results').html( data.content);

					if(Evosearch.find('.no_events').length>0){

					}else{
						// find event count
						Events = Evosearch.find('.evo_search_results').find('.eventon_list_event').length;
						Evosearch.find('.evo_search_results_count span').html( Events);
						Evosearch.find('.evo_search_results_count').fadeIn();
					}
					
				},complete: function(){
					Evosearch.removeClass('searching');
				}
			});
		}

	//submit search 
		$('body').on('click','.evosr_search_btn',function(){
			search_within_calendar( $(this).siblings('input') );
		});

		$(".evo_search_bar_in input").evo_enterKey(function () {
			search_within_calendar( $(this) );
		});

		function search_within_calendar(obj){
			
		   	var ev_cal= obj.closest('.ajde_evcal_calendar');
		   	ev_cal.find('.cal_arguments').attr({'data-s': obj.val()});

		   	var cal_head = ev_cal.find('.calendar_header');	
			var evodata = ev_cal.find('.evo-data');

			var evcal_sort = cal_head.siblings('div.evcal_sort');						
			var sort_by=evcal_sort.attr('sort_by');
			var evodata = ev_cal.evo_getevodata();
			var data_arg = {
				action: 		'the_ajax_hook',
				sort_by: 		sort_by, 	
				direction: 		'none',
				filters: 		ev_cal.evoGetFilters(),
				shortcode: 		ev_cal.evo_shortcodes(),
				evodata: 		evodata
			};

			data_arg = cal_head.evo_otherVals({'data_arg':data_arg});	

			$.ajax({
				beforeSend: function(){
					ev_cal.find('.eventon_events_list').slideUp('fast');
					ev_cal.find('#eventon_loadbar').slideDown();
				},
				type: 'POST',
				url:the_ajax_script.ajaxurl,
				data: data_arg,
				dataType:'json',
				success:function(data){
					// /alert(data);
					//console.log(data);
					ev_cal.find('.eventon_events_list').html('');
					ev_cal.find('.eventon_events_list:first').html(data.content);
														
				},complete:function(){
					ev_cal.find('#eventon_loadbar').slideUp();
					ev_cal.find('.eventon_events_list').delay(300).slideDown('slow');
					ev_cal.evoGenmaps({'delay':400});
				}
			});

			// for fullcal
				if(ev_cal.hasClass('evoFC')){			 	
				 	// AJAX data array
					var data_arg_2 = {
						action: 	'evo_fc',
						next_m: 	evodata.cmonth,	
						next_y: 	evodata.cyear,
						next_d: 	data_arg.fc_focus_day,
						change: 	'',
						filters: 		ev_cal.evoGetFilters(),
						shortcode: 		ev_cal.evo_shortcodes(),
					};
					$.ajax({
						beforeSend: function(){
							//this_section.slideUp('fast');
						},
						type: 'POST',
						url:the_ajax_script.ajaxurl,
						data: data_arg_2,
						dataType:'json',
						success:function(data){
							var strip = cal_head.parent().find('.evofc_months_strip');
							strip.html(data.month_grid);

							//width adjustment
							var month_width = parseInt(strip.parent().width());
							strip.find('.evofc_month').width(month_width);
						}
					});
				}

			// for dailyview
				if(ev_cal.hasClass('evoDV')){
					// AJAX data array
					var data_arg_3 = {
						action: 	'the_ajax_daily_view',
						next_m: 	evodata.cmonth,	
						next_y: 	evodata.cyear,
						next_d: 	data_arg.dv_focus_day,
						cal_id: 	ev_cal.attr('id'),
						send_unix: 	evodata.send_unix,
						filters: 		ev_cal.evoGetFilters(),
						shortcode: 		ev_cal.evo_shortcodes(),
					};
					$.ajax({
						beforeSend: function(){
							//this_section.slideUp('fast');
						},
						type: 'POST',
						url:the_ajax_script.ajaxurl,
						data: data_arg_3,
						dataType:'json',
						success:function(data){
							var this_section = cal_head.parent().find('.eventon_daily_in');
							this_section.html(data.days_list);
						}
					});
				}		
			// for weeklyview
				if(ev_cal.hasClass('evoWV')){
					// AJAX data array
					var data_arg_4 = {
						action: 	'the_ajax_wv2',
						next_m: 	evodata.cmonth,	
						next_y: 	evodata.cyear,
						focus_week: 	data_arg.wv_focus_week,
						filters: 		ev_cal.evoGetFilters(),
						shortcode: 		ev_cal.evo_shortcodes(),
					};
					$.ajax({
						beforeSend: function(){
							//this_section.slideUp('fast');
						},
						type: 'POST',
						url:the_ajax_script.ajaxurl,
						data: data_arg_4,
						dataType:'json',
						success:function(data){
							// save width data
							var width1 = ev_cal.find('.evoWV_days').width();
							var width2 = ev_cal.find('.eventon_wv_days').width();
							var width3 = ev_cal.find('.evo_wv_day').width();
							var ml1 = ev_cal.find('.eventon_wv_days').css('margin-left');

							// add content
							ev_cal.find('.eventon_wv_days')
								.parent().html(data.content);

							ev_cal.find('.evoWV_days').css({'width':width1});
							ev_cal.find('.eventon_wv_days').css({'width':width2, 'margin-left':ml1});
							ev_cal.find('.evo_wv_day').css({'width':width3});

						}
					});
				}			

		}	

});