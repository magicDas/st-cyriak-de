jQuery( document ).ready(function() {
		
	jQuery( "body #main-header  #mobile_menu li.menu-item-has-children, body #main-header  #mobile_menu  li.page_item_has_children" ).append( '<a href="#" class="mobile-toggle"></a>' );							
	jQuery('#mobile_menu li.menu-item-has-children .mobile-toggle, #mobile_menu li.page_item_has_children .mobile-toggle').click(function( event ) {
		event.preventDefault();
		jQuery(this).parent('li').find('ul.children').first().toggleClass('visible');
		jQuery(this).parent('li').find('ul.sub-menu').first().toggleClass('visible');
		
	});
	iconFINAL = '"' + iconTEXT.icon_text + '"';
	jQuery( 'body #main-header  #mobile_menu li.menu-item-has-children, body #main-header  #mobile_menu li.page_item_has_children' ).attr('data-icon', iconTEXT.icon_text);
	
	jQuery('.mobile-toggle').on('mouseover', function(){
	  jQuery(this).parent().addClass('is-hover');
	}).on('mouseout', function(){
	  jQuery(this).parent().removeClass('is-hover');
	})
});
