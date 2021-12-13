/*!
 * vue-circle-slider v0.1.0 
 * (c) 2021 
 * Released under the undefined License.
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

var castValue = function castValue(value) {
  if (!value) return 0;
  return parseInt(value);
};
var debounce = function debounce(fn, wait, callFirst) {
  var timeout;
  return function () {
    if (!wait) {
      return fn.apply(this, arguments);
    }

    var context = this;
    var args = arguments;
    var callNow = callFirst && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;

      if (!callNow) {
        return fn.apply(context, args);
      }
    }, wait);

    if (callNow) {
      return fn.apply(this, arguments);
    }
  };
};
var throttle = function throttle(fn, interval, callFirst) {
  var wait = false;
  var callNow = false;
  return function () {
    callNow = callFirst && !wait;
    var context = this;
    var args = arguments;

    if (!wait) {
      wait = true;
      setTimeout(function () {
        wait = false;

        if (!callFirst) {
          return fn.apply(context, args);
        }
      }, interval);
    }

    if (callNow) {
      callNow = false;
      return fn.apply(this, arguments);
    }
  };
};

var script = {
  name: 'CircleSlider',
  props: {
    startAngleOffset: {
      type: Number,
      default: 90 // degrees 

    },
    value: [Number, Object, String],
    side: {
      type: Number,
      default: 100
    },
    stepSize: {
      type: Number,
      default: 1
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 100
    },
    circleColor: {
      type: String,
      default: '#334860'
    },
    circleFill: {
      type: String,
      default: 'none'
    },
    progressColor: {
      type: String,
      default: '#00be7e'
    },
    minKnobColor: {
      type: String,
      default: '#00be7e'
    },
    maxKnobColor: {
      type: String,
      default: '#00be7e'
    },
    minKnobRadius: {
      type: Number,
      default: null
    },
    minKnobRadiusRel: {
      type: Number,
      default: 7
    },
    maxKnobRadius: {
      type: Number,
      default: null
    },
    maxKnobRadiusRel: {
      type: Number,
      default: 7
    },
    circleWidth: {
      type: Number,
      default: null
    },
    circleWidthRel: {
      type: Number,
      default: 20
    },
    progressWidth: {
      type: Number,
      default: null
    },
    progressWidthRel: {
      type: Number,
      default: 10
    },
    counterClockwise: {
      type: Boolean,
      default: false
    },
    rangeSlider: {
      type: Boolean,
      default: false
    },
    debounceInput: {
      type: Number,
      default: 1000
    },
    throttleScroll: {
      type: Number,
      default: 30
    },
    limitMin: {
      type: Number,
      default: 0
    },
    limitMax: {
      type: Number,
      default: 100
    }
  },
  data: function data() {
    return {
      mousemoveTicks: 0,
      currentMinStepIndex: 0,
      currentMaxStepIndex: 0,
      relativeX: 0,
      relativeY: 0,
      redundantAngle: 0,
      currentKnob: '',
      sliderValues: {
        maxValue: 0,
        minValue: 0
      }
    };
  },
  computed: {
    stepsCount: function stepsCount() {
      return 1 + (this.max - this.min) / this.stepSize;
    },
    steps: function steps() {
      var _this = this;

      return Array.from({
        length: this.stepsCount
      }, function (_, i) {
        return _this.min + i * _this.stepSize;
      });
    },
    radius: function radius() {
      var maxCurveWidth = Math.max(this.mainCircleStrokeWidth, this.pathStrokeWidth);
      return this.side / 2 - Math.max(maxCurveWidth, this.minKnobRadiusFinal * 2, this.maxKnobRadiusFinal * 2) / 2;
    },
    sliderTolerance: function sliderTolerance() {
      return this.radius / 2;
    },
    stepsLength: function stepsLength() {
      return this.steps.length - 1;
    },
    center: function center() {
      return this.side / 2;
    },
    minAngleFinal: function minAngleFinal() {
      if (this.counterClockwise) return this.minAngle + Math.PI / 2 - this.startAngleOffsetRadians;
      return this.minAngle + this.startAngleOffsetRadians;
    },
    maxAngleFinal: function maxAngleFinal() {
      if (this.counterClockwise) return this.maxAngle + Math.PI / 2 - this.startAngleOffsetRadians;
      return this.maxAngle + this.startAngleOffsetRadians;
    },
    mainCircleStrokeWidth: function mainCircleStrokeWidth() {
      return this.circleWidth || this.side / 2 / this.circleWidthRel;
    },
    pathDirection: function pathDirection() {
      if (this.counterClockwise) return this.maxAngle - this.minAngle < Math.PI ? 0 : 1;
      return this.maxAngleFinal - (this.minAngleFinal - Math.PI / 2) < 3 / 2 * Math.PI ? 0 : 1;
    },
    pathX: function pathX() {
      if (this.counterClockwise) return this.center + this.radius * Math.sin(this.maxAngleFinal);
      return this.center + this.radius * Math.cos(this.maxAngleFinal);
    },
    pathY: function pathY() {
      if (this.counterClockwise) return this.center + this.radius * Math.cos(this.maxAngleFinal);
      return this.center + this.radius * Math.sin(this.maxAngleFinal);
    },
    pathStrokeWidth: function pathStrokeWidth() {
      return this.progressWidth || this.side / 2 / this.progressWidthRel;
    },
    minKnobRadiusFinal: function minKnobRadiusFinal() {
      return this.minKnobRadius || this.side / 2 / this.minKnobRadiusRel;
    },
    maxKnobRadiusFinal: function maxKnobRadiusFinal() {
      return this.maxKnobRadius || this.side / 2 / this.maxKnobRadiusRel;
    },
    pathD: function pathD() {
      var parts = [];
      parts.push('M' + this.minKnobX);
      parts.push(this.minKnobY);
      parts.push('A');
      parts.push(this.radius);
      parts.push(this.radius);
      parts.push(0);
      parts.push(this.pathDirection);
      parts.push(this.counterClockwise ? 0 : 1);
      parts.push(this.pathX);
      parts.push(this.pathY);
      return parts.join(' ');
    },
    angleUnit: function angleUnit() {
      return Math.PI * 2 / this.stepsLength;
    },
    minAngle: function minAngle() {
      return Math.min(this.angleUnit * this.currentMinStepIndex, Math.PI * 2 - Number.EPSILON);
    },
    maxAngle: function maxAngle() {
      return Math.min(this.angleUnit * this.currentMaxStepIndex, Math.PI * 2 - Number.EPSILON) - 0.0001; // correct for 100% value
    },
    currentMinStepValue: function currentMinStepValue() {
      return this.steps[this.currentMinStepIndex];
    },
    currentMaxStepValue: function currentMaxStepValue() {
      return this.steps[this.currentMaxStepIndex];
    },
    sliderAngle: function sliderAngle() {
      return (Math.atan2(this.relativeY - this.center, this.relativeX - this.center) + this.startAngleOffsetRadians * 3 - this.redundantAngle) % (Math.PI * 2);
    },
    isTouchWithinSliderRange: function isTouchWithinSliderRange() {
      var touchOffset = Math.sqrt(Math.pow(Math.abs(this.relativeX - this.center), 2) + Math.pow(Math.abs(this.relativeY - this.center), 2));
      return Math.abs(touchOffset - this.radius) <= this.sliderTolerance;
    },
    startAngleOffsetRadians: function startAngleOffsetRadians() {
      return this.startAngleOffset / 180 * Math.PI;
    },
    minKnobX: function minKnobX() {
      if (this.counterClockwise) return this.center + this.radius * Math.sin(this.minAngleFinal);
      return this.center + this.radius * Math.cos(this.minAngleFinal);
    },
    minKnobY: function minKnobY() {
      if (this.counterClockwise) return this.center + this.radius * Math.cos(this.minAngleFinal);
      return this.center + this.radius * Math.sin(this.minAngleFinal);
    },
    limitMinFit: function limitMinFit() {
      return this.fitToStep(this.limitMin);
    },
    limitMaxFit: function limitMaxFit() {
      return this.fitToStep(this.limitMax);
    },
    processedValue: function processedValue() {
      if (_typeof(this.value) === 'object') {
        return {
          maxValue: this.fitToStep(castValue(this.value.maxValue)),
          minValue: this.fitToStep(castValue(this.value.minValue))
        };
      }

      return this.fitToStep(castValue(this.value));
    }
  },
  watch: {
    processedValue: {
      handler: function handler(val) {
        if (_typeof(val) === 'object') {
          this.updateCurrentValue(val.maxValue, this.sliderValues.maxValue, false);
          this.updateCurrentValue(val.minValue, this.sliderValues.minValue, true);
        } else this.updateCurrentValue(val, this.sliderValues.maxValue, false);
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    updateCurrentValue: function updateCurrentValue(newValue, prevValue, isMinValue) {
      if (Math.abs(newValue - prevValue) === this.stepSize) {
        isMinValue ? this.sliderValues.minValue = newValue : this.sliderValues.maxValue = newValue;
        this.updateFromPropValue(this.sliderValues);
      } else {
        isMinValue ? this.sliderValues.minValue = newValue : this.sliderValues.maxValue = newValue;
      }
    },
    updateFromPropValue: function updateFromPropValue(val) {
      var valueLimitExceeded = this.checkIfLimitExceeded(val);

      if (valueLimitExceeded) {
        this.emitMinMaxValues();
        return;
      }

      if (val.minValue === this.currentMinStepValue && val.maxValue === this.currentMaxStepValue) return;

      if (val.maxValue !== this.currentMaxStepValue) {
        this.currentKnob = 'max';
        val.maxValue < this.sliderValues.minValue ? this.setDefaultMaxValue() : this.updateFromPropMaxValue(val.maxValue);
        return;
      }

      if (val.minValue !== this.currentMinStepValue) {
        this.currentKnob = 'min';
        val.minValue > this.sliderValues.maxValue ? this.setDefaultMinValue() : this.updateFromPropMinValue(val.minValue);
      }
    },
    checkIfLimitExceeded: function checkIfLimitExceeded(val) {
      return _typeof(this.processedValue) === 'object' ? val.minValue < this.limitMinFit || val.maxValue > this.limitMaxFit : val.maxValue > this.limitMaxFit;
    },
    fitToStep: function fitToStep(val) {
      return Math.round(val / this.stepSize) * this.stepSize;
    },
    handleClick: function handleClick(e) {
      this.setNewPosition(e);

      if (this.isTouchWithinSliderRange) {
        var newAngle = this.sliderAngle;
        this.defineCurrentKnob(newAngle);
        if (this.currentKnob === 'min') this.animateSlider(this.minAngle, newAngle);else if (this.currentKnob === 'max') this.animateSlider(this.maxAngle, newAngle);
      }
    },
    handleMouseDown: function handleMouseDown(e) {
      e.preventDefault();
      this.setNewPosition(e);

      if (this.isTouchWithinSliderRange) {
        var newAngle = this.sliderAngle;
        this.defineCurrentKnob(newAngle);
      }

      window.addEventListener('mousemove', this.handleWindowMouseMove);
      window.addEventListener('mouseup', this.handleMouseUp);
    },
    handleMouseUp: function handleMouseUp(e) {
      e.preventDefault();
      window.removeEventListener('mousemove', this.handleWindowMouseMove);
      window.removeEventListener('mouseup', this.handleMouseUp);
      this.mousemoveTicks = 0;
    },
    handleWindowMouseMove: function handleWindowMouseMove(e) {
      e.preventDefault();
      if (this.minAngle >= this.maxAngle && this.maxAngle > 0) return;

      if (this.mousemoveTicks < 5) {
        this.mousemoveTicks++;
        return;
      }

      this.setNewPosition(e);
      this.updateSlider();
    },
    handleWheelScroll: function handleWheelScroll(e) {
      e.preventDefault();
      if (this.rangeSlider) return;
      this.currentKnob = 'max';
      var valueFromScroll = e.wheelDelta > 0 ? this.sliderValues.maxValue + this.stepSize : this.sliderValues.maxValue - this.stepSize;

      if (this.currentMaxStepValue === 0 && e.wheelDelta < 0 || this.currentMaxStepValue === 100 && e.wheelDelta > 0) {
        return;
      }

      this.updateFromPropMaxValue(valueFromScroll);
    },
    handleTouchMove: function handleTouchMove(e) {
      this.$emit('touchmove'); // Do nothing if two or more fingers used

      if (e.targetTouches.length > 1 || e.changedTouches.length > 1 || e.touches.length > 1) {
        return true;
      }

      var lastTouch = e.targetTouches.item(e.targetTouches.length - 1);
      this.setNewPosition(lastTouch);

      if (this.isTouchWithinSliderRange) {
        e.preventDefault();
        var newAngle = this.sliderAngle;
        this.defineCurrentKnob(newAngle);
        this.updateSlider();
      }
    },
    updateMinAngle: function updateMinAngle(angle) {
      this.updateCurrentMinStepFromAngle(angle);
      this.emitMinMaxValues();
    },
    updateMaxAngle: function updateMaxAngle(angle) {
      this.updateCurrentMaxStepFromAngle(angle);
      this.emitMinMaxValues();
    },
    updateFromPropMinValue: function updateFromPropMinValue(minValue) {
      var previousAngle = this.minAngle;
      this.updateCurrentMinStepFromValue(minValue);
      this.animateSlider(previousAngle, this.minAngle);
    },
    updateFromPropMaxValue: function updateFromPropMaxValue(maxValue) {
      var previousAngle = this.maxAngle;
      this.updateCurrentMaxStepFromValue(maxValue);
      this.animateSlider(previousAngle, this.maxAngle);
    },
    updateSlider: function updateSlider() {
      var angle = this.sliderAngle;
      this.defineCurrentKnob(angle);
      if (this.currentKnob === 'max' && Math.abs(angle - this.maxAngle) < Math.PI) this.updateMaxAngle(angle);else if (this.currentKnob === 'min' && Math.abs(angle - this.minAngle) < Math.PI) this.updateMinAngle(angle);
    },
    animateSlider: function animateSlider(startAngle, endAngle) {
      var _this2 = this;

      var direction = startAngle < endAngle ? 1 : -1;
      var curveAngleMovementUnit = direction * this.angleUnit * 2 / this.stepSize;

      var animate = function animate() {
        if (Math.abs(endAngle - startAngle) < Math.abs(2 * curveAngleMovementUnit)) {
          if (_this2.currentKnob === 'max' && endAngle > 0) _this2.updateMaxAngle(endAngle);else if (_this2.currentKnob === 'min') _this2.updateMinAngle(endAngle);
        }
      };

      window.requestAnimationFrame(animate);
    },
    defineInitialCurrentStepIndex: function defineInitialCurrentStepIndex() {
      for (var stepIndex in this.steps) {
        if (this.steps[stepIndex] === this.sliderValues.minValue) {
          this.currentMinStepIndex = parseInt(stepIndex);
        }

        if (this.steps[stepIndex] === this.sliderValues.maxValue) {
          this.currentMaxStepIndex = parseInt(stepIndex);
        }
      }
    },
    updateCurrentMinStepFromValue: function updateCurrentMinStepFromValue(minValue) {
      for (var i = 0; i < this.stepsLength; i++) {
        if (minValue <= this.steps[i]) {
          this.currentMinStepIndex = i;
          return;
        }
      }
    },
    updateCurrentMaxStepFromValue: function updateCurrentMaxStepFromValue(maxValue) {
      for (var i = 0; i < this.stepsLength; i++) {
        if (maxValue <= this.steps[i]) {
          this.currentMaxStepIndex = i;
          return;
        }
      }

      this.currentMaxStepIndex = this.stepsLength;
    },
    updateCurrentMinStepFromAngle: function updateCurrentMinStepFromAngle(angle) {
      var stepIndex = this.getStepIndexFromAngle(angle);
      var limitMinIndex = this.limitMinFit / this.stepSize;
      this.currentMinStepIndex = this.steps[stepIndex] < this.limitMinFit ? limitMinIndex : stepIndex;
    },
    updateCurrentMaxStepFromAngle: function updateCurrentMaxStepFromAngle(angle) {
      var stepIndex = this.getStepIndexFromAngle(angle);
      var limitMaxIndex = this.limitMaxFit / this.stepSize;
      this.currentMaxStepIndex = this.steps[stepIndex] > this.limitMaxFit ? limitMaxIndex : stepIndex;
    },
    getStepIndexFromAngle: function getStepIndexFromAngle(angle) {
      var stepIndex = Math.round(angle / this.angleUnit);
      return Math.min(Math.max(stepIndex, 0), this.stepsLength);
    },
    setNewPosition: function setNewPosition(e) {
      var dimensions = this.containerElement.getBoundingClientRect();

      if (this.counterClockwise) {
        this.relativeX = dimensions.right - (e.clientX || e.x);
      } else this.relativeX = (e.clientX || e.x) - dimensions.left;

      this.relativeY = (e.clientY || e.y) - dimensions.top;
      this.calculateRedundantAngle();
    },
    calculateRedundantAngle: function calculateRedundantAngle() {
      var totalAngle = Math.atan2(this.relativeY - this.center, this.relativeX - this.center) + this.startAngleOffsetRadians * 3;

      if (this.startAngleOffsetRadians !== Math.PI / 2 && !this.redundantAngle) {
        this.redundantAngle = totalAngle - Math.PI * 2;
      }
    },
    setInitialPosition: function setInitialPosition() {
      var dimensions = this.containerElement.getBoundingClientRect();
      var x = (this.pathX + dimensions.left).toFixed(0);
      var y = (this.pathY + dimensions.top).toFixed(0);
      this.setNewPosition({
        x: x,
        y: y
      });
    },
    defineCurrentKnob: function defineCurrentKnob(newAngle) {
      if (!this.rangeSlider) {
        this.currentKnob = 'max';
        return;
      }

      if (newAngle > this.maxAngle) this.currentKnob = 'max';else if (newAngle < this.minAngle) this.currentKnob = 'min';else {
        var offsetFromMax = Math.abs(this.maxAngle - newAngle);
        var offsetFromMin = Math.abs(this.minAngle - newAngle);
        this.currentKnob = offsetFromMax <= offsetFromMin ? 'max' : 'min';
      } // Don't move any knob when minKnob is at 0 position and 
      // when it is clicked on its half which overflows "0"

      var halfKnobAngleInDegrees = this.minKnobRadiusFinal / (2 * Math.PI * this.radius / 360);
      var halfKnobAngleInRadians = halfKnobAngleInDegrees / 180 * Math.PI;
      if (newAngle + halfKnobAngleInRadians > Math.PI * 2) this.currentKnob = '';
    },
    setDefaultMinValue: function setDefaultMinValue() {
      var defaultMinValue = this.currentMinStepValue;
      this.updateFromPropMinValue(defaultMinValue);
      this.emitMinMaxValues();
    },
    setDefaultMaxValue: function setDefaultMaxValue() {
      var defaultMaxValue = this.currentMaxStepValue;
      this.updateFromPropMaxValue(defaultMaxValue);
      this.emitMinMaxValues();
    },
    emitMinMaxValues: function emitMinMaxValues() {
      if (_typeof(this.processedValue) !== 'object') {
        this.$emit('input', this.currentMaxStepValue);
      } else {
        this.$emit('input', {
          minValue: this.currentMinStepValue,
          maxValue: this.currentMaxStepValue
        });
      }
    },
    throttleWheelScroll: function throttleWheelScroll() {
      var _this3 = this;

      return throttle(function (e) {
        return _this3.handleWheelScroll(e);
      }, this.throttleScroll);
    },
    debounceUserInput: function debounceUserInput() {
      var _this4 = this;

      return debounce(function () {
        return _this4.updateFromPropValue(_this4.sliderValues);
      }, this.debounceInput);
    }
  },
  created: function created() {
    this.defineInitialCurrentStepIndex();
  },
  mounted: function mounted() {
    this.containerElement = this.$refs._svg;
    this.setInitialPosition();
    this.emitMinMaxValues();

    if (!this.rangeSlider) {
      this.containerElement.addEventListener('wheel', this.throttleWheelScroll());
    }

    window.addEventListener('input', this.debounceUserInput());
  },
  beforeDestroy: function beforeDestroy() {
    this.containerElement.removeEventListener('wheel', this.throttleWheelScroll());
    window.removeEventListener('input', this.debounceUserInput());
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
const __vue_script__ = script;

/* template */
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('svg',{ref:"_svg",attrs:{"width":_vm.side + 'px',"height":_vm.side + 'px',"viewBox":'0 0 ' + _vm.side + ' ' + _vm.side},on:{"touchmove":_vm.handleTouchMove,"click":_vm.handleClick,"mousedown":_vm.handleMouseDown,"mouseup":_vm.handleMouseUp}},[_c('g',[_c('circle',{attrs:{"stroke":_vm.circleColor,"stroke-width":_vm.mainCircleStrokeWidth,"cx":_vm.center,"cy":_vm.center,"r":_vm.radius,"fill":_vm.circleFill}}),_vm._v(" "),_c('path',{attrs:{"stroke":_vm.progressColor,"stroke-width":_vm.pathStrokeWidth,"d":_vm.pathD,"fill":"none"}}),_vm._v(" "),(_vm.rangeSlider)?_c('circle',{attrs:{"fill":_vm.minKnobColor,"r":_vm.minKnobRadiusFinal,"cx":_vm.minKnobX,"cy":_vm.minKnobY}}):_vm._e(),_vm._v(" "),_c('circle',{attrs:{"fill":_vm.maxKnobColor,"r":_vm.maxKnobRadiusFinal,"cx":_vm.pathX,"cy":_vm.pathY}})])])])};
var __vue_staticRenderFns__ = [];

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var CircleSlider = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

var VERSION = '0.1.0'; // Install the components

function install(Vue) {
  Vue.component('circle-slider', CircleSlider);
  /* -- Add more components here -- */
} // Expose the components
/* -- Plugin definition & Auto-install -- */

/* You shouldn't have to modify the code below */
// Plugin

var plugin = {
  /* eslint-disable no-undef */
  version: VERSION,
  install: install
};

var GlobalVue = null;

if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
}

exports.CircleSlider = CircleSlider;
exports.default = plugin;
exports.install = install;
