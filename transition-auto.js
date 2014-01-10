(function(doc){
	
	/* feature detection for browsers that report different values for scrollHeight when an element's overflow is hidden vs visible (Firefox, IE) */
	var test = doc.documentElement.appendChild(doc.createElement('x-reveal-test'));
		test.innerHTML = '-';
		test.style.cssText = 'display: block !important; height: 0px !important; padding: 0px !important; font-size: 0px !important; border-width: 0px !important; line-height: 1px !important; overflow: hidden !important;';
	var scroll = test.scrollHeight || 2;
	doc.documentElement.removeChild(test);
	
	var loading = true,
      numReg = /^([0-9]*\.?[0-9]*)(.*)/,
      skipFrame = function(fn){
        requestAnimationFrame(function(){
        requestAnimationFrame(fn);
        });
      },
      /* 2 out of 3 uses of this function are purely to work around Chrome's catastrophically busted implementation of auto value CSS transitioning */
      revealFrame = function(el, state, height){
        el.setAttribute('reveal-transition', 'frame');
        el.style.height = height;
        skipFrame(function(){
          el.setAttribute('reveal-transition', state);
          el.style.height = '';
        });
      },
      transitionend = function(e){
        var node = e.target;
        if (node.hasAttribute('reveal')) {
          if (node.getAttribute('reveal-transition') == 'running') revealFrame(node, 'complete', '');
        } 
        else {
          node.removeAttribute('reveal-transition');
          node.style.height = '';
        }
      },
      animationstart = function(e){
        var node = e.target,
          name = e.animationName;   
        if (name == 'reveal' || name == 'unreveal') {
        
          if (loading) return revealFrame(node, 'complete', 'auto');
          
          var style = getComputedStyle(node),
              offset = (Number(style.paddingTop.match(numReg)[1])) +
                  (Number(style.paddingBottom.match(numReg)[1])) +
                  (Number(style.borderTopWidth.match(numReg)[1])) +
                  (Number(style.borderBottomWidth.match(numReg)[1]));
                 
          if (name == 'reveal'){
            node.setAttribute('reveal-transition', 'running');
            node.style.height = node.scrollHeight - (offset / scroll) + 'px';
          }
          else {
            if (node.getAttribute('reveal-transition') == 'running') node.style.height = '';
            else revealFrame(node, 'running', node.scrollHeight - offset + 'px');
          }
        }
      };

    if (!doc.addEventListener) {
        // attachEvent for IE :|
        doc.attachEvent('animationstart', animationstart);
        doc.attachEvent('webkitAnimationStart', animationstart);
        doc.attachEvent('transitionend', transitionend);
        doc.attachEvent('webkitTransitionEnd', transitionend);
    }
    else {
        doc.addEventListener('animationstart', animationstart, false);
        doc.addEventListener('webkitAnimationStart', animationstart, false);
        doc.addEventListener('transitionend', transitionend, false);
        doc.addEventListener('webkitTransitionEnd', transitionend, false);
    }

	/*
		Batshit readyState/DOMContentLoaded code to dance around Webkit/Chrome animation auto-run weirdness on initial page load.
		If they fixed their code, you could just check for if(doc.readyState != 'complete') in animationstart's if(loading) check
	*/
	if (doc.readyState == 'complete') {
		skipFrame(function(){
			loading = false;
		});
	}
		});
	
	else {
        if (!doc.addEventListener) {
            doc.attachEvent('DOMContentLoaded', function(e){
                skipFrame(function(){
                    loading = false;
                });
            });
        } else {
            doc.addEventListener('DOMContentLoaded', function(e){
                skipFrame(function(){
                    loading = false;
                });
            }, false);
        }

    }

	/* Styles that allow for 'reveal' attribute triggers */
	var styles = doc.createElement('style'),
		t = 'transition: none; ',
		au = 'animation: reveal 0.001s; ',
		ar = 'animation: unreveal 0.001s; ',
		clip = ' { from { clip: rect(0px, auto, auto, auto); } to { clip: rect(1px, auto, auto, auto); } }',
		r = 'keyframes reveal' + clip,
		u = 'keyframes unreveal' + clip;
	
	styles.textContent = '[reveal] { -webkit-'+ au +'-moz-'+ au + au +'}' +
		'[reveal-transition="frame"] { -webkit-' + t + '-moz-' + t + t + 'height: auto; }' +
		'[reveal-transition="complete"] { height: auto; }' +
		'[reveal-transition]:not([reveal]) { -webkit-'+ ar +'-moz-'+ ar + ar +'}' +
		'@-webkit-' + r + '@-moz-' + r + r +
		'@-webkit-' + u + '@-moz-' + u + u;
	
	doc.querySelector('head').appendChild(styles);
	
})(document);