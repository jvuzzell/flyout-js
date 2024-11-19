# Flyouts-js

Plugin for creating and managing collapsible content areas like additional information screens or tutorials

<br>

**Table of contents** 
- [Installation](#installation)
- Examples
    - [Basic Usage](#basic-usage)
    - [Custom Trigger Events](#trigger-events)
    - [Custom Callbacks](#custom-callback)
- [Public Methods](#public-methods) 
    - Flyouts - Class
        - .collapseAll()
        - .registerFlyout()
        - .getFlyout()
        - .getFlyouts()
    - Flyout - Instance
        - .toggle()
        - .collapse()
        - .isExpanded()
    - InitFlyout()
- [HTML Attributes](#html-attributes)

<br>

---

## Installation

<br>

You can use NPM to download package into your project 
```
npm install flyout-overlay-js
```
OR you can import the module directly in your project with ES6 Modules

```HTML
<script type="module">
    import { Flyouts, initFlyouts } from './flyout-overlay-js/flyouts.js';
</script>
```

<br>

---

## Basic Usage
See [*'/demo/basic-usage.html'*](https://github.com/jvuzzell/flyout-overlay-js/tree/main/demo) in repo for complete example

<br>

**CSS**
```HTML
<link rel="stylesheet" href="./flyout-overlay-js/flyouts.css">
```

**HTML**
```HTML
<button data-flyout-trigger data-flyout-target="exampleFlyout">
    <strong>></strong> Open Flyout
</button> 

<div class="flyout-containers">
    <div class="flyout-container" data-flyout-container="collapsed" data-flyout-target="exampleFlyout">
        <h1>Flyout</h1>
        <button type="button" data-close-flyout="exampleFlyout">
            <strong>&times;</strong> Close
        </button>
    </div>
</div>
```

**JavaScript**
```Javascript
<script type="module">
    // ES6 Module Import
    import {Flyouts, initFlyouts} from '/flyout-overlay-js/flyouts.js';

    // Initialize Plugin
    initFlyouts(); 
</script>
```

<br>

---


<br>

---

## Custom Trigger Event
See [*'/demo/basic-usage.html'*](https://github.com/jvuzzell/flyout-overlay-js/tree/main/demo) in repo for complete example

<br>

By default the trigger event for modals is a click event. However, you can use other events by updating the **[data-flyout-trigger]** attribute. 

<br>

**HTML**
```HTML
<button data-flyout-trigger="mouseover" data-flyout-target="exampleFlyout">
    <strong>></strong> Open Flyout
</button> 

<div class="flyout-containers">
    <div class="flyout-container" data-flyout-container="collapsed" data-flyout-target="exampleFlyout">
        <h1>Flyout</h1>
        <button type="button" data-close-flyout="exampleFlyout">
            <strong>&times;</strong> Close
        </button>
    </div>
</div>
```
<br>

---

## Custom Callback
See [*'/demo/basic-usage.html'*](https://github.com/jvuzzell/flyout-overlay-js/tree/main/demo) in repo for complete example

<br>

The default event for triggering expandable expansion can be overwritten by adding [data-flyout-override] and [data-flyout-callback] attributes to the expandable trigger. If developers do this, they become responsible for toggling the expandable expansion while adding custom behavior around the interaction.

<br>

**HTML**
```HTML
<div class="flyout-container" data-flyout-container="collapsed" data-flyout-target="exampleFlyout"  data-flyout-override=true data-flyout-callback="exampleCallback">
    <h1>Flyout</h1>
    <button type="button" data-close-flyout="exampleFlyout">
        <strong>&times;</strong> Close
    </button> 
</div>
```

**JavaScript**
```HTML
<script type="module">
    // ES6 Module Import
    import { Flyouts, initFlyouts } from './flyout-overlay-js/flyouts.js'; 

    // Initialize Plugin
    initFlyouts();

    // Custom callback where the developer has to trigger the flyout's visibility 
    window.exampleCallback = ( event ) => {
        let targetName = event.target.getAttribute( 'data-flyout-target' ); 
        Flyouts.getFlyout( targetName ).toggle(); 
        alert( 'Custom callback triggered on ' + targetName + '; expanded = ' + Flyouts.getFlyout( targetName ).getSettings().expanded );
    } 
</script>
```

<br>

---

## Public Methods

<br>

|Object|Method|Description|
|---|---|---|
|Flyouts|.collapseAll()|Collapses all flyouts outside of accordions|
||.getFlyout( name )| Expected string to equal value of [data-flyout-target] attribute on expandable HTML element. Returns single HTML element for corresponding expandable.  |
||.getFlyouts()|Returns HTMLCollection of all flyouts.|
||.registerFlyout( HTMLelement )|Expected HTML element; Takes an HTML element representing the expandable. The attributes are read from the expandable element and used to build a expandable instance.|
|Flyout|.toggle()|Toggles the value of the data attribute [data-flyout-container] between "collapsed" and "expanded"|
||.collapse()|Changes the value of the data attribute [data-flyout-container] to "collapsed"|
||.isExpanded()|Returns boolean of true or false representing whether the expandable is expanded or collapsed| 
|initFlyouts()||Initializes flyouts in the document by calling the Flyouts.registerFlyout() HTML element.|

<br>

---

## HTML Attribute

<bR>

| HTML Element | Attribute | Description |
|--------------|-----------|-------------|
(Pending)
