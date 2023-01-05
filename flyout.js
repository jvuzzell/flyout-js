export let Flyouts = (function() {

    let store = {};

    let Constructor = function( options ) {

        let publicMethods = {};
        let settings; 

        // Private
        const expand = ( target ) => {
            target.setAttribute( 'data-flyout-container', 'expanded' ); 
            publicMethods.updateState( { 'expanded' : true } );

            document.querySelector( 'body' ).setAttribute( 'data-flyout', 'active' );
            document.querySelector( 'body' ).setAttribute( 'data-overlay', 'active' );
        }

        const collapse = ( target ) => {

            target.setAttribute( 'data-flyout-container', 'collapsed' );
            publicMethods.updateState( { 'expanded' : false } );

        }

        // Public
        publicMethods.getSettings = () => {
            return settings;
        }

        publicMethods.collapse = ( target ) => {
            collapse( target );
        }

        publicMethods.toggle = ( event ) => {
            if( event !== undefined ) {
                // Check for field to update based on result of Flyout Transaction
                settings.fieldToUpdate = ( event.target.getAttribute( 'data-target-update-field' ) == undefined ) ? null : event.target.getAttribute( 'data-target-update-field' ); 
            }

            if( settings.container.getAttribute( 'data-flyout-container' ) == 'collapsed' ) {
                expand( settings.target );
            } else {
                collapse( settings.target );
            }        

        }

        publicMethods.getFieldToUpdate = () => {
            return ( settings.fieldToUpdate == undefined ) ? null : settings.fieldToUpdate;  
        }

        publicMethods.init = ( options ) => {
            
            settings = options; // This makes arguments available in the scope of other methods within this object

            if( settings == null || settings == undefined ) { console.error( 'Flyout Plugin, settings not provided upon initialization' ); return; } 

            let triggerSelector = settings.triggerSelector; 
            let triggerCollection = document.querySelectorAll( triggerSelector );            

            if( settings.override === 'true' ) {

                try {    
                    settings.callback = ( event ) => window[ thisFlyoutSettings.customCallback ]( event );
                } catch( error ) {
                    console.error( 'Flyout Plugin, custom callback for Flyout ID: ' + settings.id + '  failed. Message: ' + error.message );
                }

            } else {

                settings.callback = ( event ) => Flyouts.getFlyout( settings.id ).toggle( event );

            }

            for( let i = 0; i < triggerCollection.length; i++ ) {
                triggerCollection[ i ].setAttribute( 'data-trigger-id', i );
                let triggerEvent = triggerCollection[ i ].getAttribute( 'data-flyout-trigger' ); 
                triggerEvent = ( triggerEvent !== undefined && triggerEvent !== '' ) ? triggerEvent : 'click'; 
                settings.triggerEvent = triggerEvent;

                triggerCollection[ i ].addEventListener( triggerEvent, settings.callback );
            }

            function transitionEnd( event ) { 

                let multipleOpenFlyouts = document.querySelectorAll( '[data-flyout-container="expanded"]' );
  
                if( multipleOpenFlyouts.length < 1 ) { 
                        document.querySelector( 'body' ).setAttribute( 'data-flyout', 'inactive' );
                        document.querySelector( 'body' ).setAttribute( 'data-overlay', 'inactive' );
                }

            }

            settings.target.addEventListener( 'transitionend', transitionEnd ); 

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

    const setFlyout = function( name, obj ) {
        store[ name ] = obj;
    }

    const getFlyout = function( name ) {
        return store[ name ];
    }
	
    const getFlyouts = function( name ) {
        return store;
    }

    const collapseAll = function() {

        let flyouts = Flyouts.getFlyouts();

        for( let key in flyouts ) { 

            let flyout = flyouts[ key ]; 
            flyout.collapse( flyout.getSettings().target );

        }

    }

    const addCloseFlyoutEvents = function() {

        let flyoutParentContainer = document.querySelector( '.flyout-containers' );
   
        window.addEventListener( 'click', function( event ) {

            // Collapse all containers if Fly-Container tag is clicked
            // Allow users to exit flyout without having to click 'close' button
            if( event.target === flyoutParentContainer ) { 
                Flyouts.collapseAll();
                return;
            }
            
            let closeTrigger = event.target.getAttribute( 'data-close-flyout' ); 
            // If you click the X button, close that single flyout.
            if( closeTrigger !== null ) { 
                Flyouts.getFlyout( closeTrigger ).toggle();
            }

        });

    }

    const registerFlyout = function( flyout, iterator ) {

        let flyoutTarget          = flyout;
        let flyoutName            = flyoutTarget.getAttribute( 'data-flyout-target' );
        let flyoutTriggerSelector = '[data-flyout-target="' + flyoutName + '"][data-flyout-trigger]';
        let flyoutTriggers        = document.querySelectorAll( flyoutTriggerSelector );
        let isExpanded            = ( flyout.getAttribute( 'data-flyout-container' ) == 'collapsed' ) ? false : true;
        let flyoutCallback        = null;
        let callbackName;

        // flyoutCallback will be called if you set flyoutOverride to 'true' (string val).
        // The first (and only) argument to flyoutCallback will be e (the click event).
        // If you do this, you will need to open the flyout on your own. You will also need to obtain the field to update.
        // See toggle() above for how to do this. Or, you could just call toggle() on your own and pass e along to it.
        let flyoutOverride = flyout.getAttribute( 'data-flyout-override' );

        if( flyoutOverride && flyoutOverride !== 'false' && flyoutOverride !== 'custom' ) {
            callbackName = flyout.getAttribute( 'data-flyout-callback' ); 
            flyoutCallback = ( callbackName == undefined ) ? null : callbackName; // string, name of function to call
            if( flyoutCallback == null ) { console.warn( 'Flyouts Plugin did not detect custom callback for override, Node:', flyout ); }
        }

        if( flyoutTarget == null ) { console.warn( 'Flyout Plugin did not detect target, Node:', flyout ); }
        if( flyoutTriggers.length == 0 ) { console.warn( 'Flyout Plugin did not detect trigger, Node:', flyout) ; }

        // As you instantiate new Flyouts, insert them in the flyoutStore object, indexed by the name of the flyout.
        this.storeFlyout(
            flyoutName,
            new Flyouts.launch({
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
        addCloseFlyoutEvents : addCloseFlyoutEvents, 
        collapseAll          : collapseAll
    };  
  
})();

export const initFlyouts = function() {
    
    let flyouts = document.querySelectorAll( '[data-flyout-container]' );
    if( flyouts == null ) return; 

    for( var i = 0; i < flyouts.length; i++ ) {
        Flyouts.registerFlyout( flyouts[ i ], i );
    }

    Flyouts.addCloseFlyoutEvents();
    
}