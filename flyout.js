var flyoutPlugin = (function() {

    var store = {};

    var Constructor = function( options ) {

        var publicMethods = {};
        var settings; 

        // Private
        var expand = function( target ) {
            target.setAttribute( 'data-flyout-container', 'expanded' ); 
            publicMethods.updateState( { 'expanded' : true } );

            document.querySelector( 'body' ).setAttribute( 'data-flyout', 'active' );
            document.querySelector( 'body' ).setAttribute( 'data-overlay', 'active' );
        }

        var collapse = function( target ) {
            target.setAttribute( 'data-flyout-container', 'collapsed' );
            publicMethods.updateState( { 'expanded' : false } );

            multipleOpenFlyouts = document.querySelectorAll( '[data-flyout-container="expanded"]' );

            if( multipleOpenFlyouts.length < 1 ) {
                document.querySelector( 'body' ).setAttribute( 'data-flyout', 'inactive' );
                document.querySelector( 'body' ).setAttribute( 'data-overlay', 'inactive' ); 
                document.querySelector( 'body' ).setAttribute( 'data-overlay', 'inactive' ); 
                document.querySelector( 'body' ).setAttribute( 'data-overlay', 'inactive' ); 
            }

        }

        // Public

        publicMethods.getSettings = function() {
            return settings;
        }

        publicMethods.toggle = function( e ) {
            if( e !== undefined ) {
                // Check for field to update based on result of Flyout Transaction
                settings.fieldToUpdate = ( e.target.getAttribute( 'data-target-update-field' ) == undefined ) ? null : e.target.getAttribute( 'data-target-update-field' ); 
            }

            if( settings.container.getAttribute( 'data-flyout-container' ) == 'collapsed' ) {
                expand( settings.target );
            } else {
                collapse( settings.target );
            }        

        }

        publicMethods.getFieldToUpdate = function() {
            return ( settings.fieldToUpdate == undefined ) ? null : settings.fieldToUpdate;  
        }

        publicMethods.init = function( options ) {
            
            settings = options; // This makes arguments available in the scope of other methods within this object

            if( settings == null || settings == undefined ) { console.error( 'Flyout Plugin, settings not provided upon initialization' ); return; } 

            var triggerSelector = settings.triggerSelector;
            var triggerEvent    = 'click'; 
            
            if( settings.override === 'true' ) {

                // Try to perform the custom callback, and handle errors gracefully
                try {    
                    window.addEventListener( triggerEvent, function( event ) {

                        // Accomodate multiple triggers for one flyout
                        var triggers = document.querySelectorAll( triggerSelector );

                        // Narrow down trigger to exactly which trigger interaction
                        for( var i = 0; i < triggers.length; i++) {
                            if( event.target == triggers[ i ] ) {
                                thisFlyoutSettings = flyoutPlugin.getFlyout( settings.id ).getSettings();
                                window[ thisFlyoutSettings.customCallback ]( event );
                            }
                        }

                    });          
                } catch( error ) {
                    console.error( 'Flyout Plugin, custom callback for Flyout ID: ' + settings.id + '  failed. Message: ' + error.message );
                }

            } else {

                window.addEventListener( triggerEvent, function( event ) {

                    // Accomodate multiple triggers for one flyout
                    var triggers = document.querySelectorAll( triggerSelector );

                    // Narrow down trigger to exactly which trigger interaction
                    for( var i = 0; i < triggers.length; i++) {
                        if( event.target == triggers[ i ] ) {
                            flyoutPlugin.getFlyout( settings.id ).toggle( event );
                        }
                    }

                }); 

            }

            if( !settings.expanded ) {
                collapse( settings.target );
            }

        };

        publicMethods.updateState = function( state ) {
            
            for( var setting in state ) {
                settings[ setting ] = state[ setting ];
            }

        }

        publicMethods.getSettings = function() {
            return settings;
        }

        publicMethods.isExpanded = function() {
            return settings.expanded;
        }

        // Initialize plugin
        publicMethods.init( options );

        return publicMethods;

    }

    var setFlyout = function( name, obj ) {
        store[ name ] = obj;
    }

    var getFlyout = function( name ) {
        return store[ name ];
    }
	
    var getFlyouts = function( name ) {
        return store;
    }

    var addCloseFlyoutEvents = function() {

        var flyoutParentContainer = document.querySelector( '.flyout-containers' );

        // Collapse all containers if Fly-Container tag is clicked
        // Allow users to exit flyout without having to click 'close' button
        window.addEventListener( 'click', function( event ) {

            var closeTrigger = event.target.getAttribute( 'data-close-flyout' ); 
            
            // If you click in the gray overlay space (the main flyout parent container), collapse every flyout.
            if( event.target == flyoutParentContainer ) { 
                var flyouts = document.querySelectorAll( '[data-flyout-container]' );

                for( var i = 0; i < flyouts.length; i++ ) {
                    var flyout = flyoutPlugin.getFlyout( flyouts[i].getAttribute('data-flyout-target') );

                    if( flyout.isExpanded() ) {
                        flyout.toggle();
                    }
                }     

                document.querySelector( 'body' ).setAttribute( 'data-flyout', 'inactive' );
                document.querySelector( 'body' ).setAttribute( 'data-overlay', 'inactive' ); 
            }

            // If you click the X button, close that single flyout.
            if( closeTrigger !== null ) { 
                flyoutPlugin.getFlyout( closeTrigger ).toggle();
            }

        });

    }

    var registerFlyout = function( flyout, iterator ) {

        var flyoutTarget          = flyout;
        var flyoutName            = flyoutTarget.getAttribute( 'data-flyout-target' );
        var flyoutTriggerSelector = '[data-flyout-target="' + flyoutName + '"][data-flyout-trigger]';
        var flyoutTriggers        = document.querySelectorAll( flyoutTriggerSelector );
        var isExpanded            = ( flyout.getAttribute( 'data-flyout-container' ) == 'collapsed' ) ? false : true;
        var flyoutCallback        = null;
        var callbackName;

        // flyoutCallback will be called if you set flyoutOverride to 'true' (string val).
        // The first (and only) argument to flyoutCallback will be e (the click event).
        // If you do this, you will need to open the flyout on your own. You will also need to obtain the field to update.
        // See toggle() above for how to do this. Or, you could just call toggle() on your own and pass e along to it.
        var flyoutOverride = flyout.getAttribute( 'data-flyout-override' );

        if( flyoutOverride && flyoutOverride !== 'false' && flyoutOverride !== 'custom' ) {
            callbackName = flyout.getAttribute( 'data-flyout-callback' ); 
            flyoutCallback = ( callbackName == undefined ) ? null : callbackName; // string, name of function to call
            if( flyoutCallback == null ) { console.warn( 'Flyouts Plugin did not detect custom callback for override, Node:', flyout ); }
        }

        if( flyoutTarget == null ) { console.warn( 'Flyout Plugin did not detect target, Node:', flyout ); }
        if( flyoutTriggers.length == 0 ) { console.warn( 'Flyout Plugin did not detect trigger, Node:', flyout) ; }

        // As you instantiate new flyoutPlugins, insert them in the flyoutStore object, indexed by the name of the flyout.
        this.storeFlyout(
            flyoutName,
            new flyoutPlugin.launch({
                id               : flyoutName,
                container        : flyoutTarget, 
                triggerSelector  : flyoutTriggerSelector, 
                target           : flyoutTarget, 
                override         : flyoutOverride,
                customCallback   : flyoutCallback,
                expanded         : isExpanded
            })
        );

        function findAncestor(el, sel) {
            while ((el = el.parentElement) && !((el.matches || el.matchesSelector).call(el,sel)));
            return el;
        }
    
    }

    return { 
        launch               : Constructor, 
        registerFlyout       : registerFlyout, 
        storeFlyout          : setFlyout, 
        getFlyout            : getFlyout, 
		getFlyouts           : getFlyouts,
        addCloseFlyoutEvents : addCloseFlyoutEvents
    };  
  
})();

(function() {

    var initFlyouts = function() {
        
        var flyouts = document.querySelectorAll( '[data-flyout-container]' );
        if( flyouts == null ) return; 
    
        for( var i = 0; i < flyouts.length; i++ ) {
            flyoutPlugin.registerFlyout( flyouts[ i ], i );
        }

        flyoutPlugin.addCloseFlyoutEvents();
        
    }

    if( typeof runOnAppStart == "function" ) {
        runOnAppStart( 'initializeFlyouts', initFlyouts );
    } else { 
        initFlyouts();
    }    

})();