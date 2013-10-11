transition-auto
===============

At some point in your web development journey, you have probably wanted to transition the height 
of an element from some initial size, to auto. Well that should be easy right? Wrong - it's harder 
than finding the Higgs Boson with a magnifying glass. Luckily you've come to the right place.

The following is a simple 3 step process for `height: auto;` transitioning any element:

1. Drop the JS file from this repo in your page
2. Add initial height and transition values to elements in CSS as you normally would, for example:

    ```css
    div {
        height: 0px; /* this can be any value */
        overflow: hidden;
        transition: height 1s;
    }
    ```

3. Add or remove the boolean attribute `reveal=""` on any element and it will magically transition to and from auto height.

You don't have to write any JS other than to add/remove 1 attribute, you don't have to do anything crazy with your 
style sheets - it all Just Works™. If you still don't believe it could be that easy, here's a demo: 
http://codepen.io/csuwldcat/pen/ACKjz - what now!

That's it, Merry Christmas internet.
