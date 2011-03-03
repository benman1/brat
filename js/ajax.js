var Ajax = (function($, window, undefined) {
    var Ajax = function(dispatcher) {
      var that = this;

      // merge data will get merged into the response data
      // before calling the callback
      var ajaxCall = function(data, callback, merge) {
        dispatcher.post('spin');
        $.ajax({
          url: 'ajax.cgi',
          data: data,
          method: 'POST',
          success: function(response) {
/* TODO Commented out until
 * server-side complies
            if (response.action !== data.action) {
              console.error('Action ' + data.action +
                ' returned the results of action ' + response.action);
            }
*/
            dispatcher.post('messages', [response.messages]);

            // if .exception is just Boolean true, do not process
            // the callback; if it is anything else, the
            // callback is responsible for handling it
            if (response.exception !== true && callback) {
              if (merge) {
                $.extend(response, merge);
              }
              dispatcher.post(0, callback, [response]);
            }
            dispatcher.post('unspin');
          },
          error: function(x) {
            dispatcher.post('unspin');
            console.error(x);
          }
        });
      };

      dispatcher.
          on('ajax', ajaxCall);
    };

    return Ajax;
})(jQuery, window);