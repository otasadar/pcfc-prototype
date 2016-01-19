var pcfc = pcfc || {
	
	core : (function($) {
		
		/***************************************************************************************
		*** Document ready events **************************************************************
		***************************************************************************************/
		$(document).ready(function() {
			
			/*** Inits jQuery datepicker ********************************************************/
			$('.is-datepicker').datepicker({
				changeMonth: 				true,
				changeYear: 				true,
				showOtherMonths: 		true,
				selectOtherMonths:	true,
				showButtonPanel: 		true,
				dateFormat:					'dd/mm/yy'
			});
			
			/*** Custom Switch functionality ****************************************************/
			$('.switch .btn').on('click', function() {
				$('.switch .btn').removeClass('active');
				$(this).addClass('active');
			});
			
			/*** Multiselect: custom 'select all' feature ***************************************/
			$('select option[value="select-all"]').on('click', function() {
				var select = $(this).closest('select');
				$('option', select).prop('selected', true);
				$(this).prop('selected', false);
				select.scrollTop(0);
			});
			
			/*** Elements that toggle display property of self/other elements *******************/
			$('.toggle-trigger').on('click', function() {
				var toggleTargetsAttr = 'toggle-targets';
				var toggleTargetClasses = $(this).attr(toggleTargetsAttr);
				
				if (typeof toggleTargetClasses == 'undefined') {
					consol.error(toggleTargetsAttr + ' attribute doesn\'t exist');
					return;
				}
				
				var tmp = toggleTargetClasses.split('|');
				
				if (tmp.length == 1) { // toggle the same element
					var toggleClasses = '.' + tmp[0].replace(',', ',.');
					$(toggleClasses).each(function() {
						if ($(this).hasClass('hidden')) {
							$(this).removeClass('hidden');
						} else {
							$(this).addClass('hidden');
						}
					});
				} else if (tmp.length == 2) { // toggle other element
					var hideClasses = '.' + tmp[0].replace(',', ',.');
					var showClasses = '.' + tmp[1].replace(',', ',.');
					$(hideClasses).each(function() {
						if ($(this).hasClass('hidden') == false) {
							$(this).addClass('hidden');
						}
					});
					$(showClasses).each(function() {
						$(this).removeClass('hidden');
					});
				} else {
					consol.error(toggleTargetsAttr + ' attribute has wrong value');
				}
			});
			
			/*** Form validation *****************************************************************
				Returns: 
					true - passed, 
					false - failed
			*/
			$('.validate-form').on('click', function() {
				$.fn.ValidateForm($(this).attr('validation-msg-success'));
			});
			$.fn.ValidateForm = function(validationMsgSuccess) {
				
				var errors = [];
				$('.form-group').removeClass('has-error');
				$('.validation-errors-container').remove();
				
				// Loop throug elements that need to be validated
				$('input, select, textarea, .switch').each(function() {
					var formGroup = $(this).closest('.form-group');
					if (formGroup.hasClass('required') && $(this).css('display') != 'none' && formGroup.css('display') != 'none' && formGroup.parent('.row').css('display') != 'none') {
						if ($(this).is('input') == true) {
							// Check if field is filled
							if ($(this).val().length == 0) {
								formGroup.addClass('has-error');
								errors.push($('.control-label', formGroup).html() + ' is required');
							}
							// Check if field is valid email
							if ($(this).attr('type') == 'email') {
								var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
								if (pattern.test($(this).val()) == false) {
									formGroup.addClass('has-error');
									errors.push($('.control-label', formGroup).html() + ' is not valid email');
								}
							}
						} else if ($(this).is('select') == true) {
							if ($('option', this).length == 0) { /* selects where items added programmatically */
								formGroup.addClass('has-error');
								errors.push($('.control-label', formGroup).html() + ' has to have at least one item');
							} else if ($(this).closest('.form-group').hasClass('ddl-assigned-container') == false && (typeof $('option:selected', this).val() == 'undefined' || $('option:selected', this).val() == '')) {
								formGroup.addClass('has-error');
								errors.push($('.control-label', formGroup).html() + ' is required');
							} 
						} else if ($(this).is('textarea') == true) {
							// Check if field is filled
							if ($(this).val().length == 0) {
								formGroup.addClass('has-error');
								errors.push($('.control-label', formGroup).html() + ' is required');
							}
						} else if ($(this).hasClass('switch') == true) {
							// Check if switch option selected
							if ($('.btn[class*="active"]', this).length === 0) {
								formGroup.addClass('has-error');
								errors.push($('.control-label', formGroup).html() + ' is required');
							}
						}
					}
				});
				
				// Show success message
				if (errors.length == 0) {
					$.fn.ShowModal('success', validationMsgSuccess);
					return true;
				}
				
				// Generate errors output
				var errorsHtml = '';
				for(var a=0;a<errors.length;a++) {
					errorsHtml += '<li>' + errors[a] + '</li>';
				}
				errorsHtml = '<b>Validation Errors:</b><ul>' + errorsHtml + '</ul>';
				
				// Create and render error message block
				$('.alerts-container').append('<div class="validation-errors-container alert alert-danger">' + errorsHtml + '</div>');
				$('body, html').animate({ 
					scrollTop: $('.validation-errors-container').offset().top - 70
				});
				
				// Show the same error in the modal
				$.fn.ShowModal('error', errorsHtml);
				
				// Return
				return false;
			};
			
			// Binds events (usually after AJAX call or in the dynamic modal)
			$.fn.BindActionEvents = function() {
				$('.validate-form').on('click', function() {
					$.fn.ValidateForm($(this).attr('validation-msg-success'));
				});
			};
			
			/*** Shows modal messages ************************************************************
				Params:
					type 			- success, warning, error
					message 	- message text
					callback	- callback function
			*/
			$.fn.ShowModal = function(type, message, callback) {
			
				$('.modal, .modal-backdrop').remove();
			
				var bootstrapClass = 'alert alert-info';
				var bootstrapGlyph = '<span class="glyphicon glyphicon-info-sign"></span>';
				var typeClass = 'modal-msg-type-default';
				if (type == 'success') {
					bootstrapClass = 'alert alert-success';
					bootstrapGlyph = '<span class="glyphicon glyphicon-ok"></span>';
					typeClass = 'modal-msg-type-success';
				} else if (type == 'warning') {
					bootstrapClass = 'alert alert-warning';
					bootstrapGlyph = '<span class="glyphicon glyphicon-warning-sign"></span>';
					typeClass = 'modal-msg-type-warning';
				} else if (type == 'error') {
					bootstrapClass = 'alert alert-danger';
					bootstrapGlyph = '<span class="glyphicon glyphicon-remove"></span>';
					typeClass = 'modal-msg-type-error';
				}
				
				var modalHtml =
					'<div class="modal fade ' + typeClass + '" tabindex="-1" role="dialog">' +
						'<div class="modal-dialog">' + 
							'<div class="modal-content">' + 
								'{@body}' + 
							'</div>' +
						'</div>' +
					'</div>';
					
				var modalHtmlHeader =
					'<div class="modal-header">' +
						'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
						'<h4 class="modal-title">Modal title</h4>' +
					 '</div>';
					 
				var modalHtmlBody =
					'<div class="modal-body ' + bootstrapClass + '">' +
						'{@body-content}' +
					'</div>';
					
				var modalHtmlFooter =
					'<div class="modal-footer">' +
						'<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
						'<button type="button" class="btn btn-primary">Save changes</button>' +
					'</div>';
					
				$('#main-section > .main-container').append(
					modalHtml.replace('{@body}', modalHtmlBody.replace('{@body-content}', message))
				);
				$('.modal').modal();
				
				// Callback
				if (typeof callback == "function") {
					callback();
				}
			};
			
			/*** Moves <select> option from one <select> to another or moves option up/down ******
				within the same select.
			*/
			var needNumerationOptions = [];
			$('.move-select-options').on('click', function() {

				var moveDirection = 'horizontal';
				var inElement = ''; 							// class of element to move option up/down in
				var toElement = '';								// class of element to move option from
				var fromElement = '';							// class of element to move option to
				var needNumerationElement = ''; 	// class of element which options need to be numerated (empty if no numeration required)
				
				var classes = $(this).attr('class').split(' ');
				for(var a=0;a<classes.length;a++) {
					// Move from select to select
					if (classes[a].indexOf('move-from') != -1) {
						fromElement = '#' + classes[a].replace('move-from-', '');
					}
					if (classes[a].indexOf('move-to') != -1) {
						toElement = '#' + classes[a].replace('move-to-', '');
					}
					// Move within select
					if (classes[a].indexOf('move-up') != -1) {
						inElement = '#' + classes[a].replace('move-up-', '');
						moveDirection = 'up';
					} else if (classes[a].indexOf('move-down') != -1) {
						inElement = '#' + classes[a].replace('move-down-', '');
						moveDirection = 'down';
					}
					// Need numeration
					if (classes[a].indexOf('need-numeration') != -1) {
						needNumerationElement = '#' + classes[a].replace('need-numeration-', '');
					}
				}
				
				// Check if classes identified correctly
				var error = false;
				if (moveDirection == 'horizontal' && (fromElement == '' || toElement == '')) {
					error = true;
				} else if (moveDirection == 'up' && inElement == '') {
					error = true;
				} else if (moveDirection == 'down' && inElement == '') {
					error = true;
				}
				if (error == true) {
					alert('Error: unable to move item(s)!');
					return;
				}
				
				// Check if valid option(s) selcted
				if ($('option:selected', $(moveDirection == 'horizontal' ? fromElement : inElement)).length == 0) {
					alert('Please select at least one option first');
					return;
				} else if ($('option:selected', $(moveDirection == 'horizontal' ? fromElement : inElement)).filter('[value=""],[value="select-all"]').length > 0) {
					alert('Invalid options selected!');
					return;
				}
				
				// Move from one select to another
				if (moveDirection == 'horizontal') {
					$('option:selected', $(fromElement)).each(function() {
						var index = $(this).index();
						$(toElement).append(
							$('<option>', { 
								value: $(this).val(),
								text : $(this).text() 
							})
						);
						$(this).remove();
						
						//alert(needNumerationOptions.map(function(elem){return elem.text;}).join(","));
						if (needNumerationElement == fromElement) {
							needNumerationOptions.splice(index, 1);
						} else if (needNumerationElement == toElement) {
							needNumerationOptions.push({
								value: 	$(this).val(),
								text: 	$(this).text()
							});
						}
						//alert(needNumerationOptions.map(function(elem){return elem.text;}).join(","));
					});
				} 
				
				// Move up within the same select
				if (moveDirection == 'up') {
					$('option:selected', $(inElement)).each(function() {
						var index = $(this).index();
						if (index > 0) {
							var elToMove = needNumerationOptions[index];
							needNumerationOptions.splice(index, 1);
							needNumerationOptions.splice(index - 1, 0, { value:elToMove.value, text:elToMove.text});
							$(this).prev().before($(this));
						}
					});
				}
				
				// Move down within the same select
				if (moveDirection == 'down') {
					$($('option:selected', $(inElement)).get().reverse()).each(function() {
						var index = $(this).index();
						if (index < $('option', $(inElement)).length - 1) {
							var elToMove = needNumerationOptions[index];
							needNumerationOptions.splice(index, 1);
							needNumerationOptions.splice(index + 1, 0, { value:elToMove.value, text:elToMove.text});
							$(this).next().after($(this));
						}
					});
				}
				
				// Numerate options
				if (needNumerationElement != '') {
					$.fn.NumerateSelectOptions(needNumerationElement);
				}
			});
			
			/*** Adds numbers 1,2,3... to <select> options **************************************/
			$.fn.NumerateSelectOptions = function(elementToNumerate) {
				var separator = '. ';
				$(elementToNumerate + ' option').remove();
				for(var a=0;a < needNumerationOptions.length; a++) {
					$(elementToNumerate).append(
						$('<option>', { 
							value: needNumerationOptions[a].value,
							text : (a+1) + separator + needNumerationOptions[a].text 
						})
					);
				}
			};
			
			/*** Shows/hides 'more info' row in the table ***************************************/
			$('.pcfc-table-tr-clickable .pcfc-table-td:not(.row-actions)').on('click', function() {
				var moreinfo = $(this).closest('.pcfc-table-tr-clickable').next('.pcfc-table-tr-fullinfo');
				if (moreinfo.hasClass('hidden')) {
					// Collapse all other fullinfo rows
					$('.pcfc-table-tr-fullinfo:not(hidden)').addClass('hidden');
					// Show fullinfo
					moreinfo.removeClass('hidden');
				} else {
					moreinfo.addClass('hidden');
				}
			});
		});
		
		/***************************************************************************************
		*** Private Functions ******************************************************************
		***************************************************************************************/
		// Generates password
		function generatePassword(length) {
			var res = "";
			var charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			for (var a=0,n=charset.length;a<length;++a) {
				res += charset.charAt(Math.floor(Math.random() * n));
			}
			return res;
		}

		/***************************************************************************************
		*** Public Functions/Properties ********************************************************
		***************************************************************************************/
		return {
				generatePassword: function(length) {
						return generatePassword(length);
				}
		}
	})(jQuery)
	
};
