(function($){
	
	$(document).ready(function() {

		/*************************************************************************************
		*** APPLY FOR PASS *******************************************************************
		*************************************************************************************/
		$('.apply-container #add-equipment').on('click', function() {
			var defaultElement = $('.panel-equipment .row.hidden');
			var newElement = defaultElement.clone().removeClass('hidden');
			
			// Bind events
			$('.row-actions .ico-delete', newElement).on('click', function() {
				$(this).closest('.row').remove();
			});
			
			// Add element to DOM
			$(this).closest('.row').before(newElement);
		});
		
		$('.apply-container #add-visitor').on('click', function() {
			
			/*if ($.fn.ValidateForm() == false) {
				return;
			}*/
			
			var defaultElement = $('.panel-visitors .pcfc-table-tr.hidden');
			var newElement = defaultElement.clone().removeClass('hidden');
			$('.row-visitor-name', newElement).html($('.panel-visitors #first-name').val() + ' ' + $('.panel-visitors #last-name').val() + ' ('  + $('.panel-visitors #designation option:selected').text() + ')');
			
			// Bind events
			$('.row-actions .ico-edit', newElement).on('click', function() {
			});
			$('.row-actions .ico-delete', newElement).on('click', function() {
				$(this).closest('.row').remove();
			});
			
			// Add element to DOM
			defaultElement.before(newElement);
		});
		
		/*************************************************************************************
		*** PASSES LIST (INTERNAL USERS) *****************************************************
		*************************************************************************************/
		
		// Show pass details
		$('.passes-list-internal-container .pcfc-table-td:not(.row-actions)').on('click', function() {
			window.open("pcfc_pass.html", "_blank");
		});
		
		// Pass actions
		$('.passes-list-internal-container .panel-body .btn').on('click', function() {
			var visitorId = $('.pass-visitor-no', $(this).closest('.pcfc-table-tr')).html();
			var actionType = '';
			if ($(this).hasClass('ico-ok')) {
				actionType = 'approve';
			} else if ($(this).hasClass('ico-reject')) {
				actionType = 'reject';
			} else if ($(this).hasClass('ico-return')) {
				actionType = 'return';
			}
			$.fn.showModalOnPassAction($(this), actionType, visitorId);
		});
		$.fn.showModalOnPassAction = function(actionElement, actionType, visitorId) {
			if (actionType == '') {
				alert('Wrong action selected!');
				return;
			}
			if (actionType == 'approve' && confirm('Approve pass ' + visitorId + '?') == true) {
				//$(this).closest('.pcfc-table-tr').next().remove();
				//$(this).closest('.pcfc-table-tr').remove();
				$.fn.ShowModal('success', 'Pass successfully approved');
			} else if (actionType == 'reject' || actionType == 'return') {
				$('.form-success-msg').html('Pass successfully ' + (actionType == 'reject' ? 'rejected' : 'returned'));
				var modalContent = '' + 
					'<form action="#" role="form" class="form">' +
						'<div class="form-group">' +
							'<label for="pass-more-info-visitor-no" class="control-label">Visitor #</label>' +
							'<div id="pass-more-info-visitor-no">' +
								visitorId +
							'</div>' +
						'</div>' +
						'<div class="form-group required">' +
							'<label for="pass-more-info-reason" class="control-label">Reason</label>' +
							'<div id="pass-more-info-reason">' +
								'<select class="form-control">' + 
									'<option value="1">Reason 01</option>' + 
									'<option value="2">Reason 02</option>' + 
									'<option value="3">Reason 03</option>' + 
									'<option value="4">Reason 04</option>' + 
								'</select>' + 
							'</div>' +
						'</div>' +
						'<div class="form-group">' +
							'<label for="pass-more-info-reason-custom" class="control-label">Additional reason details</label>' +
							'<div id="pass-more-info-reason-custom">' +
								'<textarea class="form-control" rows="10" class="form-control"></textarea>' +
							'</div>' +
						'</div>' +
						'<div class="conainer-fluid form-buttons">' +
							'<input type="button" class="btn btn-submit" value="Submit" />' +
						'</div>' +
					'</form>';
				$.fn.ShowModal('default', modalContent, $.fn.BindActionEvents);
			}
		};
		
		// Show attachment
		$('.pass-visitor-attachment-type-01').on('click', function(e) {
				e.preventDefault();
				
				var name = 'David Black';
				var passport = 'ET123456';
				var visa = '2016/123/123456789';
				
				var modalContent = '' + 
					'<form action="#" role="form" class="form container-fluid">' +
						'<div class="col-md-12 col-sm-12 col-xs-12">' +
							'<label for="pass-attachment-visitor-name" class="col-md-3 col-sm-3 col-xs-12 control-label">Name</label>' +
							'<div id="pass-attachment-visitor-name" class="col-md-9 col-sm-9 col-xs-12">' +
								name +
							'</div>' +
						'</div>' +
						'<div class="col-md-12 col-sm-12 col-xs-12">' +
							'<label for="pass-attachment-doc-no" class="col-md-3 col-sm-3 col-xs-12 control-label">Passport No</label>' +
							'<div id="pass-attachment-doc-no" class="col-md-9 col-sm-9 col-xs-12">' +
								passport +
							'</div>' +
						'</div>' +
						'<div class="col-md-12 col-sm-12 col-xs-12">' +
							'<label for="pass-attachment-doc-no" class="col-md-3 col-sm-3 col-xs-12 control-label">Visa No</label>' +
							'<div id="pass-attachment-doc-no" class="col-md-9 col-sm-9 col-xs-12">' +
								visa +
							'</div>' +
						'</div>' +
						'<div class="col-md-12 col-sm-12 col-xs-12">' +
							'<div id="pass-attachment-image" class="col-md-12 col-sm-12 col-xs-12">' +
								'<div class="pass-attachment-image-preview"></div>' +
							'</div>' +
						'</div>' +
					'</form>';
				$.fn.ShowModal('default', modalContent);
			});
		
		/*************************************************************************************
		*** PCFC USER (FORM) ******************************************************************
		*************************************************************************************/
		
		// Pass actions
		$('.manage-internal-users-form-container #generate-password').on('click', function() {
			var pwd = pcfc.core.generatePassword(8);
			$('#user-password').val(pwd);
			$('#user-confirm-password').val(pwd);
			$('#generate-password-value').html(pwd);
		});
		
		$('.pcfc-pass-form-container .form-buttons .btn').on('click', function() {
			var visitorId = $('.pass-visitor-no').html();
			var actionType = '';
			if ($(this).hasClass('btn-approve')) {
				actionType = 'approve';
			} else if ($(this).hasClass('btn-reject')) {
				actionType = 'reject';
			} else if ($(this).hasClass('btn-return')) {
				actionType = 'return';
			}
			$.fn.showModalOnPassAction($(this), actionType, visitorId);
		});
		
		/*************************************************************************************
		*** TEMP *****************************************************************************
		*************************************************************************************/
	
	});
	
})($);


	
	
