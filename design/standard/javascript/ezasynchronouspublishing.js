var eZAsynchronousPublishingApp = function() {
    var ret = {};
    var Y;

    // Y.later object, used to stop the timer
    var publishQueueUpdater;

    var ajaxURI;

    var yCallback = function( yui, result ) {
        Y = yui;
        Y.on( "contentready", function( e )
        {
            updateStatus( Y );
            publishQueueUpdater = Y.later( 1000, null, updateStatus, null, true );
        }, '#ezap-message-publishing' );

    };

    var updateStatus = function updateStatus()
    {
        Y.io.ez( ajaxUri, {
            on: {success: function( id,r )
                {
                    if ( r.responseJSON.error_text )
                    {
                        toggle( '#ezap-error' );
                        Y.get( '#ezap-error' ).setContent( r.responseJSON.error_text );
                    }
                    else
                    {
                        var status = r.responseJSON.content.status;
                        // var message = statusMessage + r.responseJSON.content.status;
                        // Y.get( '#publish-queue-status-placeholder' ).setContent( message );

                        // publishing finished
                        if ( status == 'finished' )
                        {
                            if ( publishQueueUpdater != null )
                                publishQueueUpdater.cancel();

                            if ( ret.cfg.redirect_uri != false )
                            {
                                window.location = ret.cfg.redirect_uri;
                            }
                            else
                            {
                                toggle( '#ezap-message-finished' );
                                // Y.get( '.ezap-placeholder' ).setStyle( 'display', 'none' );
                                // Y.get( '#ezap-message-finished' ).setStyle( 'display', 'block' );
                                Y.get( '#ezap-message-finished #ezap-contentview-uri' )
                                    .set( 'href', r.responseJSON.content.node_uri );
                            }
                        }
                        // deferred to crontab
                        else if ( status == 'deferred' )
                        {
                            if ( publishQueueUpdater != null )
                                publishQueueUpdater.cancel();

                            toggle( '#ezap-message-deferred' );
                            Y.get( '#ezap-message-finished #ezap-contentview-uri' )
                                .set( 'href', r.responseJSON.content.versionview_uri );
                        }
                    }
                }
            }
        , method: 'GET'});
    };

    toggle = function( id ) {
        Y.get( '.ezap-placeholder' ).setStyle( 'display', 'none' );
        Y.get( id ).setStyle( 'display', 'block' );
    }

    ret.cfg = {}

    ret.init = function()
    {
        ajaxUri = 'ezpublishingqueue::status::' + ret.cfg.contentobject_id + '::' + ret.cfg.version;
        var ins = YUI( YUI3_config ).use('node', 'io-ez', yCallback );
    }

    return ret;
}();
