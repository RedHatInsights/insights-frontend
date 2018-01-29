# Directive Conventions

## What

Given the directive "some-component"
Use replace:true in the directive.
```javascript
function someComponent() {
    return {
        templateUrl: 'js/components/someComponent/someComponent.html',
        restrict: 'E',
        replace: true,
        controller: someComponentCtrl
    };
}

componentsModule.directive('someComponent', someComponent);
```

Always start the template with the prefixed component name.
```jade
insights-some-component.svg(tooltip='{{tooltip}}', ng-class='svgClass')
  md-icon(md-svg-src="{{icon}}" alt="{{tooltip}}")
  span.text(ng-hide='hideLabel') {{:: supportText}}
```

## Why

1. Using the replace:false causes divitus

example:

```jade
.svg(tooltip='{{tooltip}}', ng-class='svgClass')
  md-icon(md-svg-src="{{icon}}" alt="{{tooltip}}")
  span.text(ng-hide='hideLabel') {{:: supportText}}
```

would look like:
```html
<some-component>
  <div class="svg" tooltip='' ng-class=''>
    <md-icon></md-icon>
    <span></span>
  </div>
</some-component>
```

The extra div is bad

2. With replace:true you cannot use the same component name in the component

```jade
some-component.svg(tooltip='{{tooltip}}', ng-class='svgClass')
  md-icon(md-svg-src="{{icon}}" alt="{{tooltip}}")
  span.text(ng-hide='hideLabel') {{:: supportText}}
```

Would cause a cyclical reference because some-comonent has some-component inside of itself
