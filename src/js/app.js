require('../index.html');
import '../scss/styles.scss';
import Draggabilly from 'draggabilly';
import $ from 'jquery';

// Aspect ratio for grid elements
let aspectRatio = 5 / 6;

$(function() {

  function calc() {
    let containerWidth = $('.vg-container').width();
    let containerHeight = $('.vg-container').outerHeight();
    let numRects = $('.vg-item').length;
    console.log(containerWidth, containerHeight, numRects);
    
    if (containerWidth < 0 || containerHeight < 0) {
      throw new Error('Container must have a non-negative area');
    }
    if (numRects < 1 || !Number.isInteger(numRects)) {
      throw new Error('Number of shapes to place must be a positive integer');
    }
    if (isNaN(aspectRatio)) {
      throw new Error('Aspect ratio must be a number');
    }

    let best = { area: 0, cols: 0, rows: 0, width: 0, height: 0 };

    const startCols = numRects;
    const colDelta = -1;

    for (let cols = startCols; cols > 0; cols += colDelta) {
      const rows = Math.ceil(numRects / cols);
      const hScale = containerWidth / (cols * aspectRatio);
      const vScale = containerHeight / rows;
      let width;
      let height;
      
      if (hScale <= vScale) {
        width = containerWidth / cols;
        height = width / aspectRatio;
      } else {
        height = containerHeight / rows;
        width = height * aspectRatio;
      }
      const area = width * height;
      if (area > best.area) {
        best = { area, width, height, rows, cols };
      }
    }

    $('.vg-item').css('flex-basis', best.width + 'px');
    $('.vg-item').css('height', best.height + 'px');

  }

  $('#vg-add').click(function () {
    let num = $('.vg-item').length + 1;
    $('.vg-container').append('<div class="vg-item"><div class="vg-item-inner">' + num + '</div></div>');
    calc();
  });

  $('#vg-remove').click(function () {
    ($('.vg-item').length > 1) && $('.vg-item:last-child').remove();
    calc();
  });

  $(window).resize(calc);

  calc();

  let elem = document.querySelector('.vg-own');
  let draggie = new Draggabilly(elem, {
    containment: true
  });

});

